import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("");

  const login = (name) => {
    setIsAdmin(true);
    setAdminName(name);
    localStorage.setItem("adminName", name);
  };

  const logout = () => {
    setIsAdmin(false);
    setAdminName("");
    localStorage.removeItem("adminName");
  };

  // Check if admin was logged in on mount
  if (!isAdmin && typeof window !== "undefined") {
    const stored = localStorage.getItem("adminName");
    if (stored && !adminName) {
      setAdminName(stored);
      setIsAdmin(true);
    }
  }

  return (
    <AuthContext.Provider value={{ isAdmin, adminName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
