// src/components/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "Employer User",
    email: "employer@example.com",
    isVerified: false,
    emailVerified: false,
    companyVerified: false,
    paymentMethodVerified: false,
    profileComplete: false,
    // ... other user properties
  });

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const updateVerification = (updates) => {
    setUser(prev => ({
      ...prev,
      ...updates,
      isVerified: updates.emailVerified && updates.companyVerified && 
                 updates.paymentMethodVerified && updates.profileComplete
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateVerification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
