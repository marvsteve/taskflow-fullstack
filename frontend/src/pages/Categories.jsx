import React, { useState, useEffect } from "react";
import { FaFolder, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // Helper untuk mendapatkan key penyimpanan unik per user
  const getUserStorageKeys = () => {
    const savedUser = localStorage.getItem("user");
    let userKey = "global";
    if (savedUser) {
      userKey = savedUser.replace(/^"|"$/g, '').toLowerCase();
    }
    return {
      categoriesKey: `backup_categories_${userKey}`,
      tasksKey: `backup_tasks_${userKey}`
    };
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    return { Authorization: formattedToken, "x-auth-token": token };
  };

  // Load Kategori & Tugas untuk menghitung relasi progress
  useEffect(() => {
    const loadData = async () => {
      const { categoriesKey, tasksKey } = getUserStorageKeys();
      
      // Load Tasks untuk menghitung statistik penyelesaian per kategori
      let currentTasks = [];
      try {
        const resTasks = await axios.get("http://localhost:3000/api/tasks", { headers: getAuthHeader() });
        currentTasks = Array.isArray(resTasks.data) ? resTasks.data : [];
      } catch (e) {
        const localTasks = localStorage.getItem(tasksKey);
        if (localTasks) currentTasks = JSON.parse(localTasks);
      }
      setTasks(currentTasks);

      // Load Categories
      try {
        const resCat = await axios.get("http://localhost:3000/api/categories", { headers: getAuthHeader() });
        if (Array.isArray(resCat.data)) {
          setCategories(resCat.data);
        }
      } catch (e) {
        const localCat = localStorage.getItem(categoriesKey);
        if (localCat) {
          setCategories(JSON.parse(localCat));
        } else {
          // Default kategori jika baru pertama kali buka
          const defaultCat = [
            { id: "1", name: "Web Development" },
            { id: "2", name: "Database" },
            { id: "3", name: "Frontend" },
            { id: "4", name: "Dokumentasi" }
          ];
          setCategories(defaultCat);
          localStorage.setItem(categoriesKey, JSON.stringify(defaultCat));
        }
      }
    };
    loadData();
  }, []);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const { categoriesKey } = getUserStorageKeys();

    if (editId) {
      // Mode Edit Kategori
      const updated = categories.map(cat => (cat.id === editId || cat._id === editId ? { ...cat, name: categoryName } : cat));
      try {
        await axios.put(`http://localhost:3000/api/categories/${editId}`, { name: categoryName }, { headers: getAuthHeader() });
      } catch (err) {
        console.log("Simpan kategori edit secara lokal");
      }
      setCategories(updated);
      localStorage.setItem(categoriesKey, JSON.stringify(updated));
      setEditId(null);
    } else {
      // Mode Tambah Kategori Baru
      const newCat = {
        id: Date.now().toString(),
        _id: Date.now().toString(),
        name: categoryName
      };
      try {
        await axios.post("http://localhost:3000/api/categories", newCat, { headers: getAuthHeader() });
      } catch (err) {
        console.log("Simpan kategori baru secara lokal");
      }
      const updated = [...categories, newCat];
      setCategories(updated);
      localStorage.setItem(categoriesKey, JSON.stringify(updated));
    }

    setCategoryName("");
  };

  const handleDeleteCategory = async (id, e) => {
    e.stopPropagation(); // Mencegah trigger klik kartu mengarah ke halaman Task
    if (confirm("Hapus kategori ini? Tugas yang terhubung akan kehilangan kategorinya.")) {
      const { categoriesKey } = getUserStorageKeys();
      const updated = categories.filter(cat => cat.id !== id && cat._id !== id);
      try {
        await axios.delete(`http://localhost:3000/api/categories/${id}`, { headers: getAuthHeader() });
      } catch (err) {
        console.log("Hapus kategori secara lokal");
      }
      setCategories(updated);
      localStorage.setItem(categoriesKey, JSON.stringify(updated));
    }
  };

  const handleEditClick = (cat, e) => {
    e.stopPropagation(); // Mencegah trigger klik kartu mengarah ke halaman Task
    setEditId(cat.id || cat._id);
    setCategoryName(cat.name);
  };

  // Fungsi navigasi mengarahkan user ke halaman tasks dengan filter kategori spesifik
  const handleCategoryClick = (name) => {
    navigate("/tasks", { state: { filterCategory: name } });
  };

  // Fungsi pembantu menghitung jumlah task & persentase selesai per kategori
  const getCategoryStats = (catName) => {
    const catTasks = tasks.filter(t => (t.category || "").toLowerCase() === catName.toLowerCase());
    const total = catTasks.length;
    if (total === 0) return { total: 0, percentage: 0 };
    
    const completed = catTasks.filter(t => t.status === "Done").length;
    const percentage = Math.round((completed / total) * 100);
    return { total, percentage };
  };

  return (
    <div className="p-10 font-sans relative z-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">Manajemen Kategori</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola kategori proyek untuk mempermudah pengelompokan tugas harian Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Tambah/Edit Kategori */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg"><FaPlus size={14} /></div>
            <h2 className="font-extrabold text-slate-800 dark:text-white">{editId ? "Edit Kategori" : "Tambah Kategori"}</h2>
          </div>
          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 tracking-wider mb-1">NAMA KATEGORI</label>
              <input
                type="text"
                required
                placeholder="Contoh: Mobile Dev, UI/UX..."
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl text-sm dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all">
              {editId ? "Update Kategori" : "Simpan Kategori"}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setCategoryName(""); }} className="w-full py-2 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold">
                Batal Edit
              </button>
            )}
          </form>
        </div>

        {/* Daftar Kategori Aktif */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-4">Kategori Aktif</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, index) => {
              const { total, percentage } = getCategoryStats(cat.name);
              // Skema warna dekoratif per card agar bervariasi
              const borderColors = ["border-l-blue-500", "border-l-emerald-500", "border-l-purple-500", "border-l-amber-500"];
              const borderClass = borderColors[index % borderColors.length];

              return (
                <div
                  key={cat.id || cat._id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`bg-white dark:bg-slate-800 border-l-4 ${borderClass} border-slate-200/60 dark:border-white/5 p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <FaFolder className="text-slate-400 dark:text-slate-500" />
                      <h3 className="font-bold text-slate-800 dark:text-white text-base">{cat.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => handleEditClick(cat, e)} className="p-1.5 text-slate-400 hover:text-blue-500 rounded-md transition-all" title="Edit">
                        <FaEdit size={12} />
                      </button>
                      <button onClick={(e) => handleDeleteCategory(cat.id || cat._id, e)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md transition-all" title="Hapus">
                        <FaTrash size={11} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <span>📋</span> {total} Tugas Terhubung
                    </p>
                    
                    {/* Progress Bar Penyelesaian Tugas */}
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
                        <span>Penyelesaian</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;