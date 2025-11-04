// src/app/main/dashboard/training/NotificationsPage.jsx
'use client';
import React, { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faEnvelope,
  faCheckCircle,
  faExclamationCircle,
  faCalendarAlt,
  faEllipsisV,
  faTrash,
  faTimes,
  faCheck,
  faFilter
} from '@fortawesome/free-solid-svg-icons';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'enrollment',
      title: 'New Enrollment Request',
      message: 'John Smith has requested enrollment in Advanced React Course',
      date: '2023-07-15',
      time: '10:30 AM',
      read: false,
      important: true
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $299.00 received for Web Development Bootcamp',
      date: '2023-07-14',
      time: '2:45 PM',
      read: true,
      important: false
    },
    {
      id: 3,
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on July 20, 2023 from 2:00 AM to 4:00 AM',
      date: '2023-07-13',
      time: '9:15 AM',
      read: true,
      important: false
    },
    {
      id: 4,
      type: 'message',
      title: 'New Student Message',
      message: 'You have a new message from Sarah Johnson regarding the upcoming class',
      date: '2023-07-12',
      time: '4:20 PM',
      read: false,
      important: true
    },
    {
      id: 5,
      type: 'certificate',
      title: 'Certificate Generated',
      message: 'Certificate for Data Science Course has been generated for Michael Brown',
      date: '2023-07-11',
      time: '11:05 AM',
      read: true,
      important: false
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    setShowActionsMenu(null);
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  const toggleActionsMenu = (id, e) => {
    e.stopPropagation();
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'important') return notification.important;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'enrollment':
        return <span className="text-blue-500">📩</span>;
      case 'payment':
        return <span className="text-green-500">💰</span>;
      case 'system':
        return <span className="text-yellow-500">⚙️</span>;
      case 'message':
        return <span className="text-purple-500">💬</span>;
      case 'certificate':
        return <span className="text-red-500">📜</span>;
      default:
        return <span className="text-gray-500">🔔</span>;
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Notifications</h2>
            <p className="text-sm text-gray-500 mt-2">
              {filteredNotifications.length} {filter === 'all' ? '' : filter} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="important">Important</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FontAwesomeIcon icon={faFilter} className="text-sm" />
              </div>
            </div>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
              onClick={markAllAsRead}
            >
              Mark All as Read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 rounded-lg cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50 border-gray-200'} border shadow-sm`}
                onClick={() => handleView(notification)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm sm:text-base font-medium ${!notification.read ? 'text-blue-800' : 'text-gray-800'}`}>
                          {notification.title}
                        </h3>
                        {notification.important && (
                          <span className="text-xs text-red-500">
                            <FontAwesomeIcon icon={faExclamationCircle} />
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                        <span>{notification.date} at {notification.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button 
                      className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100"
                      onClick={(e) => toggleActionsMenu(notification.id, e)}
                    >
                      <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                    </button>
                    {showActionsMenu === notification.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 overflow-hidden">
                        <div className="py-1">
                          {!notification.read && (
                            <button
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                                setShowActionsMenu(null);
                              }}
                            >
                              <FontAwesomeIcon icon={faCheck} className="mr-2 text-blue-500 w-4 h-4" />
                              Mark as Read
                            </button>
                          )}
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2 text-red-500 w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear All Button */}
        {notifications.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button 
              className="text-sm text-red-600 hover:text-red-800 flex items-center font-medium"
              onClick={deleteAll}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2 w-4 h-4" />
              Clear All Notifications
            </button>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && selectedNotification && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-blue-700">Notification Details</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowViewModal(false)}
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-gray-900">
                      {selectedNotification.title}
                      {selectedNotification.important && (
                        <span className="ml-2 text-red-500">
                          <FontAwesomeIcon icon={faExclamationCircle} />
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {selectedNotification.date} at {selectedNotification.time}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-base text-gray-700">
                    {selectedNotification.message}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <FontAwesomeIcon icon={selectedNotification.read ? faCheckCircle : faBell} className="mr-1" />
                  <span>{selectedNotification.read ? 'Read' : 'Unread'}</span>
                </div>
              </div>
              <div className="border-t p-5 flex justify-end space-x-3">
                <button
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
                <button
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                  onClick={() => {
                    deleteNotification(selectedNotification.id);
                    setShowViewModal(false);
                  }}
                >
                  Delete Notification
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsPage;
