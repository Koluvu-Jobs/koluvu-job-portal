// src/app/auth/register/employer/page.js

'use client';

import EmployerRegistrationForm from './form';
import Header from '@koluvu/components/Header/Header';
import Footer from '@koluvu/components/Footer/Footer';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function EmployerRegistrationPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <style jsx global>{`
          @media (min-width: 1024px) {
            .registration-container {
              justify-content: space-between;
              position: relative;
            }
            .employer-registration-form {
              margin-right: 0.75rem; /* 12px */
            }
          }
          
          @media (min-width: 1400px) {
            .registration-container > div:first-child {
              padding-left: 0;
              transform: translateX(-2rem); /* Move 32px to the left */
            }
          }
          
          @media (min-width: 1500px) {
            .employer-registration-form {
              position: relative;
              right: 0;
              margin-right: 0.5rem; /* 8px */
              transform: translateX(6rem); /* Move 96px to the right */
            }
          }
          
          @media (min-width: 1550px) and (max-width: 1599px) {
            .registration-container {
              justify-content: flex-end;
              padding-right: 0.125rem; /* 2px */
            }
            .employer-registration-form {
              position: relative;
              right: 0;
              margin-right: 0.125rem; /* 2px */
              transform: translateX(5rem); /* Move 80px to the right */
            }
          }
          
          @media (min-width: 1600px) {
            .registration-container {
              justify-content: flex-end;
              padding-right: 0.0625rem; /* 1px */
            }
            .employer-registration-form {
              position: relative;
              right: 0;
              margin-right: 0.0625rem; /* 1px */
              transform: translateX(7rem); /* Move 112px to the right */
            }
          }
          
          @media (min-width: 1700px) and (max-width: 1899px) {
            .registration-container {
              padding-right: 0;
            }
            .employer-registration-form {
              margin-right: 0;
              transform: translateX(12rem); /* Move 192px to the right */
            }
          }
          
          @media (min-width: 1900px) and (max-width: 1949px) {
            .registration-container {
              padding-right: 0;
            }
            .employer-registration-form {
              margin-right: 0;
              transform: translateX(15rem); /* Move 240px to the right */
            }
          }
          
          @media (min-width: 1950px) {
            .registration-container {
              padding-right: 0;
            }
            .employer-registration-form {
              margin-right: 0;
              transform: translateX(18rem); /* Move 288px to the right */
            }
          }
          
          @media (min-width: 2000px) {
            .employer-registration-form {
              margin-right: 0.5rem; /* 8px */
            }
          }
        `}</style>
        {/* Header with responsive padding */}
        <div className={`${windowWidth >= 1200 && windowWidth < 1300 ? 'px-8' : 'px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12'}`}>
          <Header />
        </div>

        <main className="flex-grow relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/employer-registration.jpeg"
              alt="Employer Registration Background"
              fill
              priority
              quality={100}
              className="object-cover"
              style={{
                objectPosition: '35% center',
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
            />
          </div>

        {/* Content Container - Adjusted top padding for mobile */}
        <div className="mx-0 px-0 pt-2 sm:pt-6 md:pt-10 relative z-10">
          <div className="registration-container flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto px-4">
            {/* Left Content */}
            <div className="w-full md:w-1/2 -mt-1 sm:mt-2 md:mt-6 pr-8 pl-4 md:pl-12 flex flex-col items-center md:items-start">
              <div className="max-w-md text-center md:text-left">
                <h1 className="text-3xl sm:text-3.5xl md:text-4xl font-bold mb-3 sm:mb-4">
                  Welcome to&nbsp;
                  <span className="text-3xl sm:text-3.5xl md:text-4xl text-blue-400">KOLUVU</span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-black/90">
                  Find the perfect talent for your organization
                </p>
                
                <div className="space-y-3 sm:space-y-4 md:flex md:flex-col md:items-center">
                  <div className="flex items-start gap-3 sm:gap-4 md:max-w-xs">
                    <div className="bg-blue-500/50 rounded-full p-1.5 sm:p-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-left md:text-center">
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg text-black">Access Top Talent</h3>
                      <p className="bg-blue-500/30 px-2 py-1 rounded-md text-white text-xs sm:text-sm md:text-base">
                        Connect with thousands of verified professionals
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4 md:max-w-xs">
                    <div className="bg-blue-500/50 rounded-full p-1.5 sm:p-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-left md:text-center">
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg text-black">Streamlined Hiring</h3>
                      <p className="bg-blue-500/30 px-2 py-1 rounded-md text-white text-xs sm:text-sm md:text-base">
                        Manage candidates and interviews in one place
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4 md:max-w-xs">
                    <div className="bg-blue-500/50 rounded-full p-1.5 sm:p-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-left md:text-center">
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg text-black">Industry Insights</h3>
                      <p className="bg-blue-500/30 px-2 py-1 rounded-md text-white text-xs sm:text-sm md:text-base">
                        Get market data to make informed hiring decisions
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form - Right side */}
            <div className="employer-registration-form w-full max-w-md p-6 sm:p-8 bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 mt-8 md:mt-12">
              <EmployerRegistrationForm 
                showPassword={showPassword} 
                setShowPassword={setShowPassword}
              />
            </div>
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </>
  );
}
