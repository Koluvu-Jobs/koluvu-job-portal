// src/app/main/dashboard/training/TrainingDashboard.js

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";
import InstituteSetupModal from "@koluvu/components/training/InstituteSetupModal";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.6, -0.05, 0.01, 0.99],
        },
    },
};

// Category colors mapping
const categoryColors = {
    "Information Technology (IT) & Software": "bg-blue-50 border-blue-100 text-blue-700",
    "Retail & E-Commerce": "bg-purple-50 border-purple-100 text-purple-700",
    "Agriculture, Farming & Forestry": "bg-green-50 border-green-100 text-green-700",
    "PRCG (Fast-Homey Common Goods)": "bg-yellow-50 border-yellow-100 text-yellow-700",
    "Environmental Services & Sustainability": "bg-teal-50 border-teal-100 text-teal-700",
    "Healthcare & Pharmaceuticals": "bg-red-50 border-red-100 text-red-700",
    "Construction & Real Estate": "bg-indigo-50 border-indigo-100 text-indigo-700",
    "Media, Relations & Entertainment": "bg-pink-50 border-pink-100 text-pink-700",
    "Tools & A-payers": "bg-gray-50 border-gray-100 text-gray-700",
    "Real Estate Investment ": "bg-orange-50 border-orange-100 text-orange-700",
    "Finance, Banking & Insurance": "bg-cyan-50 border-cyan-100 text-cyan-700",
    "Telecommunication & Networking": "bg-violet-50 border-violet-100 text-violet-700",
    "Aerospects, Aviation & Defense": "bg-fuchsia-50 border-fuchsia-100 text-fuchsia-700",
    "Home & Metals": "bg-amber-50 border-amber-100 text-amber-700",
    "Consumer Durable": "bg-lime-50 border-lime-100 text-lime-700",
    "Service Law": "bg-rose-50 border-rose-100 text-rose-700",
    "Marketing, Advertising & PX": "bg-sky-50 border-sky-100 text-sky-700",
    "Haggadfly, Travel & Tourism": "bg-emerald-50 border-emerald-100 text-emerald-700",
    "Legal, Law & Compliance": "bg-blue-50 border-blue-100 text-blue-700",
    "Consulting & Advisory Services": "bg-purple-50 border-purple-100 text-purple-700",
    "NGOs & Social Enterprises": "bg-green-50 border-green-100 text-green-700",
    "Education & Training": "bg-yellow-50 border-yellow-100 text-yellow-700",
    "Automobile & Auto Components": "bg-teal-50 border-teal-100 text-teal-700",
    "Government & Public Sector": "bg-red-50 border-red-100 text-red-700",
    "Electronics & Semiconductors": "bg-indigo-50 border-indigo-100 text-indigo-700",
    "Education Technology (ETGs)": "bg-pink-50 border-pink-100 text-pink-700",
    "Manufacturing & Production": "bg-gray-50 border-gray-100 text-gray-700",
    "Energy, QG, Gas & Utilities": "bg-orange-50 border-orange-100 text-orange-700",
    "Transportation & Logistics": "bg-cyan-50 border-cyan-100 text-cyan-700",
    "Chemicals & Petrochemicals": "bg-violet-50 border-violet-100 text-violet-700",
    "Financial Technology (mTabs)": "bg-fuchsia-50 border-fuchsia-100 text-fuchsia-700",
};

// Icons for categories
const categoryIcons = {
    "Information Technology (IT) & Software": "💻",
    "Retail & E-Commerce": "🛒",
    "Agriculture, Farming & Forestry": "🌾",
    "PRCG (Fast-Homey Common Goods)": "🏷️",
    "Environmental Services & Sustainability": "🌱",
    "Healthcare & Pharmaceuticals": "🏥",
    "Construction & Real Estate": "🏗️",
    "Media, Relations & Entertainment": "🎬",
    "Tools & A-payers": "🛠️",
    "Real Estate Investment ": "🏘️",
    "Finance, Banking & Insurance": "💰",
    "Telecommunication & Networking": "📡",
    "Aerospects, Aviation & Defense": "✈️",
    "Home & Metals": "🏠",
    "Consumer Durable": "🛋️",
    "Service Law": "⚖️",
    "Marketing, Advertising & PX": "📢",
    "Haggadfly, Travel & Tourism": "✈️",
    "Legal, Law & Compliance": "📜",
    "Consulting & Advisory Services": "💼",
    "NGOs & Social Enterprises": "🤝",
    "Education & Training": "🎓",
    "Automobile & Auto Components": "🚗",
    "Government & Public Sector": "🏛️",
    "Electronics & Semiconductors": "🔌",
    "Education Technology (ETGs)": "📱",
    "Manufacturing & Production": "🏭",
    "Energy, QG, Gas & Utilities": "⚡",
    "Transportation & Logistics": "🚚",
    "Chemicals & Petrochemicals": "🧪",
    "Financial Technology (mTabs)": "💳",
};

