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

  // Helper internal: menyimpan sesi ke localStorage & state.
  // HANYA dipanggil setelah backend benar-benar mengonfirmasi kredensial valid.
  const setSession = (userData, jwtToken) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setToken(jwtToken);
  };

  // Sekarang benar-benar memanggil backend untuk verifikasi email & password
  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token: jwtToken, user: userData } = response.data.data;

    setSession(userData, jwtToken);
  };

  const register = async (email, password) => {
    const name = email.split("@")[0];

    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    const { token: jwtToken, user: userData } = response.data.data;

    if (jwtToken) {
      setSession(userData, jwtToken);
    }

    return true;
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
