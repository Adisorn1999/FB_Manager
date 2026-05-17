import { useEffect, useState,useCallback } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/70 backdrop-blur-sm
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-gray-900
          border border-gray-700
          rounded-3xl
          p-8
          w-full
          max-w-2xl
          relative
          shadow-2xl
        "
      >
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            text-white/50 hover:text-white
          "
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};

const STATUS_STYLE = {
  active:
    "bg-green-500/10 text-green-400 border border-green-500/20",

  inactive:
    "bg-red-500/10 text-red-400 border border-red-500/20",
};

export default function Links() {
  const LIMIT = 9;

  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [tab, setTab] = useState("all");

  const [page, setPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    link_name: "",
    link: "",
    remark: "",
    status: "active",
  });

  // ================= FETCH =================
const fetchData = useCallback(async () => {
  try {
    const res = await api.get("/links", {
      params: { search },
    });

    setData(res.data.data || []);
  } catch (err) {
    console.error(err);
  }
}, [search]);

useEffect(() => {
  fetchData();
}, [fetchData]);
  // ================= FILTER =================
  const filtered = data.filter((row) => {
    const keyword = String(search || "")
      .toLowerCase();

    const link_name = String(
      row.link_name || ""
    ).toLowerCase();

    const link = String(
      row.link || ""
    ).toLowerCase();

    const remark = String(
      row.remark || ""
    ).toLowerCase();

    const matchSearch =
      link_name.includes(keyword) ||
      link.includes(keyword) ||
      remark.includes(keyword);

    const matchTab =
      tab === "all"
        ? true
        : String(row.status || "")
            .toLowerCase() === tab;

    return matchSearch && matchTab;
  });

  // ================= PAGINATION =================
  const totalPages =
    Math.ceil(filtered.length / LIMIT) || 1;

  const paginated = filtered.slice(
    (page - 1) * LIMIT,
    page * LIMIT
  );

  // ================= ADD =================
  const openAdd = async () => {
    const result = await Swal.fire({
      title: "Add Link ?",
      icon: "question",
      showCancelButton: true,

      background: "#0f172a",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    setForm({
      link_name: "",
      link: "",
      remark: "",
      status: "active",
    });

    setEditingId(null);

    setOpenModal(true);
  };

  // ================= EDIT =================
  const openEdit = async (row) => {
    const result = await Swal.fire({
      title: "Edit Link ?",
      icon: "question",
      showCancelButton: true,

      background: "#0f172a",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await api.get(
        `/links/${row.id}`
      );

      setForm(res.data.data);

      setEditingId(row.id);

      setOpenModal(true);
    } catch {
      toast.error("Failed ❌");
    }
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(
          `/links/${editingId}`,
          form
        );
      } else {
        await api.post("/links", form);
      }

      setOpenModal(false);

      fetchData();

      toast.success("Saved ✅");
    } catch {
      toast.error("Error ❌");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Link ?",
      icon: "warning",
      showCancelButton: true,

      background: "#0f172a",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/links/${id}`);

      fetchData();

      toast.success("Deleted ✅");
    } catch {
      toast.error("Delete Failed ❌");
    }
  };

  // ================= COPY =================
  const copyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(
        link
      );

      toast.success("Copied 🔥");
    } catch {
      toast.error("Copy failed ❌");
    }
  };

  const TABS = [
    {
      key: "all",
      label: "All",
      emoji: "📋",
    },

    {
      key: "active",
      label: "Active",
      emoji: "✅",
    },

    {
      key: "inactive",
      label: "Inactive",
      emoji: "💀",
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-black">
            Links
          </h1>

          <p className="text-white/50 mt-1 text-sm">
            {filtered.length} links found
          </p>

        </div>

        <button
          onClick={openAdd}
          className="
            bg-blue-600 hover:bg-blue-500
            text-white
            px-5 py-3
            rounded-2xl
            font-bold
            transition
          "
        >
          + Add Link
        </button>

      </div>

      {/* SEARCH */}
      <div className="mb-6">

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search links..."
          className="
            w-full
            bg-gray-900
            border border-gray-800
            rounded-2xl
            px-5 py-3
            text-white
            placeholder:text-white/30
            focus:outline-none
            focus:border-blue-500
          "
        />

      </div>

      {/* TABS */}
      <div
        className="
          flex gap-2
          bg-gray-900
          border border-gray-800
          p-2
          rounded-2xl
          w-fit
          mb-8
        "
      >
        {TABS.map((t) => {
          const active = tab === t.key;

          return (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);

                setPage(1);
              }}
              className={`
                px-4 py-2
                rounded-xl
                text-sm font-bold
                transition

                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-white/60 hover:bg-gray-800"
                }
              `}
            >
              {t.emoji} {t.label}
            </button>
          );
        })}
      </div>

      {/* GRID */}
      {paginated.length === 0 ? (
        <div
          className="
            flex flex-col items-center justify-center
            py-24 text-white/30
          "
        >
          <p className="text-5xl mb-4">
            📭
          </p>

          <p className="text-lg font-bold">
            No links found
          </p>

        </div>
      ) : (
        <div
          className="
            grid grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >
          {paginated.map((row) => (
            <div
              key={row.id}
              className="
                bg-gray-900
                border border-gray-800
                rounded-3xl
                p-5
                hover:border-blue-500/40
                transition
              "
            >

              {/* HEADER */}
              <div
                className="
                  flex items-start justify-between
                  mb-5
                "
              >
                <div>

                  <h2
                    className="
                      text-xl font-black
                      break-all
                    "
                  >
                    {row.link_name}
                  </h2>

                  <p
                    className="
                      text-white/40 text-sm mt-1
                    "
                  >
                    Link Tracking
                  </p>

                </div>

                <span
                  className={`
                    px-3 py-1
                    rounded-full
                    text-xs font-bold
                    uppercase
                    ${
                      STATUS_STYLE[
                        String(
                          row.status
                        ).toLowerCase()
                      ]
                    }
                  `}
                >
                  {row.status}
                </span>

              </div>

              {/* URL */}
              <div
                className="
                  bg-gray-800/60
                  rounded-2xl
                  p-4
                  border border-gray-800
                  mb-3
                "
              >
                <div
                  className="
                    flex items-center justify-between
                    gap-2
                  "
                >
                  <p
                    className="
                      text-xs text-white/40
                      uppercase
                    "
                  >
                    URL
                  </p>

                  <button
                    onClick={() =>
                      copyLink(row.link)
                    }
                    className="
                      text-xs
                      bg-gray-700
                      hover:bg-gray-600
                      px-2 py-1
                      rounded-lg
                    "
                  >
                    Copy
                  </button>

                </div>

                <a
                  href={row.link}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    mt-2
                    block
                    text-sm
                    break-all
                    text-blue-400
                    hover:underline
                  "
                >
                  {row.link}
                </a>

              </div>

              {/* REMARK */}
              <div
                className="
                  bg-gray-800/60
                  rounded-2xl
                  p-4
                  border border-gray-800
                "
              >
                <p
                  className="
                    text-xs text-white/40
                    uppercase
                  "
                >
                  Remark
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    break-all
                    text-white/80
                  "
                >
                  {row.remark || "-"}
                </p>

              </div>

              {/* ACTIONS */}
              <div
                className="
                  mt-5
                  flex gap-2
                "
              >
                <button
                  onClick={() =>
                    copyLink(row.link)
                  }
                  className="
                    flex-1
                    py-2.5
                    rounded-2xl
                    bg-blue-600 hover:bg-blue-500
                    text-white font-bold
                  "
                >
                  📋 Copy
                </button>

                <button
                  onClick={() =>
                    openEdit(row)
                  }
                  className="
                    flex-1
                    py-2.5
                    rounded-2xl
                    bg-yellow-500/10
                    hover:bg-yellow-500/20
                    text-yellow-400
                    border border-yellow-500/20
                    font-bold
                  "
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(row.id)
                  }
                  className="
                    flex-1
                    py-2.5
                    rounded-2xl
                    bg-red-500/10
                    hover:bg-red-500/20
                    text-red-400
                    border border-red-500/20
                    font-bold
                  "
                >
                  🗑 Delete
                </button>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div
        className="
          mt-8
          bg-gray-900
          border border-gray-800
          rounded-2xl
          px-5 py-4
          flex items-center justify-between
        "
      >
        <p className="text-white/60">
          Page {page} / {totalPages}
        </p>

        <div className="flex gap-2">

          <button
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
            className="
              px-4 py-2
              rounded-xl
              bg-gray-800
              hover:bg-gray-700
              disabled:opacity-30
            "
          >
            Prev
          </button>

          <button
            disabled={
              page === totalPages
            }
            onClick={() =>
              setPage(page + 1)
            }
            className="
              px-4 py-2
              rounded-xl
              bg-blue-600
              hover:bg-blue-500
              disabled:opacity-30
            "
          >
            Next
          </button>

        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <Modal
          onClose={() =>
            setOpenModal(false)
          }
        >

          <h2
            className="
              text-2xl font-black
              mb-6
            "
          >
            {editingId
              ? "✏️ Edit Link"
              : "➕ Add Link"}
          </h2>

          <div className="space-y-3">

            <input
              value={form.link_name || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  link_name:
                    e.target.value,
                })
              }
              placeholder="Link Name"
              className="
                w-full
                bg-gray-800
                border border-gray-700
                rounded-2xl
                p-4
                text-white
              "
            />

            <input
              value={form.link || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  link:
                    e.target.value,
                })
              }
              placeholder="https://example.com"
              className="
                w-full
                bg-gray-800
                border border-gray-700
                rounded-2xl
                p-4
                text-white
              "
            />

            <textarea
              rows={5}
              value={form.remark || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  remark:
                    e.target.value,
                })
              }
              placeholder="Remark"
              className="
                w-full
                bg-gray-800
                border border-gray-700
                rounded-2xl
                p-4
                text-white
              "
            />

            <select
              value={
                form.status || "active"
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  status:
                    e.target.value,
                })
              }
              className="
                w-full
                bg-gray-800
                border border-gray-700
                rounded-2xl
                p-4
                text-white
              "
            >
              <option value="active">
                active
              </option>

              <option value="inactive">
                inactive
              </option>

            </select>

          </div>

          <div
            className="
              flex justify-end gap-3
              mt-6
            "
          >
            <button
              onClick={() =>
                setOpenModal(false)
              }
              className="
                px-5 py-3
                rounded-2xl
                bg-gray-800
                hover:bg-gray-700
              "
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="
                px-6 py-3
                rounded-2xl
                bg-blue-600
                hover:bg-blue-500
                font-bold
              "
            >
              Save
            </button>

          </div>

        </Modal>
      )}

    </div>
  );
}