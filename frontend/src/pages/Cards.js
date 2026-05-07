import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Cards() {

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
    api.get('/cards', { params: { search } })
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
      number: '',
      exp: '',
      code: '',
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
    const res = await api.get(`/cards/${row.id}`);
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
        await api.put(`/cards/${editingId}`, form);
      } else {
        await api.post('/cards', form);
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

    api.delete(`/cards/${id}`)
      .then(() => {
        fetchData();
        showToast('Deleted ✅');
      });
  };

  // ======================
  // COPY
  // ======================
  const autoCopy = (row) => {
    const text = `${row.number}|${row.exp}|${row.code}`;

    navigator.clipboard.writeText(text);
    showToast('Copied 🔥');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Cards</h1>

        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Card
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search card..."
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

          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Card Number</th>
              <th className="px-4 py-3 text-left">EXP</th>
              <th className="px-4 py-3 text-left">CVV</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-left">Remark</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((row, i) => (
              <tr
                key={row.id}
                className={`border-t ${
                  i % 2 ? 'bg-gray-50/40' : ''
                } hover:bg-blue-50`}
              >

                <td className="px-4 py-3 font-medium">
                  {row.number}
                </td>

                <td className="px-4 py-3">{row.exp}</td>
                <td className="px-4 py-3">{row.code}</td>

                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 text-xs rounded
                    ${row.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'}
                  `}>
                    {row.status}
                  </span>
                </td>

                <td className="px-4 py-3">{row.remark || '-'}</td>

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
              {editingId ? 'Edit Card' : 'Add Card'}
            </h2>

            <input
              value={form.number || ''}
              onChange={e => setForm({ ...form, number: e.target.value })}
              placeholder="Card Number"
              className="w-full p-2 border mb-2"
            />

            <input
              value={form.exp || ''}
              onChange={e => setForm({ ...form, exp: e.target.value })}
              placeholder="MM/YY"
              className="w-full p-2 border mb-2"
            />

            <input
              value={form.code || ''}
              onChange={e => setForm({ ...form, code: e.target.value })}
              placeholder="CVV"
              className="w-full p-2 border mb-2"
            />

            <select
              value={form.status || 'active'}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full p-2 border mb-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
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