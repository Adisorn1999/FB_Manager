import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {

  const location = useLocation();

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

  };

  return (

    <div
      className="
        w-[240px]
        min-h-screen

        bg-[#15172b]

        text-white

        flex
        flex-col

        px-5
        py-6
      "
    >

      {/* LOGO */}
      <div className="mb-10">

        <h1 className="
          text-3xl
          font-bold
          tracking-wide
        ">
          Manager
        </h1>

        <p className="
          text-sm
          text-gray-400
          mt-1
        ">
          Admin Dashboard
        </p>

      </div>

      {/* MENU */}
      <div className="space-y-2">

        <MenuItem
          to="/dashboard"
          label="Dashboard"
          active={location.pathname === "/dashboard"}
        />

        <MenuItem
          to="/accounts"
          label="Accounts"
          active={location.pathname === "/accounts"}
        />

        <MenuItem
          to="/pages"
          label="Pages"
          active={location.pathname === "/pages"}
        />

        <MenuItem
          to="/pixels"
          label="Pixels"
          active={location.pathname === "/pixels"}
        />

        <MenuItem
          to="/cards"
          label="Cards"
          active={location.pathname === "/cards"}
        />

        <MenuItem
          to="/links"
          label="Links"
          active={location.pathname === "/links"}
        />

      </div>

      {/* FOOTER */}
      <div className="mt-auto">

        <div className="
          bg-white/5
          border
          border-white/10

          rounded-2xl

          p-4

          backdrop-blur
        ">

          <p className="
            text-xs
            text-gray-400
          ">
            Logged in as
          </p>

          <h3 className="
            font-semibold
            text-lg
            mt-1
          ">
            admin
          </h3>

          <button
            onClick={logout}
            className="
              mt-4
              w-full

              py-2.5

              rounded-xl

              bg-red-500
              hover:bg-red-600

              text-white
              font-medium

              transition-all
              duration-300
            "
          >
            Logout
          </button>

        </div>

        <p className="
          text-center
          text-xs
          text-gray-500
          mt-4
        ">
          v2.0 Dashboard
        </p>

      </div>

    </div>

  );

}

function MenuItem({ to, label, active }) {

  return (

    <Link
      to={to}
      className={`
        flex
        items-center

        px-4
        py-3

        rounded-xl

        transition-all
        duration-300

        ${
          active
            ? "bg-blue-600 text-white shadow-lg"
            : "text-gray-300 hover:bg-white/5 hover:text-white"
        }
      `}
    >
      {label}
    </Link>

  );

}