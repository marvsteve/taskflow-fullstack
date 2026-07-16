import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setToken(jwtToken);
  };

  const register = async (email, password) => {
    try {
      // Membuat nama otomatis dari string email sebelum tanda '@'
      const name = email.split("@")[0];

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // Backend sekarang mengembalikan { success, data: { token, user } }
      const { token: jwtToken, user: userData } = response.data.data;

      if (jwtToken) {
        // Langsung "login"-kan user yang baru daftar, sama seperti alur login biasa
        login(userData, jwtToken);
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
