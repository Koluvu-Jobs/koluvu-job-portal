// src/app/main/dashboard/employee/profile/components/NotificationBox.js

import React, { useState } from 'react';
import { X, Bell, MessageSquare } from 'lucide-react';

const NotificationBox = ({ isDarkMode, show, onClose, messages }) => {
    const [notificationMessages, setNotificationMessages] = useState([
        "Profile updated successfully",
        "New job recommendation available",
        "Your profile is 90% complete"
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setNotificationMessages([...notificationMessages, newMessage]);
            setNewMessage('');
        }
    };

    if (!show) return null;

    return (
        <div
            className={`fixed bottom-4 right-4 w-80 rounded-lg shadow-xl z-50 ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    type="button"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="max-h-60 overflow-y-auto p-4">
                {notificationMessages.map((msg, index) => (
                    <div
                        key={index}
                        className="mb-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700"
                    >
                        <p>{msg}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</p>
                    </div>
                ))}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={`flex-grow p-2 rounded-l-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                    }`}
                />
                <button
                    onClick={handleSendMessage}
                    className={`px-3 rounded-r-md ${isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white flex items-center justify-center transition-colors`}
                    type="button"
                >
                    <MessageSquare className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default NotificationBox;
