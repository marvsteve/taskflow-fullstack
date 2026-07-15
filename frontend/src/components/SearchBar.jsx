import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  search,
  setSearch,
  status,
  setStatus,
  onAddTask,
}) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] p-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Input Pencarian */}
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all placeholder-slate-500 font-medium"
          />
        </div>

        {/* Filter Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl bg-white/5 border border-white/10 text-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all font-medium cursor-pointer"
        >
          <option value="" className="bg-slate-900 text-white">Semua Status</option>
          <option value="Todo" className="bg-slate-900 text-white">Todo</option>
          <option value="In Progress" className="bg-slate-900 text-white">In Progress</option>
          <option value="Done" className="bg-slate-900 text-white">Done</option>
        </select>

        {/* Tombol Tambah Task yang Menyala */}
        <button
          onClick={onAddTask}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-slate-950 rounded-xl font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(0,242,254,0.3)] hover:shadow-[0_4px_25px_rgba(0,242,254,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
        >
          + Tambah Task
        </button>

      </div>
    </div>
  );
};

export default SearchBar;