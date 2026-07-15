import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">

      {/* Previous */}
      <motion.button
        whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border duration-300
        ${
          currentPage === 1
            ? "bg-white/5 border-white/5 text-slate-600 cursor-not-allowed"
            : "bg-white/5 hover:bg-cyan-500 border-white/10 text-white hover:text-slate-950 shadow-lg hover:shadow-cyan-500/20"
        }`}
      >
        <FaChevronLeft />
        Previous
      </motion.button>

      {/* Nomor Halaman */}
      {pages.map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page)}
          className={`w-11 h-11 rounded-xl font-bold text-sm transition-all border duration-300
          ${
            currentPage === page
              ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-transparent shadow-[0_0_15px_rgba(0,242,254,0.3)]"
              : "bg-white/5 hover:bg-white/10 text-slate-300 border-white/10"
          }`}
        >
          {page}
        </motion.button>
      ))}

      {/* Next */}
      <motion.button
        whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border duration-300
        ${
          currentPage === totalPages
            ? "bg-white/5 border-white/5 text-slate-600 cursor-not-allowed"
            : "bg-white/5 hover:bg-cyan-500 border-white/10 text-white hover:text-slate-950 shadow-lg hover:shadow-cyan-500/20"
        }`}
      >
        Next
        <FaChevronRight />
      </motion.button>

    </div>
  );
};

export default Pagination;