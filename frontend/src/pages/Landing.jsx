import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaFolderOpen, FaArrowRight } from "react-icons/fa";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-hidden font-sans flex flex-col justify-between select-none">
      
      {/* 1. ELEGANT BACKGROUND ORBS */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[130px] pointer-events-none" />

      {/* 2. MINIMALIST TOP NAVBAR */}
      <header className="w-full px-8 py-6 flex justify-between items-center z-20 max-w-7xl mx-auto">
        {/* Brand Logo (Sesuai Konsep Logo Asli) */}
        <div className="flex items-center gap-3 text-slate-900 font-sans tracking-tight">
          <svg width="40" height="36" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <rect x="5" y="32" width="22" height="6" rx="3" fill="url(#logo-grad)" />
            <rect x="0" y="48" width="27" height="6" rx="3" fill="url(#logo-grad)" />
            <rect x="8" y="64" width="19" height="6" rx="3" fill="url(#logo-grad)" />
            <path 
              d="M50 15C41.7 15 35 21.7 35 30V70C35 78.3 41.7 85 50 85H90C98.3 85 105 78.3 105 70V30C105 21.7 98.3 15 90 15H50Z" 
              stroke="url(#logo-grad)" 
              strokeWidth="10" 
              strokeLinejoin="round" 
              fill="none"
            />
            <path 
              d="M58 52L68 62L87 38" 
              stroke="url(#logo-grad)" 
              strokeWidth="9" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex flex-col justify-center">
            <div className="text-xl font-black text-slate-800 tracking-tight leading-none flex items-center">
              <span>Task</span>
              <span className="text-blue-600 font-extrabold">Flow</span>
            </div>
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">Plan. Focus. Achieve.</span>
          </div>
        </div>

        {/* Akses Cepat */}
        <button
          onClick={() => navigate("/login")}
          className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors duration-200"
        >
          Masuk Akun
        </button>
      </header>

      {/* 3. HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto z-10 my-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full shadow-sm">
            Smart Task Manager
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-black text-slate-800 tracking-tight leading-none">
            Kelola Tugas Kuliah <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Tanpa Hambatan
            </span>
          </h1>
          
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto font-medium leading-relaxed">
            Pantau seluruh progres tugas harian, filter status pengerjaan, dan atur kategori proyek akademik Anda dalam satu ruang kerja digital terpadu.
          </p>

          <div className="pt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-600 transition-all duration-300"
            >
              <span>Mulai Sekarang</span>
              <FaArrowRight className="text-sm" />
            </motion.button>
          </div>
        </motion.div>

        {/* 4. HIGH-LIGHT FEATURES */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mt-16 text-left"
        >
          {/* Fitur 1 */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl inline-block mb-4">
              <FaCheckCircle className="text-lg" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 mb-1">Manajemen Tugas</h3>
            <p className="text-slate-500 text-sm font-medium">Tambah, edit, hapus, dan kelompokkan tugas harian Anda berdasarkan status To-Do, In Progress, atau Done.</p>
          </div>

          {/* Fitur 2 */}
          <div className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl inline-block mb-4">
              <FaFolderOpen className="text-lg" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 mb-1">Sistem Kategori</h3>
            <p className="text-slate-500 text-sm font-medium">Kelompokkan berbagai tugas secara spesifik (misal: Mata Kuliah, Proyek Akhir, atau Magang) secara dinamis.</p>
          </div>
        </motion.div>
      </main>

      {/* 5. FOOTER */}
      <footer className="w-full text-center py-6 text-xs text-slate-400 font-medium border-t border-slate-200/50">
        &copy; {new Date().getFullYear()} TaskFlow Team. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
};

export default Landing;