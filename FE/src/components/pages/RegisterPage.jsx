import React from 'react';
import { User, Calendar, Phone, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10">
          <div className="flex items-center  justify-center gap-2 mb-6">
            <span className="font-bold text-xl tracking-tight uppercase">CORTIA</span>
          </div>

          <h2 className="text-2xl font-bold">Pendaftaran Akun</h2>
          <p className="text-slate-500 mt-1 mb-8">Lengkapi data di bawah ini sesuai dengan identitas resmi Anda.</p>

          <form className="space-y-5">
            {/* nik (Primary Key) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">NIK (Nomor Induk Kependudukan)</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="nik"
                  placeholder="327xxxxxxxxxxxxx" 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition" 
                />
              </div>
            </div>

            {/* nama_panjang */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={16} />
                <input 
                  type="text" 
                  name="nama_panjang"
                  placeholder="Masukkan nama sesuai KTP" 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* tgl_lahir */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tanggal Lahir</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input 
                    type="date" 
                    name="tgl_lahir"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition text-sm" 
                  />
                </div>
              </div>

              {/* no_hp */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nomor HP</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input 
                    type="tel" 
                    name="no_hp"
                    placeholder="0812xxxxxxxx" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition" 
                  />
                </div>
              </div>
            </div>

            {/* email */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition" 
                />
              </div>
            </div>

            {/* password */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-900 transition" 
                />
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2">
                Daftar Akun <ArrowRight size={18} />
              </button>
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              Sudah memiliki akun? <Link to="/login" className="text-slate-900 font-bold hover:underline">Masuk di sini</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;