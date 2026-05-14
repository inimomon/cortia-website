import React from 'react';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../ui/Navbar';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Navbar />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-10">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            <span className="font-bold text-2xl tracking-tight text-slate-900 uppercase">CORTIA</span>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Selamat Datang</h2>
            <p className="text-slate-500 mt-2">Masuk untuk mengakses Dashboard Analisis</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Institusi</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="email" 
                  placeholder="nama@instansi.go.id"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-slate-700">Kata Sandi</label>
                <Link to="/forgot-password" size={16} className="text-xs text-blue-600 hover:underline font-medium">Lupa sandi?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition text-sm"
                />
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
              Masuk ke Sistem <ArrowRight size={18} />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Atau</span></div>
            </div>

            <p className="text-center text-sm text-slate-500">
              Belum memiliki akses? <Link to="/register" className="text-slate-900 font-bold hover:underline">Daftar Akun</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;