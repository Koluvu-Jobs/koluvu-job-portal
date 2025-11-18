// src/app/main/dashboard/training/ActiveTrainingPostPage.jsx

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  faUser,
  faEnvelope,
  faPhone,
  faIdBadge
} from '@fortawesome/free-solid-svg-icons';

const ActiveTrainingPostPage = () => {
  const router = useRouter();
  const [activeTrainings, setActiveTrainings] = useState([
    {
      id: 1,
      title: "Advanced Web Development Bootcamp",
      status: "Active",
      enrollments: 45,
      capacity: 50,
      startDate: "2023-06-15",
      endDate: "2023-09-15",
      category: "Web Development",
      fee: "$499",
      progress: 90,
      lastUpdated: "2 hours ago",
      description: "Comprehensive web development course covering HTML, CSS, JavaScript, and modern frameworks like React and Node.js.",
      members: Array.from({ length: 45 }, (_, i) => ({
        id: i + 1,
        name: `Participant ${i + 1}`,
        email: `participant${i + 1}@example.com`,
        phone: `+1 (555) ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        enrollmentDate: `2023-${String(Math.floor(Math.random() * 3) + 5).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status: Math.random() > 0.1 ? "Active" : "Inactive"
      }))
    },
    {
      id: 2,
      title: "Data Science & Machine Learning Fundamentals",
      status: "Active",
      enrollments: 32,
      capacity: 40,
      startDate: "2023-07-01",
      endDate: "2023-10-01",
      category: "Data Science",
      fee: "$599",
      progress: 80,
      lastUpdated: "5 hours ago",
      description: "Introduction to data analysis, visualization, and machine learning algorithms using Python and TensorFlow.",
      members: Array.from({ length: 32 }, (_, i) => ({
        id: i + 1,
        name: `Participant ${i + 1}`,
        email: `participant${i + 1}@example.com`,
        phone: `+1 (555) ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        enrollmentDate: `2023-${String(Math.floor(Math.random() * 3) + 6).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status: Math.random() > 0.1 ? "Active" : "Inactive"
      }))
    },
    {
      id: 3,
      title: "Mobile App Development with Flutter",
      status: "Active",
      enrollments: 28,
      capacity: 35,
      startDate: "2023-07-10",
      endDate: "2023-10-10",
      category: "Mobile Development",
      fee: "$449",
      progress: 80,
      lastUpdated: "1 day ago",
      description: "Build cross-platform mobile applications using Flutter framework with Dart programming language.",
      members: Array.from({ length: 28 }, (_, i) => ({
        id: i + 1,
        name: `Participant ${i + 1}`,
        email: `participant${i + 1}@example.com`,
        phone: `+1 (555) ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        enrollmentDate: `2023-${String(Math.floor(Math.random() * 3) + 6).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status: Math.random() > 0.1 ? "Active" : "Inactive"
      }))
    },
    {
      id: 4,
      title: "Cloud Computing with AWS",
      status: "Active",
      enrollments: 18,
      capacity: 25,
      startDate: "2023-08-05",
      endDate: "2023-11-05",
      category: "Cloud Computing",
      fee: "$699",
      progress: 72,
      lastUpdated: "2 days ago",
      description: "Master AWS cloud services including EC2, S3, Lambda, and more for scalable cloud solutions.",
      members: Array.from({ length: 18 }, (_, i) => ({
        id: i + 1,
        name: `Participant ${i + 1}`,
        email: `participant${i + 1}@example.com`,
        phone: `+1 (555) ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        enrollmentDate: `2023-${String(Math.floor(Math.random() * 2) + 7).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status: Math.random() > 0.1 ? "Active" : "Inactive"
      }))
    }
  ]);

  const [selectedTraining, setSelectedTraining] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [modalTopOffset, setModalTopOffset] = useState('mt-16');
  const [newTraining, setNewTraining] = useState({
    title: '',
    category: '',
    startDate: '',
    endDate: '',
    capacity: '',
    fee: '',
    description: ''
  });

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

  const handleEdit = (training) => {
    setEditingTraining({ ...training });
    setShowViewModal(false);
    console.log('Editing training:', training);
    alert(`Edit form would open for: ${training.title}`);
  };

  const handleDelete = (id) => {
    setActiveTrainings(activeTrainings.filter(training => training.id !== id));
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

  const toggleActionsMenu = (id, e) => {
    e.stopPropagation();
    setShowActionsMenu(showActionsMenu === id ? null : id);
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newId = Math.max(...activeTrainings.map(t => t.id), 0) + 1;
    const progress = Math.floor(Math.random() * 30) + 10; // Random progress between 10-40%
    const enrollments = Math.floor((progress / 100) * parseInt(newTraining.capacity));
    
    const createdTraining = {
      id: newId,
      title: newTraining.title,
      status: "Active",
      enrollments: enrollments,
      capacity: parseInt(newTraining.capacity),
      startDate: newTraining.startDate,
      endDate: newTraining.endDate,
      category: newTraining.category,
      fee: `$${newTraining.fee}`,
      progress: progress,
      lastUpdated: "Just now",
      description: newTraining.description,
      members: Array.from({ length: enrollments }, (_, i) => ({
        id: i + 1,
        name: `Participant ${i + 1}`,
        email: `participant${i + 1}@example.com`,
        phone: `+1 (555) ${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: "Active"
      }))
    };

    setActiveTrainings([...activeTrainings, createdTraining]);
    setShowCreateModal(false);
    setNewTraining({
      title: '',
      category: '',
      startDate: '',
      endDate: '',
      capacity: '',
      fee: '',
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTraining(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewProfile = (member) => {
    // Redirect to employee profile with member data
    router.push('/dashboard/employee?tab=profile');
    
    // Store member data to be used in the profile page
    localStorage.setItem('viewingMemberProfile', JSON.stringify(member));
    
    // Close the members modal
    setShowMembersModal(false);
  };

  const totalEnrollments = activeTrainings.reduce((sum, training) => sum + training.enrollments, 0);
  const averageCompletion = activeTrainings.length > 0 
    ? Math.round(activeTrainings.reduce((sum, training) => sum + training.progress, 0) / activeTrainings.length)
    : 0;
  const totalRevenue = activeTrainings.reduce((sum, training) => {
    const feeValue = Number(training.fee.replace(/[^0-9.-]+/g, ""));
    return isNaN(feeValue) ? sum : sum + (feeValue * training.enrollments);
  }, 0);

  // Mock extra fields for demo table (department, specialization, skills, experience)
  const mockDepartments = ["Software Development", "Data Science", "UI/UX Design", "DevOps", "Cybersecurity"];
  const mockSpecializations = [
    "Full Stack Development",
    "Machine Learning",
    "Product Design",
    "Cloud Infrastructure",
    "Network Security"
  ];
  const mockSkills = [
    "React, Node.js, Python, AWS",
    "Python, TensorFlow, SQL, R",
    "Figma, Sketch, Prototyping, User Research",
    "Docker, Kubernetes, Jenkins, Azure",
    "Ethical Hacking, Firewall, CISSP, Python"
  ];
  const mockExperience = ["5 years", "3 years", "4 years", "6 years", "7 years"];

  // Selection state for candidate rows
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const handleSelectCandidate = (id) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };
  const handleSelectAllCandidates = (ids) => {
    if (selectedCandidates.length === ids.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(ids);
    }
  };

  // Filtered members for modal (show all participants)
  const filteredMembers = selectedTraining && memberSearch
    ? selectedTraining.members.filter(
        (m) =>
          m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
          m.email.toLowerCase().includes(memberSearch.toLowerCase())
      )
    : (selectedTraining?.members || []);

  // Export all members as CSV
  const handleExportMembers = () => {
    if (!selectedTraining) return;
    const headers = ["S.No", "Name", "Email", "Phone", "Enrollment Date", "Status"];
    const rows = selectedTraining.members.map((m, i) => [
      i + 1,
      m.name,
      m.email,
      m.phone,
      m.enrollmentDate,
      m.status
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTraining.title.replace(/\s+/g, "_")}_members.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export only selected candidates as CSV (Download)
  const handleBulkDownloadCandidates = () => {
    if (!selectedTraining || selectedCandidates.length === 0) {
      alert("Please select at least one candidate to download.");
      return;
    }
    const headers = [
      "S.No",
      "Name",
      "Email",
      "Phone",
      "Department",
      "Specialization",
      "Skills",
      "Experience",
      "Enrollment Date",
      "Status"
    ];
    const selected = selectedTraining.members.filter(m => selectedCandidates.includes(m.id));
    const rows = selected.map((m, i) => [
      i + 1,
      m.name,
      m.email,
      `'${m.phone}`,
      mockDepartments[(i) % mockDepartments.length],
      mockSpecializations[(i) % mockSpecializations.length],
      mockSkills[(i) % mockSkills.length],
      mockExperience[(i) % mockExperience.length],
      m.enrollmentDate,
      m.status
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTraining.title.replace(/\s+/g, "_")}_selected_candidates.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Send SMS to selected candidates
  const handleSendSMS = () => {
    if (!selectedTraining || selectedCandidates.length === 0) {
      alert("Please select at least one candidate to send SMS.");
      return;
    }
    const selected = selectedTraining.members.filter(m => selectedCandidates.includes(m.id));
    selected.forEach(m => {
      // Replace with real SMS API call
      console.log(`Sending SMS to ${m.phone}`);
    });
    alert(`SMS sent to ${selected.length} candidate(s).`);
  };

  // Send Email to selected candidates
  const handleSendEmail = () => {
    if (!selectedTraining || selectedCandidates.length === 0) {
      alert("Please select at least one candidate to send Email.");
      return;
    }
    const selected = selectedTraining.members.filter(m => selectedCandidates.includes(m.id));
    selected.forEach(m => {
      // Replace with real Email API call
      console.log(`Sending Email to ${m.email}`);
    });
    alert(`Email sent to ${selected.length} candidate(s).`);
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Active Training Programs</h2>
            <p className="text-sm text-gray-500 mt-2">Manage your currently running training programs and track their performance</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
            <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
              <span className="hidden sm:inline">Active Programs: </span>
              {activeTrainings.length}
            </div>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm w-full md:w-auto"
              onClick={handleCreateNew}
            >
              + Create New Program
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
              {activeTrainings.map((training) => (
                <tr key={training.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
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
                    <span className="px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-emerald-100 text-emerald-800">
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
                                  handleEdit(training);
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
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(training.id);
                                }}
                              >
                                <FontAwesomeIcon icon={faShare} className="mr-2 text-purple-500 w-4 h-4" />
                                Share
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
          {activeTrainings.map((training) => (
            <Card key={training.id} className="p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3 shadow-sm">
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
                          handleEdit(training);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500 w-3.5 h-3.5" />
                        Edit
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
                  <span className="px-2 py-0.5 inline-flex text-xs leading-3 font-semibold rounded-full bg-emerald-100 text-emerald-800 mt-1">
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
            <div className="mt-2 flex items-center text-xs font-medium text-emerald-600">
              <span>↑ 12% from last month</span>
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
            <div className="mt-2 flex items-center text-xs font-medium text-emerald-600">
              <span>↑ 5% from last month</span>
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
            <div className="mt-2 flex items-center text-xs font-medium text-emerald-600">
              <span>↑ 18% from last month</span>
            </div>
          </div>
        </div>

        {/* View Modal */}
        {showViewModal && selectedTraining && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-blue-700">Training Program Details</h3>
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
                    <p className="text-base mt-1 font-medium">{selectedTraining.title}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Category</h4>
                    <p className="text-base mt-1 font-medium">{selectedTraining.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <p className="text-base mt-1">
                      <span className="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
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
              <div className="border-t p-5 flex justify-end space-x-3">
                <button
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
                <button
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all"
                  onClick={() => handleEdit(selectedTraining)}
                >
                  Edit Program
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Members Modal */}
        {showMembersModal && selectedTraining && (
          <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-4`}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-full sm:max-w-[1250px] max-h-[90vh] flex flex-col overflow-x-auto mt-8 sm:mt-16">
              {/* Colored Header */}
              <div className="rounded-t-xl" style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)' }}>
                <div className="p-3 sm:p-6 mt-6 sm:mt-0">
                  <h2 className="text-base sm:text-2xl font-extrabold text-white mb-2 sm:mb-1 block" style={{letterSpacing: '0.02em'}}>
                    Candidate Profile Selection
                  </h2>
                  <p className="text-xs sm:text-base text-blue-100">Manage and select candidates for training programs</p>
                </div>
              </div>
              {/* Search, Filter, Select All */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-2 sm:px-12 pt-2 sm:pt-8 pb-1 sm:pb-4 bg-white z-10 w-full">
                <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm w-full sm:w-64"
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                  />
                  <select className="px-2 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm bg-white w-full sm:w-auto" style={{ minWidth: 100 }}>
                    <option value="">All</option>
                    {mockDepartments.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm text-gray-500">{selectedCandidates.length} of {filteredMembers.length} selected</span>
                  <button
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 w-full sm:w-auto"
                    onClick={() => handleSelectAllCandidates(filteredMembers.map(m => m.id))}
                  >
                    Select All
                  </button>
                </div>
              </div>
              {/* Table (scrollable) */}
              <div className="flex-1 px-1 sm:px-12 pb-1 sm:pb-4 overflow-y-auto overflow-x-auto w-full" style={{ maxHeight: '50vh' }}>
                <table className="min-w-[600px] sm:min-w-full divide-y divide-gray-200 mt-2 text-xs sm:text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">S.NO</th>
                      <th className="px-2 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider">Selection</th>
                      <th className="px-2 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Candidate Name</th>
                      <th className="px-2 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                      <th className="px-2 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Specialization</th>
                      <th className="px-2 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Training Skills</th>
                      <th className="px-2 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Experience</th>
                      <th className="px-2 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-400 text-xs">No candidates found.</td>
                      </tr>
                    ) : (
                      filteredMembers.map((member, index) => (
                        <tr key={member.id} className={index % 2 === 0 ? "bg-white" : "bg-blue-50/40"}>
                          <td className="px-2 py-2 whitespace-nowrap text-gray-500">{index + 1}</td>
                          <td className="px-2 py-2 text-center">
                            <input
                              type="checkbox"
                              checked={selectedCandidates.includes(member.id)}
                              onChange={() => handleSelectCandidate(member.id)}
                              className="accent-blue-600 w-4 h-4"
                            />
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <span className="font-semibold text-gray-900">{member.name}</span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-lg">{mockDepartments[index % mockDepartments.length]}</span>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">{mockSpecializations[index % mockSpecializations.length]}</td>
                          <td className="px-2 py-2 whitespace-nowrap">{mockSkills[index % mockSkills.length]}</td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-lg">{mockExperience[index % mockExperience.length]}</span>
                          </td>
                          <td className="px-2 py-2 text-center whitespace-nowrap">
                            <button 
                              className="text-blue-600 hover:text-blue-800 mx-1" 
                              title="View"
                              onClick={() => handleViewProfile(member)}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button className="text-green-600 hover:text-green-800 mx-1" title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                            <button className="text-red-600 hover:text-red-800 mx-1" title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Footer summary */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-b-xl px-2 sm:px-12 py-1 sm:py-4 border-t text-xs sm:text-sm text-gray-600 gap-1 sm:gap-2 w-full">
                <div className="w-full sm:w-auto">Showing {filteredMembers.length} of {selectedTraining.members.length} candidates</div>
                <div className="w-full sm:w-auto">{selectedCandidates.length} candidates selected for training</div>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 ml-auto mt-2 sm:mt-0 w-full sm:w-auto">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors w-full sm:w-auto"
                    onClick={handleSendSMS}
                  >
                    Send SMS
                  </button>
                  <button
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors w-full sm:w-auto"
                    onClick={handleSendEmail}
                  >
                    Send Email
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors w-full sm:w-auto"
                    onClick={handleBulkDownloadCandidates}
                  >
                    Download
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors w-full sm:w-auto"
                    onClick={() => setShowMembersModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create New Program Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-blue-700">Create New Training Program</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowCreateModal(false)}
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateSubmit} className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-500 mb-1">
                      Title*
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newTraining.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-500 mb-1">
                      Category*
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={newTraining.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Digital Marketing">Digital Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-500 mb-1">
                      Start Date*
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newTraining.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-500 mb-1">
                      End Date*
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={newTraining.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-500 mb-1">
                      Capacity*
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={newTraining.capacity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="fee" className="block text-sm font-medium text-gray-500 mb-1">
                      Fee ($)*
                    </label>
                    <input
                      type="number"
                      id="fee"
                      name="fee"
                      value={newTraining.fee}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-500 mb-1">
                      Description*
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newTraining.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="border-t p-5 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all"
                  >
                    Create Program
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveTrainingPostPage;
