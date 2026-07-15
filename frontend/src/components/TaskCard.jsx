import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaFolder,
  FaCalendarAlt,
} from "react-icons/fa";

const TaskCard = ({ task, onEdit, onDelete }) => {
  // Pengaturan warna badge status dengan kontras tinggi (terang & gelap)
  const getStatusColor = (status) => {
    switch (status) {
      case "Todo":
        return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30";
      case "In Progress":
        return "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30";
      case "Done":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 border border-slate-200";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md duration-300 p-6 mb-5 border border-slate-200 dark:border-slate-800/80"
    >
      {/* Bagian Atas: Judul, Deskripsi, dan Status */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          {/* Judul Task - Tebal & Jelas */}
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {task.title}
          </h2>
          
          {/* Deskripsi - Warna Kontras Sedang agar Nyaman Dibaca */}
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-2xl">
            {task.description}
          </p>
        </div>

        {/* Badge Status */}
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shrink-0 ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>

      {/* Garis Pembatas Tipis */}
      <hr className="my-5 border-slate-100 dark:border-slate-800" />

      {/* Bagian Bawah: Metadata & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Metadata (Kategori & Tanggal) */}
        <div className="flex flex-wrap gap-5 text-slate-700 dark:text-slate-300 text-sm font-semibold">
          {/* Kategori */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <FaFolder className="text-blue-500 dark:text-blue-400" />
            <span>{task.category_name || "Tanpa Kategori"}</span>
          </div>

          {/* Tanggal Pembuatan */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <FaCalendarAlt className="text-emerald-500 dark:text-emerald-400" />
            <span>
              {task.created_at
                ? new Date(task.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>
        </div>

        {/* Tombol Aksi (Edit & Hapus) */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onEdit(task)}
            className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white border border-blue-100 dark:border-blue-900/50 transition-all duration-200"
            title="Edit Tugas"
          >
            <FaEdit className="text-base" />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white border border-red-100 dark:border-red-900/50 transition-all duration-200"
            title="Hapus Tugas"
          >
            <FaTrash className="text-base" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default TaskCard;