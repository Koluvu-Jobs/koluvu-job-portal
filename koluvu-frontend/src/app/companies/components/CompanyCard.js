"use client";

import { useState } from "react";
import Image from "next/image";
import CompanyModal from "./CompanyModel";
import { MotionDiv, MotionButton } from "@koluvu/components/motion";
import styles from "@koluvu/styles/components/company/Company-card.module.css";

export default function CompanyCard({ company }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <MotionDiv
        className={`${styles.card} flex flex-col h-full rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm transition-all duration-300`}
        whileHover={{
          y: -5,
          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Company Header */}
          <div className="flex items-start gap-3">
            <MotionDiv
              className="shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src={company.logo}
                alt={company.name}
                width={48}
                height={48}
                className="object-contain p-1"
              />
            </MotionDiv>
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-gray-900 truncate text-base hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                {company.name}
              </h3>
              <div className="flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-xs text-gray-600 truncate">
                  {company.location}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
            <div className="text-center bg-blue-50 rounded-lg p-2">
              <p className="text-xs text-blue-700 truncate">Type</p>
              <p className="text-sm font-medium text-blue-900 truncate">
                {company.type}
              </p>
            </div>
            <div className="text-center bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-700 truncate">Industry</p>
              <p className="text-sm font-medium text-gray-900 truncate">
                {company.industry}
              </p>
            </div>
          </div>

          {/* Normal Weight Description */}
          <div className="mt-3 flex-1">
            <p className="text-gray-700 leading-relaxed line-clamp-2 sm:line-clamp-3 text-sm">
              {company.description}
            </p>
          </div>

          {/* Professional View Details Button */}
          <div className="mt-4">
            <MotionButton
              onClick={() => setIsModalOpen(true)}
              className="group relative w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)",
              }}
              whileTap={{
                scale: 0.98,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
            >
              {/* Gradient overlay for hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Button content */}
              <div className="relative flex items-center justify-center space-x-2">
                <span className="text-sm font-semibold tracking-wide">
                  View Details
                </span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-300"></div>
            </MotionButton>
          </div>
        </div>
      </MotionDiv>

      {isModalOpen && (
        <CompanyModal company={company} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
