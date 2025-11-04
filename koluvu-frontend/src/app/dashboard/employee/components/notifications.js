// src/app/main/dashboard/employee/components/notifications.js

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Notifications({
  isOpen,
  onClose,
  onNotificationRead,
  isDarkMode,
}) {
  const notifications = [
    {
      id: 1,
      message: "New job recommendation available!",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      message: "Your application was viewed by XYZ Ltd.",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      message: "Interview scheduled with DEF Inc.",
      time: "2 days ago",
      read: false,
    },
    {
      id: 4,
      message: "Your profile has been updated.",
      time: "3 days ago",
      read: true,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed top-16 right-36 w-80 max-h-[70vh] ${
            isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
          } rounded-lg shadow-xl z-50 flex flex-col overflow-hidden`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`flex justify-between items-center p-4 border-b ${
              isDarkMode
                ? "border-gray-700 bg-gray-700"
                : "border-gray-200 bg-gray-100"
            }`}
          >
            <h3 className="text-xl font-semibold">Notifications</h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-full ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-600"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-200"
              } transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  notification.read
                    ? isDarkMode
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                    : isDarkMode
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200 text-gray-900"
                } shadow-sm flex flex-col`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNotificationRead(notification.id)}
              >
                <p className="font-medium">{notification.message}</p>
                <span className="text-xs opacity-80 mt-1">
                  {notification.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