const allCategories = [{
        title: "Software Training Programs",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "Full Stack Development",
                provider: "ABC Software Academy",
                specialization: "Full Stack Development",
                courses: ["ReactJS", "NodeJS", "MongoDB", "Express"],
                type: "Online & Offline",
                duration: "3 Months",
                benefits: ["Placement Support", "Certification", "Live Projects"],
                rating: 4.5,
                reviews: 42,
                price: "₹15,000",
            },
            {
                name: "Python Programming",
                provider: "Python Institute",
                specialization: "Data Science & Backend",
                courses: ["Python Basics", "Django", "Flask", "Data Analysis"],
                type: "Online",
                duration: "2 Months",
                benefits: ["Certification", "Project Work", "Interview Preparation"],
                rating: 4.2,
                reviews: 35,
                price: "₹12,500",
            },
            {
                name: "Java Development",
                provider: "Java Masters",
                specialization: "Enterprise Development",
                courses: ["Core Java", "Spring Boot", "Hibernate", "Microservices"],
                type: "Offline",
                duration: "4 Months",
                benefits: ["Placement Support", "Internship", "Mock Interviews"],
                rating: 4.3,
                reviews: 28,
                price: "₹18,000",
            },
        ],
    },
    {
        title: "ITeS and Emerging Technologies",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "IT Service Management",
                provider: "ITSM Academy",
                specialization: "ITIL Framework",
                courses: [
                    "ITIL Foundation",
                    "Service Strategy",
                    "Continual Service Improvement",
                ],
                type: "Online",
                duration: "2 Months",
                benefits: ["Certification", "Case Studies", "Exam Prep"],
                rating: 4.3,
                reviews: 27,
                price: "₹14,000",
            },
            {
                name: "IoT Fundamentals",
                provider: "Tech Futures Institute",
                specialization: "Internet of Things",
                courses: ["Embedded Systems", "Sensor Networks", "Cloud Integration"],
                type: "Hybrid",
                duration: "3 Months",
                benefits: ["Hands-on Kits", "Industry Projects", "Certification"],
                rating: 4.5,
                reviews: 31,
                price: "₹19,000",
            },
        ],
    },
    {
        title: "Hardware & Networking",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "CCNA Certification",
                provider: "Cisco Networking Academy",
                specialization: "Network Engineering",
                courses: [
                    "Routing & Switching",
                    "Network Security",
                    "Wireless Networks",
                ],
                type: "Offline",
                duration: "4 Months",
                benefits: ["Cisco Certification", "Lab Access", "Exam Voucher"],
                rating: 4.7,
                reviews: 45,
                price: "₹22,000",
            },
            {
                name: "Computer Hardware Engineering",
                provider: "Hardware Experts",
                specialization: "PC Assembly & Maintenance",
                courses: [
                    "Motherboard Architecture",
                    "Troubleshooting",
                    "Peripheral Devices",
                ],
                type: "Offline",
                duration: "3 Months",
                benefits: ["Practical Training", "Certification", "Tool Kit"],
                rating: 4.2,
                reviews: 23,
                price: "₹15,000",
            },
        ],
    },
    {
        title: "Banking & Financial Services",
        category: "Finance, Banking & Insurance",
        items: [{
                name: "Certified Financial Planner",
                provider: "Financial Education Academy",
                specialization: "Wealth Management",
                courses: [
                    "Investment Planning",
                    "Tax Strategies",
                    "Retirement Planning",
                ],
                type: "Hybrid",
                duration: "5 Months",
                benefits: ["CFP Certification", "Case Studies", "Mock Exams"],
                rating: 4.6,
                reviews: 38,
                price: "₹25,000",
            },
            {
                name: "Banking Operations",
                provider: "Banking Professionals Institute",
                specialization: "Core Banking",
                courses: ["Loan Processing", "KYC/AML", "Payment Systems"],
                type: "Online",
                duration: "2 Months",
                benefits: [
                    "Placement Assistance",
                    "Industry Insights",
                    "Certification",
                ],
                rating: 4.1,
                reviews: 19,
                price: "₹12,000",
            },
        ],
    },
    {
        title: "Digital Marketing & Online Branding",
        category: "Marketing, Advertising & PX",
        items: [{
                name: "Digital Marketing Masterclass",
                provider: "Digital Marketing Institute",
                specialization: "Online Marketing",
                courses: [
                    "SEO",
                    "Social Media",
                    "Content Marketing",
                    "Email Marketing",
                ],
                type: "Online",
                duration: "3 Months",
                benefits: ["Certification", "Live Projects", "Tools Access"],
                rating: 4.4,
                reviews: 52,
                price: "₹18,000",
            },
            {
                name: "Personal Branding",
                provider: "Branding Experts",
                specialization: "Online Presence",
                courses: [
                    "LinkedIn Optimization",
                    "Content Creation",
                    "Thought Leadership",
                ],
                type: "Hybrid",
                duration: "1 Month",
                benefits: ["1-on-1 Coaching", "Profile Makeover", "Content Strategy"],
                rating: 4.7,
                reviews: 34,
                price: "₹15,000",
            },
        ],
    },
    {
        title: "Finance and Accounting",
        category: "Finance, Banking & Insurance",
        items: [{
                name: "Chartered Accountancy Prep",
                provider: "CA Training Institute",
                specialization: "Accounting Standards",
                courses: ["Financial Reporting", "Auditing", "Taxation"],
                type: "Offline",
                duration: "12 Months",
                benefits: ["CA Mentorship", "Mock Tests", "Study Material"],
                rating: 4.8,
                reviews: 67,
                price: "₹35,000",
            },
            {
                name: "QuickBooks Certification",
                provider: "Accounting Professionals",
                specialization: "Bookkeeping",
                courses: [
                    "QuickBooks Online",
                    "Payroll Processing",
                    "Financial Statements",
                ],
                type: "Online",
                duration: "2 Months",
                benefits: ["Software License", "Certification", "Practical Exercises"],
                rating: 4.5,
                reviews: 41,
                price: "₹14,500",
            },
        ],
    },
    {
        title: "HR and SAP",
        category: "Consulting & Advisory Services",
        items: [{
                name: "SAP HR Certification",
                provider: "SAP Training Academy",
                specialization: "Human Capital Management",
                courses: ["Organizational Management", "Payroll", "Time Management"],
                type: "Hybrid",
                duration: "4 Months",
                benefits: ["SAP Access", "Certification", "Case Studies"],
                rating: 4.6,
                reviews: 39,
                price: "₹28,000",
            },
            {
                name: "HR Analytics",
                provider: "HR Professionals Network",
                specialization: "People Analytics",
                courses: [
                    "Workforce Planning",
                    "Attrition Analysis",
                    "Performance Metrics",
                ],
                type: "Online",
                duration: "2 Months",
                benefits: ["Certification", "Dashboard Templates", "Case Studies"],
                rating: 4.3,
                reviews: 27,
                price: "₹16,000",
            },
        ],
    },
    {
        title: "Govt Institutes",
        category: "Government & Public Sector",
        items: [{
                name: "Public Administration",
                provider: "National Institute of Governance",
                specialization: "Government Operations",
                courses: ["Policy Making", "Public Finance", "Administrative Law"],
                type: "Offline",
                duration: "6 Months",
                benefits: ["Government Certification", "Internship", "Study Material"],
                rating: 4.4,
                reviews: 32,
                price: "₹12,000",
            },
            {
                name: "Urban Planning",
                provider: "Center for Urban Development",
                specialization: "City Planning",
                courses: ["GIS Applications", "Transport Planning", "Housing Policies"],
                type: "Hybrid",
                duration: "4 Months",
                benefits: ["Field Visits", "Certification", "Project Work"],
                rating: 4.2,
                reviews: 18,
                price: "₹15,000",
            },
        ],
    },
    {
        title: "NGOs",
        category: "NGOs & Social Enterprises",
        items: [{
                name: "Non-profit Management",
                provider: "Social Impact Institute",
                specialization: "NGO Operations",
                courses: ["Fundraising", "Grant Writing", "Program Evaluation"],
                type: "Online",
                duration: "3 Months",
                benefits: ["Certification", "Networking", "Resource Toolkit"],
                rating: 4.5,
                reviews: 24,
                price: "₹10,000",
            },
            {
                name: "Social Entrepreneurship",
                provider: "Change Makers Academy",
                specialization: "Sustainable Development",
                courses: ["Impact Measurement", "CSR", "Community Engagement"],
                type: "Hybrid",
                duration: "2 Months",
                benefits: ["Mentorship", "Pitch Training", "Certification"],
                rating: 4.7,
                reviews: 29,
                price: "₹12,500",
            },
        ],
    },
    {
        title: "Healthcare",
        category: "Healthcare & Pharmaceuticals",
        items: [{
                name: "Medical Coding",
                provider: "Healthcare Professionals Academy",
                specialization: "ICD Coding",
                courses: ["Anatomy Basics", "CPT Coding", "Insurance Claims"],
                type: "Online",
                duration: "4 Months",
                benefits: ["Certification", "Placement Support", "Practice Software"],
                rating: 4.6,
                reviews: 47,
                price: "₹20,000",
            },
            {
                name: "Hospital Management",
                provider: "Healthcare Management Institute",
                specialization: "Healthcare Administration",
                courses: ["Patient Care", "Medical Records", "Facility Operations"],
                type: "Hybrid",
                duration: "3 Months",
                benefits: ["Internship", "Certification", "Industry Visits"],
                rating: 4.3,
                reviews: 31,
                price: "₹18,000",
            },
        ],
    },
    {
        title: "Cloud Computing & DevOps",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "AWS Certification",
                provider: "Amazon Web Services",
                specialization: "Cloud Architecture",
                courses: ["EC2", "S3", "Lambda", "RDS", "CloudFormation"],
                type: "Online",
                duration: "3 Months",
                benefits: ["AWS Credits", "Official Certification", "Hands-on Labs"],
                rating: 4.8,
                reviews: 62,
                price: "₹18,000",
            },
            {
                name: "DevOps Engineering",
                provider: "Linux Foundation",
                specialization: "CI/CD Pipelines",
                courses: ["Docker", "Kubernetes", "Jenkins", "Terraform", "Ansible"],
                type: "Offline",
                duration: "4 Months",
                benefits: ["Real-world Projects", "Certification", "Interview Prepration"],
                rating: 4.9,
                reviews: 51,
                price: "₹24,000",
            },
        ],
    },
    {
        title: "Cybersecurity & Ethical Hacking",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "Ethical Hacking",
                provider: "Security Experts",
                specialization: "Penetration Testing",
                courses: ["Kali Linux", "Metasploit", "Burp Suite", "OWASP"],
                type: "Hybrid",
                duration: "5 Months",
                benefits: ["CTF Challenges", "Certification", "Bug Bounty Guidance"],
                rating: 4.8,
                reviews: 45,
                price: "₹28,000",
            },
            {
                name: "Certified Information Security",
                provider: "CISSP Academy",
                specialization: "Security Management",
                courses: ["Risk Management", "Security Architecture", "Cryptography"],
                type: "Online",
                duration: "6 Months",
                benefits: ["Exam Prep", "Practice Tests", "Study Materials"],
                rating: 4.7,
                reviews: 36,
                price: "₹32,000",
            },
        ],
    },
    {
        title: "Web & Mobile App Development",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "React Native",
                provider: "Mobile Masters",
                specialization: "Cross-platform Development",
                courses: ["React Native", "Redux", "Firebase", "App Deployment"],
                type: "Online",
                duration: "2 Months",
                benefits: ["App Publishing", "Certification", "UI/UX Basics"],
                rating: 4.4,
                reviews: 38,
                price: "₹14,000",
            },
            {
                name: "Flutter Development",
                provider: "Google Developers",
                specialization: "Mobile Development",
                courses: ["Dart", "Flutter", "Firebase", "State Management"],
                type: "Hybrid",
                duration: "3 Months",
                benefits: [
                    "Google Certification",
                    "Project Support",
                    "Play Store Deployment",
                ],
                rating: 4.6,
                reviews: 47,
                price: "₹17,000",
            },
        ],
    },
    {
        title: "Data Science & Machine Learning",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "Data Science Bootcamp",
                provider: "Data Wizards",
                specialization: "Data Analysis & Visualization",
                courses: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
                type: "Online",
                duration: "4 Months",
                benefits: ["Certification", "Kaggle Projects", "Job Assistance"],
                rating: 4.7,
                reviews: 53,
                price: "₹22,000",
            },
            {
                name: "Machine Learning",
                provider: "AI Institute",
                specialization: "Predictive Modeling",
                courses: ["Scikit-learn", "TensorFlow", "NLP", "Computer Vision"],
                type: "Hybrid",
                duration: "5 Months",
                benefits: ["Research Papers", "Model Deployment", "Mentorship"],
                rating: 4.9,
                reviews: 48,
                price: "₹28,000",
            },
        ],
    },
    {
        title: "Artificial Intelligence & Deep Learning",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "Deep Learning",
                provider: "Neural Networks Academy",
                specialization: "Neural Networks",
                courses: ["PyTorch", "Keras", "GANs", "Reinforcement Learning"],
                type: "Online",
                duration: "3 Months",
                benefits: ["GPU Access", "Research Guidance", "Competition Prep"],
                rating: 4.8,
                reviews: 37,
                price: "₹25,000",
            },
            {
                name: "AI for Business",
                provider: "AI Business Solutions",
                specialization: "Enterprise AI",
                courses: ["Chatbots", "Predictive Analytics", "Process Automation"],
                type: "Hybrid",
                duration: "2 Months",
                benefits: ["Case Studies", "Implementation Guide", "Certification"],
                rating: 4.5,
                reviews: 29,
                price: "₹20,000",
            },
        ],
    },
    {
        title: "UI/UX Design",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "UX Design Bootcamp",
                provider: "Design Masters",
                specialization: "User Experience",
                courses: [
                    "User Research",
                    "Wireframing",
                    "Prototyping",
                    "Usability Testing",
                ],
                type: "Online",
                duration: "3 Months",
                benefits: ["Portfolio Review", "Design Toolkit", "Career Coaching"],
                rating: 4.5,
                reviews: 41,
                price: "₹16,000",
            },
            {
                name: "UI Design Specialization",
                provider: "Creative Arts Institute",
                specialization: "User Interface",
                courses: ["Figma", "Adobe XD", "Color Theory", "Design Systems"],
                type: "Hybrid",
                duration: "2 Months",
                benefits: ["Design Assets", "Certification", "Freelance Guidance"],
                rating: 4.4,
                reviews: 33,
                price: "₹14,500",
            },
        ],
    },
    {
        title: "Blockchain Technology",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "Blockchain Developer",
                provider: "Crypto Academy",
                specialization: "Smart Contracts",
                courses: ["Solidity", "Ethereum", "Hyperledger", "DApp Development"],
                type: "Online",
                duration: "4 Months",
                benefits: ["Certification", "Project Portfolio", "Crypto Wallet"],
                rating: 4.7,
                reviews: 39,
                price: "₹26,000",
            },
            {
                name: "NFT Fundamentals",
                provider: "Web3 Institute",
                specialization: "Digital Assets",
                courses: [
                    "NFT Minting",
                    "Marketplaces",
                    "Smart Contracts",
                    "IP Rights",
                ],
                type: "Hybrid",
                duration: "2 Months",
                benefits: ["Hands-on Projects", "Certification", "Community Access"],
                rating: 4.6,
                reviews: 28,
                price: "₹18,000",
            },
        ],
    },
    {
        title: "AR/VR & Game Development",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "Unity Game Development",
                provider: "Game Dev Academy",
                specialization: "3D Game Design",
                courses: ["C# Programming", "Unity Engine", "Physics", "Animation"],
                type: "Online",
                duration: "3 Months",
                benefits: ["Game Portfolio", "Asset Packages", "Publishing Guide"],
                rating: 4.8,
                reviews: 43,
                price: "₹20,000",
            },
            {
                name: "AR/VR Development",
                provider: "Extended Reality Institute",
                specialization: "Immersive Technologies",
                courses: [
                    "Unreal Engine",
                    "3D Modeling",
                    "Spatial Computing",
                    "UX for XR",
                ],
                type: "Hybrid",
                duration: "4 Months",
                benefits: ["Hardware Access", "Certification", "Demo Projects"],
                rating: 4.5,
                reviews: 31,
                price: "₹24,000",
            },
        ],
    },
    {
        title: "Project Management (PMP, Agile, PRINCE2)",
        category: "Consulting & Advisory Services",
        items: [{
                name: "PMP Certification",
                provider: "Project Management Institute",
                specialization: "Project Management",
                courses: [
                    "Scope Management",
                    "Risk Management",
                    "Stakeholder Management",
                ],
                type: "Online",
                duration: "3 Months",
                benefits: ["Exam Prep", "Practice Tests", "PDUs"],
                rating: 4.7,
                reviews: 58,
                price: "₹25,000",
            },
            {
                name: "Agile Scrum Master",
                provider: "Agile Alliance",
                specialization: "Agile Methodologies",
                courses: ["Scrum Framework", "User Stories", "Sprint Planning"],
                type: "Hybrid",
                duration: "2 Months",
                benefits: ["Certification", "Case Studies", "Simulations"],
                rating: 4.6,
                reviews: 42,
                price: "₹18,000",
            },
        ],
    },
    {
        title: "Business Analytics & Intelligence",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "Tableau Certification",
                provider: "Data Visualization Institute",
                specialization: "Business Intelligence",
                courses: [
                    "Data Visualization",
                    "Dashboard Design",
                    "Advanced Analytics",
                ],
                type: "Online",
                duration: "2 Months",
                benefits: ["Tableau License", "Certification", "Portfolio Projects"],
                rating: 4.5,
                reviews: 37,
                price: "₹16,000",
            },
            {
                name: "Power BI Mastery",
                provider: "Microsoft Learn",
                specialization: "Data Analytics",
                courses: ["DAX Formulas", "Data Modeling", "Report Publishing"],
                type: "Hybrid",
                duration: "1 Month",
                benefits: ["Microsoft Certification", "Dataset Access", "Templates"],
                rating: 4.4,
                reviews: 29,
                price: "₹14,000",
            },
        ],
    },
    {
        title: "Entrepreneurship & Startups",
        category: "Consulting & Advisory Services",
        items: [{
                name: "Startup Bootcamp",
                provider: "Entrepreneurship Network",
                specialization: "New Ventures",
                courses: ["Business Planning", "Funding Strategies", "Growth Hacking"],
                type: "Hybrid",
                duration: "3 Months",
                benefits: ["Mentorship", "Pitch Training", "Investor Access"],
                rating: 4.7,
                reviews: 45,
                price: "₹20,000",
            },
            {
                name: "E-commerce Mastery",
                provider: "Digital Commerce Institute",
                specialization: "Online Business",
                courses: ["Shopify", "Amazon FBA", "Dropshipping", "Digital Marketing"],
                type: "Online",
                duration: "2 Months",
                benefits: ["Store Setup", "Supplier Contacts", "Marketing Templates"],
                rating: 4.3,
                reviews: 33,
                price: "₹15,000",
            },
        ],
    },
    {
        title: "Business Communication & Soft Skills",
        category: "Education & Training",
        items: [{
                name: "Executive Communication",
                provider: "Leadership Academy",
                specialization: "Professional Communication",
                courses: ["Business Writing", "Presentation Skills", "Negotiation"],
                type: "Offline",
                duration: "1 Month",
                benefits: ["Video Feedback", "Personalized Coaching", "Certification"],
                rating: 4.6,
                reviews: 41,
                price: "₹12,000",
            },
            {
                name: "Emotional Intelligence",
                provider: "Soft Skills Institute",
                specialization: "People Skills",
                courses: [
                    "Self-awareness",
                    "Relationship Management",
                    "Conflict Resolution",
                ],
                type: "Hybrid",
                duration: "6 Weeks",
                benefits: ["Assessment Tools", "Workbook", "Certification"],
                rating: 4.5,
                reviews: 36,
                price: "₹10,000",
            },
        ],
    },
    {
        title: "Legal & Compliance Training",
        category: "Legal, Law & Compliance",
        items: [{
                name: "Corporate Law Essentials",
                provider: "Legal Professionals Academy",
                specialization: "Business Law",
                courses: ["Contracts", "Intellectual Property", "Corporate Governance"],
                type: "Online",
                duration: "2 Months",
                benefits: ["Case Studies", "Document Templates", "Certification"],
                rating: 4.4,
                reviews: 28,
                price: "₹15,000",
            },
            {
                name: "GDPR Compliance",
                provider: "Data Protection Institute",
                specialization: "Privacy Regulations",
                courses: ["Data Mapping", "Consent Management", "Breach Notification"],
                type: "Hybrid",
                duration: "1 Month",
                benefits: ["Compliance Checklist", "Certification", "Policy Templates"],
                rating: 4.6,
                reviews: 32,
                price: "₹18,000",
            },
        ],
    },
    {
        title: "Sales & CRM Tools (Salesforce, Zoho)",
        category: "Information Technology (IT) & Software",
        items: [{
                name: "Salesforce Administrator",
                provider: "CRM Experts",
                specialization: "Salesforce Platform",
                courses: ["Data Management", "Automation", "Reports & Dashboards"],
                type: "Online",
                duration: "3 Months",
                benefits: ["Salesforce Access", "Certification Prep", "Hands-on Labs"],
                rating: 4.7,
                reviews: 47,
                price: "₹22,000",
            },
            {
                name: "Zoho CRM Mastery",
                provider: "Zoho Certified Partners",
                specialization: "Zoho Platform",
                courses: ["Lead Management", "Workflow Automation", "Analytics"],
                type: "Hybrid",
                duration: "2 Months",
                benefits: ["Zoho License", "Certification", "Implementation Guide"],
                rating: 4.3,
                reviews: 29,
                price: "₹16,000",
            },
        ],
    },
    {
        title: "Search Engine Optimization (SEO)",
        category: "Marketing, Advertising & PX",
        items: [{
                name: "SEO Mastery",
                provider: "Search Engine Experts",
                specialization: "Search Optimization",
                courses: [
                    "Keyword Research",
                    "On-Page SEO",
                    "Technical SEO",
                    "Analytics",
                ],
                type: "Online",
                duration: "2 Months",
                benefits: ["Certification", "Tools Access", "Case Studies"],
                rating: 4.3,
                reviews: 38,
                price: "₹12,000",
            },
            {
                name: "Local SEO",
                provider: "Digital Marketing Pros",
                specialization: "Local Search",
                courses: ["Google My Business", "Citations", "Local Link Building"],
                type: "Hybrid",
                duration: "1 Month",
                benefits: ["Local Audit", "Certification", "Implementation Plan"],
                rating: 4.5,
                reviews: 27,
                price: "₹10,000",
            },
        ],
    },
    {
        title: "Social Media Marketing",
        category: "Marketing, Advertising & PX",
        items: [{
                name: "Social Media Marketing",
                provider: "Digital Buzz",
                specialization: "Platform Strategies",
                courses: [
                    "Facebook Ads",
                    "Instagram Growth",
                    "LinkedIn Marketing",
                    "Content Creation",
                ],
                type: "Hybrid",
                duration: "1 Month",
                benefits: ["Ad Credits", "Certification", "Strategy Templates"],
                rating: 4.2,
                reviews: 29,
                price: "₹10,000",
            },
            {
                name: "Influencer Marketing",
                provider: "Social Media Institute",
                specialization: "Brand Partnerships",
                courses: [
                    "Influencer Outreach",
                    "Campaign Management",
                    "ROI Measurement",
                ],
                type: "Online",
                duration: "3 Weeks",
                benefits: ["Media Kit Templates", "Certification", "Network Access"],
                rating: 4.4,
                reviews: 23,
                price: "₹8,000",
            },
        ],
    },
];

