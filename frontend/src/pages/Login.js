import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/accounts");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.username || !form.password) {
      Swal.fire({
        title: "Missing Fields ❌",
        text: "Please fill username and password",
        icon: "error",
        showConfirmButton: true,
        background: "#0f172a",
        color: "#fff",
      });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      Swal.fire({
        title: "Login Success ✅",
        text: `Welcome ${res.data.user.username || "User"}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#fff",
      });

      navigate("/accounts");
    } catch (err) {
      Swal.fire({
        title: "Login Failed ❌",
        text: err?.response?.data?.message || "Wrong username/password",
        icon: "error",
        showConfirmButton: true,
        background: "#0f172a",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="bg-gray-950/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-[400px]">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-center text-white/60 mb-8">
          Please login to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            autoComplete="off"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="off"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition text-white font-bold p-4 rounded-xl shadow-md"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 text-white/50 text-sm">
          Don't have an account?{" "}
          <span className="text-blue-400 hover:underline cursor-pointer">
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}