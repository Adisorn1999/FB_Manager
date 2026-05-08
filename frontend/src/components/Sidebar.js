import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
export default function Sidebar() {

  const location = useLocation();

  const logout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    window.location.href = '/login';
  };

  return (

    <div style={{
      width: 220,
      height: '100vh',
      background: '#1e1e2f',
      color: '#fff',
      padding: 20
    }}>

      <h2 style={{ marginBottom: 30 }}>
        Manager
      </h2>

      <MenuItem to="/dashboard" label="Dashboard"  active={location.pathname === '/dashboard'}/>
      <MenuItem to="/accounts" label="Accounts" active={location.pathname === '/accounts'} />
      <MenuItem to="/pages" label="Pages" active={location.pathname === '/pages'} />
      <MenuItem to="/pixels" label="Pixels" active={location.pathname === '/pixels'} />
      <MenuItem to="/cards" label="Cards" active={location.pathname === '/cards'} />
      <MenuItem to="/relations" label="Relations" active={location.pathname === '/relations'} />


    </div>
  );
}

function MenuItem({ to, label }) {

  return (

    <div style={{ marginBottom: 15 }}>

      <Link
        to={to}
        style={{
          color: '#ccc',
          textDecoration: 'none'
        }}
      >
        {label}
      </Link>

    </div>
  );
}