import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Pages() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all'); // 🔥 tabs
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
    api.get('/pages', { params: { search } })
      .then(res => setData(res.data.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  // reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [tab]);

  // ======================
  // FILTER (tabs)
  // ======================
  const filtered = data.filter(row => {
    if (tab === 'all') return true;
    return (row.status || 'page_die') === tab;
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
      page_id: '',
      page_name: '',
      agen: '',
      status: 'active',
      remark: ''
    });

    setEditingId(null);
    setOpenModal(true);
  };

  // ======================
  // EDIT
  // ======================
  const openEdit = async (row) => {
    const res = await api.get(`/pages/${row.id}`);
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
        await api.put(`/pages/${editingId}`, form);
      } else {
        await api.post('/pages', form);
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

    api.delete(`/pages/${id}`)
      .then(() => {
        fetchData();
        showToast('Deleted ✅');
      });
  };

  // ======================
  // COPY
  // ======================
  const autoCopy = (row) => {
  const text = `${row.page_id}|${row.agen}`;

  navigator.clipboard.writeText(text);
  showToast('Copied 🔥');
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Pages</h1>

        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Page
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search page..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-3 mb-4 border rounded"
      />

      {/* 🔥 TABS */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: 'All' },
          { key: 'active', label: 'Active' },
          { key: 'page_die', label: 'page_die' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1 rounded text-sm
              ${tab === t.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Page ID</th>
              <th className="px-4 py-3 text-left">Agen</th>
              <th className="px-4 py-3 text-left">Page Name</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-left">Remark</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((row, i) => (
              <tr
                key={row.id}
                className={`border-t hover:bg-gray-50 ${
                  i % 2 ? 'bg-gray-50/40' : ''
                }`}
              >

                <td className="px-4 py-3 font-medium">{row.page_id}</td>
                <td className="px-4 py-3">{row.agen || '-'}</td>
                <td className="px-4 py-3 truncate max-w-[220px]">
                  {row.page_name || '-'}
                </td>

                {/* STATUS BADGE */}
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs
                    ${row.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'}
                  `}>
                    {row.status || 'page_die'}
                  </span>
                </td>

                <td className="px-4 py-3 truncate max-w-[200px]">
                  {row.remark || '-'}
                </td>

                <td className="px-4 py-3 text-center">
                  <button onClick={() => openEdit(row)} className="text-blue-600 mr-2">Edit</button>
                  <button onClick={() => handleDelete(row.id)} className="text-red-600 mr-2">Delete</button>
                  <button onClick={() => autoCopy(row)} className="text-green-600">Copy</button>
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
              {editingId ? 'Edit Page' : 'Add Page'}
            </h2>

            <input
              value={form.page_id || ''}
              onChange={e => setForm({ ...form, page_id: e.target.value })}
              placeholder="Page ID"
              className="w-full p-2 border mb-2"
            />

            
            <input
              value={form.agen || ''}
              onChange={e => setForm({ ...form, agen: e.target.value })}
              placeholder="Agen"
              className="w-full p-2 border mb-2"
            />
<input
              value={form.page_name || ''}
              onChange={e => setForm({ ...form, page_name: e.target.value })}
              placeholder="Page Name"
              className="w-full p-2 border mb-2"
            />

            <select
              value={form.status || 'active'}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full p-2 border mb-2"
            >
              <option value="active">Active</option>
              <option value="page_die">page_die</option>
            </select>

            <input
              value={form.remark || ''}
              onChange={e => setForm({ ...form, remark: e.target.value })}
              placeholder="Remark"
              className="w-full p-2 border mb-3"
            />

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