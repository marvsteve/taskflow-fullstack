import { useState } from "react";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom"; // Menambahkan import Outlet
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 block md:flex relative overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen w-full md:ml-72 transition-all duration-300 flex flex-col">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
          }}
          className="p-4 md:p-8 flex-1 w-full max-w-full overflow-x-hidden"
        >
          {/* Menggunakan Outlet sebagai tempat munculnya halaman-halaman dashboard */}
          <Outlet /> 
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;