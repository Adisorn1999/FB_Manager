import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
export default function Dashboard() {
const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [detail, setDetail] = useState(null);

  const [accountPages, setAccountPages] = useState([]);
  const [accountPixels, setAccountPixels] = useState([]);
  const [accountCards, setAccountCards] = useState([]);

  const [pages, setPages] = useState([]);
  const [pixels, setPixels] = useState([]);
  const [cards, setCards] = useState([]);

  const [addModal, setAddModal] = useState(null);
  const [editModal, setEditModal] = useState(null);

  const [type, setType] = useState('page');
  const [selected, setSelected] = useState('');
  const [editForm, setEditForm] = useState({});



  // ================= ALERT =================
  const showSuccess = (msg) => {
  toast.success(msg);
};

const showError = (msg) => {
  toast.error(msg);
};
  // ================= LOAD =================
  const fetchAccounts = async () => {
    const res = await api.get('/dashboard');
    setAccounts(res.data.data || []);
    setLoading(false);
  };
  

  useEffect(() => {
    fetchAccounts();
  }, []);
if (loading) {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    </div>
  );
}
  // ================= DETAIL =================
  const openDetail = async (acc) => {
  if (!acc?.id) return;

  try {
    // 🔥 ดึงข้อมูลเต็ม
    const res = await api.get(`/accounts/${acc.id}`);
    const data = res.data.data;

   const mapped = {
  ...data,
  twofa: data.secret_code,
  email_pass: data.email_password,
  status: data.status   // 🔥 ใส่ชัด ๆ ไปเลย
};

    setDetail(mapped);

    // โหลด asset
    const [ap, px, cd] = await Promise.all([
      api.get(`/account-pages/account/${acc.id}`),
      api.get(`/account-pixels/account/${acc.id}`),
      api.get(`/account-cards/account/${acc.id}`)
    ]);

    setAccountPages(ap.data.data || []);
    setAccountPixels(px.data.data || []);
    setAccountCards(cd.data.data || []);

  } catch (err) {
    console.error(err);
    showError('โหลดข้อมูลไม่สำเร็จ ❌');
  }
};

  // ================= COPY =================
  const copyAccount = () => {
    if (!detail) return;
 const text = [
      detail.username,
      detail.password,
      detail.secret_code,
      detail.email,
      detail.email_password,
      detail.temp_mail,
      detail.bm
    ]
 .filter(Boolean)
      .join('\n');
    navigator.clipboard.writeText(text);
    showSuccess('คัดลอกแล้ว 📋');
  };

  // ================= ADD =================
  const openAdd = async (t, acc) => {
  setAddModal(acc);
  setType(t);
  setSelected('');

  // 🔥 โหลด relation ก่อน
  const [ap, px, cd] = await Promise.all([
    api.get(`/account-pages/account/${acc.id}`),
    api.get(`/account-pixels/account/${acc.id}`),
    api.get(`/account-cards/account/${acc.id}`)
  ]);

  setAccountPages(ap.data.data || []);
  setAccountPixels(px.data.data || []);
  setAccountCards(cd.data.data || []);

  // 🔥 โหลด options
  const [p, px2, c] = await Promise.all([
    api.get('/pages'),
    api.get('/pixels'),
    api.get('/cards')
  ]);

  setPages(p.data.data || []);
  setPixels(px2.data.data || []);
  setCards(c.data.data || []);
};

  const handleSave = async () => {
    try {
      if (!selected) return showError('เลือกก่อน ❗');

      let res;

      if (type === 'page') {
        res = await api.post('/account-pages', {
          account_id: addModal.id,
          page_id: selected
        });
      }

      if (type === 'pixel') {
        res = await api.post('/account-pixels', {
          account_id: addModal.id,
          px_id: selected
        });
      }

      if (type === 'card') {
        res = await api.post('/account-cards', {
          account_id: addModal.id,
          card_id: selected
        });
      }

      if (res?.data?.success) {
        showSuccess(res.data.message);

        const acc = addModal;
        setAddModal(null);
        openDetail(acc);
      }

    } catch (err) {
      showError('Error ❌');
    }
  };

  // ================= DELETE =================
  const removeItem = async (item, t) => {
    if (!window.confirm('ลบแน่?')) return;

    try {

      if (t === 'page') {
        await api.delete(`/account-pages/${item.id}`);
      }

      if (t === 'pixel') {
        await api.delete(`/account-pixels/${item.id}`);
      }

      if (t === 'card') {
        await api.delete(`/account-cards/${item.id}`);
      }

      showSuccess('ลบสำเร็จ 🗑');
      openDetail(detail);

    } catch {
      showError('ลบไม่สำเร็จ ❌');
    }
  };

  // ================= EDIT =================
 const openEdit = async (acc) => {
  try {
    const res = await api.get(`/accounts/${acc.id}`);
    const data = res.data.data;

    setEditModal(data);

    // 🔥 FIX ตรงนี้
    setEditForm({
      ...data,
      twofa: data.secret_code,
      email_pass: data.email_password
    });

  } catch (err) {
    console.error(err);
    showError('โหลดข้อมูลไม่สำเร็จ ❌');
  }
};
  const handleUpdate = async () => {
  try {

    const payload = {
      ...editForm,
      secret_code: editForm.twofa,
      email_password: editForm.email_pass
    };

    const res = await api.put(`/accounts/${editModal.id}`, payload);

    if (res.data.success) {
      showSuccess('อัปเดตสำเร็จ');

      const acc = editModal;
      setEditModal(null);

      openDetail(acc);
      fetchAccounts();
    }

  } catch (err) {
    console.error(err);
    showError('Update error ❌');
  }
};