const ads = [{
        id: 1,
        title: "🚀 Hiring Fast?",
        description: "Get your jobs seen by 1M+ candidates in 24 hours with our premium listings.",
        cta: "Boost Your Post",
        link: "#",
        bgColor: "bg-blue-200",
        icon: "💼",
    },
    {
        id: 2,
        title: "🏢 Join Top Startups!",
        description: "Explore 5,000+ startup jobs in tech, marketing, and design. Fresh openings every day.",
        cta: "Browse Jobs",
        link: "#",
        bgColor: "bg-yellow-200",
        icon: "🚀",
    },
    {
        id: 3,
        title: "🌍 Work Remotely",
        description: "Discover remote opportunities from global tech giants and emerging startups.",
        cta: "Find Remote Jobs",
        link: "#",
        bgColor: "bg-green-200",
        icon: "🌐",
    },
    {
        id: 4,
        title: "💰 Salary Benchmarking",
        description: "Get personalized salary insights and know what you deserve before you negotiate.",
        cta: "Check Salaries",
        link: "#",
        bgColor: "bg-purple-200",
        icon: "📈",
    },
    {
        id: 5,
        title: "🎯 Hire Top Talent",
        description: "Post a job and reach vetted professionals actively looking for new roles.",
        cta: "Post a Job",
        link: "#",
        bgColor: "bg-pink-200",
        icon: "🎯",
    },
    {
        id: 6,
        title: "🧑‍💻 Tech Jobs Hotlist",
        description: "Latest openings for developers, designers, and PMs at Amazon, Google, and top startups.",
        cta: "View Listings",
        link: "#",
        bgColor: "bg-indigo-200",
        icon: "🛠️",
    },
    {
        id: 7,
        title: "🏆 Top Companies Hiring",
        description: "Apply to jobs at Fortune 500 companies and fast-growing startups, all in one place.",
        cta: "See Companies",
        link: "#",
        bgColor: "bg-orange-200",
        icon: "🏢",
    },
    {
        id: 8,
        title: "🎓 Freshers Welcome!",
        description: "Thousands of entry-level roles now open for 2024 graduates across India and abroad.",
        cta: "Explore Fresher Jobs",
        link: "#",
        bgColor: "bg-teal-200",
        icon: "🎓",
    },
    {
        id: 9,
        title: "📚 Free Courses",
        description: "Access 100+ free courses on programming, design, and business skills. Limited time offer!",
        cta: "Enroll Now",
        link: "#",
        bgColor: "bg-red-200",
        icon: "🎁",
    },
    {
        id: 10,
        title: "🤝 Refer & Earn",
        description: "Refer friends and earn up to ₹50,000 when they get placed through our platform.",
        cta: "Start Referring",
        link: "#",
        bgColor: "bg-amber-200",
        icon: "💰",
    },
    {
        id: 11,
        title: "🏅 Skill Badges",
        description: "Earn verified skill badges to showcase your expertise to top employers worldwide.",
        cta: "Get Certified",
        link: "#",
        bgColor: "bg-lime-200",
        icon: "🛡️",
    },
    {
        id: 12,
        title: "📱 Mobile App",
        description: "Get job alerts, apply on-the-go, and track applications with our new mobile app.",
        cta: "Download Now",
        link: "#",
        bgColor: "bg-cyan-200",
        icon: "📲",
    },
    {
        id: 13,
        title: "👔 Career Coaching",
        description: "1:1 sessions with industry experts to boost your career growth and interview skills.",
        cta: "Book Session",
        link: "#",
        bgColor: "bg-violet-200",
        icon: "🎤",
    },
    {
        id: 14,
        title: "🌎 Global Opportunities",
        description: "Find international jobs with visa sponsorship in USA, Canada, Europe, and Australia.",
        cta: "Explore Abroad",
        link: "#",
        bgColor: "bg-emerald-200",
        icon: "✈️",
    },
    {
        id: 15,
        title: "📝 Resume Builder",
        description: "Create ATS-friendly resumes with our free tool and increase your interview chances.",
        cta: "Build Resume",
        link: "#",
        bgColor: "bg-fuchsia-200",
        icon: "📄",
    },
    {
        id: 16,
        title: "🔍 Job Alerts",
        description: "Get personalized job recommendations based on your profile and preferences.",
        cta: "Set Up Alerts",
        link: "#",
        bgColor: "bg-rose-200",
        icon: "🔔",
    },
];

