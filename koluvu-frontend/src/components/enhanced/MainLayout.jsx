// src/components/enhanced/MainLayout.jsx

import React from "react";

const MainLayout = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default MainLayout;
