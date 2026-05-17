import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import api from "../api/axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 login แล้ว → dashboard
  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  // ================= CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      Swal.fire({
            title: "Edit Page ?",
            icon: "question",
            showCancelButton: true,
      
            background: "#0f172a",
            color: "#fff",
          });

      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Wrong username/password");
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[400px]">
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border p-4 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-4 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 transition text-white p-4 rounded-lg font-semibold"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}
