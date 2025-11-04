// src/app/main/dashboard/employer/RecentActivities.js

'use client';

import { useState } from 'react';

export default function RecentActivities() {
  const [showAll, setShowAll] = useState(false);
  
  const allActivities = [
    { id: 1, action: 'Interview scheduled', person: 'Alex Johnson', time: '2 hours ago', type: 'interview', read: false },
    { id: 2, action: 'New candidate applied', person: 'Sarah Williams', time: '5 hours ago', type: 'application', read: false },
    { id: 3, action: 'Job position closed', person: 'Frontend Developer', time: '1 day ago', type: 'job', read: true },
    { id: 4, action: 'Offer sent', person: 'Michael Chen', time: '2 days ago', type: 'offer', read: true },
    { id: 5, action: 'Interview completed', person: 'Emma Davis', time: '3 days ago', type: 'interview', read: true },
    { id: 6, action: 'Candidate rejected', person: 'James Wilson', time: '4 days ago', type: 'application', read: true },
    { id: 7, action: 'New job posted', person: 'Backend Engineer', time: '1 week ago', type: 'job', read: true },
    { id: 8, action: 'Offer accepted', person: 'Olivia Martinez', time: '1 week ago', type: 'offer', read: true },
    { id: 9, action: 'Interview rescheduled', person: 'Daniel Thompson', time: '10 minutes ago', type: 'interview', read: false },
    { id: 10, action: 'New candidate applied', person: 'Sophia Garcia', time: '30 minutes ago', type: 'application', read: false },
    { id: 11, action: 'Reference check completed', person: 'Robert Brown', time: '1 hour ago', type: 'application', read: false },
    { id: 12, action: 'Position reopened', person: 'UX Designer', time: '6 hours ago', type: 'job', read: true },
    // Additional activities
    { id: 13, action: 'Screening test sent', person: 'David Wilson', time: '8 hours ago', type: 'application', read: true },
    { id: 14, action: 'Interview feedback received', person: 'Lisa Anderson', time: '12 hours ago', type: 'interview', read: true },
    { id: 15, action: 'New candidate shortlisted', person: 'Thomas Lee', time: '1 day ago', type: 'application', read: false },
    { id: 16, action: 'Offer declined', person: 'Jennifer Kim', time: '2 days ago', type: 'offer', read: true },
    { id: 17, action: 'Background check initiated', person: 'Christopher Taylor', time: '3 days ago', type: 'application', read: true },
    { id: 18, action: 'Job description updated', person: 'Product Manager', time: '4 days ago', type: 'job', read: true },
  ];

  const activitiesToDisplay = showAll ? allActivities : allActivities.slice(0, 5);

  const getIcon = (type) => {
    switch (type) {
      case 'interview':
        return <i className="fas fa-calendar-check text-blue-500"></i>;
      case 'application':
        return <i className="fas fa-user-plus text-green-500"></i>;
      case 'offer':
        return <i className="fas fa-file-signature text-purple-500"></i>;
      default:
        return <i className="fas fa-briefcase text-gray-500"></i>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {showAll ? 'All Activities' : 'Recent Activities'}
        </h2>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
        >
          {showAll ? 'Show Less' : 'View All'} 
          <i className={`fas ${showAll ? 'fa-chevron-up' : 'fa-chevron-right'} ml-1 text-xs`}></i>
        </button>
      </div>
      <div className="space-y-4">
        {activitiesToDisplay.map((activity) => (
          <div key={activity.id} className={`flex items-start space-x-3 p-2 rounded-lg ${!activity.read ? 'bg-blue-50' : ''}`}>
            <div className="flex-shrink-0 mt-1">
              <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                {getIcon(activity.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${!activity.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                {activity.action} <span className="text-blue-600">{activity.person}</span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
            {!activity.read && (
              <div className="flex-shrink-0">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              </div>
            )}
          </div>
        ))}
      </div>
      {showAll && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing {allActivities.length} activities
          </p>
        </div>
      )}
    </div>
  );
}
