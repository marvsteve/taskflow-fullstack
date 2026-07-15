import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  FaThLarge, 
  FaCheckSquare, 
  FaTags, 
  FaSignOutAlt 
} from "react-icons/fa";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Gagal keluar:", error);
    }
  };

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <FaThLarge /> },
    { path: "/tasks", name: "Tasks", icon: <FaCheckSquare /> },
    { path: "/categories", name: "Categories", icon: <FaTags /> },
  ];

  return (
    // Ditambahkan fixed, posisi top-left, tinggi penuh h-screen, dan lebar w-72 pas sesuai pl-72 MainLayout
    <div className="fixed top-0 left-0 w-72 h-screen bg-[#05040a] text-slate-400 flex flex-col justify-between border-r border-slate-900 shadow-xl select-none z-30">
      
      {/* BAGIAN ATAS: LOGO BRAND */}
      <div>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-900 font-sans">
          <svg width="34" height="30" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="side-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <rect x="5" y="32" width="22" height="6" rx="3" fill="url(#side-logo-grad)" />
            <rect x="0" y="48" width="27" height="6" rx="3" fill="url(#side-logo-grad)" />
            <rect x="8" y="64" width="19" height="6" rx="3" fill="url(#side-logo-grad)" />
            <path 
              d="M50 15C41.7 15 35 21.7 35 30V70C35 78.3 41.7 85 50 85H90C98.3 85 105 78.3 105 70V30C105 21.7 98.3 15 90 15H50Z" 
              stroke="url(#side-logo-grad)" 
              strokeWidth="10" 
              strokeLinejoin="round" 
              fill="none"
            />
            <path 
              d="M58 52L68 62L87 38" 
              stroke="url(#side-logo-grad)" 
              strokeWidth="9" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="flex flex-col">
            <div className="text-lg font-black tracking-tight leading-none text-white">
              <span>Task</span>
              <span className="text-blue-400 font-extrabold">Flow</span>
            </div>
            <span className="text-[8px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">Smart Task Manager</span>
          </div>
        </div>

        {/* MENU NAVIGASI */}
        <nav className="mt-6 px-3 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive 
                  ? "bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-[0_4px_12px_rgba(59,130,246,0.1)]" 
                  : "hover:bg-white/5 hover:text-slate-200"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* BAGIAN BAWAH: TOMBOL KELUAR */}
      <div className="p-4 border-t border-slate-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-bold text-red-400/90 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 rounded-xl transition-all duration-200 group"
        >
          <FaSignOutAlt className="group-hover:translate-x-0.5 transition-transform" />
          <span>Keluar Aplikasi</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;