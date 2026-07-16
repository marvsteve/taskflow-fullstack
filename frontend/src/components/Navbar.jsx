import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaUserCircle, FaBars } from "react-icons/fa";

const Navbar = ({ onMenuClick }) => {
  const [activeUser, setActiveUser] = useState("Administrator");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        // "user" di localStorage sekarang berbentuk objek: {"id":9,"name":"kirana","email":"..."}
        const parsedUser = JSON.parse(savedUser);
        const displayName =
          parsedUser?.name || parsedUser?.email?.split("@")[0] || "Administrator";

        // Kapitalisasi huruf pertama biar rapi (kirana -> Kirana)
        setActiveUser(displayName.charAt(0).toUpperCase() + displayName.slice(1));
      } catch (err) {
        setActiveUser("Administrator");
      }
    }
  }, []);

  // Fungsi pembantu untuk memformat tanggal Indonesia di Header
  const getFormattedDate = () => {
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    return new Date().toLocaleDateString("id-ID", options);
  };

  return (
    <div className="bg-slate-400/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200 dark:border-white/5 p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full rounded-b-2xl shadow-sm">
      
      {/* Bagian Kiri: Tombol Hamburger Menu + Judul Halaman Utama Dinamis */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Tombol Hamburger - Muncul Hanya di Layar HP/Tablet */}
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-500/10 rounded-lg transition-colors"
        >
          <FaBars size={20} />
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Selamat datang kembali 👋</p>
        </div>
      </div>

      {/* Bagian Kanan: Widget Tanggal & Nama Akun User */}
      <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto justify-end">
        {/* Widget Hari & Tanggal Resmi */}
        <div className="flex items-center gap-2 bg-slate-700/80 dark:bg-slate-800 px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-white text-xs font-semibold shadow-sm border border-slate-600/50">
          <FaCalendarAlt className="text-blue-400" />
          <span>{getFormattedDate()}</span>
        </div>

        {/* Kotak Profil Pengguna Aktif */}
        <div className="flex items-center gap-3 bg-slate-700/90 dark:bg-slate-800 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-white text-xs font-bold shadow-sm border border-slate-600/50">
          <FaUserCircle size={22} className="text-slate-300" />
          <div className="flex flex-col items-start">
            {/* Menampilkan nama dinamis yang sudah diproses */}
            <span className="text-white leading-tight max-w-[120px] truncate">{activeUser}</span>
            <span className="text-[10px] text-slate-400 font-normal mt-0.5">User Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
