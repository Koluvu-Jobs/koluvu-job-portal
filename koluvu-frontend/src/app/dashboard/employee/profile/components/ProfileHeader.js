// src/app/dashboard/employee/profile/components/ProfileHeader.js

import React from "react";
import { Camera } from "lucide-react";

const ProfileHeader = ({
  profileData,
  isEditing,
  isDarkMode,
  handleInputChange,
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row items-center md:items-stretch gap-8 p-8 rounded-xl mb-8 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } shadow-xl border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      {/* Profile image section removed */}

      <div
        className={`flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-4 p-6 rounded-lg ${
          isDarkMode ? "bg-gray-700" : "bg-blue-50"
        } border ${isDarkMode ? "border-gray-600" : "border-blue-200"}`}
      >
        <div>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } font-bold`}
          >
            Department
          </p>
          {isEditing ? (
            <input
              type="text"
              value={profileData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              className={`w-full p-2 rounded-md ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"
              } border ${
                isDarkMode ? "border-gray-500" : "border-gray-300"
              } focus:ring-blue-500 outline-none`}
            />
          ) : (
            <p
              className={`font-semibold text-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {profileData.department}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } font-bold`}
          >
            Mobile No.
          </p>
          {isEditing ? (
            <input
              type="text"
              value={profileData.mobileNo}
              onChange={(e) => handleInputChange("mobileNo", e.target.value)}
              className={`w-full p-2 rounded-md ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"
              } border ${
                isDarkMode ? "border-gray-500" : "border-gray-300"
              } focus:ring-blue-500 outline-none`}
            />
          ) : (
            <p
              className={`font-semibold text-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {profileData.mobileNo}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } font-bold`}
          >
            Location
          </p>
          {isEditing ? (
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className={`w-full p-2 rounded-md ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"
              } border ${
                isDarkMode ? "border-gray-500" : "border-gray-300"
              } focus:ring-blue-500 outline-none`}
            />
          ) : (
            <p
              className={`font-semibold text-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {profileData.location}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } font-bold`}
          >
            Current CTC
          </p>
          {isEditing ? (
            <input
              type="text"
              value={profileData.ctc}
              onChange={(e) => handleInputChange("ctc", e.target.value)}
              className={`w-full p-2 rounded-md ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"
              } border ${
                isDarkMode ? "border-gray-500" : "border-gray-300"
              } focus:ring-blue-500 outline-none`}
            />
          ) : (
            <p
              className={`font-semibold text-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {profileData.ctc}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Designation
          </p>
          {isEditing ? (
            <input
              type="text"
              value={profileData.designation}
              onChange={(e) => handleInputChange("designation", e.target.value)}
              className={`w-full p-2 rounded-md ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"
              } border ${
                isDarkMode ? "border-gray-500" : "border-gray-300"
              } focus:ring-blue-500 outline-none`}
            />
          ) : (
            <p
              className={`font-semibold text-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {profileData.designation}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Email ID
          </p>
          {isEditing ? (
            <input
              type="email"
              value={profileData.emailId}
              onChange={(e) => handleInputChange("emailId", e.target.value)}
              className={`w-full p-2 rounded-md ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"
              } border ${
                isDarkMode ? "border-gray-500" : "border-gray-300"
              } focus:ring-blue-500 outline-none`}
            />
          ) : (
            <p
              className={`font-semibold text-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {profileData.emailId}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Notice Period
          </p>
          {isEditing ? (
            <input
              type="text"
              value={profileData.noticePeriod}
              onChange={(e) =>
                handleInputChange("noticePeriod", e.target.value)
              }
              className={`w-full p-2 rounded-md ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"
              } border ${
                isDarkMode ? "border-gray-500" : "border-gray-300"
              } focus:ring-blue-500 outline-none`}
            />
          ) : (
            <p
              className={`font-semibold text-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {profileData.noticePeriod}
            </p>
          )}
        </div>
        <div>
          <p
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Expected CTC
          </p>
          {isEditing ? (
            <input
              type="text"
              value={profileData.expectedCtc}
              onChange={(e) => handleInputChange("expectedCtc", e.target.value)}
              className={`w-full p-2 rounded-md ${
                isDarkMode ? "bg-gray-600 text-white" : "bg-white text-gray-900"
              } border ${
                isDarkMode ? "border-gray-500" : "border-gray-300"
              } focus:ring-blue-500 outline-none`}
            />
          ) : (
            <p
              className={`font-semibold text-sm ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {profileData.expectedCtc}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
