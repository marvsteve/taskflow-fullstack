import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout"; // Diubah ke DashboardLayout
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import Categories from "../pages/Categories";
import Login from "../pages/Login"; 
import Register from "../pages/Register"; 
import { useAuth } from "../contexts/AuthContext";
import Landing from "../pages/Landing";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p className="text-lg font-bold animate-pulse">Memuat aplikasi...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* RUTE PUBLIK */}
      <Route 
        path="/" 
        element={!user ? <Landing /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/login" 
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/register" 
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />} 
      />

      {/* RUTE OPERASIONAL UTAMA */}
      {/* Diubah untuk menggunakan DashboardLayout */}
      <Route 
        element={user ? <DashboardLayout /> : <Navigate to="/" replace />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/categories" element={<Categories />} />
      </Route>

      {/* FALLBACK REDIRECT */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
};

export default AppRoutes;