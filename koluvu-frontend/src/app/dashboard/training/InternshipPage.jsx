// src/app/main/dashboard/training/InternshipPage.jsx
'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faCalendarAlt,
  faClock,
  faMoneyBillWave,
  faEllipsisV,
  faEdit,
  faTrash,
  faPlus,
  faTimes,
  faBuilding,
  faEye
} from '@fortawesome/free-solid-svg-icons';

const InternshipPage = () => {
  const [internships, setInternships] = useState([
    {
      id: 1,
      company: "Tech Innovations",
      position: "Software Development Intern",
      duration: "3 months",
      stipend: "$2,000/month",
      postedDate: "2023-06-10",
      deadline: "2023-07-10",
      status: "Active",
      description: "Hands-on experience with modern web development technologies.",
      requirements: "Basic programming knowledge, enthusiasm to learn"
    },
    {
      id: 2,
      company: "Data Insights",
      position: "Data Science Intern",
      duration: "6 months",
      stipend: "$2,500/month",
      postedDate: "2023-06-15",
      deadline: "2023-07-15",
      status: "Active",
      description: "Work with real-world datasets and machine learning models.",
      requirements: "Python, basic statistics, machine learning concepts"
    },
    {
      id: 3,
      company: "Digital Creations",
      position: "UI/UX Design Intern",
      duration: "2 months",
      stipend: "$1,800/month",
      postedDate: "2023-05-20",
      deadline: "2023-06-20",
      status: "Expired",
      description: "Design user interfaces and improve user experiences.",
      requirements: "Figma, design principles, creativity"
    }
  ]);

  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInternship, setNewInternship] = useState({
    company: "",
    position: "",
    duration: "",
    stipend: "",
    deadline: "",
    description: "",
    requirements: ""
  });

  const handleView = (internship) => {
    setSelectedInternship(internship);
    setShowViewModal(true);
  };

  const handleEdit = (id) => {
    console.log(`Edit internship with id: ${id}`);
    setShowActionsMenu(null);
  };

  const handleDelete = (id) => {
    setInternships(internships.filter(internship => internship.id !== id));
    setShowActionsMenu(null);
  };

  const handleAddInternship = (e) => {
    e.preventDefault();
    const newId = internships.length > 0 ? Math.max(...internships.map(i => i.id)) + 1 : 1;
    const internshipToAdd = {
      id: newId,
      company: newInternship.company,
      position: newInternship.position,
      duration: newInternship.duration,
      stipend: newInternship.stipend,
      postedDate: new Date().toISOString().split('T')[0],
      deadline: newInternship.deadline,
      status: "Active",
      description: newInternship.description,
      requirements: newInternship.requirements
    };
    setInternships([...internships, internshipToAdd]);
    setNewInternship({
      company: "",
      position: "",
      duration: "",
      stipend: "",
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
    setNewInternship(prev => ({
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
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Internship Opportunities</h2>
            <p className="text-sm text-gray-500 mt-2">Manage internship programs for your students</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
              <span className="hidden sm:inline">Internships: </span>
              {internships.length}
            </div>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm w-full md:w-auto"
              onClick={() => setShowAddForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add Internship
            </button>
          </div>
        </div>

        {/* Add Internship Form */}
        {showAddForm && (
          <Card className="mb-6 rounded-xl border border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Add New Internship</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowAddForm(false)}
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddInternship} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company*</label>
                    <input
                      type="text"
                      name="company"
                      value={newInternship.company}
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
                      value={newInternship.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration*</label>
                    <input
                      type="text"
                      name="duration"
                      value={newInternship.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 3 months"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stipend*</label>
                    <input
                      type="text"
                      name="stipend"
                      value={newInternship.stipend}
                      onChange={handleInputChange}
                      placeholder="e.g., $2,000/month"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline*</label>
                    <input
                      type="date"
                      name="deadline"
                      value={newInternship.deadline}
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
                    value={newInternship.description}
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
                    value={newInternship.requirements}
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
                    Add Internship
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
                  Duration & Stipend
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
              {internships.map((internship) => (
                <tr key={internship.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                        <FontAwesomeIcon icon={faBuilding} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{internship.company}</div>
                        <div className="text-xs text-gray-500">{internship.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faClock} className="text-gray-400 mr-2 text-sm" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{internship.duration}</div>
                        <div className="text-xs text-gray-500">{internship.stipend}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2 text-sm" />
                      <div>
                        <div className="text-sm text-gray-900">Posted: {internship.postedDate}</div>
                        <div className="text-xs text-gray-500">Deadline: {internship.deadline}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusColor(internship.status)}`}>
                      {internship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2 relative">
                      <button 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        onClick={() => handleView(internship)}
                      >
                        View
                      </button>
                      <div className="relative">
                        <button 
                          className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                          onClick={(e) => toggleActionsMenu(internship.id, e)}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                        </button>
                        {showActionsMenu === internship.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 overflow-hidden">
                            <div className="py-1">
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(internship);
                                }}
                              >
                                <FontAwesomeIcon icon={faEye} className="mr-2 text-blue-500 w-4 h-4" />
                                View
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(internship.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500 w-4 h-4" />
                                Edit
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(internship.id);
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
          {internships.map((internship) => (
            <Card key={internship.id} className="p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3 shadow-sm">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{internship.company}</h3>
                    <p className="text-xs text-gray-500">{internship.position}</p>
                  </div>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                  onClick={(e) => toggleActionsMenu(internship.id, e)}
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                </button>
                {showActionsMenu === internship.id && (
                  <div className="absolute right-4 mt-6 w-40 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 overflow-hidden">
                    <div className="py-1">
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(internship);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2 text-blue-500 w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(internship.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500 w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(internship.id);
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
                  <p className="text-xs font-medium text-gray-500">Duration</p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon={faClock} className="text-gray-400 mr-1 text-xs" />
                    <p className="text-sm font-semibold">{internship.duration}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Stipend</p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400 mr-1 text-xs" />
                    <p className="text-sm font-semibold">{internship.stipend}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Posted</p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-1 text-xs" />
                    <p className="text-sm">{internship.postedDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Status</p>
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-3 font-semibold rounded-full ${getStatusColor(internship.status)} mt-1`}>
                    {internship.status}
                  </span>
                </div>
              </div>

              <button 
                className="mt-4 w-full py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                onClick={() => handleView(internship)}
              >
                View Details
              </button>
            </Card>
          ))}
        </div>

        {/* View Modal */}
        {showViewModal && selectedInternship && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-blue-700">Internship Details</h3>
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
                    <p className="text-base mt-1 font-medium">{selectedInternship.company}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Position</h4>
                    <p className="text-base mt-1 font-medium">{selectedInternship.position}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                    <p className="text-base mt-1 font-medium">{selectedInternship.duration}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Stipend</h4>
                    <p className="text-base mt-1 font-medium">{selectedInternship.stipend}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="text-base mt-1">
                      <span className={`px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(selectedInternship.status)}`}>
                        {selectedInternship.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Posted Date</h4>
                    <p className="text-base mt-1 font-medium">{selectedInternship.postedDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Deadline</h4>
                    <p className="text-base mt-1 font-medium">{selectedInternship.deadline}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {selectedInternship.description}
                  </p>
                </div>
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Requirements</h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {selectedInternship.requirements}
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
                    handleEdit(selectedInternship.id);
                    setShowViewModal(false);
                  }}
                >
                  Edit Internship
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InternshipPage;
