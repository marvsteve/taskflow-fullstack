import React, { useState, useEffect } from "react";
import { FaTasks, FaSpinner, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, inProgress: 0, done: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi dinamis untuk mencocokkan key storage dengan user aktif
  const getUserStorageKeys = () => {
    const savedUser = localStorage.getItem("user");
    let userKey = "global";
    if (savedUser) {
      userKey = savedUser.replace(/^"|"$/g, '').toLowerCase();
    }
    return {
      tasksKey: `backup_tasks_${userKey}`,
      statsKey: `dashboard_stats_${userKey}`
    };
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};
    const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    return { Authorization: formattedToken, "x-auth-token": token };
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      const { tasksKey, statsKey } = getUserStorageKeys();
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/tasks", {
          headers: getAuthHeader(),
        });
        
        const currentTasks = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.tasks || []);
        
        calculateStats(currentTasks);
      } catch (error) {
        console.log("Membaca data backup milik akun aktif.");
        
        const localStats = localStorage.getItem(statsKey);
        const backupData = localStorage.getItem(tasksKey);
        
        if (localStats && backupData) {
          const parsedStats = JSON.parse(localStats);
          setStats({ total: parsedStats.total || 0, inProgress: parsedStats.inProgress || 0, done: parsedStats.done || 0 });
          setRecentTasks(JSON.parse(backupData).slice(0, 3));
        } else if (backupData) {
          calculateStats(JSON.parse(backupData));
        } else {
          setStats({ total: 0, inProgress: 0, done: 0 });
          setRecentTasks([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const calculateStats = (tasksList) => {
      const total = tasksList.length;
      const inProgress = tasksList.filter((t) => t.status === "In Progress").length;
      const done = tasksList.filter((t) => t.status === "Done").length;
      
      setStats({ total, inProgress, done });
      setRecentTasks(tasksList.slice(0, 3));
    };

    loadDashboardData();
  }, []);

  return (
    <div className="p-10 font-sans relative z-10">
      {loading ? (
        <div className="p-10 text-center text-slate-500 font-semibold animate-pulse">
          Memuat ringkasan aktivitas...
        </div>
      ) : (
        <>
          <div className="mb-4">
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 px-3 py-1 rounded-full tracking-wider uppercase">
              Ringkasan Aktivitas
            </span>
          </div>

          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Workspace Utama</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 p-6 rounded-2xl shadow-sm flex justify-between items-center transform transition-all hover:scale-[1.01]">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">TOTAL TUGAS</p>
                <h3 className="text-4xl font-black mt-2 text-slate-800 dark:text-white">{stats.total}</h3>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-xl">
                <FaTasks size={20} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 p-6 rounded-2xl shadow-sm flex justify-between items-center transform transition-all hover:scale-[1.01]">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">DALAM PROSES</p>
                <h3 className="text-4xl font-black mt-2 text-slate-800 dark:text-white">{stats.inProgress}</h3>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-xl">
                <FaSpinner size={20} className={stats.inProgress > 0 ? "animate-spin" : ""} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 p-6 rounded-2xl shadow-sm flex justify-between items-center transform transition-all hover:scale-[1.01]">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">SELESAI</p>
                <h3 className="text-4xl font-black mt-2 text-slate-800 dark:text-white">{stats.done}</h3>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl">
                <FaCheckCircle size={20} />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Aktivitas Tugas Terakhir</h2>
            <Link to="/tasks" className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Lihat Semua Task →
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/40 border border-dashed rounded-2xl p-10 text-center text-slate-400 text-sm">
              Belum ada aktivitas tugas yang terdaftar saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentTasks.map((task) => (
                <div 
                  key={task.id || task._id} 
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 p-6 rounded-2xl shadow-sm flex flex-col justify-between transform transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{task.title}</h4>
                      <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${
                        task.status === "Done" 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                          : task.status === "In Progress" 
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" 
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-slate-400 dark:text-slate-400 text-xs line-clamp-3 mb-4 leading-relaxed">
                      {task.desc || task.description || "Tidak ada deskripsi tambahan."}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                    <FaCalendarAlt size={10} className="text-slate-300" />
                    <span>Deadline: {task.date ? task.date.substring(0, 10) : "-"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;