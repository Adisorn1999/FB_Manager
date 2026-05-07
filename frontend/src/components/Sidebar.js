import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div style={{
      width: 220,
      height: '100vh',
      background: '#1e1e2f',
      color: '#fff',
      padding: 20
    }}>
      <h2 style={{ marginBottom: 30 }}>Manager</h2>

      <MenuItem to="/" label="Dashboard" />
      <MenuItem to="/accounts" label="Accounts" />
      <MenuItem to="/pages" label="Pages" />
      <MenuItem to="/pixels" label="Pixels" />
      <MenuItem to="/cards" label="Cards" />
      <MenuItem to="/relations" label="Relations" />
    </div>
  );
}

function MenuItem({ to, label }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <Link to={to} style={{ color: '#ccc', textDecoration: 'none' }}>
        {label}
      </Link>
    </div>
  );
}