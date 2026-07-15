import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Sidebar tetap menempel di kiri layar dengan lebar w-72 (18rem) */}
      <Sidebar />

      {/* Konten utama bergeser ke kanan sejauh lebar sidebar (pl-72) agar tidak saling tumpang tindih */}
      <div className="pl-72 flex flex-col min-h-screen">
        {/* Navbar dipasang di bagian atas halaman */}
        <Navbar />

        {/* Halaman utama (Dashboard, Tasks, Categories) akan otomatis dimuat di dalam Outlet ini */}
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;