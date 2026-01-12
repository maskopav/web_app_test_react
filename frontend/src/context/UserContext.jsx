import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const getInitialUser = () => {
    const stored = localStorage.getItem("adminUser");
    if (stored) return JSON.parse(stored);
    
    // Development Placeholder
    // if (import.meta.env.DEV) {
    //   return { id: 1, full_name: "Master User", role_id: 1, email: "master_user@example.com" };
    // }
    return null;
  };

  const [user, setUser] = useState(getInitialUser);

  const login = (userData) => {
    localStorage.setItem("adminUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("adminUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);