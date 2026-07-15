import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validasi kecocokan password di frontend
    if (password !== confirmPassword) {
      return setError("Konfirmasi kata sandi tidak cocok.");
    }

    // 2. Validasi panjang minimal password di frontend agar tidak ditolak sistem auth
    if (password.length < 6) {
      return setError("Kata sandi minimal harus terdiri dari 6 karakter.");
    }

    try {
      setError("");
      setLoading(true);
      
      // Mengirim data ke Context Auth
      await register(email, password);
      
      // Jika berhasil, alihkan langsung ke dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Error Registrasi:", err);
      setError("Gagal membuat akun. Silakan periksa koneksi server backend Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-hidden font-sans flex items-center justify-center select-none">
      
      {/* Ornamen Latar Belakang */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-[120px] pointer-events-none" />

      <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-10 rounded-3xl shadow-xl w-full max-w-md z-10 transition-all duration-300">
        
        {/* LOGO BARU TASKFLOW */}
        <div className="flex justify-center mb-6">
          <svg width="60" height="54" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
            <defs>
              <linearGradient id="reg-logo-grad-new" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <rect x="5" y="32" width="22" height="6" rx="3" fill="url(#reg-logo-grad-new)" />
            <rect x="0" y="48" width="27" height="6" rx="3" fill="url(#reg-logo-grad-new)" />
            <rect x="8" y="64" width="19" height="6" rx="3" fill="url(#reg-logo-grad-new)" />
            <path 
              d="M50 15C41.7 15 35 21.7 35 30V70C35 78.3 41.7 85 50 85H90C98.3 85 105 78.3 105 70V30C105 21.7 98.3 15 90 15H50Z" 
              stroke="url(#reg-logo-grad-new)" 
              strokeWidth="10" 
              strokeLinejoin="round" 
              fill="none"
            />
            <path 
              d="M58 52L68 62L87 38" 
              stroke="url(#reg-logo-grad-new)" 
              strokeWidth="9" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Daftar Akun <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TaskFlow</span>
          </h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">Mulai organisasikan rencana akademik Anda sekarang</p>
        </div>

        {error && (
          <div className="mb-5 p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Alamat Email</label>
            <input 
              type="email" 
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Kata Sandi Baru</label>
            <input 
              type="password" 
              required
              placeholder="Min. 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-300"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Konfirmasi Kata Sandi</label>
            <input 
              type="password" 
              required
              placeholder="Ulangi kata sandi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md shadow-blue-500/10 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Membuat Akun..." : "Daftar & Masuk Workspace"}
          </button>
        </form>

        <div className="text-center mt-6 text-xs font-semibold text-slate-400">
          Sudah memiliki akun?{" "}
          <button 
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline font-bold"
          >
            Masuk disini
          </button>
        </div>

      </div>
    </div>
  );
};

export default Register;