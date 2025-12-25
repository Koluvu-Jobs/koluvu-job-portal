// src/app/main/dashboard/training/ExpiredTrainingPostPage.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCalendarAlt,
  faClock,
  faMoneyBillWave,
  faChartLine,
  faEllipsisV,
  faEye,
  faEdit,
  faTrash,
  faDownload,
  faShare,
  faTimes,
  faRedo,
  faUser,
  faEnvelope,
  faPhone
} from '@fortawesome/free-solid-svg-icons';

const ExpiredTrainingPostPage = () => {
  const [expiredTrainings, setExpiredTrainings] = useState([
    {
      id: 1,
      title: "Advanced JavaScript Concepts",
      status: "Expired",
      enrollments: 28,
      capacity: 30,
      startDate: "2023-01-15",
      endDate: "2023-04-15",
      category: "Web Development",
      fee: "$399",
      progress: 93,
      lastUpdated: "3 months ago",
      description: "Deep dive into advanced JavaScript concepts including closures, prototypes, and async programming.",
      members: Array.from({ length: 28 }, (_, i) => ({
        id: i + 1,
        name: `Participant ${i + 1}`,
        email: `participant${i + 1}@example.com`,
        phone: `+1 (555) ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        enrollmentDate: `2023-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status: "Completed"
      }))
    },
    {
      id: 2,
      title: "Python for Data Analysis",
      status: "Expired",
      enrollments: 22,
      capacity: 25,
      startDate: "2023-02-01",
      endDate: "2023-05-01",
      category: "Data Science",
      fee: "$449",
      progress: 88,
      lastUpdated: "2 months ago",
      description: "Learn how to use Python for data analysis with Pandas, NumPy, and visualization libraries.",
      members: Array.from({ length: 22 }, (_, i) => ({
        id: i + 1,
        name: `Participant ${i + 1}`,
        email: `participant${i + 1}@example.com`,
        phone: `+1 (555) ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        enrollmentDate: `2023-${String(Math.floor(Math.random() * 3) + 2).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status: "Completed"
      }))
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      status: "Expired",
      enrollments: 15,
      capacity: 20,
      startDate: "2023-03-10",
      endDate: "2023-06-10",
      category: "Design",
      fee: "$349",
      progress: 75,
      lastUpdated: "1 month ago",
      description: "Fundamentals of user interface and user experience design principles and best practices.",
      members: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Participant ${i + 1}`,
        email: `participant${i + 1}@example.com`,
        phone: `+1 (555) ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        enrollmentDate: `2023-${String(Math.floor(Math.random() * 3) + 3).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status: "Completed"
      }))
    }
  ]);

  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [modalTopOffset, setModalTopOffset] = useState('mt-16');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setModalTopOffset('mt-24');
      } else {
        setModalTopOffset('mt-16');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateProgressColor = (progress) => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-amber-400';
    return 'bg-red-500';
  };

  const handleView = (training) => {
    setSelectedTraining(training);
    setShowViewModal(true);
  };

  const handleViewMembers = (training) => {
    setSelectedTraining(training);
    setShowMembersModal(true);
  };

  const handleEdit = (id) => {
    console.log(`Edit training with id: ${id}`);
    setShowActionsMenu(null);
  };

  const handleDelete = (id) => {
    setExpiredTrainings(expiredTrainings.filter(training => training.id !== id));
    setShowActionsMenu(null);
  };

  const handleDownload = (id) => {
    console.log(`Download details for training with id: ${id}`);
    setShowActionsMenu(null);
  };

  const handleShare = (id) => {
    console.log(`Share training with id: ${id}`);
    setShowActionsMenu(null);
  };

  const handleRenew = (training) => {
    console.log('Renewing training:', training);
    alert(`Renewing program: ${training.title}`);
    setShowActionsMenu(null);
    setShowViewModal(false);
  };

  const toggleActionsMenu = (id, e) => {
    e.stopPropagation();
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  const totalEnrollments = expiredTrainings.reduce((sum, training) => sum + training.enrollments, 0);
  const averageCompletion = expiredTrainings.length > 0 
    ? Math.round(expiredTrainings.reduce((sum, training) => sum + training.progress, 0) / expiredTrainings.length)
    : 0;
  const totalRevenue = expiredTrainings.reduce((sum, training) => {
    const feeValue = Number(training.fee.replace(/[^0-9.-]+/g, ""));
    return isNaN(feeValue) ? sum : sum + (feeValue * training.enrollments);
  }, 0);

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Expired Training Programs</h2>
            <p className="text-sm text-gray-500 mt-2">Review and manage your completed training programs</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
              <span className="hidden sm:inline">Expired Programs: </span>
              {expiredTrainings.length}
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Program Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Enrollment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {expiredTrainings.map((training) => (
                <tr key={training.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 shadow-sm">
                        <FontAwesomeIcon icon={faChartLine} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{training.title}</div>
                        <div className="text-xs text-gray-500">{training.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full mr-4">
                        <div className="flex justify-between text-sm">
                          <button 
                            className="font-medium text-gray-900 hover:text-blue-600"
                            onClick={() => handleViewMembers(training)}
                          >
                            {training.enrollments}
                          </button>
                          <span className="text-gray-500">/ {training.capacity}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${calculateProgressColor(training.progress)}`}
                            style={{ width: `${training.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{training.progress}% filled</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2 text-sm" />
                      <div>
                        <div className="text-sm text-gray-900">{training.startDate}</div>
                        <div className="text-xs text-gray-500">to {training.endDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {training.status}
                    </span>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1" />
                      {training.fee}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2 relative">
                      <button 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        onClick={() => handleView(training)}
                      >
                        View
                      </button>
                      <div className="relative">
                        <button 
                          className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                          onClick={(e) => toggleActionsMenu(training.id, e)}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                        </button>
                        {showActionsMenu === training.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 overflow-hidden">
                            <div className="py-1">
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRenew(training);
                                }}
                              >
                                <FontAwesomeIcon icon={faRedo} className="mr-2 text-blue-500 w-4 h-4" />
                                Renew
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(training.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500 w-4 h-4" />
                                Edit
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(training.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} className="mr-2 text-red-500 w-4 h-4" />
                                Delete
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(training.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faDownload} className="mr-2 text-green-500 w-4 h-4" />
                                Download
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {expiredTrainings.map((training) => (
            <Card key={training.id} className="p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 mr-3 shadow-sm">
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{training.title}</h3>
                    <p className="text-xs text-gray-500">{training.category}</p>
                  </div>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                  onClick={(e) => toggleActionsMenu(training.id, e)}
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                </button>
                {showActionsMenu === training.id && (
                  <div className="absolute right-4 mt-6 w-40 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 overflow-hidden">
                    <div className="py-1">
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(training);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2 text-blue-500 w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRenew(training);
                        }}
                      >
                        <FontAwesomeIcon icon={faRedo} className="mr-2 text-blue-500 w-3.5 h-3.5" />
                        Renew
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(training.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2 text-red-500 w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Enrollment</p>
                  <button 
                    className="text-sm font-semibold mt-1 hover:text-blue-600"
                    onClick={() => handleViewMembers(training)}
                  >
                    {training.enrollments}/{training.capacity} ({training.progress}%)
                  </button>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${calculateProgressColor(training.progress)}`}
                      style={{ width: `${training.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Duration</p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-1 text-xs" />
                    <p className="text-sm">
                      {training.startDate} - {training.endDate}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Status</p>
                  <span className="px-2 py-0.5 inline-flex text-xs leading-3 font-semibold rounded-full bg-gray-100 text-gray-800 mt-1">
                    {training.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Fee</p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400 mr-1 text-xs" />
                    <p className="text-sm font-semibold">{training.fee}</p>
                  </div>
                </div>
              </div>

              <button 
                className="mt-4 w-full py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                onClick={() => handleView(training)}
              >
                View Details
              </button>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
                <p className="text-xl font-bold mt-1 text-gray-800">{totalEnrollments}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600 shadow-inner">
                <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-gray-500">
              <span>Historical data</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Completion</p>
                <p className="text-xl font-bold mt-1 text-gray-800">{averageCompletion}%</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 shadow-inner">
                <FontAwesomeIcon icon={faClock} className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-gray-500">
              <span>Historical data</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-xl font-bold mt-1 text-gray-800">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl text-purple-600 shadow-inner">
                <FontAwesomeIcon icon={faMoneyBillWave} className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs font-medium text-gray-500">
              <span>Historical data</span>
            </div>
          </div>
        </div>

        {/* View Modal */}
        {showViewModal && selectedTraining && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-3 sm:p-5">
                <h3 className="text-lg sm:text-xl font-bold text-blue-700">Expired Training Program Details</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowViewModal(false)}
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 sm:p-5 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Title</h4>
                    <p className="text-base mt-1 font-medium">{selectedTraining.title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Category</h4>
                    <p className="text-base mt-1 font-medium">{selectedTraining.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="text-base mt-1">
                      <span className="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {selectedTraining.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fee</h4>
                    <p className="text-base mt-1 font-medium">{selectedTraining.fee}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                    <p className="text-base mt-1 font-medium">{selectedTraining.startDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">End Date</h4>
                    <p className="text-base mt-1 font-medium">{selectedTraining.endDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Enrollments</h4>
                    <button 
                      className="text-base mt-1 font-medium hover:text-blue-600"
                      onClick={() => {
                        setShowViewModal(false);
                        handleViewMembers(selectedTraining);
                      }}
                    >
                      {selectedTraining.enrollments} / {selectedTraining.capacity} ({selectedTraining.progress}%)
                    </button>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full ${calculateProgressColor(selectedTraining.progress)}`}
                        style={{ width: `${selectedTraining.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                    <p className="text-base mt-1 font-medium">{selectedTraining.lastUpdated}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {selectedTraining.description}
                  </p>
                </div>
              </div>
              <div className="border-t p-3 sm:p-5 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  className="px-4 sm:px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors w-full sm:w-auto"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
                <button
                  className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all w-full sm:w-auto"
                  onClick={() => handleRenew(selectedTraining)}
                >
                  Renew Program
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Members Modal */}
        {showMembersModal && selectedTraining && (
          <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-50 p-2 sm:p-4 ${modalTopOffset}`}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center border-b p-3 sm:p-5 sticky top-0 bg-white z-10">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-700">
                  Members Enrolled in {selectedTraining.title} ({selectedTraining.enrollments})
                </h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowMembersModal(false)}
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 sm:p-5 overflow-auto flex-1">
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Showing all {selectedTraining.enrollments} members
                    </h4>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Export List
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Member
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enrollment Date
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedTraining.members.map((member) => (
                          <tr key={member.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {member.id}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                  <FontAwesomeIcon icon={faUser} />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center">
                                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2 text-xs" />
                                  <span className="truncate max-w-[120px] sm:max-w-xs">{member.email}</span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-2 text-xs" />
                                  <span className="truncate max-w-[120px] sm:max-w-none">{member.phone}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center">
                                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2 text-xs" />
                                  {member.enrollmentDate}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                                member.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                              }`}>
                                {member.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="border-t p-3 sm:p-5 flex justify-end sticky bottom-0 bg-white">
                <button
                  className="px-4 sm:px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors w-full sm:w-auto"
                  onClick={() => setShowMembersModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpiredTrainingPostPage;
