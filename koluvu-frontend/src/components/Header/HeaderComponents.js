// src/components/Header/HeaderComponents.js

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../../styles/components/header/header.module.css";

export const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(pathname === href);
  }, [pathname, href]);

  return (
    <Link
      href={href}
      className={`${
        styles["nav-link"]
      } text-white hover:bg-white/25 px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5 rounded-full font-medium relative transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:scale-105 group ${
        isActive ? styles.active : ""
      }`}
      style={{ fontSize: "clamp(13px, 1.4vw, 15px)" }}
    >
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      {isActive && (
        <span className="absolute bottom-0 left-1/2 w-4 h-1 bg-white transform -translate-x-1/2 rounded-full shadow-lg" style={{ boxShadow: "0 0 10px rgba(255,255,255,0.5)" }}></span>
      )}
    </Link>
  );
};

export const MobileNavLink = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-white hover:bg-white/25 block px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 rounded-xl font-medium transition-all duration-300 hover:pl-5 hover:transform hover:scale-[1.02] ${
        isActive ? "bg-white/20 border-l-4 border-white shadow-lg" : ""
      } relative overflow-hidden group`}
      style={{ fontSize: "clamp(14px, 3.5vw, 16px)" }}
    >
      <span className="relative z-10 flex items-center">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
      {isActive && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg" style={{ boxShadow: "0 0 10px rgba(255,255,255,0.6)" }}></div>
        </div>
      )}
    </Link>
  );
};

export const MobileAuthButton = ({ href, children, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className="bg-[#28a745] hover:bg-[#218838] text-white px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 rounded-xl font-semibold block text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] relative overflow-hidden group"
    style={{ 
      fontSize: "clamp(14px, 3.5vw, 16px)",
      boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)"
    }}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "inset 0 0 30px rgba(255, 255, 255, 0.15)" }}></div>
  </Link>
);

export const DropdownLink = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (isActive) {
          e.preventDefault();
          window.location.href = href;
        }
      }}
      className="group block px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 transition-all duration-300 hover:pl-4 relative overflow-hidden border-l-4 border-transparent hover:border-[#fa7f04]"
    >
      <span className="relative z-10 flex items-center">
        {children}
        <svg
          className="ml-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-[#fa7f04]/5 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
    </Link>
  );
};

export const MobileDropdownLink = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = (e) => {
    if (isActive) {
      e.preventDefault();
      window.location.href = href;
    }
    onClick?.();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="group block px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-2.5 text-white hover:bg-white/20 rounded-lg font-medium relative transition-all duration-300 hover:pl-4 hover:transform hover:scale-105 overflow-hidden"
      style={{ fontSize: "clamp(14px, 3.5vw, 15px)" }}
    >
      <span className="relative z-10 flex items-center">
        {children}
        <svg
          className="ml-1.5 w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
      {isActive && (
        <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
        </div>
      )}
    </Link>
  );
};

export const AuthButton = ({ href, children }) => (
  <Link
    href={href}
    className={`${styles["auth-button"]} bg-[#28a745] hover:bg-[#218838] text-white px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 hover:transform hover:-translate-y-1 hover:scale-105 active:scale-95 relative overflow-hidden group btn-animate btn-glow`}
    style={{ 
      fontSize: "clamp(13px, 1.4vw, 15px)",
      boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)"
    }}
  >
    <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.2)" }}></div>
  </Link>
);
