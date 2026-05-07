import Sidebar from './Sidebar';

export default function Layout({ children }) {

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="flex-1">
        {children}
      </div>

    </div>
  );
}