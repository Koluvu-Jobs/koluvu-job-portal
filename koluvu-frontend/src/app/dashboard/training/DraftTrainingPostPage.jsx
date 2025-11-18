// src/app/main/dashboard/training/DraftTrainingPostPage.jsx
'use client';
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faTrash,
  faEye,
  faEllipsisV,
  faTimes,
  faCalendarAlt,
  faMoneyBillWave,
  faUpload,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const DraftTrainingPostPage = () => {
  const [drafts, setDrafts] = useState([
    {
      id: 1,
      title: "Advanced React Course",
      category: "Web Development",
      createdDate: "2023-05-15",
      lastEdited: "2 days ago",
      status: "Draft",
      fee: "$399",
      description: "Comprehensive course covering React hooks, context API, and advanced state management patterns.",
      hasMaterials: false
    },
    {
      id: 2,
      title: "Node.js Backend Development",
      category: "Backend Development",
      createdDate: "2023-06-01",
      lastEdited: "1 week ago",
      status: "Draft",
      fee: "$449",
      description: "Learn to build scalable backend services with Node.js, Express, and MongoDB.",
      hasMaterials: true
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      category: "Design",
      createdDate: "2023-06-10",
      lastEdited: "3 days ago",
      status: "Draft",
      fee: "$349",
      description: "Introduction to user interface and experience design principles.",
      hasMaterials: false
    }
  ]);

  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [editingDraft, setEditingDraft] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    fee: '',
    description: '',
    hasMaterials: false
  });

  const handleView = (draft) => {
    setSelectedDraft(draft);
    setShowViewModal(true);
  };

  const handleEdit = (id) => {
    const draftToEdit = drafts.find(draft => draft.id === id);
    if (draftToEdit) {
      setEditingDraft(draftToEdit);
      setFormData({
        title: draftToEdit.title,
        category: draftToEdit.category,
        fee: draftToEdit.fee,
        description: draftToEdit.description,
        hasMaterials: draftToEdit.hasMaterials
      });
      setShowEditModal(true);
    }
    setShowActionsMenu(null);
  };

  const handleDelete = (id) => {
    setDrafts(drafts.filter(draft => draft.id !== id));
    setShowActionsMenu(null);
    if (selectedDraft && selectedDraft.id === id) {
      setShowViewModal(false);
    }
  };

  const handlePublish = (id) => {
    setDrafts(drafts.map(draft => {
      if (draft.id === id) {
        return { ...draft, status: "Published" };
      }
      return draft;
    }));
    setShowActionsMenu(null);
    if (selectedDraft && selectedDraft.id === id) {
      setShowViewModal(false);
    }
  };

  const toggleActionsMenu = (id, e) => {
    e.stopPropagation();
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveEdit = () => {
    setDrafts(drafts.map(draft => {
      if (draft.id === editingDraft.id) {
        return {
          ...draft,
          title: formData.title,
          category: formData.category,
          fee: formData.fee,
          description: formData.description,
          hasMaterials: formData.hasMaterials,
          lastEdited: "Just now"
        };
      }
      return draft;
    }));
    setShowEditModal(false);
    if (selectedDraft && selectedDraft.id === editingDraft.id) {
      setSelectedDraft({
        ...selectedDraft,
        title: formData.title,
        category: formData.category,
        fee: formData.fee,
        description: formData.description,
        hasMaterials: formData.hasMaterials,
        lastEdited: "Just now"
      });
    }
  };

  const handleCreateNewDraft = () => {
    const newDraft = {
      id: Math.max(...drafts.map(d => d.id)) + 1,
      title: "New Training Program",
      category: "General",
      createdDate: new Date().toISOString().split('T')[0],
      lastEdited: "Just now",
      status: "Draft",
      fee: "$0",
      description: "Enter your program description here",
      hasMaterials: false
    };
    setDrafts([...drafts, newDraft]);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Draft Training Programs</h2>
            <p className="text-sm text-gray-500 mt-2">Manage and prepare your unpublished training programs</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
              <span className="hidden sm:inline">Drafts: </span>
              {drafts.length}
            </div>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm w-full md:w-auto"
              onClick={handleCreateNewDraft}
            >
              + Create New Draft
            </button>
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
                  Created
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
              {drafts.map((draft) => (
                <tr key={draft.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 shadow-sm">
                        <FontAwesomeIcon icon={faEdit} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">{draft.title}</div>
                        <div className="text-xs text-gray-500">{draft.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2 text-sm" />
                      <div>
                        <div className="text-sm text-gray-900">{draft.createdDate}</div>
                        <div className="text-xs text-gray-500">Last edited: {draft.lastEdited}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                      draft.status === "Draft" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {draft.status}
                    </span>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="mr-1" />
                      {draft.fee}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-2 relative">
                      <button 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        onClick={() => handleView(draft)}
                      >
                        View
                      </button>
                      <div className="relative">
                        <button 
                          className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                          onClick={(e) => toggleActionsMenu(draft.id, e)}
                        >
                          <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                        </button>
                        {showActionsMenu === draft.id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 overflow-hidden">
                            <div className="py-1">
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(draft.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500 w-4 h-4" />
                                Edit
                              </button>
                              {draft.status === "Draft" && (
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePublish(draft.id);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faUpload} className="mr-2 text-green-500 w-4 h-4" />
                                  Publish
                                </button>
                              )}
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(draft.id);
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
          {drafts.map((draft) => (
            <Card key={draft.id} className="p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mr-3 shadow-sm">
                    <FontAwesomeIcon icon={faEdit} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{draft.title}</h3>
                    <p className="text-xs text-gray-500">{draft.category}</p>
                  </div>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
                  onClick={(e) => toggleActionsMenu(draft.id, e)}
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                </button>
                {showActionsMenu === draft.id && (
                  <div className="absolute right-4 mt-6 w-40 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-10 overflow-hidden">
                    <div className="py-1">
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(draft);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2 text-blue-500 w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(draft.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500 w-3.5 h-3.5" />
                        Edit
                      </button>
                      {draft.status === "Draft" && (
                        <button
                          className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePublish(draft.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faUpload} className="mr-2 text-green-500 w-3.5 h-3.5" />
                          Publish
                        </button>
                      )}
                      <button
                        className="flex items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(draft.id);
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
                  <p className="text-xs font-medium text-gray-500">Created</p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-1 text-xs" />
                    <p className="text-sm">{draft.createdDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Last Edited</p>
                  <p className="text-sm mt-1">{draft.lastEdited}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Status</p>
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-3 font-semibold rounded-full ${
                    draft.status === "Draft" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {draft.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">Fee</p>
                  <div className="flex items-center mt-1">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-gray-400 mr-1 text-xs" />
                    <p className="text-sm font-semibold">{draft.fee}</p>
                  </div>
                </div>
              </div>

              <button 
                className="mt-4 w-full py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                onClick={() => handleView(draft)}
              >
                View Details
              </button>
            </Card>
          ))}
        </div>

        {/* View Modal */}
        {showViewModal && selectedDraft && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-blue-700">Draft Program Details</h3>
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
                    <h4 className="text-sm font-medium text-gray-500">Title</h4>
                    <p className="text-base mt-1 font-medium">{selectedDraft.title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Category</h4>
                    <p className="text-base mt-1 font-medium">{selectedDraft.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="text-base mt-1">
                      <span className={`px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        selectedDraft.status === "Draft" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {selectedDraft.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fee</h4>
                    <p className="text-base mt-1 font-medium">{selectedDraft.fee}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Created Date</h4>
                    <p className="text-base mt-1 font-medium">{selectedDraft.createdDate}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Last Edited</h4>
                    <p className="text-base mt-1 font-medium">{selectedDraft.lastEdited}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500">Materials Uploaded</h4>
                    <p className="text-base mt-1 flex items-center">
                      {selectedDraft.hasMaterials ? (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mr-2 w-4 h-4" />
                          <span className="text-emerald-600 font-medium">Materials uploaded</span>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-500">No materials uploaded yet</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {selectedDraft.description}
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
                    handleEdit(selectedDraft.id);
                    setShowViewModal(false);
                  }}
                >
                  Edit Draft
                </button>
                {selectedDraft.status === "Draft" && (
                  <button
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 text-sm font-medium transition-all"
                    onClick={() => {
                      handlePublish(selectedDraft.id);
                      setShowViewModal(false);
                    }}
                  >
                    Publish Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingDraft && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-blue-700">Edit Draft Program</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowEditModal(false)}
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="fee" className="block text-sm font-medium text-gray-500 mb-1">Fee</label>
                    <input
                      type="text"
                      id="fee"
                      name="fee"
                      value={formData.fee}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasMaterials"
                      name="hasMaterials"
                      checked={formData.hasMaterials}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasMaterials" className="ml-2 block text-sm text-gray-700">
                      Materials Uploaded
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="border-t p-5 flex justify-end space-x-3">
                <button
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DraftTrainingPostPage;
