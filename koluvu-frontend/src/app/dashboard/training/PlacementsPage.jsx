// src/app/main/dashboard/training/PlacementsPage.jsx
'use client';
import React, { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faUserTie,
  faBuilding,
  faCalendarAlt,
  faMoneyBillWave,
  faEllipsisV,
  faEdit,
  faTrash,
  faPlus,
  faTimes,
  faEye
} from '@fortawesome/free-solid-svg-icons';

const PlacementsPage = () => {
  const [placements, setPlacements] = useState([
    {
      id: 1,
      company: "Tech Solutions Inc.",
      position: "Frontend Developer",
      salary: "$85,000",
      postedDate: "2023-06-15",
      deadline: "2023-07-15",
      status: "Active",
      description: "Looking for a skilled frontend developer with React experience.",
      requirements: "3+ years of experience, React, JavaScript, HTML/CSS"
    },
    {
      id: 2,
      company: "Data Analytics Co.",
      position: "Data Scientist",
      salary: "$95,000",
      postedDate: "2023-06-20",
      deadline: "2023-07-20",
      status: "Active",
      description: "Seeking data scientist with Python and machine learning experience.",
      requirements: "Python, Pandas, Scikit-learn, SQL"
    },
    {
      id: 3,
      company: "Digital Marketing Agency",
      position: "SEO Specialist",
      salary: "$65,000",
      postedDate: "2023-05-10",
      deadline: "2023-06-10",
      status: "Expired",
      description: "SEO specialist needed for content optimization and strategy.",
      requirements: "SEO tools, Google Analytics, content writing"
    }
  ]);

  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlacement, setNewPlacement] = useState({
    company: "",
    position: "",
    salary: "",
    deadline: "",
    description: "",
    requirements: ""
  });

  const handleView = (placement) => {
    setSelectedPlacement(placement);
    setShowViewModal(true);
  };

  const handleEdit = (id) => {
    console.log(`Edit placement with id: ${id}`);
    setShowActionsMenu(null);
  };

  const handleDelete = (id) => {
    setPlacements(placements.filter(placement => placement.id !== id));
    setShowActionsMenu(null);
  };

  const handleAddPlacement = (e) => {
    e.preventDefault();
    const newId = placements.length > 0 ? Math.max(...placements.map(p => p.id)) + 1 : 1;
    const placementToAdd = {
      id: newId,
      company: newPlacement.company,
      position: newPlacement.position,
      salary: newPlacement.salary,
      postedDate: new Date().toISOString().split('T')[0],
      deadline: newPlacement.deadline,
      status: "Active",
      description: newPlacement.description,
      requirements: newPlacement.requirements
    };
    setPlacements([...placements, placementToAdd]);
    setNewPlacement({
      company: "",
      position: "",
      salary: "",
      deadline: "",
      description: "",
      requirements: ""
    });
    setShowAddForm(false);
  };

  const toggleActionsMenu = (id, e) => {
    e.stopPropagation();
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlacement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Active": return "bg-emerald-100 text-emerald-800";
      case "Expired": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Placement Opportunities</h2>
            <p className="text-sm text-gray-500 mt-2">Manage job placements and career opportunities for your students</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
              <span className="hidden sm:inline">Placements: </span>
              {placements.length}
            </div>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm w-full md:w-auto"
              onClick={() => setShowAddForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Placement
            </button>
          </div>
        </div>

        {/* Add Placement Form */}
        {showAddForm && (
          <Card className="mb-6 rounded-xl border border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Add New Placement</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowAddForm(false)}
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddPlacement} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company*</label>
                    <input
                      type="text"
                      name="company"
                      value={newPlacement.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position*</label>
                    <input
                      type="text"
                      name="position"
                      value={newPlacement.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary*</label>
                    <input
                      type="text"
                      name="salary"
                      value={newPlacement.salary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline*</label>
                    <input
                      type="date"
                      name="deadline"
                      value={newPlacement.deadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                  <textarea
                    name="description"
                    value={newPlacement.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements*</label>
                  <textarea
                    name="requirements"
                    value={newPlacement.requirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all"
                  >
                    Add Placement
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Company & Position
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Salary
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Dates
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
              {placements.map((placement) => (
                <tr key={placement.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                        <FontAwesomeIcon icon={faBuilding} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{placement.company}</div>
                        <div className="text-xs text-gray-500">{placement.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400 mr-2 text-sm" />
                      <div className="text-sm font-medium text-gray-900">{placement.salary}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2 text-sm" />
                      <div>
                        <div className="text-sm text-gray-900">Posted: {placement.postedDate}</div>
                        <div className="text-xs text-gray-500">Deadline: {placement.deadline}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusColor(placement.status)}`}>
                      {placement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2 relative">
                      <button 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        onClick={() => handleView(placement)}
                      >
                        View
                      </button>
                      <div className="relative">
                        <button 
                          className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                          onClick={(e) => toggleActionsMenu(placement.id, e)}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                        </button>
                        {showActionsMenu === placement.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 overflow-hidden">
                            <div className="py-1">
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(placement);
                                }}
                              >
                                <FontAwesomeIcon icon={faEye} className="mr-2 text-blue-500 w-4 h-4" />
                                View
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(placement.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500 w-4 h-4" />
                                Edit
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(placement.id);
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {placements.map((placement) => (
            <Card key={placement.id} className="p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3 shadow-sm">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{placement.company}</h3>
                    <p className="text-xs text-gray-500">{placement.position}</p>
                  </div>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                  onClick={(e) => toggleActionsMenu(placement.id, e)}
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                </button>
                {showActionsMenu === placement.id && (
                  <div className="absolute right-4 mt-6 w-40 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 overflow-hidden">
                    <div className="py-1">
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(placement);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2 text-blue-500 w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(placement.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500 w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(placement.id);
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
                  <p className="text-xs font-medium text-gray-500">Salary</p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400 mr-1 text-xs" />
                    <p className="text-sm font-semibold">{placement.salary}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Posted</p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-1 text-xs" />
                    <p className="text-sm">{placement.postedDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Deadline</p>
                  <p className="text-sm mt-1">{placement.deadline}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Status</p>
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-3 font-semibold rounded-full ${getStatusColor(placement.status)} mt-1`}>
                    {placement.status}
                  </span>
                </div>
              </div>

              <button 
                className="mt-4 w-full py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                onClick={() => handleView(placement)}
              >
                View Details
              </button>
            </Card>
          ))}
        </div>

        {/* View Modal */}
        {showViewModal && selectedPlacement && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-blue-700">Placement Details</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowViewModal(false)}
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Company</h4>
                    <p className="text-base mt-1 font-medium">{selectedPlacement.company}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Position</h4>
                    <p className="text-base mt-1 font-medium">{selectedPlacement.position}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Salary</h4>
                    <p className="text-base mt-1 font-medium">{selectedPlacement.salary}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="text-base mt-1">
                      <span className={`px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(selectedPlacement.status)}`}>
                        {selectedPlacement.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Posted Date</h4>
                    <p className="text-base mt-1 font-medium">{selectedPlacement.postedDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Deadline</h4>
                    <p className="text-base mt-1 font-medium">{selectedPlacement.deadline}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {selectedPlacement.description}
                  </p>
                </div>
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Requirements</h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {selectedPlacement.requirements}
                  </p>
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
                    handleEdit(selectedPlacement.id);
                    setShowViewModal(false);
                  }}
                >
                  Edit Placement
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlacementsPage;
