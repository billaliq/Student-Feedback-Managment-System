import { createContext, useContext, useState } from "react";
import { adminLogin } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("admin");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (username, password) => {
    const data = await adminLogin(username, password);
    if (data.success) {
      const adminData = { token: data.token, ...data.user };
      setAdmin(adminData);
      localStorage.setItem("admin", JSON.stringify(adminData));
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
