import { useEffect, useState } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

// =================== SWAL DARK THEME ===================
const SWAL_DARK = {
  background: "#0f172a",
  color: "#fff",
  customClass: {
    popup: "rounded-3xl",
    input: "swal-dark-select",
    confirmButton: "swal-confirm",
    cancelButton: "swal-cancel",
  },
};

// =================== MODAL ===================
const Modal = ({ children, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-2xl relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/50 hover:text-white transition"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

// =================== RELATION MODAL ===================
// รวม Pages / Pixels / Cards ไว้ใน component เดียว
function RelationModal({ type, title, items, currentAccount, onClose, onRefresh }) {
  const [available, setAvailable]   = useState([]);
  const [selected, setSelected]     = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [adding, setAdding]         = useState(false);

  // config ตาม type
  const cfg = {
    page:  { idKey: "page_id",  apiPath: "/account-pages",  listApi: "/pages",  displayKey: "page_id",  subKey: "page_name" },
    pixel: { idKey: "px_id",    apiPath: "/account-pixels", listApi: "/pixels", displayKey: "px_id",    subKey: null },
    card:  { idKey: "id",       apiPath: "/account-cards",  listApi: "/cards",  displayKey: "number",   subKey: "payment_type" },
  }[type];

  const relApi = `${cfg.apiPath}/account/${currentAccount.id}`;

  // ---- open add screen ----
  const openAdd = async () => {
    try {
      const [all, used] = await Promise.all([api.get(cfg.listApi), api.get(relApi)]);
      const usedIds = (used.data.data || []).map((x) => String(x[cfg.idKey]));
      setAvailable(
        (all.data.data || [])
          .filter((x) => x.status === "active")
          .map((x) => ({ ...x, used: usedIds.includes(String(x[cfg.idKey])) }))
      );
      setSelected("");
      setSearchInput("");
      setAdding(true);
    } catch {
      toast.error("Load failed");
    }
  };

  // ---- confirm add ----
  const handleAdd = async () => {
    const { isConfirmed } = await Swal.fire({
      title: `เพิ่ม ${title}?`,
      text: `ID: ${selected}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      ...SWAL_DARK,
    });
    if (!isConfirmed) return;

    try {
      const bodyMap = {
        page:  { account_id: currentAccount.id, page_id: selected },
        pixel: { account_id: currentAccount.id, px_id: selected },
        card:  { account_id: currentAccount.id, card_id: selected },
      };
      await api.post(cfg.apiPath, bodyMap[type]);
      toast.success(`Add ${title} success`);
      setAdding(false);
      onRefresh();
    } catch {
      toast.error(`Add ${title} failed`);
    }
  };

  // ---- delete ----
  const handleDelete = async (item) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete?", text: "ต้องการลบใช่ไหม", icon: "warning",
      showCancelButton: true, confirmButtonText: "ลบ", cancelButtonText: "ยกเลิก",
      ...SWAL_DARK,
    });
    if (!isConfirmed) return;

    const deleteId = type === "card" ? (item.relation_id || item.id) : item.id;
    await api.delete(`${cfg.apiPath}/${deleteId}`);
    toast.success("Deleted");
    onRefresh();
  };

  // ---- edit card payment type ----
  const handleEditCard = async (item) => {
    const { value: paymentType } = await Swal.fire({
      title: "Edit Payment Type",
      input: "select",
      inputOptions: { main: "main", backup: "backup" },
      inputValue: item.payment_type || "backup",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      ...SWAL_DARK,
    });
    if (!paymentType) return;

    try {
      await api.put(`${cfg.apiPath}/${item.relation_id}/payment-type`, { payment_type: paymentType });
      toast.success("Updated");
      onRefresh();
    } catch {
      toast.error("Update failed");
    }
  };

  const filtered = available.filter((x) =>
    String(x[cfg.displayKey] ?? "").toLowerCase().includes(searchInput.toLowerCase())
  );

  // ---- ADD SCREEN ----
  if (adding) {
    return (
      <Modal onClose={() => setAdding(false)}>
        <div className="mb-6">
          <h2 className="text-3xl font-black text-white">Add {title}</h2>
          <p className="text-white/40 mt-1">Select {title.toLowerCase()} for this account</p>
        </div>
        <input
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white mb-5 focus:outline-none focus:border-blue-500 transition"
        />
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {filtered.map((item) => (
            <button
              key={item.id}
              disabled={item.used}
              onClick={() => setSelected(item[cfg.idKey])}
              className={`w-full text-left px-4 py-4 rounded-2xl border transition-all
                ${selected === item[cfg.idKey] ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-gray-800/70"}
                ${item.used ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{item[cfg.displayKey]}</p>
                  {cfg.subKey && <p className="text-sm text-white/40 mt-0.5">{item[cfg.subKey]}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {item.used && <span className="text-orange-400 text-sm">(ใช้แล้ว)</span>}
                  {selected === item[cfg.idKey] && <span className="text-blue-400 text-xl">✓</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setAdding(false)} className="px-5 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition">
            Cancel
          </button>
          <button
            disabled={!selected}
            onClick={handleAdd}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition"
          >
            Add {title}
          </button>
        </div>
      </Modal>
    );
  }

  // ---- LIST SCREEN ----
  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white">{title}</h2>
          <p className="text-white/40 mt-1 text-sm">Manage {title.toLowerCase()}</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition">
          + Add
        </button>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="bg-gray-800/70 border border-gray-700 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-lg">{item[cfg.displayKey]}</p>
                {cfg.subKey && <p className="text-sm text-white/40 mt-1">{item[cfg.subKey] || "—"}</p>}
              </div>
              <div className="flex items-center gap-2">
                {type === "card" && (
                  <button
                    onClick={() => handleEditCard(item)}
                    className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition"
                  >
                    แก้ไข
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item)}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-white/40">No {title} Found</div>
        )}
      </div>
    </Modal>
  );
}

// =================== MAIN ===================
export default function Accounts() {
  const LIMIT = 6;

  const [data, setData]           = useState([]);
  const [tab, setTab]             = useState("all");
  const [search, setSearch]       = useState("");
  const [sort, setSort]           = useState("newest");
  const [page, setPage]           = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState({});
  const [bulkText, setBulkText]   = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [checking, setChecking]   = useState(false);

  const [detailModal, setDetailModal]     = useState(null);
  const [relationModal, setRelationModal] = useState(null); // { type, title, items, account }

  // =================== FETCH ===================
  const fetchData = async () => {
    try {
      const res = await api.get("/accounts", { params: { status: tab, search } });
      const accounts = res.data.data || [];

      const fullData = await Promise.all(
        accounts.map(async (acc) => {
          try {
            const [detail, ap, px, cd] = await Promise.all([
              api.get(`/accounts/${acc.id}`),
              api.get(`/account-pages/account/${acc.id}`),
              api.get(`/account-pixels/account/${acc.id}`),
              api.get(`/account-cards/account/${acc.id}`),
            ]);
            return {
              ...acc,
              password:       detail.data.data.password,
              secret_code:    detail.data.data.secret_code,
              email_password: detail.data.data.email_password,
              temp_mail:      detail.data.data.temp_mail,
              pages_count:    ap.data.data?.length || 0,
              pixels_count:   px.data.data?.length || 0,
              cards_count:    cd.data.data?.length || 0,
            };
          } catch {
            return acc;
          }
        })
      );

      setData(fullData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    setPage(1);
  }, [tab, search]);

  // =================== FILTER + SORT ===================
  const filtered = data
    .filter((item) => {
      const matchTab    = tab === "all" || item.status === tab;
      const matchSearch =
        item.username?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.bm?.toString().includes(search);
      return matchTab && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "az")     return a.username?.localeCompare(b.username);
      if (sort === "za")     return b.username?.localeCompare(a.username);
      if (sort === "oldest") return a.id - b.id;
      return b.id - a.id;
    });

  const totalPages = Math.ceil(filtered.length / LIMIT) || 1;
  const paginated  = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  // =================== DUPLICATE CHECK ===================
  let debounceTimer;
  const checkDuplicate = (formData) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        setChecking(true);
        const res = await api.post("/accounts/check-duplicate", { ...formData, id: editingId || null });
        setIsDuplicate(res.data.duplicate);
      } catch (err) {
        console.error(err);
      } finally {
        setChecking(false);
      }
    }, 500);
  };

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    const { username, password, secret_code, email, email_password, bm } = updated;
    if (username && password && secret_code && email && email_password && bm) checkDuplicate(updated);
  };

  // =================== BULK PASTE ===================
  const handleBulkPaste = (value) => {
    setBulkText(value);
    const lines = value.trim().split("\n");
    const acc   = lines[0]?.split("|") || [];
    const extra = lines[1]?.split("|") || [];
    setForm({
      username:       acc[0] || "",
      password:       acc[1] || "",
      secret_code:    acc[2] || "",
      email:          acc[3] || "",
      email_password: acc[4] || "",
      temp_mail:      acc[5] || "",
      bm:             extra[0] || "",
      status: "active",
    });
  };

  // =================== FORM VALIDATION ===================
  const REQUIRED = ["username", "password", "secret_code", "email", "email_password", "temp_mail", "bm"];
  const isFormValid = REQUIRED.every((f) => form[f]?.toString().trim() !== "");

  // =================== ADD ===================
  const openAdd = async () => {
    const { isConfirmed } = await Swal.fire({ title: "เพิ่ม Account?", icon: "question", showCancelButton: true, confirmButtonText: "ตกลง", cancelButtonText: "ยกเลิก", ...SWAL_DARK });
    if (!isConfirmed) return;
    setForm({ username: "", password: "", secret_code: "", email: "", email_password: "", temp_mail: "", bm: "", status: "active" });
    setBulkText("");
    setEditingId(null);
    setIsDuplicate(false);
    setOpenModal(true);
  };

  // =================== EDIT ===================
  const openEdit = async (acc) => {
    const { isConfirmed } = await Swal.fire({ title: "ต้องการแก้ไข Account?", icon: "question", showCancelButton: true, confirmButtonText: "แก้ไข", cancelButtonText: "ยกเลิก", ...SWAL_DARK });
    if (!isConfirmed) return;
    const res = await api.get(`/accounts/${acc.id}`);
    setForm(res.data.data);
    setEditingId(acc.id);
    setIsDuplicate(false);
    setOpenModal(true);
  };

  // =================== SAVE ===================
  const handleSave = async () => {
    const { isConfirmed } = await Swal.fire({ title: editingId ? "บันทึกการแก้ไข?" : "เพิ่ม Account?", icon: "question", showCancelButton: true, confirmButtonText: "บันทึก", cancelButtonText: "ยกเลิก", ...SWAL_DARK });
    if (!isConfirmed) return;
    try {
      if (editingId) {
        await api.put(`/accounts/${editingId}`, form);
      } else {
        await api.post("/accounts", form);
      }
      setOpenModal(false);
      fetchData();
      toast.success("Saved ✅");
    } catch {
      toast.error("Error ❌");
    }
  };

  // =================== COPY ===================
  const copyAll = (acc) => {
    const text = [acc.username, acc.password, acc.secret_code, acc.email, acc.email_password, acc.temp_mail, acc.bm].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied ✅");
  };

  // =================== OPEN RELATION ===================
  const openRelation = async (acc, type) => {
    const titleMap = { page: "Pages", pixel: "Pixels", card: "Cards" };
    const apiMap   = { page: `/account-pages/account/${acc.id}`, pixel: `/account-pixels/account/${acc.id}`, card: `/account-cards/account/${acc.id}` };
    try {
      const res = await api.get(apiMap[type]);
      setRelationModal({ type, title: titleMap[type], items: res.data.data || [], account: acc });
    } catch {
      toast.error("Load failed");
    }
  };

  const refreshRelation = async () => {
    if (!relationModal) return;
    const apiMap = {
      page:  `/account-pages/account/${relationModal.account.id}`,
      pixel: `/account-pixels/account/${relationModal.account.id}`,
      card:  `/account-cards/account/${relationModal.account.id}`,
    };
    const res = await api.get(apiMap[relationModal.type]);
    setRelationModal((prev) => ({ ...prev, items: res.data.data || [] }));
    fetchData();
  };

  const TABS = [
    { key: "all",          label: "All",        emoji: "📋" },
    { key: "active",       label: "Active",     emoji: "✅" },
    { key: "bm_die",       label: "BM Die",     emoji: "🔴" },
    { key: "main_die",     label: "Main Die",   emoji: "💀" },
    { key: "BmAndMain_die",label: "BM&Main Die",emoji: "☠️" },
    { key: "cancel",     label: "Cancel",   emoji: "❌" },
  ];

  // =================== RENDER ===================
  return (
    <div className="p-6 min-w-full min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Accounts</h1>
          <p className="text-white/60 text-sm mt-1">{filtered.length} accounts found</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-900/40 transition-all hover:scale-105 active:scale-95"
        >
          <span className="text-lg leading-none">+</span> Add Account
        </button>
      </div>

      {/* SEARCH + SORT */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 select-none">🔍</span>
          <input
            placeholder="Search username, email, BM..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-gray-900 border border-gray-800 text-white placeholder:text-white/40 rounded-2xl pl-11 pr-10 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition text-sm">
              ✕
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="bg-gray-900 border border-gray-800 text-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500 transition cursor-pointer"
        >
          <option value="newest">⬇ Newest</option>
          <option value="oldest">⬆ Oldest</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-1.5 mb-8 bg-gray-900 p-1.5 rounded-2xl w-fit border border-gray-800">
        {TABS.map((t) => {
          const count    = data.filter((d) => t.key === "all" || d.status === t.key).length;
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setPage(1); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-white/70 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span>{t.emoji}</span>
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-blue-500/60 text-white" : "bg-gray-800 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* CARDS */}
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/30">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-bold">No accounts found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginated.map((acc) => (
            <AccountCard
              key={acc.id}
              acc={acc}
              onCopy={copyAll}
              onDetail={async () => {
                const res = await api.get(`/accounts/${acc.id}`);
                setDetailModal(res.data.data);
              }}
              onEdit={() => openEdit(acc)}
              onPages={() => openRelation(acc, "page")}
              onPixels={() => openRelation(acc, "pixel")}
              onCards={() => openRelation(acc, "card")}
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold border border-blue-600/30">
            {page}
          </div>
          <p className="font-semibold text-white/70">
            Page <span className="text-white">{page}</span> / {totalPages}
            <span className="text-white/40 ml-2 text-sm">({filtered.length} total)</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 rounded-xl border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition">
            ← Prev
          </button>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition">
            Next →
          </button>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <h2 className="text-xl font-bold text-white mb-5">
            {editingId ? "✏️ Edit" : "➕ Add"} Account
          </h2>

          {/* Bulk paste — only on add */}
          {!editingId && (
            <textarea
              rows={4}
              value={bulkText}
              onChange={(e) => handleBulkPaste(e.target.value)}
              placeholder={"61576723122787|password|2fa|email|emailpass|tempmail\n966618305914195|1391181998381579"}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder:text-white/30 rounded-2xl p-4 mb-4 focus:outline-none focus:border-blue-500 transition"
            />
          )}

          {REQUIRED.map((f) => (
            <input
              key={f}
              value={form[f] || ""}
              onChange={(e) => handleChange(f, e.target.value)}
              placeholder={f.replace(/_/g, " ")}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl p-3 mb-3 focus:outline-none focus:border-blue-500 transition"
            />
          ))}

          <select
            value={form.status || "active"}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-xl p-3 mb-3 focus:outline-none focus:border-blue-500 transition"
          >
            {["active", "bm_die", "main_die", "BmAndMain_die", "cancel"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {!isFormValid && <p className="text-red-400 text-sm mb-2">กรุณากรอกข้อมูลให้ครบทั้งหมด</p>}
          {checking    && <p className="text-yellow-400 text-sm mb-2">⏳ Checking...</p>}
          {isDuplicate && <p className="text-red-400 font-bold mb-2">❌ Duplicate</p>}

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setOpenModal(false)} className="px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-gray-800 transition">
              Cancel
            </button>
            <button
              disabled={isDuplicate || !isFormValid}
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* DETAIL MODAL */}
      {detailModal && (
        <DetailModal acc={detailModal} onCopy={copyAll} onClose={() => setDetailModal(null)} />
      )}

      {/* RELATION MODAL */}
      {relationModal && (
        <RelationModal
          type={relationModal.type}
          title={relationModal.title}
          items={relationModal.items}
          currentAccount={relationModal.account}
          onClose={() => setRelationModal(null)}
          onRefresh={refreshRelation}
        />
      )}
    </div>
  );
}

// =================== ACCOUNT CARD ===================
const STATUS_STYLE = {
  active:         "bg-green-500/10 text-green-400 border border-green-500/20",
  bm_die:         "bg-red-500/10 text-red-400 border border-red-500/20",
  main_die:       "bg-gray-500/10 text-white/70 border border-gray-500/20",
  BmAndMain_die:  "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  cancel:       "bg-purple-500/10 text-purple-400 border border-purple-500/20",
};

function AccountCard({ acc, onCopy, onDetail, onEdit, onPages, onPixels, onCards }) {
  const copyField = (val, label) => {
    navigator.clipboard.writeText(val || "");
    toast.success(`${label} copied ✅`);
  };

  const fields = [
    { label: "Password",  value: acc.password,   btnColor: "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400" },
    { label: "2FA",       value: acc.secret_code, btnColor: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400" },
    { label: "Email",     value: acc.email,        btnColor: "bg-pink-500/10 hover:bg-pink-500/20 text-pink-400" },
    { label: "Temp Mail", value: acc.temp_mail,    btnColor: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400" },
  ];

  const stats = [
    { icon: "📄", count: acc.pages_count,  label: "Pages",  onClick: onPages },
    { icon: "📡", count: acc.pixels_count, label: "Pixels", onClick: onPixels },
    { icon: "💳", count: acc.cards_count,  label: "Cards",  onClick: onCards },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 hover:border-blue-500/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] transition-all duration-300 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-900/40">
            👤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{acc.username}</h2>
              <button onClick={() => copyField(acc.username, "Username")} className="w-8 h-8 rounded-xl bg-gray-800 hover:bg-gray-700 text-white/70 hover:text-white flex items-center justify-center transition text-sm">
                📋
              </button>
            </div>
            <p className="text-white/50 text-sm mt-0.5">{acc.bm}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_STYLE[acc.status] || "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"}`}>
          {acc.status}
        </span>
      </div>

      {/* Fields */}
      <div className="mt-6 space-y-3">
        {fields.map(({ label, value, btnColor }) => (
          <div key={label} className="bg-gray-800/60 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 border border-gray-800">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/50 uppercase tracking-wider">{label}</p>
              <p className="mt-0.5 text-sm font-bold text-gray-200 break-all">{value || "—"}</p>
            </div>
            <button onClick={() => copyField(value, label)} className={`w-10 h-10 rounded-xl ${btnColor} flex items-center justify-center text-base transition flex-shrink-0`}>
              📋
            </button>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 border-t border-gray-800 pt-5">
        <div className="grid grid-cols-3 gap-2">
          {stats.map(({ icon, count, label, onClick }) => (
            <button key={label} onClick={onClick} className="bg-gray-800/60 border border-gray-800 rounded-2xl p-3 text-center hover:border-blue-500/40 hover:bg-gray-700/70 hover:-translate-y-1 active:scale-95 transition-all">
              <p className="text-xl">{icon}</p>
              <h3 className="mt-1 text-xl font-black text-white">{count || 0}</h3>
              <p className="text-xs text-white/60">{label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 border-t border-gray-800 pt-5 flex gap-2">
        <button onClick={() => onCopy(acc)} className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition active:scale-95">
          📋 Copy All
        </button>
        <button onClick={onDetail} className="flex-1 py-2.5 rounded-2xl bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold text-sm border border-green-500/20 transition active:scale-95">
          🔍 Detail
        </button>
        <button onClick={onEdit} className="flex-1 py-2.5 rounded-2xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-bold text-sm border border-yellow-500/20 transition active:scale-95">
          ✏️ Edit
        </button>
      </div>
    </div>
  );
}

// =================== DETAIL MODAL ===================
function DetailModal({ acc, onCopy, onClose }) {
  const copyField = (val, label) => {
    navigator.clipboard.writeText(val || "");
    toast.success(`${label} copied ✅`);
  };

  const rows = [
    { label: "Password",       value: acc.password,       color: "text-yellow-300" },
    { label: "2FA",            value: acc.secret_code,    color: "text-blue-300" },
    { label: "Email",          value: acc.email,           color: "text-pink-300" },
    { label: "Email Password", value: acc.email_password, color: "text-purple-300" },
    { label: "Temp Email",     value: acc.temp_mail,      color: "text-indigo-300" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white">{acc.username}</h2>
            <p className="text-white/40 mt-1">{acc.bm}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-white/70 transition flex items-center justify-center">
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {rows.map(({ label, value, color }) => (
            <div key={label} className="bg-gray-800/60 border border-gray-800 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
                <p className={`mt-0.5 font-bold break-all text-sm ${color}`}>{value || "—"}</p>
              </div>
              <button onClick={() => copyField(value, label)} className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white flex items-center justify-center text-sm transition flex-shrink-0">
                📋
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-3">
          <button onClick={() => onCopy(acc)} className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition active:scale-95">
            📋 Copy All
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition active:scale-95">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