return (
  <div className="p-6 bg-gray-100 min-h-screen">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">

      <div>

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Welcome back 👋
        </p>

      </div>

      <div className="flex items-center gap-4">

        {/* USER */}
        <div className="text-right">

          <div className="font-semibold text-sm">
            {JSON.parse(localStorage.getItem('user'))?.username}
          </div>

          <div className="text-xs text-gray-500">
            {JSON.parse(localStorage.getItem('user'))?.role}
          </div>

        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            window.location.href = '/login';

          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>

      </div>

    </div>

    {/* ACCOUNT LIST */}
    <div className="grid grid-cols-3 gap-6">

      {accounts
        .filter(acc => acc.status === 'active')
        .map(acc => (

          <div
            key={acc.id}
            className="bg-white p-4 rounded shadow"
          >

            <div className="font-bold">
              {acc.username}
            </div>

            <div className="text-sm text-gray-500 mt-1">
              BM: {acc.bm}
            </div>

            <div className="flex gap-3 mt-3">

              <button onClick={()=>openDetail(acc)}>
                👁️
              </button>

              <button onClick={()=>openAdd('page', acc)}>
                📄
              </button>

              <button onClick={()=>openAdd('pixel', acc)}>
                ⚡
              </button>

              <button onClick={()=>openAdd('card', acc)}>
                💳
              </button>

            </div>

          </div>

      ))}

    </div>

    {/* DETAIL POPUP */}
    {detail && (
      <Modal onClose={()=>setDetail(null)}>

        <div className="flex justify-between mb-3">

          <h2 className="text-xl font-bold">
            Account Detail
          </h2>

          <div className="flex gap-2">

            <button
              onClick={copyAccount}
              className="bg-green-500 text-white px-2 rounded"
            >
              Copy All
            </button>

            <button
              onClick={()=>openEdit(detail)}
              className="bg-yellow-400 text-white px-2 rounded"
            >
              ✏️
            </button>

          </div>

        </div>

        <Row label="Username" value={detail.username} />
        <Row label="Password" value={detail.password} isPassword />
        <Row label="2FA" value={detail.twofa} />
        <Row label="Email" value={detail.email} />
        <Row label="Email Pass" value={detail.email_pass} />
        <Row label="Temp Mail" value={detail.temp_mail} />
        <Row label="BM" value={detail.bm} />
        <Row label="Status" value={detail.status} />

        <ListSection
          title="Pages"
          data={accountPages}
          field="page_id"
          onRemove={(i)=>removeItem(i,'page')}
        />

        <ListSection
          title="Pixels"
          data={accountPixels}
          field="px_id"
          onRemove={(i)=>removeItem(i,'pixel')}
        />

        <ListSection
          title="Cards"
          data={accountCards}
          field="number"
          onRemove={(i)=>removeItem(i,'card')}
        />

      </Modal>
    )}

    {/* ADD */}
    {addModal && (
      <Modal onClose={()=>setAddModal(null)}>

        <h2 className="text-xl font-bold mb-4">
          Add {type}
        </h2>

        <select
          onChange={(e)=>setSelected(e.target.value)}
          className="w-full border p-2 my-3"
        >

          <option value="">
            -- เลือก --
          </option>

          {type === 'page' && pages.map(p => {

            const used = accountPages.some(
              i => i.page_id === p.page_id
            );

            return (
              <option
                key={p.id}
                value={p.page_id}
                disabled={used}
              >
                {p.page_id}
                {used ? ' (ใช้แล้ว)' : ''}
              </option>
            );
          })}

          {type === 'pixel' && pixels.map(px => {

            const used = accountPixels.some(
              i => i.px_id === px.px_id
            );

            return (
              <option
                key={px.id}
                value={px.px_id}
                disabled={used}
              >
                {px.px_id}
                {used ? ' (ใช้แล้ว)' : ''}
              </option>
            );
          })}

          {type === 'card' && cards.map(c => {

            const used = accountCards.some(
              i => i.number === c.number
            );

            return (
              <option
                key={c.id}
                value={c.id}
                disabled={used}
              >
                {c.number}
                {used ? ' (ใช้แล้ว)' : ''}
              </option>
            );
          })}

        </select>

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Save
        </button>

      </Modal>
    )}

    {/* EDIT */}
    {editModal && (
      <Modal onClose={()=>setEditModal(null)}>

        <h2 className="text-xl font-semibold mb-4">
          Edit Account
        </h2>

        <div className="space-y-3 text-sm">

          <div>
            <label className="block mb-1 font-medium">
              Username
            </label>

            <input
              value={editForm.username || ''}
              onChange={e=>setEditForm({
                ...editForm,
                username:e.target.value
              })}
              className="w-full border p-2 rounded"
            />
          </div>

        </div>

      </Modal>
    )}

    

  </div>
);
}