export default function TrainingDashboard() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    // Check profile completeness on mount
    useEffect(() => {
        const checkProfileCompleteness = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    console.warn("No access token found");
                    setIsCheckingProfile(false);
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/api/training/profile/check-completeness/`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data.profile);
                    
                    // Show modal if profile is incomplete
                    if (!data.is_complete) {
                        setShowSetupModal(true);
                    }
                } else {
                    console.error("Failed to check profile completeness");
                }
            } catch (error) {
                console.error("Error checking profile:", error);
            } finally {
                setIsCheckingProfile(false);
            }
        };

        checkProfileCompleteness();
    }, []);

    const handleProfileSubmit = async (formData) => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                throw new Error("No access token found");
            }

            const response = await fetch(`${API_BASE_URL}/api/training/profile/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to save profile");
            }

            const updatedProfile = await response.json();
            setProfileData(updatedProfile);
            setShowSetupModal(false);
            
            // Show success message
            alert("Profile setup completed successfully!");
        } catch (error) {
            console.error("Error submitting profile:", error);
            throw error;
        }
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    const companyCategories = [
        "Information Technology (IT) & Software",
        "Retail & E-Commerce",
        "Agriculture, Farming & Forestry",
        "PRCG (Fast-Homey Common Goods)",
        "Environmental Services & Sustainability",
        "Healthcare & Pharmaceuticals",
        "Construction & Real Estate",
        "Media, Relations & Entertainment",
        "Tools & A-payers",
        "Real Estate Investment ",
        "Finance, Banking & Insurance",
        "Telecommunication & Networking",
        "Aerospects, Aviation & Defense",
        "Home & Metals",
        "Consumer Durable",
        "Service Law",
        "Marketing, Advertising & PX",
        "Haggadfly, Travel & Tourism",
        "Legal, Law & Compliance",
        "Consulting & Advisory Services",
        "NGOs & Social Enterprises",
        "Education & Training",
        "Automobile & Auto Components",
        "Government & Public Sector",
        "Electronics & Semiconductors",
        "Education Technology (ETGs)",
        "Manufacturing & Production",
        "Energy, QG, Gas & Utilities",
        "Transportation & Logistics",
        "Chemicals & Petrochemicals",
        "Financial Technology (mTabs)",
    ];

    const filteredCategories = allCategories
    .map((category) => ({
        ...category,
        items: category.items.filter(
            (item) =>
                (item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.provider.toLowerCase().includes(search.toLowerCase()) ||
                item.specialization.toLowerCase().includes(search.toLowerCase())) &&
                (!activeCategory || category.category === activeCategory)
        ),
    }))
    .filter((category) => category.items.length > 0);
    const handleCategoryClick = (category) => {
        setActiveCategory(activeCategory === category ? "" : category);
    };

    const displayedCategories = showAllCategories ?
        companyCategories :
        companyCategories.slice(0, 12);

    if (!isClient) {
        return null;
    }

    // Show loading state while checking profile
    if (isCheckingProfile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-gray-50">
            {/* Institute Setup Modal */}
            <InstituteSetupModal
                isOpen={showSetupModal}
                onClose={() => {}} // Prevent closing until setup is complete
                onSubmit={handleProfileSubmit}
                existingData={profileData}
            />
            
            <Header />
            {/* Header Section */}
            <motion.div className="text-center mb-6 pt-8 px-4 bg-white shadow-sm"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}>
                <motion.h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
                    variants={fadeInUp}>
                    Discover{" "}
                    <span className="text-blue-600 font-bold lg:text-5xl">
                        Training Programs
                    </span>
                </motion.h1>
                <motion.p className="mt-6 text-gray-600 max-w-6xl mx-auto"
                    variants={fadeInUp}>
                    Browse through our network of training providers and find your perfect course match
                </motion.p>

                {/* Search Section */}
                <div className="mt-4 flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="relative">
                            <input type="text"
                                placeholder="Search courses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" />
                            <div className="absolute right-3 top-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Categories Section */}
            <motion.section className="mb-8 px-4"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}>
                <h3 className="text-center text-2xl font-bold text-gray-800 mb-6">
                    Training Categories
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
                    {displayedCategories.map((category, idx) => {
                        const icon = categoryIcons[category] || "📚";
                        const isActive = activeCategory === category;
                        const colorClass = categoryColors[category] || "bg-gray-100 text-gray-700";
                        const [bgClass, borderClass, textClass] = colorClass.split(" ");

                        return (
                            <motion.div key={typeof category === 'string' ? category : `category-${idx}-${Math.random()}`}
                                className={`relative p-4 rounded-xl border bg-white shadow-sm transition-all flex flex-col items-center justify-center cursor-pointer aspect-square w-full 
                                            ${isActive 
                                                ? "border-blue-500 shadow-md" 
                                                : "border-gray-200 hover:shadow-md hover:scale-[1.03]"
                                            }`}
                                onClick={() => handleCategoryClick(category)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                variants={itemVariants}>
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${bgClass.replace("50", "100")}`}>
                                    <span className="text-3xl">{typeof icon === 'string' ? icon : '❓'}</span>
                                </div>
                                <h4 className={`text-sm font-bold text-center line-clamp-2 ${isActive ? "text-blue-600" : textClass}`}>
                                    {typeof category === 'string' ? category : 'Unknown Category'}
                                </h4>
                            </motion.div>
                        );
                    })}
                </div>
                <div className="text-center mt-8">
                    <button onClick={() => setShowAllCategories(!showAllCategories)}
                        className="px-6 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition border border-gray-300 flex items-center justify-center gap-2 mx-auto text-base shadow">
                        {showAllCategories ? "Show Less Industries" : "Show All Industries"}
                        <span className="text-sm">{showAllCategories ? "▲" : "▼"}</span>
                    </button>
                </div>
            </motion.section>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col lg:flex-row gap-3 px-4 pb-6">
                {/* Left sidebar - Ads */}
                <motion.div className="lg:w-80 flex-shrink-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}>
                    <div className="sticky top-4 space-y-4">
                        {ads.slice(0, 8).map((ad) => (
                            <motion.div key={ad.id}
                                className={`p-6 rounded-xl ${ad.bgColor.replace(
                                    "100",
                                    "150"
                                )} shadow-sm border-2 border-transparent`}
                                whileHover={{
                                    y: -7,
                                    boxShadow: "0 15px 35px -10px rgba(16, 185, 129, 0.5)",
                                    borderColor: "rgba(16, 185, 129, 0.8)",
                                    backgroundColor: `${ad.bgColor.replace("200", "200")}`,
                                    transition: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 15,
                                    },
                                }}
                                whileTap={{ scale: 0.98 }}>
                                <div className="flex items-start gap-4">
                                    <motion.div className="text-3xl mt-1"
                                        whileHover={{
                                            scale: 1.15,
                                            rotate: [0, -5, 5, 0],
                                            transition: { duration: 0.6 },
                                        }}>
                                        {ad.icon}
                                    </motion.div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-gray-800">{ad.title}</h3>
                                        <p className="text-sm mb-4 text-gray-600">{ad.description}</p>
                                        <motion.a href={ad.link}
                                            className="inline-block px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-semibold border-2 border-emerald-400 hover:bg-emerald-100"
                                            whileHover={{
                                                scale: 1.05,
                                                backgroundColor: "rgba(16, 185, 129, 0.2)",
                                                boxShadow: "0 5px 15px -3px rgba(16, 185, 129, 0.4)",
                                            }}
                                            whileTap={{ scale: 0.98 }}>
                                            {ad.cta}
                                        </motion.a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Main content - Training programs */}
                <div className="flex-1 min-w-0 max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {filteredCategories.length === 0 ? (
                            <motion.div className="bg-white rounded-lg p-8 text-center shadow-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 mx-auto text-gray-400 mb-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-700 mb-1">
                                    No training programs found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your search or filter criteria
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div className="space-y-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible">
                                <AnimatePresence>
                                    {filteredCategories.map((category, idx) => {
                                        const colorClasses =
                                            categoryColors[category.category] ||
                                            "bg-gray-50 border-gray-100 text-gray-700";
                                        const icon = categoryIcons[category.category] || "📚";

                                        return (
                                            <motion.div key={idx}
                                                variants={itemVariants}
                                                layout transition={{
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 30,
                                                }}>
                                                <div className={`bg-white rounded-xl shadow p-6 border ${colorClasses
                                                    .replace("50", "100")
                                                    .replace("text-", "border-")} border-opacity-50`}>
                                                    <div className="flex items-center justify-between gap-3 mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-3 rounded-lg ${colorClasses.replace(
                                                                "50",
                                                                "100"
                                                            )}`}>
                                                                <span className="text-2xl">{icon}</span>
                                                            </div>
                                                            <h2 className={`text-2xl font-bold ${colorClasses
                                                                .replace("50", "800")
                                                                .replace("bg-", "text-")}`}>
                                                                {category.title}
                                                            </h2>
                                                        </div>
                                                        <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-semibold border border-blue-300 hover:bg-blue-50 transition-colors shadow-sm">
                                                            View All
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {category.items.map((item, itemIdx) => (
                                                            <div key={itemIdx}
                                                                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition cursor-pointer hover:shadow-md">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                                                                            {item.provider}
                                                                        </span>
                                                                        <h3 className="text-lg font-medium text-gray-800 mt-1">
                                                                            {item.name}
                                                                        </h3>
                                                                    </div>
                                                                    <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                        New
                                                                    </span>
                                                                </div>

                                                                <div className="mt-4 space-y-3">
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-600">
                                                                            Specialised In:
                                                                        </p>
                                                                        <p className="text-sm text-gray-800">
                                                                            {item.specialization}
                                                                        </p>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-600">
                                                                            Courses:
                                                                        </p>
                                                                        <p className="text-sm text-gray-800">
                                                                            {item.courses.join(", ")}
                                                                        </p>
                                                                    </div>

                                                                    <div className="flex justify-between">
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-600">
                                                                                Type:
                                                                            </p>
                                                                            <p className="text-sm text-gray-800">
                                                                                {item.type}
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-600">
                                                                                Duration:
                                                                            </p>
                                                                            <p className="text-sm text-gray-800">
                                                                                {item.duration}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-600">
                                                                            Benefits:
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                                            {item.benefits.map((benefit, i) => (
                                                                                <span key={i}
                                                                                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                                    {benefit}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-4 flex justify-end">
                                                                    <a href="#"
                                                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                                                                        View Details→
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right sidebar - Ads */}
                <motion.div className="lg:w-96 flex-shrink-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}>
                    <div className="sticky top-4 space-y-4">
                        {ads.slice(8).map((ad) => (
                            <motion.div key={ad.id}
                                className={`p-6 rounded-xl ${ad.bgColor.replace(
                                    "100",
                                    "150"
                                )} shadow-sm border-2 border-transparent`}
                                whileHover={{
                                    y: -7,
                                    boxShadow: "0 15px 35px -10px rgba(16, 185, 129, 0.5)",
                                    borderColor: "rgba(16, 185, 129, 0.8)",
                                    backgroundColor: `${ad.bgColor.replace("200", "200")}`,
                                    transition: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 15,
                                    },
                                }}
                                whileTap={{ scale: 0.98 }}>
                                <div className="flex items-start gap-4">
                                    <motion.div className="text-3xl mt-1"
                                        whileHover={{
                                            scale: 1.15,
                                            rotate: [0, -5, 5, 0],
                                            transition: { duration: 0.6 },
                                        }}>
                                        {ad.icon}
                                    </motion.div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2 text-gray-800">{ad.title}</h3>
                                        <p className="text-sm mb-4 text-gray-600">{ad.description}</p>
                                        <motion.a href={ad.link}
                                            className="inline-block px-4 py-2 bg-white text-emerald-700 rounded-lg text-sm font-semibold border-2 border-emerald-400 hover:bg-emerald-100"
                                            whileHover={{
                                                scale: 1.05,
                                                backgroundColor: "rgba(16, 185, 129, 0.2)",
                                                boxShadow: "0 5px 15px -3px rgba(16, 185, 129, 0.4)",
                                            }}
                                            whileTap={{ scale: 0.98 }}>
                                            {ad.cta}
                                        </motion.a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}

export { categoryColors, categoryIcons };
