//src/app/kolink/page.js

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { Camera, Briefcase, Users, MessageSquare, BookOpen, Award, TrendingUp, Settings, Bell, Search, Home, Send, ChevronRight, Star, MapPin, Clock, DollarSign, CheckCircle, Eye, ThumbsUp, MessageCircle, Share2, Plus, Filter, Menu, X, Sparkles, Zap, Target, Building2, Compass, BarChart3, Route, UserCheck, Library, FileText, Wand2, Crosshair, Mic } from 'lucide-react';
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import CareerFieldsSection from "./career-guidance/components/CareerFieldsSection";
import SkillAssessmentSection from "./career-guidance/components/SkillAssessmentSection";
import CareerPathsSection from "./career-guidance/components/CareerPathsSection";
import ResourcesSection from "./career-guidance/components/ResourcesSection";
import MentorshipSection from "./career-guidance/components/MentorshipSection";
import CareerGoalsSection from "./career-guidance/components/CareerGoalsSection";

const CAREER_GUIDANCE_VIEWS = new Set([
  "fields",
  "goals",
  "assessments",
  "paths",
  "mentorship",
  "resources",
]);

// Mock Data
const mockUsers = [
  { id: 1, name: 'Sarah Johnson', title: 'Senior Software Engineer', company: 'TechCorp', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', verified: true, connections: 500 },
  { id: 2, name: 'Michael Chen', title: 'Product Manager', company: 'InnovateLabs', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', verified: true, connections: 820 },
  { id: 3, name: 'Emily Rodriguez', title: 'UX Designer', company: 'DesignHub', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', verified: false, connections: 342 }
];

const mockJobs = [
  { id: 1, title: 'Full Stack Developer', company: 'TechCorp', location: 'Remote', type: 'Full-time', salary: '$80k-120k', posted: '2 days ago', applicants: 45 },
  { id: 2, title: 'UI/UX Designer', company: 'DesignHub', location: 'San Francisco', type: 'Full-time', salary: '$70k-100k', posted: '5 days ago', applicants: 28 },
  { id: 3, title: 'Data Scientist', company: 'DataFlow', location: 'New York', type: 'Remote', salary: '$90k-130k', posted: '1 week ago', applicants: 67 }
];

const mockPosts = [
  { id: 1, author: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', time: '3h ago', content: 'Just completed an amazing AI/ML certification! Excited to implement these skills in real-world projects. #MachineLearning #CareerGrowth', likes: 234, comments: 18, shares: 12 },
  { id: 2, author: 'TechCorp', avatar: 'https://ui-avatars.com/api/?name=TechCorp&background=fa7f04&color=fff&size=128', time: '5h ago', content: 'We\'re hiring! Looking for talented developers to join our remote team. Check out our latest openings.', likes: 156, comments: 24, shares: 45 },
];

const mockFreelanceProjects = [
  { id: 1, title: 'E-commerce Website Development', budget: '$2000-$5000', duration: '2-3 months', proposals: 12, client: 'StartupXYZ', posted: '1 day ago' },
  { id: 2, title: 'Mobile App UI Design', budget: '$1500-$3000', duration: '1 month', proposals: 8, client: 'AppMakers Inc', posted: '3 days ago' }
];

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Main App Component
const KolinkApp = () => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const isCareerGuidanceView = CAREER_GUIDANCE_VIEWS.has(currentView);
  const [currentUser] = useState({
    name: 'Alex Morgan',
    title: 'Software Engineer',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    verified: true,
    connections: 456,
    profileViews: 89,
    postImpressions: 1234
  });

  const contentWrapperClass = isCareerGuidanceView
    ? "w-full px-0 py-0"
    : "w-full px-9 sm:px-9 lg:px-9 py-6";

  const navigateToCareerGuidance = useCallback(
    (section) => {
      if (CAREER_GUIDANCE_VIEWS.has(section)) {
        setCurrentView(section);
        return;
      }
      router.push(section ? `/kolink/career-guidance?section=${section}` : "/kolink/career-guidance");
    },
    [router, setCurrentView]
  );

  // Close sidebar when view changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [currentView]);

  return (
    <div className="min-h-screen bg-white">
      <Header className="bg-white/80 backdrop-blur-md shadow-sm" />
      
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-orange-50 rounded-lg transition-all duration-200 active:scale-95"
              >
                <motion.div
                  animate={{ rotate: sidebarOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {sidebarOpen ? <X className="w-5 h-5 text-orange-600" /> : <Menu className="w-5 h-5 text-gray-700" />}
                </motion.div>
              </button>
              
              <motion.h1 
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                Kolink
              </motion.h1>
              
              <motion.div 
                className={`hidden md:flex items-center rounded-xl px-4 py-2.5 transition-all duration-300 ${
                  searchFocused 
                    ? 'bg-white shadow-lg ring-2 ring-orange-500 w-96' 
                    : 'bg-gray-100 hover:bg-gray-200 w-80'
                }`}
              >
                <Search className={`w-5 h-5 mr-2 transition-colors ${searchFocused ? 'text-orange-600' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search jobs, people, companies..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
                />
              </motion.div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              <NavIcon icon={<Home className="w-5 h-5" />} label="Home" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
              <NavIcon icon={<Users className="w-5 h-5" />} label="Network" active={currentView === 'network'} onClick={() => setCurrentView('network')} />
              <NavIcon icon={<Briefcase className="w-5 h-5" />} label="Jobs" active={currentView === 'jobs'} onClick={() => setCurrentView('jobs')} />
              <NavIcon icon={<MessageSquare className="w-5 h-5" />} label="Messages" active={currentView === 'messages'} onClick={() => setCurrentView('messages')} />
              <NavIcon icon={<Bell className="w-5 h-5" />} label="Notifications" badge={3} />
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 cursor-pointer hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 rounded-lg p-2 transition-all"
              >
                <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-200" />
                <span className="hidden lg:block text-sm font-medium text-gray-700">Me</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={contentWrapperClass}>
        {isCareerGuidanceView ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {currentView === 'fields' && <CareerFieldsSection />}
              {currentView === 'goals' && <CareerGoalsSection />}
              {currentView === 'assessments' && <SkillAssessmentSection />}
              {currentView === 'paths' && <CareerPathsSection />}
              {currentView === 'mentorship' && <MentorshipSection />}
              {currentView === 'resources' && <ResourcesSection />}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Left Sidebar - Profile */}
            <div className={`lg:col-span-3 ${sidebarOpen ? '' : 'hidden lg:block'}`}>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div 
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white shadow-2xl overflow-y-auto lg:hidden"
                  >
                    <ProfileSidebar
                      user={currentUser}
                      onCareerGuidanceClick={navigateToCareerGuidance}
                      onSelectView={setCurrentView}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="hidden lg:block">
                <ProfileSidebar
                  user={currentUser}
                  onCareerGuidanceClick={navigateToCareerGuidance}
                  onSelectView={setCurrentView}
                />
              </div>
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentView === 'home' && <HomeFeed />}
                  {currentView === 'jobs' && <JobsView />}
                  {currentView === 'network' && <NetworkView />}
                  {currentView === 'messages' && <MessagesView />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block lg:col-span-3"
            >
              <RightSidebar />
            </motion.div>
          </div>
        )}
      </div>
      
      <Footer className="bg-white/80 backdrop-blur-md border-t mt-12" />
    </div>
  );
};

// Navigation Icon Component
const NavIcon = ({ icon, label, active, badge, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className={`flex flex-col items-center cursor-pointer transition-all relative group ${
      active ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'
    }`}
  >
    <div className="relative p-2 rounded-lg transition-colors group-hover:bg-orange-50">
      {icon}
      {badge && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg"
        >
          {badge}
        </motion.span>
      )}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full"
        />
      )}
    </div>
    <span className={`text-xs mt-1 hidden lg:block font-medium ${active ? 'text-orange-600' : 'text-gray-600'}`}>
      {label}
    </span>
  </motion.div>
);

// Profile Sidebar Component
const ProfileSidebar = ({ user, onCareerGuidanceClick, onSelectView, hideGuidanceLinks = false }) => (
  <motion.div 
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    className="space-y-4 p-4 lg:p-0"
  >
    <motion.div 
      variants={fadeInUp}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="h-20 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      <div className="px-4 pb-6">
        <div className="flex flex-col items-center -mt-12">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover shadow-lg ring-4 ring-white"
            />
            {user.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute bottom-0 right-0"
              >
                <CheckCircle className="w-7 h-7 text-orange-500 bg-white rounded-full" />
              </motion.div>
            )}
          </motion.div>
        </div>
        <div className="text-center mt-3">
          <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{user.title}</p>
        </div>

        <motion.div 
          className="mt-5 pt-5 border-t border-gray-100"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex justify-between items-center text-sm mb-3 p-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">
            <span className="text-gray-600 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Profile views
            </span>
            <span className="font-bold text-orange-600">{user.profileViews}</span>
          </div>
          <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer">
            <span className="text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Post impressions
            </span>
            <span className="font-bold text-amber-600">{user.postImpressions}</span>
          </div>
        </motion.div>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-3 font-medium">
            <Users className="w-4 h-4 text-orange-600" />
            <span>{user.connections} connections</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white py-2.5 rounded-xl hover:from-orange-700 hover:to-amber-600 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
          >
            View Profile
          </motion.button>
        </div>
      </div>
    </motion.div>

    {/* Career Guidance Section */}
    <motion.div 
      variants={fadeInUp}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="px-4 py-4 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <h3 className="font-bold text-white relative z-10 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Career Guidance
        </h3>
      </div>
      <div className="px-3 py-3 space-y-1">
        {!hideGuidanceLinks && [
          { icon: Building2, label: 'Career Field', view: 'fields', color: 'orange', iconColor: 'text-orange-600' },
          { icon: Compass, label: 'Career Goals', view: 'goals', color: 'orange', iconColor: 'text-amber-600' },
          { icon: BarChart3, label: 'Skills Assessment', view: 'assessments', color: 'orange', iconColor: 'text-orange-500' },
          { icon: Route, label: 'Career Path', view: 'paths', color: 'orange', iconColor: 'text-amber-500' },
          { icon: UserCheck, label: 'Mentorship', view: 'mentorship', color: 'orange', iconColor: 'text-orange-600' },
          { icon: Library, label: 'Resources', view: 'resources', color: 'orange', iconColor: 'text-amber-600' }
        ].map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.button
              key={item.view}
              onClick={() => onCareerGuidanceClick(item.view)}
              whileHover={{ scale: 1.03, x: 5 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`w-full flex items-center gap-3 py-2.5 px-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 rounded-xl text-left text-sm transition-all group`}
            >
              <IconComponent className={`w-5 h-5 ${item.iconColor} group-hover:scale-110 transition-transform`} />
              <span className="font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  </motion.div>
);

// Home Feed Component
const HomeFeed = () => {
  const [postContent, setPostContent] = useState('');

  return (
    <motion.div 
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {/* Create Post */}
      <motion.div 
        variants={fadeInUp}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5"
      >
        <div className="flex gap-3">
          <motion.span 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="text-3xl cursor-pointer"
          >
            👤
          </motion.span>
          <input
            type="text"
            placeholder="Share your thoughts..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
          {[
            { icon: Camera, label: 'Photo', color: 'orange' },
            { icon: Award, label: 'Achievement', color: 'yellow' },
            { icon: BookOpen, label: 'Article', color: 'green' }
          ].map((item, index) => (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 px-4 py-2 rounded-xl transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:text-orange-600 transition-colors" />
              <span className="text-sm font-medium hidden sm:block">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* AI Suggestions */}
      <motion.div 
        variants={fadeInUp}
        className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-orange-200/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"></div>
        <div className="relative flex items-start gap-4">
          <motion.div 
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="bg-gradient-to-br from-orange-600 to-amber-500 rounded-2xl p-3 shadow-lg"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-bold text-orange-900 flex items-center gap-2">
              Kolink AI Suggestions
              <Zap className="w-4 h-4 text-yellow-500" />
            </h3>
            <p className="text-sm text-gray-700 mt-2">Your profile strength is <span className="font-bold text-orange-600">85%</span>. Add certifications to reach 100%!</p>
            <motion.button 
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="mt-3 text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1 group"
            >
              Enhance Profile 
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Posts */}
      {mockPosts.map((post, index) => (
        <motion.div
          key={post.id}
          variants={fadeInUp}
          transition={{ delay: index * 0.1 }}
        >
          <Post post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
};

// Post Component
const Post = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            src={post.avatar}
            alt={post.author}
            className="w-12 h-12 rounded-full object-cover cursor-pointer ring-2 ring-orange-100"
          />
          <div>
            <h4 className="font-bold text-gray-900 hover:text-orange-600 cursor-pointer transition-colors">
              {post.author}
            </h4>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.time}
            </p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
        >
          •••
        </motion.button>
      </div>

      <p className="mt-4 text-gray-700 leading-relaxed">{post.content}</p>

      <div className="flex items-center gap-6 mt-5 pt-5 border-t border-gray-100">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLike}
          className={`flex items-center gap-2 transition-all ${
            liked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <motion.div
            animate={liked ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-blue-600' : ''}`} />
          </motion.div>
          <span className="font-semibold text-sm">{likeCount}</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold text-sm">{post.comments}</span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-semibold text-sm">{post.shares}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Jobs View Component
const JobsView = () => (
  <motion.div 
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    className="space-y-4"
  >
    <motion.div 
      variants={fadeInUp}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          Job Recommendations
        </h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 px-4 py-2 rounded-xl font-medium transition-all"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filters</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        {mockJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <JobCard job={job} />
          </motion.div>
        ))}
      </div>
    </motion.div>

    <motion.div 
      variants={fadeInUp}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-purple-600" />
        Freelance Projects
      </h3>
      <div className="space-y-4">
        {mockFreelanceProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FreelanceCard project={project} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

// Job Card Component
const JobCard = ({ job }) => {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div 
      whileHover={{ scale: 1.01, x: 5 }}
      className="border-b last:border-b-0 py-5 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 cursor-pointer transition-colors">
            {job.title}
          </h3>
          <p className="text-gray-600 text-sm mt-1 font-medium">{job.company}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSaved(!saved)}
          className={`p-2 rounded-lg transition-all ${
            saved ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-500'
          }`}
        >
          <Star className={`w-5 h-5 ${saved ? 'fill-yellow-500' : ''}`} />
        </motion.button>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-3">
        {[
          { icon: MapPin, text: job.location, color: 'text-blue-600' },
          { icon: Clock, text: job.type, color: 'text-green-600' },
          { icon: DollarSign, text: job.salary, color: 'text-purple-600' }
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
            <item.icon className={`w-4 h-4 ${item.color}`} />
            <span className="text-sm text-gray-700 font-medium">{item.text}</span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-500 flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          {job.applicants} applicants • {job.posted}
        </span>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
        >
          Apply Now
        </motion.button>
      </div>
    </motion.div>
  );
};

// Freelance Card Component
const FreelanceCard = ({ project }) => (
  <motion.div 
    whileHover={{ scale: 1.01, x: 5 }}
    className="border-b last:border-b-0 py-5 px-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50/50 hover:to-blue-50/50 transition-all"
  >
    <h4 className="font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
      {project.title}
    </h4>
    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
      <Users className="w-3.5 h-3.5" />
      Client: <span className="font-medium">{project.client}</span>
    </p>
    
    <div className="flex flex-wrap gap-3 mt-3">
      <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg">
        <DollarSign className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-700 font-bold">{project.budget}</span>
      </div>
      <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-lg">
        <Clock className="w-4 h-4 text-orange-600" />
        <span className="text-sm text-orange-700 font-medium">{project.duration}</span>
      </div>
    </div>
    
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs text-gray-500">{project.proposals} proposals • {project.posted}</span>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="border-2 border-orange-600 text-orange-600 px-5 py-2 rounded-xl hover:bg-orange-600 hover:text-white text-sm font-semibold transition-all"
      >
        Submit Proposal
      </motion.button>
    </div>
  </motion.div>
);

// Network View Component
const NetworkView = () => (
  <motion.div 
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    className="space-y-4"
  >
    <motion.div 
      variants={fadeInUp}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-600" />
        People You May Know
      </h2>
      <div className="space-y-4">
        {mockUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <UserCard user={user} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

// User Card Component
const UserCard = ({ user }) => {
  const [connected, setConnected] = useState(false);

  return (
    <motion.div 
      whileHover={{ scale: 1.01, x: 5 }}
      className="flex items-start gap-4 border-b last:border-b-0 pb-5 px-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-amber-50/50 transition-all"
    >
      <motion.img 
        whileHover={{ scale: 1.1 }}
        src={user.avatar}
        alt={user.name}
        className="w-16 h-16 rounded-full object-cover cursor-pointer ring-2 ring-orange-100"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-gray-900 hover:text-orange-600 cursor-pointer transition-colors">
            {user.name}
          </h4>
          {user.verified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
            >
              <CheckCircle className="w-5 h-5 text-orange-500" />
            </motion.div>
          )}
        </div>
        <p className="text-sm text-gray-700 font-medium mt-1">{user.title}</p>
        <p className="text-sm text-gray-600">{user.company}</p>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {user.connections} connections
        </p>
      </div>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setConnected(!connected)}
        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
          connected
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
        }`}
      >
        {connected ? 'Connected' : 'Connect'}
      </motion.button>
    </motion.div>
  );
};

// Messages View Component
const MessagesView = () => {
  const [messages] = useState([
    { id: 1, sender: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', preview: 'Thanks for connecting! Would love to discuss...', time: '2h ago', unread: true },
    { id: 2, sender: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', preview: 'Hey! I saw your profile and thought...', time: '5h ago', unread: false }
  ]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden h-[600px] flex flex-col sm:flex-row"
    >
      {/* Messages List */}
      <div className="w-full sm:w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center bg-white rounded-xl px-4 py-2.5 shadow-sm">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search messages" 
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500" 
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {messages.map((msg, index) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              onClick={() => setSelectedMessage(msg)}
              className={`p-4 border-b cursor-pointer transition-all ${
                msg.unread 
                  ? 'bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100' 
                  : 'hover:bg-gray-50'
              } ${selectedMessage?.id === msg.id ? 'bg-orange-100' : ''}`}
            >
              <div className="flex gap-3">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm truncate text-gray-900">{msg.sender}</h4>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className={`text-sm truncate ${msg.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {msg.preview}
                  </p>
                  {msg.unread && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-orange-600 rounded-full mt-1"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-3">
            <motion.img 
              whileHover={{ scale: 1.1 }}
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Sarah Johnson"
              className="w-12 h-12 rounded-full object-cover cursor-pointer ring-2 ring-orange-100"
            />
            <div>
              <h3 className="font-bold text-gray-900">Sarah Johnson</h3>
              <p className="text-xs text-gray-600">Active now</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="inline-block bg-white rounded-2xl shadow-md px-6 py-4"
            >
              <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Select a conversation to view messages</p>
            </motion.div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm" 
            />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Right Sidebar Component
const RightSidebar = () => (
  <motion.div 
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    className="space-y-4"
  >
    {/* AI Tools */}
    <motion.div 
      variants={fadeInUp}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-2xl"></div>
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10">
        <Sparkles className="w-5 h-5 text-orange-600" />
        Kolink AI Tools
      </h3>
      <div className="space-y-2 relative z-10">
        {[
          { icon: FileText, label: 'Resume Builder', iconColor: 'text-orange-600' },
          { icon: Wand2, label: 'Profile Enhancer', iconColor: 'text-amber-600' },
          { icon: Crosshair, label: 'Job Matcher', iconColor: 'text-orange-500' },
          { icon: Mic, label: 'Interview Prep', iconColor: 'text-amber-500' }
        ].map((tool, index) => (
          <motion.div
            key={tool.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AIToolButton icon={tool.icon} label={tool.label} iconColor={tool.iconColor} />
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Trending */}
    <motion.div 
      variants={fadeInUp}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Trending Now
        </h3>
        <motion.div whileHover={{ x: 3 }}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      </div>
      <div className="space-y-2">
        {[
          { tag: '#RemoteWork', posts: '1.2K posts', color: 'blue' },
          { tag: '#AIJobs', posts: '890 posts', color: 'purple' },
          { tag: '#CareerGrowth', posts: '2.3K posts', color: 'green' }
        ].map((item, index) => (
          <motion.div
            key={item.tag}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TrendingItem tag={item.tag} posts={item.posts} />
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Learning Paths */}
    <motion.div 
      variants={fadeInUp}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5"
    >
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-orange-600" />
        Learning Paths
      </h3>
      <div className="space-y-3">
        {[
          { title: 'AI & Machine Learning', progress: 60, color: 'blue' },
          { title: 'Full Stack Development', progress: 30, color: 'purple' }
        ].map((course, index) => (
          <motion.div
            key={course.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CourseItem title={course.title} progress={course.progress} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

// AI Tool Button Component
const AIToolButton = ({ icon: IconComponent, label, iconColor }) => (
  <motion.button 
    whileHover={{ scale: 1.03, x: 5 }}
    whileTap={{ scale: 0.98 }}
    className="w-full flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 rounded-xl text-left transition-all group"
  >
    <IconComponent className={`w-5 h-5 ${iconColor} group-hover:scale-110 transition-transform`} />
    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{label}</span>
    <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
  </motion.button>
);

// Trending Item Component
const TrendingItem = ({ tag, posts }) => (
  <motion.div 
    whileHover={{ scale: 1.02, x: 5 }}
    className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 p-3 rounded-xl transition-all"
  >
    <p className="font-bold text-sm text-blue-600">{tag}</p>
    <p className="text-xs text-gray-500 mt-0.5">{posts}</p>
  </motion.div>
);

// Course Item Component
const CourseItem = ({ title, progress }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="p-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 rounded-xl cursor-pointer transition-all"
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-bold text-gray-900">{title}</p>
      <span className="text-xs font-semibold text-blue-600">{progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
      />
    </div>
  </motion.div>
);

export default KolinkApp;