// ================= COMPONENT =================

const Modal = ({ children, onClose }) => {

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={onClose}   // 🔥 คลิกพื้นหลัง = ปิด
    >
      <div
        className="bg-white p-8 rounded-xl shadow-lg relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}  // 🔥 กันคลิกทะลุ
      >
        <button onClick={onClose} className="absolute right-2 top-2">✖</button>
        {children}
      </div>
    </div>
  );
};

const Row = ({ label, value, isPassword }) => {
  const [show, setShow] = useState(false);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(value || '');
      toast.success("คัดลอกแล้ว 📋");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-between items-center text-sm mb-2">

      <div>
        <b>{label}:</b>{' '}
        {isPassword && !show ? '••••••' : value}
      </div>

      <div className="flex gap-2 items-center">

        {isPassword && (
          <button
            onClick={() => setShow(!show)}
            className="text-blue-500 text-xs"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        )}

        <button
          onClick={copyText}
          className="bg-gray-200 px-2 rounded"
        >
          Copy
        </button>

      </div>
    </div>
  );
};

const ListSection = ({ title, data, field, onRemove }) => (
  <div className="mt-3">
    <div className="font-bold">{title}</div>

    {data.map(i => (
      <div key={i.id} className="flex justify-between text-sm">
        <span>{i[field]}</span>
        <button onClick={()=>onRemove(i)} className="text-red-500">ลบ</button>
      </div>
    ))}
  </div>
);