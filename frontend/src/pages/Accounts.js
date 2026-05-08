import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Accounts() {
  const [data, setData] = useState([]);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const [toast, setToast] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [checking, setChecking] = useState(false);

  const pageSize = 20;

  // ======================
  // TOAST
  // ======================
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1500);
  };

  // ======================
  // FETCH
  // ======================
  const fetchData = () => {
    api
      .get("/accounts", {
        params: { status: tab, search },
      })
      .then((res) => setData(res.data.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
    setPage(1);
  }, [tab, search]);

  // ======================
  // PAGINATION
  // ======================
  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  // ======================
  // DUPLICATE CHECK
  // ======================
  let debounceTimer;

  const checkDuplicate = (data) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      try {
        setChecking(true);

        const res = await api.post("/accounts/check-duplicate", {
          ...data,
          id: editingId || null,
        });

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

    if (
      updated.username &&
      updated.password &&
      updated.secret_code &&
      updated.email &&
      updated.email_password &&
      updated.bm
    ) {
      checkDuplicate(updated);
    }
  };

  // ======================
  // ADD
  // ======================
  const openAdd = () => {
    setForm({
      username: "",
      password: "",
      secret_code: "",
      email: "",
      email_password: "",
      temp_mail: "",
      bm: "",
      status: "active",
    });

    setEditingId(null);
    setIsDuplicate(false);
    setOpenModal(true);
  };

  // ======================
  // EDIT
  // ======================
  const openEdit = async (acc) => {
    const res = await api.get(`/accounts/${acc.id}`);
    setForm(res.data.data);
    setEditingId(acc.id);
    setIsDuplicate(false);
    setOpenModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/accounts/${editingId}`, form);
      } else {
        await api.post("/accounts", form);
      }

      setOpenModal(false);
      fetchData();
      showToast("Saved ✅");
    } catch (err) {
      showToast("Error ❌");
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = (id) => {
    if (!window.confirm("Delete?")) return;

    api.delete(`/accounts/${id}`).then(() => {
      fetchData();
      showToast("Deleted ✅");
    });
  };

  // ======================
  // INLINE STATUS CHANGE 🔥
  // ======================
  const changeStatus = async (acc) => {
    const next =
      acc.status === "active"
        ? "bm_die"
        : acc.status === "bm_die"
          ? "main_die"
          : "active";

    await api.put(`/accounts/${acc.id}`, {
      ...acc,
      status: next,
    });

    fetchData();
    showToast("Status Updated 🔄");
  };

  // ======================
  // COPY
  // ======================
  const autoCopy = async (acc) => {
    const res = await api.get(`/accounts/${acc.id}`);
    const d = res.data.data;

    const text = [
      d.username,
      d.password,
      d.secret_code,
      d.email,
      d.email_password,
      d.temp_mail,
      d.bm,
    ].join("\n");

    navigator.clipboard.writeText(text);
    showToast("Copied ✅");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Accounts</h1>

        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Account
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-4 border rounded"
      />

      {/* TABS */}
      <div className="flex gap-2 mb-4">
        {["all", "active", "bm_die", "main_die"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded ${tab === t ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Password</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">BM</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((acc) => (
              <tr key={acc.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{acc.username}</td>
                <td className="px-4 py-3 truncate max-w-[180px]">
                  {acc.password}
                </td>
                <td className="px-4 py-3">{acc.email}</td>
                <td className="px-4 py-3">{acc.bm}</td>

                {/* 🔥 CLICK TO CHANGE STATUS */}
                <td className="px-4 py-3 text-center">
                  <span
                    onClick={() => changeStatus(acc)}
                    className={`cursor-pointer px-2 py-1 rounded text-xs
                      ${
                        acc.status === "active"
                          ? "bg-green-100 text-green-700"
                          : acc.status === "bm_die"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-300 text-gray-700"
                      }`}
                  >
                    {acc.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openEdit(acc)}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="text-red-600 mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => autoCopy(acc)}
                    className="text-green-600"
                  >
                    Copy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-between">
        <span>
          Page {page} / {totalPages}
        </span>

        <div>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <h2 className="text-xl mb-3">{editingId ? "Edit" : "Add"} Account</h2>

          {[
            "username",
            "password",
            "secret_code",
            "email",
            "email_password",
            "temp_mail",
            "bm",
          ].map((f) => (
            <input
              key={f}
              value={form[f] || ""}
              onChange={(e) => handleChange(f, e.target.value)}
              placeholder={f}
              className="w-full p-2 border mb-2"
            />
          ))}

          {/* ✅ STATUS FIX */}
          <select
            value={form.status || "active"}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full p-2 border mb-2"
          >
            <option value="active">Active</option>
            <option value="bm_die">BM Die</option>
            <option value="main_die">Main Die</option>
            <option value="BmAndMain_die">BmAndMain_die</option>
            <option value="canceled">Canceled</option>
          </select>

          {checking && <p className="text-yellow-500">Checking...</p>}
          {isDuplicate && (
            <p className="text-red-600 font-bold">❌ Duplicate</p>
          )}

          <div className="flex justify-end gap-2">
            <button onClick={() => setOpenModal(false)}>Cancel</button>
            <button
              disabled={isDuplicate}
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded">
          {toast}
        </div>
      )}
    </div>
  );
}
const Modal = ({ children, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={onClose} // 🔥 คลิกพื้นหลัง = ปิด
    >
      <div
        className="bg-white p-8 rounded-xl shadow-lg relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // 🔥 กันคลิกทะลุ
      >
        <button onClick={onClose} className="absolute right-2 top-2">
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};
