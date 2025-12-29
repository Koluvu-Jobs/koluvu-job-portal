// src/components/Header/HeaderStatic.js

import Link from "next/link";
import Image from "next/image";
import {
  NavLink,
  MobileNavLink,
  MobileAuthButton,
  AuthButton,
} from "./HeaderComponents";
import styles from "../../styles/components/header/header.module.css";

export const HeaderStatic = ({
  koluvuLabsComponent,
  authButtonsComponent,
  userSectionComponent,
  navLinksComponent,
  mobileMenuButtonComponent,
  mobileMenuComponent,
  sidebarToggleComponent,
  isScrolled = false,
}) => {
  return (
    <header
      className={`${styles.headerContainer} ${
        isScrolled ? styles.scrolled : ""
      }`}
    >
      <nav className={styles.navWrapper}>
        <div className={styles.navInner}>
          {/* Logo - Far Left */}
          <div className={styles.logoContainer}>
            {/* Sidebar Toggle Button for Dashboard Pages */}
            {sidebarToggleComponent}

            <Link href="/" className={styles.logoLink}>
              <Image
                src="/images/koluvu_logo.jpg"
                alt="Koluvu"
                width={32}
                height={32}
                className={styles.logoImage}
                priority
              />
              <span className={styles.logoText}>Koluvu</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className={styles.desktopNav}>
            <div className={styles.navItems}>
              {navLinksComponent || (
                <>
                  <NavLink href="/">
                    <span className="flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1.5 opacity-80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Home
                    </span>
                  </NavLink>

                  <NavLink href="/jobs">
                    <span className="flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1.5 opacity-80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Jobs
                    </span>
                  </NavLink>

                  <NavLink href="/companies">
                    <span className="flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1.5 opacity-80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Companies
                    </span>
                  </NavLink>

                  {koluvuLabsComponent}

                  <NavLink href="/training">
                    <span className="flex items-center">
                      <svg
                        className="w-3.5 h-3.5 mr-1.5 opacity-80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      Training
                    </span>
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Auth Buttons / User Section - Far Right */}
          <div className={styles.authButtons}>
            {userSectionComponent || authButtonsComponent || (
              <>
                <AuthButton href="/auth/register/employee">
                  <span className="flex items-center">
                    <svg
                      className="w-3.5 h-3.5 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Employee
                  </span>
                </AuthButton>

                <AuthButton href="/auth/register/employer">
                  <span className="flex items-center">
                    <svg
                      className="w-3.5 h-3.5 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Employer
                  </span>
                </AuthButton>

                <AuthButton href="/auth/login/partner">
                  <span className="flex items-center">
                    <svg
                      className="w-3.5 h-3.5 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Partner
                  </span>
                </AuthButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          {mobileMenuButtonComponent || (
            <div className={styles.mobileMenuBtnContainer}>
              <button className={styles.mobileMenuBtn}>
                <span className={styles.srOnly}>Open main menu</span>
                <svg
                  className={styles.menuIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuComponent}
    </header>
  );
};
