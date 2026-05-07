import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data.data || []))
      .catch(err => console.error(err));
  }, []);

  // 🧠 group by account
  const grouped = {};

  (data || []).forEach(item => {
    if (!grouped[item.account_id]) {
      grouped[item.account_id] = {
        id: item.account_id,
        username: item.username,
        bm: item.bm,
        status: item.account_status,
        pages: new Set(),
        pixels: new Set()
      };
    }

    if (item.page_id) grouped[item.account_id].pages.add(item.page_id);
    if (item.px_id) grouped[item.account_id].pixels.add(item.px_id);
  });

  const accounts = Object.values(grouped);

  // 🟢 OPEN MODAL
  const openModal = (acc) => {
    setSelected(acc);
    setDetail(null);
    setShowPassword(false);

    api.get(`/accounts/${acc.id}`)
      .then(res => setDetail(res.data.data))
      .catch(err => console.error(err));
  };

  const closeModal = () => {
    setSelected(null);
    setDetail(null);
  };

  // 🔥 COPY SINGLE
  const copy = (text, key) => {
    navigator.clipboard.writeText(text || '');
    setCopied(key);
    setTimeout(() => setCopied(''), 1000);
  };

  // 🔥 COPY ALL (FORMAT ดิบ)
  const copyAll = () => {
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

    setCopied('all');
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {accounts.map((acc) => (
          <div
            key={acc.id}
            onClick={() => openModal(acc)}
            className="bg-white rounded-2xl p-5 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border cursor-pointer"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">{acc.username}</h2>
                <p className="text-xs text-gray-500">BM: {acc.bm}</p>
              </div>

              <span className={`px-3 py-1 text-xs rounded-full font-medium
                ${acc.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'}`}>
                {acc.status}
              </span>
            </div>

            <div className="border-t my-3"></div>

            {/* PAGES */}
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-600 mb-1">Pages</p>
              <div className="flex flex-wrap gap-2">
                {[...acc.pages].length > 0 ? (
                  [...acc.pages].map((p, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">No Pages</span>
                )}
              </div>
            </div>

            {/* PIXELS */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Pixels</p>
              <div className="flex flex-wrap gap-2">
                {[...acc.pixels].length > 0 ? (
                  [...acc.pixels].map((px, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                      {px}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">No Pixels</span>
                )}
              </div>
            </div>

          </div>
        ))}

      </div>

      {/* 🟣 MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-[420px] p-6 shadow-xl relative">

            {/* CLOSE */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            {/* 🔥 COPY ALL BUTTON */}
            <div className="absolute top-3 right-14">
              <button
                onClick={copyAll}
                className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                {copied === 'all' ? 'Copied!' : 'Copy All'}
              </button>
            </div>

            <h2 className="text-xl font-bold mb-4">Account Detail</h2>

            {!detail ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <div className="space-y-2 text-sm">

                <Row label="Username" value={detail.username} onCopy={() => copy(detail.username, 'u')} copied={copied === 'u'} />

                {/* PASSWORD */}
                <div className="flex justify-between items-center">
                  <div>
                    <b>Password:</b> {showPassword ? detail.password : '••••••••'}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs bg-gray-200 px-2 py-1 rounded"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>

                    <button
                      onClick={() => copy(detail.password, 'p')}
                      className="text-xs bg-blue-100 px-2 py-1 rounded"
                    >
                      {copied === 'p' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <Row label="2FA" value={detail.secret_code} onCopy={() => copy(detail.secret_code, '2fa')} copied={copied === '2fa'} />
                <Row label="Email" value={detail.email} onCopy={() => copy(detail.email, 'e')} copied={copied === 'e'} />
                <Row label="Email Pass" value={detail.email_password} onCopy={() => copy(detail.email_password, 'ep')} copied={copied === 'ep'} />
                <Row label="Temp Mail" value={detail.temp_mail} onCopy={() => copy(detail.temp_mail, 'tm')} copied={copied === 'tm'} />
                <Row label="BM" value={detail.bm} onCopy={() => copy(detail.bm, 'bm')} copied={copied === 'bm'} />

                <p><b>Status:</b> {detail.status}</p>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

// 🔥 reusable row
function Row({ label, value, onCopy, copied }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <b>{label}:</b> {value || '-'}
      </div>

      <button
        onClick={onCopy}
        className="text-xs bg-blue-100 px-2 py-1 rounded"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}