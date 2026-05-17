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
      // popup synchronous → ไม่หาย
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
      // popup synchronous → จะไม่หาย
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
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[400px]">
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>

        <form onSubmit={handleLogin}>
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
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-white p-4 rounded-lg font-semibold"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}