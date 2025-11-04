// src/app/main/dashboard/training/InboxPage.jsx
'use client';
import React, { useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faEnvelopeOpen, 
  faStar, 
  faTrash, 
  faReply, 
  faEllipsisV,
  faArrowLeft,
  faPaperclip,
  faShare,
  faPrint,
  faReplyAll,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

// Sample messages data
const allMessages = [
  {
    id: 1,
    sender: 'John Smith',
    senderEmail: 'john.smith@example.com',
    subject: 'Regarding Course Enrollment',
    content: `Dear Training Institute,

I hope this message finds you well. I'm writing to inquire about the advanced JavaScript course you're offering. I came across it on your website and it seems like exactly what I'm looking for to enhance my skills.

Could you please provide me with more details about:
- The course schedule
- Prerequisites required
- Certification provided upon completion
- Any available discounts for early enrollment

I'm particularly interested in the modules covering React and Node.js integration. Would these be covered in depth?

Looking forward to your response.

Best regards,
John Smith`,
    time: '10:30 AM',
    date: 'Today',
    unread: true,
    starred: false,
    hasAttachment: true
  },
  {
    id: 2,
    sender: 'Sarah Johnson',
    senderEmail: 'sarah.j@example.com',
    subject: 'Payment Confirmation',
    content: `Hello,

Thank you for your prompt processing of my payment for the "Advanced Data Science" course. I've received the receipt and all details look correct.

I noticed the receipt mentions access to course materials will be granted 3 days before the start date. Could you confirm if this timeline is still accurate?

Also, will there be any orientation session before the course begins? I'd like to prepare accordingly.

Thanks again,
Sarah Johnson`,
    time: 'Yesterday',
    date: 'Jul 26',
    unread: false,
    starred: true,
    hasAttachment: false
  },
  {
    id: 3,
    sender: 'Training Department',
    senderEmail: 'training@koluvu.com',
    subject: 'New Course Announcement',
    content: `Dear Team,

We're excited to announce our new "React Native Mobile Development" course starting next month! This comprehensive program covers:

- React Native fundamentals
- State management with Redux
- Native module integration
- Performance optimization
- Publishing to app stores

Key details:
- Start Date: September 5th
- Duration: 8 weeks
- Format: Hybrid (online + in-person labs)
- Early bird discount available until August 20th

Please update students and promote through our channels. Marketing materials are attached.

Best,
Training Department`,
    time: 'Jul 25',
    date: 'Jul 25',
    unread: false,
    starred: false,
    hasAttachment: true
  },
  {
    id: 4,
    sender: 'Michael Brown',
    senderEmail: 'michael.b@example.com',
    subject: 'Internship Opportunity',
    content: `Hello,

Our company is looking for interns from your institute for the upcoming summer program. We're particularly interested in students with skills in:

- Web Development (React, Node.js)
- Data Analysis
- UI/UX Design

The internship duration would be 3 months with potential for full-time offers based on performance. Could you please share this opportunity with your students?

We'd be happy to conduct an info session if needed.

Regards,
Michael Brown
HR Manager
TechSolutions Inc.`,
    time: 'Jul 24',
    date: 'Jul 24',
    unread: false,
    starred: false,
    hasAttachment: false
  },
  {
    id: 5,
    sender: 'Support Team',
    senderEmail: 'support@koluvu.com',
    subject: 'Your Recent Ticket',
    content: `Dear User,

We're happy to inform you that your recent support ticket (#45678) regarding dashboard access issues has been resolved. 

The problem was related to a temporary server outage that has now been fixed. Please try accessing your dashboard again. If you continue to experience issues, don't hesitate to contact us again.

Thank you for your patience.

Best regards,
Support Team
Koluvu`,
    time: 'Jul 22',
    date: 'Jul 22',
    unread: false,
    starred: false,
    hasAttachment: false
  }
];

const InboxPage = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageList, setMessageList] = useState(allMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [composeMode, setComposeMode] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [forwardMode, setForwardMode] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const messagesPerPage = 3;

  // Calculate pagination
  const filteredMessages = messageList.filter(message =>
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const handleStarMessage = (id, e) => {
    e.stopPropagation();
    setMessageList(messageList.map(msg => 
      msg.id === id ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const handleDeleteMessage = (id, e) => {
    e.stopPropagation();
    setMessageList(messageList.filter(msg => msg.id !== id));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
    // Reset to first page if current page becomes empty
    if (currentMessages.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setMessageList(messageList.map(msg => 
      msg.id === message.id ? { ...msg, unread: false } : msg
    ));
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
    setComposeMode(false);
    setReplyMode(false);
    setForwardMode(false);
    setActiveAction(null);
  };

  const handleCompose = () => {
    setComposeMode(true);
    setSelectedMessage(null);
    setReplyMode(false);
    setForwardMode(false);
  };

  const handleReply = () => {
    setReplyMode(true);
    setForwardMode(false);
    setComposeMode(false);
  };

  const handleForward = () => {
    setForwardMode(true);
    setReplyMode(false);
    setComposeMode(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    // In a real app, this would send the message to your backend
    alert('Message sent successfully!');
    setComposeMode(false);
    setReplyMode(false);
    setForwardMode(false);
    setActiveAction(null);
  };

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 sm:p-6">
          {!selectedMessage && !composeMode && !replyMode && !forwardMode ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-700">Inbox</h2>
                  <p className="text-sm text-gray-500 mt-2">
                    {messageList.filter(m => m.unread).length} unread message{messageList.filter(m => m.unread).length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
                  <button 
                    onClick={handleCompose}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm flex items-center"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Compose
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Message List */}
              <div className="space-y-3">
                {currentMessages.length > 0 ? (
                  currentMessages.map((message) => (
                    <div 
                      key={message.id}
                      className={`p-4 rounded-lg border cursor-pointer shadow-sm transition-colors duration-150 ${
                        message.unread 
                          ? 'border-blue-200 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleMessageClick(message)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 pt-1">
                          <button 
                            onClick={(e) => handleStarMessage(message.id, e)}
                            className={`text-gray-400 hover:text-yellow-400 ${message.starred ? 'text-yellow-400' : ''}`}
                          >
                            <FontAwesomeIcon icon={faStar} />
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className={`text-sm font-medium truncate ${
                              message.unread ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {message.sender}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {message.time}
                            </span>
                          </div>
                          <h4 className={`text-sm ${
                            message.unread ? 'font-semibold text-gray-800' : 'text-gray-600'
                          } truncate mt-1`}>
                            {message.subject}
                          </h4>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {message.content.split('\n')[0]}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex gap-1">
                          <button 
                            className="p-1 text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMessage(message);
                              setReplyMode(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faReply} size="xs" />
                          </button>
                          <button 
                            className="p-1 text-gray-400 hover:text-gray-600"
                            onClick={(e) => handleDeleteMessage(message.id, e)}
                          >
                            <FontAwesomeIcon icon={faTrash} size="xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No messages found
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <button 
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        page === currentPage 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium ${
                    currentPage === totalPages || totalPages === 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : composeMode ? (
            <>
              {/* Compose New Message */}
              <div className="mb-4">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2 w-4 h-4" />
                  Back to inbox
                </button>
              </div>

              <form onSubmit={handleSendMessage}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <button 
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      >
                        <FontAwesomeIcon icon={faPaperclip} className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : replyMode || forwardMode ? (
            <>
              {/* Reply/Forward Message */}
              <div className="mb-4">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2 w-4 h-4" />
                  Back to inbox
                </button>
              </div>

              <form onSubmit={handleSendMessage}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <input 
                      type="email" 
                      defaultValue={replyMode ? selectedMessage.senderEmail : ''}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      defaultValue={`${replyMode ? 'Re: ' : 'Fwd: '}${selectedMessage.subject}`}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                      required
                      defaultValue={replyMode ? `\n\n---------- Original Message ----------\nFrom: ${selectedMessage.sender} <${selectedMessage.senderEmail}>\nDate: ${selectedMessage.date} at ${selectedMessage.time}\nSubject: ${selectedMessage.subject}\n\n${selectedMessage.content}` : selectedMessage.content}
                    ></textarea>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <button 
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      >
                        <FontAwesomeIcon icon={faPaperclip} className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium transition-all"
                    >
                      {replyMode ? 'Reply' : 'Forward'}
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Message View */}
              <div className="mb-4">
                <button 
                  onClick={handleBackToList}
                  className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2 w-4 h-4" />
                  Back to inbox
                </button>
              </div>

              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{selectedMessage.subject}</h2>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      onClick={() => {
                        setActiveAction('print');
                        window.print();
                      }}
                    >
                      <FontAwesomeIcon icon={faPrint} className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                      onClick={(e) => handleDeleteMessage(selectedMessage.id, e)}
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{selectedMessage.sender}</p>
                    <p className="text-sm text-gray-500">{selectedMessage.senderEmail}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedMessage.date} at {selectedMessage.time}
                  </div>
                </div>
              </div>

              <div className="prose max-w-none whitespace-pre-line mb-6 text-gray-700">
                {selectedMessage.content}
              </div>

              {selectedMessage.hasAttachment && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">Attachments</h3>
                  <div className="flex items-center gap-2 p-2 border rounded-lg w-max">
                    <FontAwesomeIcon icon={faPaperclip} className="text-gray-500 w-4 h-4" />
                    <span className="text-sm">document.pdf</span>
                    <button className="ml-2 text-blue-600 text-sm hover:text-blue-800">
                      Download
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={handleReply}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
                >
                  <FontAwesomeIcon icon={faReply} className="w-4 h-4" />
                  Reply
                </button>
                <button 
                  onClick={handleForward}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm font-medium"
                >
                  <FontAwesomeIcon icon={faShare} className="w-4 h-4" />
                  Forward
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm font-medium">
                  <FontAwesomeIcon icon={faReplyAll} className="w-4 h-4" />
                  Reply All
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InboxPage;
