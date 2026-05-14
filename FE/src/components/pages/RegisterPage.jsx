import React, { useState } from "react";

import { User, Calendar, Phone, Mail, Lock, ArrowRight } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nik: "",
    nama_panjang: "",
    tgl_lahir: "",
    no_hp: "",
    email: "",
    password: "",
  });
  const validateForm = () => {
    let newErrors = {};

    // validasi nik
    if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = "NIK harus 16 digit angka";
    }

    // validasi no hp
    if (!/^\d{10,15}$/.test(formData.no_hp)) {
      newErrors.no_hp = "Nomor HP harus 10-15 digit angka";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
     return;
    }
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8005/api/v1/auth/register",
        formData,
      );
      navigate("/login");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="font-bold text-xl tracking-tight uppercase">
              CORTIA
            </span>
          </div>

          <h2 className="text-2xl font-bold">Pendaftaran Akun</h2>

          <p className="text-slate-500 mt-1 mb-8">
            Lengkapi data di bawah ini sesuai dengan identitas resmi Anda.
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* NIK */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                NIK
              </label>

              <div className="relative">
                <input
                  type="number"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="327xxxxxxxxxxxxx"
                  className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition"
                />
              </div>
            </div>

            {/* Nama */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Nama Lengkap
              </label>

              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-slate-400"
                  size={16}
                />

                <input
                  type="text"
                  name="nama_panjang"
                  value={formData.nama_panjang}
                  onChange={handleChange}
                  placeholder="Masukkan nama sesuai KTP"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tanggal Lahir */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tanggal Lahir
                </label>

                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-3 text-slate-400"
                    size={16}
                  />

                  <input
                    type="date"
                    name="tgl_lahir"
                    value={formData.tgl_lahir}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition text-sm"
                  />
                </div>
              </div>

              {/* No HP */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nomor HP
                </label>

                <div className="relative">
                  <Phone
                    className="absolute left-3 top-3 text-slate-400"
                    size={16}
                  />

                  <input
                    type="text"
                    name="no_hp"
                    value={formData.no_hp}
                    onChange={handleChange}
                    placeholder="0812xxxxxxxx"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Alamat Email
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-slate-400"
                  size={16}
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kata Sandi
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-slate-400"
                  size={16}
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                {loading ? "Loading..." : "Daftar Akun"}

                <ArrowRight size={18} />
              </button>
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              Sudah memiliki akun?{" "}
              <Link
                to="/login"
                className="text-slate-900 font-bold hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
