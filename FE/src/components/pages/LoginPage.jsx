import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../ui/Navbar";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8005/api/v1/auth/login",
        formData,
      );

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Navbar />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <span className="font-bold text-2xl tracking-tight text-slate-900 uppercase">
              CORTIA
            </span>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Selamat Datang
            </h2>

            <p className="text-slate-500 mt-2">
              Masuk untuk mengakses Dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Email
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="nama@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
            >
              {loading ? "Loading..." : "Masuk ke Sistem"}

              <ArrowRight size={18} />
            </button>

            <p className="text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-slate-900 font-bold hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
