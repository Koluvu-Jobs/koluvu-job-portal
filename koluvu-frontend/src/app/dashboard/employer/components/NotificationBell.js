// src/app/main/dashboard/employer/components/NotificationBell.js

'use client';

import { useState, useEffect } from 'react';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New applicant for Software Engineer', read: false, time: '2 hours ago' },
    { id: 2, text: 'Interview reminder for tomorrow', read: false, time: '5 hours ago' },
    { id: 3, text: 'Your job post was viewed 15 times', read: true, time: '1 day ago' },
  ]);

  // Simulate real-time notifications
  useEffect(() => {
    const notificationMessages = [
      'New candidate applied for Frontend Developer',
      'Your job post was viewed 25 times',
      'Interview scheduled with Alex Johnson',
      'Candidate completed assessment',
      'New message from recruiter',
      'Job position closing soon',
      'Profile viewed by 5 candidates'
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new notification
        const newNotification = {
          id: Date.now(),
          text: notificationMessages[Math.floor(Math.random() * notificationMessages.length)],
          read: false,
          time: 'Just now'
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, read: true} : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({...n, read: true}))
    );
  };

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            markAllAsRead();
          }
        }}
        className="p-1 rounded-full hover:bg-white/10 relative"
      >
        <i className="fas fa-bell text-xl"></i>
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {notifications.filter(n => !n.read).length}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-3 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <button className="text-blue-500 text-sm">View All</button>
            </div>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 hover:bg-gray-50 cursor-pointer ${notification.read ? 'opacity-70' : 'bg-blue-50'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <p className="text-sm text-gray-800">{notification.text}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
