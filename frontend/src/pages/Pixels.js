import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Pixels() {

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [page, setPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  const [toast, setToast] = useState('');

  const pageSize = 20;

  // ======================
  // TOAST
  // ======================
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1500);
  };

  // ======================
  // FETCH
  // ======================
  const fetchData = () => {
    api.get('/pixels', { params: { search } })
      .then(res => setData(res.data.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [tab]);

  // ======================
  // FILTER
  // ======================
  const filtered = data.filter(row => {
    if (tab === 'all') return true;
    return (row.status || 'inactive') === tab;
  });

  // ======================
  // PAGINATION
  // ======================
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // ======================
  // ADD
  // ======================
  const openAdd = () => {
    setForm({
      px_id: '',
      agen1: '',
      agen2: '',
      token: '',
      status: 'active'
    });

    setEditingId(null);
    setOpenModal(true);
  };

  // ======================
  // EDIT
  // ======================
  const openEdit = async (row) => {
    const res = await api.get(`/pixels/${row.id}`);
    setForm(res.data.data);
    setEditingId(row.id);
    setOpenModal(true);
  };

  // ======================
  // SAVE
  // ======================
  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/pixels/${editingId}`, form);
      } else {
        await api.post('/pixels', form);
      }

      setOpenModal(false);
      fetchData();
      showToast('Saved ✅');

    } catch {
      showToast('Error ❌');
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = (id) => {
    if (!window.confirm('Delete?')) return;

    api.delete(`/pixels/${id}`)
      .then(() => {
        fetchData();
        showToast('Deleted ✅');
      });
  };

  // ======================
  // COPY
  // ======================
  const autoCopy = (row) => {
  const text = `${row.px_id}|${row.agen1}|${row.agen2}`;

  navigator.clipboard.writeText(text);
  showToast('Copied 🔥');
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Pixels</h1>

        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Pixel
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search pixel..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-3 mb-4 border rounded"
      />

      {/* TABS */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'inactive', label: 'Inactive' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1 rounded
              ${tab === t.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">

  <table className="w-full text-sm">

    {/* HEADER */}
    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 uppercase text-xs tracking-wide">
      <tr>
        <th className="px-5 py-3 text-left">PX ID</th>
        <th className="px-5 py-3 text-left">Agen 1</th>
        <th className="px-5 py-3 text-left">Agen 2</th>
        <th className="px-5 py-3 text-left">Token</th>
        <th className="px-5 py-3 text-center">Status</th>
        <th className="px-5 py-3 text-center">Action</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {paginated.map((row, i) => (
        <tr
          key={row.id}
          className={`border-t transition-all duration-200
            ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
            hover:bg-blue-50 hover:shadow-sm`}
        >

          {/* PX ID */}
          <td className="px-5 py-4 font-semibold text-gray-800">
            {row.px_id}
          </td>

          {/* AGEN */}
          <td className="px-5 py-4 text-gray-700">{row.agen1 || '-'}</td>
          <td className="px-5 py-4 text-gray-700">{row.agen2 || '-'}</td>

          {/* TOKEN */}
          <td className="px-5 py-4">
            <div className="flex items-center gap-2">

              <span className="truncate max-w-[220px] text-gray-600 font-mono text-xs">
                {row.token}
              </span>

              <button
  onClick={() => {
    if (!row.token) {
      showToast('No token ❌');
      return;
    }

    navigator.clipboard.writeText(row.token)
      .then(() => showToast('Token copied 🔥'))
      .catch(() => showToast('Copy failed ❌'));
  }}
  className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
>
  Copy
</button>

            </div>
          </td>

          {/* STATUS */}
          <td className="px-5 py-4 text-center">
            <span className={`px-3 py-1 text-xs rounded-full font-semibold
              ${
                row.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {row.status}
            </span>
          </td>

          {/* ACTION */}
          <td className="px-5 py-4 text-center">
            <div className="flex justify-center gap-2">

              <button
                onClick={() => openEdit(row)}
                className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(row.id)}
                className="px-3 py-1 text-xs rounded bg-red-100 text-red-600 hover:bg-red-200"
              >
                Delete
              </button>

              <button
                onClick={() => autoCopy(row)}
                className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
              >
                Copy All
              </button>

            </div>
          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-between">
        <span>Page {page} / {totalPages}</span>

        <div>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded w-[420px]">

            <h2 className="text-xl mb-4">
              {editingId ? 'Edit Pixel' : 'Add Pixel'}
            </h2>

            <input
              value={form.px_id || ''}
              onChange={e => setForm({ ...form, px_id: e.target.value })}
              placeholder="PX ID"
              className="w-full p-2 border mb-2"
            />

            <input
              value={form.agen1 || ''}
              onChange={e => setForm({ ...form, agen1: e.target.value })}
              placeholder="Agen 1"
              className="w-full p-2 border mb-2"
            />

            <input
              value={form.agen2 || ''}
              onChange={e => setForm({ ...form, agen2: e.target.value })}
              placeholder="Agen 2"
              className="w-full p-2 border mb-2"
            />

            <textarea
              value={form.token || ''}
              onChange={e => setForm({ ...form, token: e.target.value })}
              placeholder="Token"
              className="w-full p-2 border mb-2"
            />

            <select
              value={form.status || 'active'}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full p-2 border mb-3"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpenModal(false)}>Cancel</button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
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