import Sidebar from "./Sidebar";

export default function Layout({ children }) {

  return (

    <div className="flex min-h-screen bg-black">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <main
        className="
          flex-1
          p-6
          overflow-y-auto
          bg-black
          text-white
        "
      >
        {children}
      </main>

    </div>

  );

}