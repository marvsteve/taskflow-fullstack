import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaFolder, FaCalendarAlt, FaTrash, FaInbox, FaTimes, FaEdit } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import axios from "axios"; 

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]); // State kategori baru
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  
  // State filter kategori dinamis
  const [categoryFilter, setCategoryFilter] = useState("Semua Kategori");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    desc: "", 
    status: "Todo",
    category: "General", // Default kategori awal
    date: ""
  });

  const location = useLocation();

  // Mendapatkan key storage unik berdasarkan user aktif
  const getUserStorageKeys = () => {
    const savedUser = localStorage.getItem("user");
    let userKey = "global";
    if (savedUser) {
      userKey = savedUser.replace(/^"|"$/g, '').toLowerCase();
    }
    return {
      tasksKey: `backup_tasks_${userKey}`,
      statsKey: `dashboard_stats_${userKey}`,
      categoriesKey: `backup_categories_${userKey}`
    };
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    return { Authorization: formattedToken, "x-auth-token": token };
  };

  const updateDashboardStats = (currentTasks) => {
    const total = currentTasks.length;
    const todo = currentTasks.filter(t => t.status === "Todo").length;
    const inProgress = currentTasks.filter(t => t.status === "In Progress").length;
    const done = currentTasks.filter(t => t.status === "Done").length;
    
    const { statsKey } = getUserStorageKeys();
    localStorage.setItem(statsKey, JSON.stringify({ total, todo, inProgress, done }));
  };

  // Fetch Kategori & Tasks
  const fetchData = async () => {
    const { tasksKey, categoriesKey } = getUserStorageKeys();
    try {
      setLoading(true);
      
      // 1. Ambil Tasks
      const response = await axios.get("http://localhost:3000/api/tasks", { headers: getAuthHeader() });
      let currentTasks = [];
      if (Array.isArray(response.data)) {
        currentTasks = response.data;
        setTasks(currentTasks);
        updateDashboardStats(currentTasks);
      }

      // 2. Ambil Kategori
      const resCat = await axios.get("http://localhost:3000/api/categories", { headers: getAuthHeader() });
      if (Array.isArray(resCat.data)) {
        setCategories(resCat.data);
      }
    } catch (error) {
      // FALLBACK LOCAL STORAGE
      const localData = localStorage.getItem(tasksKey);
      const localCats = localStorage.getItem(categoriesKey);

      const parsedTasks = localData ? JSON.parse(localData) : [];
      setTasks(parsedTasks);
      updateDashboardStats(parsedTasks);

      const parsedCats = localCats ? JSON.parse(localCats) : [
        { id: "1", name: "Web Development" },
        { id: "2", name: "Database" },
        { id: "3", name: "Frontend" },
        { id: "4", name: "Dokumentasi" }
      ];
      setCategories(parsedCats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // MENDETEKSI JIKA USER DIALIKHAN DARI KLIK KARTU KATEGORI
  useEffect(() => {
    if (location.state && location.state.filterCategory) {
      setCategoryFilter(location.state.filterCategory);
      // Bersihkan state agar saat refresh page filter tidak tertahan terus
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    const { tasksKey } = getUserStorageKeys();
    
    if (editId) {
      const updatedTasks = tasks.map(task => {
        if (task.id === editId || task._id === editId) {
          return { ...task, ...formData, description: formData.desc };
        }
        return task;
      });

      try {
        await axios.put(`http://localhost:3000/api/tasks/${editId}`, formData, { headers: getAuthHeader() });
      } catch (error) {
        console.log("Simpan perubahan secara lokal.");
      }

      setTasks(updatedTasks);
      localStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
      updateDashboardStats(updatedTasks);
      setEditId(null);
    } else {
      const newTaskFormat = {
        id: Date.now(),
        _id: Date.now().toString(),
        title: formData.title,
        desc: formData.desc,
        description: formData.desc,
        status: formData.status,
        category: formData.category,
        date: formData.date
      };

      try {
        await axios.post("http://localhost:3000/api/tasks", newTaskFormat, { headers: getAuthHeader() });
      } catch (error) {
        console.log("Simpan data baru secara lokal.");
      }

      const updatedTasks = [newTaskFormat, ...tasks];
      setTasks(updatedTasks);
      localStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
      updateDashboardStats(updatedTasks);
    }

    // Reset Form & Tutup Modal
    setFormData({ title: "", desc: "", status: "Todo", category: categories[0]?.name || "General", date: "" });
    setIsModalOpen(false);
  };

  const handleEditClick = (task) => {
    setEditId(task.id || task._id);
    setFormData({
      title: task.title || "",
      desc: task.desc || task.description || "",
      status: task.status || "Todo",
      category: task.category || "General",
      date: task.date ? task.date.substring(0, 10) : ""
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      const { tasksKey } = getUserStorageKeys();
      const updatedTasks = tasks.filter(task => task.id !== id && task._id !== id);
      try {
        await axios.delete(`http://localhost:3000/api/tasks/${id}`, { headers: getAuthHeader() });
      } catch (error) {
        console.log("Hapus data secara lokal.");
      }
      setTasks(updatedTasks);
      localStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
      updateDashboardStats(updatedTasks);
    }
  };

  // PROSES FILTERING TUGAS GANDA (BERDASARKAN TEXT, STATUS, DAN KATEGORI)
  const filteredTasks = tasks.filter((task) => {
    const titleText = task.title ? task.title.toLowerCase() : "";
    const descText = task.desc || task.description ? (task.desc || task.description).toLowerCase() : "";
    const matchesSearch = titleText.includes(searchQuery.toLowerCase()) || descText.includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "Semua Status" || task.status === statusFilter;
    
    const matchesCategory = categoryFilter === "Semua Kategori" || 
      (task.category || "").toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="p-10 font-sans relative z-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Daftar Tugas Anda</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pantau dan kelola seluruh jadwal tugas dengan aman.</p>
      </div>

      <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 p-4 rounded-2xl flex flex-col xl:flex-row gap-4 items-center justify-between shadow-sm mb-8">
        <div className="relative w-full xl:w-80">
          <FaSearch className="absolute left-4 top-3.5 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Cari task..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-3 items-center">
          {/* Dropdown Filter Kategori */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer w-full sm:w-48"
          >
            <option value="Semua Kategori">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          {/* Dropdown Filter Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer w-full sm:w-48"
          >
            <option value="Semua Status">Semua Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <button
            onClick={() => { 
              setEditId(null); 
              setFormData({ 
                title: "", 
                desc: "", 
                status: "Todo", 
                category: categories[0]?.name || "General", 
                date: "" 
              }); 
              setIsModalOpen(true); 
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FaPlus size={11} /> Tambah Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center text-slate-500 font-semibold animate-pulse">Menghubungkan ke server...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-2xl mb-4"><FaInbox size={40} /></div>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Belum ada tugas</h3>
          <p className="text-slate-400 text-xs max-w-sm mt-1 mb-6">Mulai tambahkan tugas baru di kategori atau filter ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id || task._id} className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transform transition-all duration-300 hover:shadow-md hover:shadow-blue-500/5 hover:-translate-y-1">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{task.title}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${task.status === "Done" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : task.status === "In Progress" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-3xl">{task.desc || task.description}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-[11px] font-medium text-slate-400">
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md"><FaFolder size={10} className="text-blue-500" />{task.category || "General"}</div>
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md"><FaCalendarAlt size={10} />Deadline: {task.date ? task.date.substring(0, 10) : "-"}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 justify-end">
                <button onClick={() => handleEditClick(task)} className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all" title="Edit Tugas">
                  <FaEdit size={14} />
                </button>
                <button onClick={() => handleDeleteTask(task.id || task._id)} className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all" title="Hapus Tugas">
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT TASK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"><FaTimes size={16} /></button>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">{editId ? "Edit Tugas" : "Tugas Baru"}</h2>
            <p className="text-slate-400 text-xs mb-6">Ubah data target rencana manajemen pengerjaan tugas Anda.</p>

            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 tracking-wider mb-1">JUDUL TUGAS</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-sm dark:text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 tracking-wider mb-1">DESKRIPSI TUGAS</label>
                <textarea rows="3" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-sm dark:text-white resize-none focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* MODIFIKASI: Mengubah Input Text Kategori Menjadi Select Dropdown yang Dinamis */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 tracking-wider mb-1">KATEGORI</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-sm dark:text-white focus:outline-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id || cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 tracking-wider mb-1">BATAS WAKTU</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-sm dark:text-white focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 tracking-wider mb-1">STATUS</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-sm dark:text-white focus:outline-none">
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 border rounded-xl text-xs font-bold text-slate-500">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md">{editId ? "Simpan Perubahan" : "Tambah Tugas"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;