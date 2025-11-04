//src/app/dashboard/employer/components/EmployerProfile.js

'use client';

import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';

// Language translations
const translations = {
  en: {
    viewProfile: "View Profile",
    settings: "Settings",
    about: "About",
    contact: "Contact",
    subscription: "Subscription",
    upgrade: "Upgrade",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    editProfile: "Edit Profile",
    privacySettings: "Privacy Settings",
    language: "Language",
    helpSupport: "Help & Support",
    helpCenter: "Help Center",
    giveFeedback: "Give Feedback",
    signOut: "Sign Out",
    positionAt: "at",
    noInfo: "No information provided",
    feedbackPlaceholder: "What do you like or what can we improve?",
    feedbackType: "Feedback Type",
    bugReport: "Bug Report",
    suggestion: "Suggestion",
    submitFeedback: "Submit Feedback",
    privacyTitle: "Privacy Settings",
    privacyDesc: "Control who can see your profile and personal information",
    helpTitle: "Help Center",
    helpDesc: "Find answers to common questions and issues",
    feedbackTitle: "Give Feedback",
    feedbackDesc: "We'd love to hear your thoughts about our platform",
    stillNeedHelp: "Still need help?",
    contactSupport: "Contact Support",
    back: "Back"
  },
  te: {
    viewProfile: "ప్రొఫైల్ చూడండి",
    settings: "సెట్టింగ్స్",
    about: "గురించి",
    contact: "సంప్రదించండి",
    subscription: "చందా",
    upgrade: "అప్గ్రేడ్",
    saveChanges: "మార్పులను భద్రపరచండి",
    cancel: "రద్దు చేయండి",
    editProfile: "ప్రొఫైల్‌ని సవరించండి",
    privacySettings: "గోప్యతా సెట్టింగ్‌లు",
    language: "భాష",
    helpSupport: "సహాయం మరియు మద్దతు",
    helpCenter: "సహాయ కేంద్రం",
    giveFeedback: "ఫీడ్‌బ్యాక్ ఇవ్వండి",
    signOut: "సైన్ అవుట్",
    positionAt: "వద్ద",
    noInfo: "సమాచారం అందుబాటులో లేదు",
    feedbackPlaceholder: "మీకు ఏమి నచ్చింది లేదా మేము ఏమి మెరుగుపరచగలము?",
    feedbackType: "ఫీడ్‌బ్యాక్ రకం",
    bugReport: "బగ్ నివేదిక",
    suggestion: "సలహా",
    submitFeedback: "ఫీడ్‌బ్యాక్ సమర్పించండి",
    privacyTitle: "గోప్యతా సెట్టింగ్‌లు",
    privacyDesc: "మీ ప్రొఫైల్ మరియు వ్యక్తిగత సమాచారాన్ని ఎవరు చూడగలరో నియంత్రించండి",
    helpTitle: "సహాయ కేంద్రం",
    helpDesc: "సాధారణ ప్రశ్నలు మరియు సమస్యలకు ಸಮಾಧಾನಗಳು కనుగొనండి",
    feedbackTitle: "ఫీడ్‌బ్యాక్ ఇవ్వండి",
    feedbackDesc: "మా ప్లాట్‌ఫారమ్ గురించి మీ ఆలోచనలు మాకు తెలియజేయండి",
    stillNeedHelp: "ఇంకా సహాయం కావాలా?",
    contactSupport: "మద్దతును సంప్రదించండి",
    back: "వెనుకకు"
  },
  hi: {
    viewProfile: "प्रोफ़ाइल देखें",
    settings: "सेटिंग्स",
    about: "के बारे में",
    contact: "संपर्क",
    subscription: "सदस्यता",
    upgrade: "अपग्रेड",
    saveChanges: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    editProfile: "प्रोफ़ाइल संपादित करें",
    privacySettings: "गोपनीयता सेटिंग्स",
    language: "भाषा",
    helpSupport: "सहायता और समर्थन",
    helpCenter: "सहायता केंद्र",
    giveFeedback: "प्रतिक्रिया दें",
    signOut: "साइन आउट",
    positionAt: "पर",
    noInfo: "कोई जानकारी उपलब्ध नहीं",
    feedbackPlaceholder: "आपको क्या पसंद है या हम क्या सुधार कर सकते हैं?",
    feedbackType: "प्रतिक्रिया प्रकार",
    bugReport: "बग रिपोर्ट",
    suggestion: "सुझाव",
    submitFeedback: "प्रतिक्रिया सबमिट करें",
    privacyTitle: "गोपनीयता सेटिंग्स",
    privacyDesc: "नियंत्रित करें कि आपकी प्रोफ़ाइल और व्यक्तिगत जानकारी कौन देख सकता है",
    helpTitle: "सहायता केंद्र",
    helpDesc: "सामान्य प्रश्नों और मुद्दों के उत्तर खोजें",
    feedbackTitle: "प्रतिक्रिया दें",
    feedbackDesc: "हमें आपके विचार सुनना अच्छा लगेगा",
    stillNeedHelp: "अभी भी मदद चाहिए?",
    contactSupport: "समर्थन से संपर्क करें",
    back: "पीछे"
  },
  mr: {
    viewProfile: "प्रोफाइल पहा",
    settings: "सेटिंग्ज",
    about: "विषयी",
    contact: "संपर्क",
    subscription: "वर्गणी",
    upgrade: "अपग्रेड",
    saveChanges: "बदल जतन करा",
    cancel: "रद्द करा",
    editProfile: "प्रोफाइल संपादित करा",
    privacySettings: "गोपनीयता सेटिंग्ज",
    language: "भाषा",
    helpSupport: "मदत आणि समर्थन",
    helpCenter: "मदत केंद्र",
    giveFeedback: "अभिप्राय द्या",
    signOut: "साइन आउट",
    positionAt: "येथे",
    noInfo: "माहिती उपलब्ध नाही",
    feedbackPlaceholder: "तुम्हाला काय आवडते किंवा आम्ही काय सुधारू शकतो?",
    feedbackType: "अभिप्राय प्रकार",
    bugReport: "बग अहवाल",
    suggestion: "सूचना",
    submitFeedback: "अभिप्राय सबमिट करा",
    privacyTitle: "गोपनीयता सेटिंग्ज",
    privacyDesc: "तुमची प्रोफाइल आणि वैयक्तिक माहिती कोण पाहू शकतो हे नियंत्रित करा",
    helpTitle: "मदत केंद्र",
    helpDesc: "सामान्य प्रश्न आणि समस्यांसाठी उत्तरे शोधा",
    feedbackTitle: "अभिप्राय द्या",
    feedbackDesc: "आमच्या प्लॅटफॉर्मबद्दल तुमचे विचार ऐकण्यास आम्हाला आनंद होईल",
    stillNeedHelp: "अजून मदत हवी आहे?",
    contactSupport: "समर्थनाशी संपर्क साधा",
    back: "मागे"
  },
  ta: {
    viewProfile: "சுயவிவரத்தைக் காண்க",
    settings: "அமைப்புகள்",
    about: "பற்றி",
    contact: "தொடர்பு",
    subscription: "சந்தா",
    upgrade: "மேம்படுத்து",
    saveChanges: "மாற்றங்களை சேமி",
    cancel: "ரத்துசெய்",
    editProfile: "சுயவிவரத்தைத் திருத்து",
    privacySettings: "தனியுரிமை அமைப்புகள்",
    language: "மொழி",
    helpSupport: "உதவி மற்றும் ஆதரவு",
    helpCenter: "உதவி மையம்",
    giveFeedback: "கருத்து தெரிவிக்கவும்",
    signOut: "வெளியேறு",
    positionAt: "இல்",
    noInfo: "தகவல் இல்லை",
    feedbackPlaceholder: "நீங்கள் என்ன விரும்புகிறீர்கள் அல்லது நாம் எதை மேம்படுத்த முடியும்?",
    feedbackType: "கருத்து வகை",
    bugReport: "பிழை அறிக்கை",
    suggestion: "பரிந்துரை",
    submitFeedback: "கருத்தை சமர்ப்பிக்கவும்",
    privacyTitle: "தனியுரிமை அமைப்புகள்",
    privacyDesc: "உங்கள் சுயவிவரம் மற்றும் தனிப்பட்ட தகவல்களை யார் பார்க்க முடியும் என்பதைக் கட்டுப்படுத்தவும்",
    helpTitle: "உதவி மையம்",
    helpDesc: "பொதுவான கேள்விகள் மற்றும் சிக்கல்களுக்கான பதில்களைக் கண்டறியவும்",
    feedbackTitle: "கருத்து தெரிவிக்கவும்",
    feedbackDesc: "எங்கள் தளம் பற்றி உங்கள் கருத்துகளைக் கேட்பதில் நாங்கள் மகிழ்ச்சியடைவோம்",
    stillNeedHelp: "இன்னும் உதவி தேவையா?",
    contactSupport: "ஆதரவைத் தொடர்பு கொள்ளவும்",
    back: "பின்"
  },
  kn: {
    viewProfile: "ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ",
    settings: "ಸೆಟ್ಟಿಂಗ್ಸ್",
    about: "ಬಗ್ಗೆ",
    contact: "ಸಂಪರ್ಕ",
    subscription: "ಚಂದಾದಾರಿಕೆ",
    upgrade: "ಅಪ್ಗ್ರೇಡ್",
    saveChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡು",
    editProfile: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    privacySettings: "ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್ಸ್",
    language: "ಭಾಷೆ",
    helpSupport: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ",
    helpCenter: "ಸಹಾಯ ಕೇಂದ್ರ",
    giveFeedback: "ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ",
    signOut: "ಸೈನ್ ಔಟ್",
    positionAt: "ನಲ್ಲಿ",
    noInfo: "ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ",
    feedbackPlaceholder: "ನೀವು ಏನನ್ನು ಇಷ್ಟಪಡುತ್ತೀರಿ ಅಥವಾ ನಾವು ಏನನ್ನು ಸುಧಾರಿಸಬಹುದು?",
    feedbackType: "ಪ್ರತಿಕ್ರಿಯೆ ಪ್ರಕಾರ",
    bugReport: "ದೋಷ ವರದಿ",
    suggestion: "ಸಲಹೆ",
    submitFeedback: "ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ",
    privacyTitle: "ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್ಸ್",
    privacyDesc: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮತ್ತು ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಯಾರು ನೋಡಬಹುದು ಎಂಬುದನ್ನು ನಿಯಂತ್ರಿಸಿ",
    helpTitle: "ಸಹಾಯ ಕೇಂದ್ರ",
    helpDesc: "ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಸಮಸ್ಯೆಗಳಿಗೆ ಉತ್ತರಗಳನ್ನು ಹುಡುಕಿ",
    feedbackTitle: "ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ",
    feedbackDesc: "ನಮ್ಮ ವೇದಿಕೆಯ ಬಗ್ಗೆ ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಕೇಳಲು ನಾವು ಇಷ್ಟಪಡುತ್ತೇವೆ",
    stillNeedHelp: "ಇನ್ನೂ ಸಹಾಯ ಬೇಕೇ?",
    contactSupport: "ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ",
    back: "ಹಿಂದೆ"
  }
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'kn', name: 'ಕನ್ನಡ' }
];

const privacyOptions = {
  en: [
    { id: 'public', label: 'Public', description: 'Your profile is visible to everyone' },
    { id: 'connections', label: 'Connections Only', description: 'Only your connections can see your profile' },
    { id: 'private', label: 'Private', description: 'Only you can see your profile' }
  ],
  te: [
    { id: 'public', label: 'పబ్లిక్', description: 'మీ ప్రొఫైల్ అందరికీ కనిపిస్తుంది' },
    { id: 'connections', label: 'కనెక్షన్లు మాత్రమే', description: 'మీ కనెక్షన్లు మాత్రమే మీ ప్రొఫైల్‌ను చూడగలరు' },
    { id: 'private', label: 'ప్రైవేట్', description: 'మీరు మాత్రమే మీ ప్రొఫైల్‌ను చూడగలరు' }
  ],
  hi: [
    { id: 'public', label: 'सार्वजनिक', description: 'आपकी प्रोफ़ाइल सभी को दिखाई देती है' },
    { id: 'connections', label: 'केवल कनेक्शन', description: 'केवल आपके कनेक्शन आपकी प्रोफ़ाइल देख सकते हैं' },
    { id: 'private', label: 'निजी', description: 'केवल आप ही अपनी प्रोफ़ाइल देख सकते हैं' }
  ],
  mr: [
    { id: 'public', label: 'सार्वजनिक', description: 'तुमची प्रोफाइल प्रत्येकास दिसते' },
    { id: 'connections', label: 'केवळ कनेक्शन्स', description: 'फक्त तुमची कनेक्शन्स तुमची प्रोफाइल पाहू शकतात' },
    { id: 'private', label: 'खाजगी', description: 'फक्त तुम्ही तुमची प्रोफाइल पाहू शकता' }
  ],
  ta: [
    { id: 'public', label: 'பொது', description: 'உங்கள் சுயவிவரம் அனைவருக்கும் தெரியும்' },
    { id: 'connections', label: 'இணைப்புகள் மட்டுமே', description: 'உங்கள் இணைப்புகள் மட்டுமே உங்கள் சுயவிவரத்தைப் பார்க்க முடியும்' },
    { id: 'private', label: 'தனிப்பட்ட', description: 'நீங்கள் மட்டுமே உங்கள் சுயவிவரத்தைப் பார்க்க முடியும்' }
  ],
  kn: [
    { id: 'public', label: 'ಸಾರ್ವಜನಿಕ', description: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಎಲ್ಲರಿಗೂ ಗೋಚರಿಸುತ್ತದೆ' },
    { id: 'connections', label: 'ಕೇವಲ ಸಂಪರ್ಕಗಳು', description: 'ನಿಮ್ಮ ಸಂಪರ್ಕಗಳು ಮಾತ್ರ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ನೋಡಬಹುದು' },
    { id: 'private', label: 'ಖಾಸಗಿ', description: 'ನೀವು ಮಾತ್ರ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ನೋಡಬಹುದು' }
  ]
};

const helpTopics = {
  en: [
    { id: 'account', title: 'Account Settings', content: 'Learn how to manage your account settings and preferences.' },
    { id: 'privacy', title: 'Privacy Controls', content: 'Understand how to control your privacy settings and data sharing.' },
    { id: 'billing', title: 'Billing & Subscriptions', content: 'Get help with billing issues and subscription management.' },
    { id: 'troubleshooting', title: 'Troubleshooting', content: 'Solutions for common technical issues and problems.' }
  ],
  te: [
    { id: 'account', title: 'ఖాతా సెట్టింగ్స్', content: 'మీ ఖాతా సెట్టింగ్స్ మరియు ప్రాధాన్యతలను ఎలా నిర్వహించాలో తెలుసుకోండి.' },
    { id: 'privacy', title: 'గోప్యతా నియంత్రణలు', content: 'మీ గోప్యతా సెట్టింగ్స్ మరియు డేటా షేరింగ్‌ను ఎలా నియంత్రించాలో అర్థం చేసుకోండి.' },
    { id: 'billing', title: 'బిల్లింగ్ & సభ్యత్వాలు', content: 'బిల్లింగ్ సమస్యలు మరియు సభ్యత్వ నిర్వహణకు సహాయం పొందండి.' },
    { id: 'troubleshooting', title: 'ట్రబుల్‌షూటింగ్', content: 'సాధారణ సాంకేతిక సమస్యలు మరియు సమస్యలకు పరిష్కಾರాలు.' }
  ],
  hi: [
    { id: 'account', title: 'खाता सेटिंग्स', content: 'जानें कि अपनी खाता सेटिंग्स और प्राथमिकताओं को कैसे प्रबंधित करें।' },
    { id: 'privacy', title: 'गोपनीयता नियंत्रण', content: 'समझें कि अपनी गोपनीयता सेटिंग्स और डेटा साझाकरण को कैसे नियंत्रित करें।' },
    { id: 'billing', title: 'बिलिंग और सदस्यता', content: 'बिलिंग मुद्दों और सदस्यता प्रबंधन में सहायता प्राप्त करें।' },
    { id: 'troubleshooting', title: 'समस्या निवारण', content: 'सामान्य तकनीकी समस्याओं और मुद्दों के समाधान।' }
  ],
  mr: [
    { id: 'account', title: 'खाते सेटिंग्ज', content: 'तुमच्या खाते सेटिंग्ज आणि प्राधान्यांचे व्यवस्थापन कसे करावे ते जाणून घ्या.' },
    { id: 'privacy', title: 'गोपनीयता नियंत्रणे', content: 'तुमची गोपनीयता सेटिंग्ज आणि डेटा शेअरिंग कशी नियंत्रित करायची ते समजून घ्या.' },
    { id: 'billing', title: 'बिलिंग आणि सदस्यता', content: 'बिलिंग समस्या आणि सदस्यता व्यवस्थापनासाठी मदत मिळवा.' },
    { id: 'troubleshooting', title: 'समस्या निवारण', content: 'सामान्य तांत्रिक समस्या आणि समस्यांसाठी उपाय.' }
  ],
  ta: [
    { id: 'account', title: 'கணக்கு அமைப்புகள்', content: 'உங்கள் கணக்கு அமைப்புகள் மற்றும் விருப்பங்களை எவ்வாறு நிர்வகிப்பது என்பதைக் கற்றுக்கொள்ளுங்கள்.' },
    { id: 'privacy', title: 'தனியுரிமை கட்டுப்பாடுகள்', content: 'உங்கள் தனியுரிமை அமைப்புகள் மற்றும் தரவு பகிர்வை எவ்வாறு கட்டுப்படுத்துவது என்பதைப் புரிந்து கொள்ளுங்கள்.' },
    { id: 'billing', title: 'பில்லிங் & சந்தாக்கள்', content: 'பில்லிங் சிக்கல்கள் மற்றும் சந்தா மேலாண்மைக்கு உதவி பெறவும்.' },
    { id: 'troubleshooting', title: 'சிக்கல் தீர்த்தல்', content: 'பொதுவான தொழில்நுட்ப சிக்கல்கள் மற்றும் பிரச்சினைகளுக்கான தீர்வுகள்.' }
  ],
  kn: [
    { id: 'account', title: 'ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು', content: 'ನಿಮ್ಮ ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ಹೇಗೆ ನಿರ್ವಹಿಸುವುದು ಎಂದು ತಿಳಿಯಿರಿ.' },
    { id: 'privacy', title: 'ಗೌಪ್ಯತೆ ನಿಯಂತ್ರಣಗಳು', content: 'ನಿಮ್ಮ ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಡೇಟಾ ಹಂಚಿಕೆಯನ್ನು ಹೇಗೆ ನಿಯಂತ್ರಿಸುವುದು ಎಂದು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.' },
    { id: 'billing', title: 'ಬಿಲ್ಲಿಂಗ್ & ಚಂದಾದಾರಿಕೆಗಳು', content: 'ಬಿಲ್ಲಿಂಗ್ ಸಮಸ್ಯೆಗಳು ಮತ್ತು ಚಂದಾದಾರಿಕೆ ನಿರ್ವಹಣೆಗೆ ಸಹಾಯ ಪಡೆಯಿರಿ.' },
    { id: 'troubleshooting', title: 'ಸಮಸ್ಯೆ ನಿವಾರಣೆ', content: 'ಸಾಮಾನ್ಯ ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆಗಳು ಮತ್ತು ಸಮಸ್ಯೆಗಳಿಗೆ ಪರಿಹಾರಗಳು.' }
  ]
};

export default function EmployerProfile({ 
  userData, 
  updateProfile, 
  handleSignOut,
  isProfileOpen,
  setIsProfileOpen
}) {
  const [activeTab, setActiveTab] = useState('view');
  const [editMode, setEditMode] = useState(false);
  const [tempProfileData, setTempProfileData] = useState({ ...userData });
  const [activeSetting, setActiveSetting] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [activeHelpTopic, setActiveHelpTopic] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(userData.language || 'en');
  const fileInputRef = useRef(null);

  // Wrap updateProfile in useCallback to prevent unnecessary re-renders
  const stableUpdateProfile = useCallback((data) => {
    updateProfile(data);
  }, [updateProfile]);

  // Update translations when language changes
  useEffect(() => {
    setTempProfileData(prev => ({ ...prev, language: currentLanguage }));
    stableUpdateProfile({ ...tempProfileData, language: currentLanguage });
  }, [currentLanguage, tempProfileData, stableUpdateProfile]);

  const t = (key) => translations[currentLanguage]?.[key] || translations['en'][key];

  const handleInputChange = (field, value) => {
    setTempProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    stableUpdateProfile(tempProfileData);
    setEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange('image', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handlePrivacyChange = (privacyLevel) => {
    handleInputChange('privacy', privacyLevel);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', feedback);
    setFeedbackSubmitted(true);
    setFeedback('');
    setTimeout(() => setFeedbackSubmitted(false), 3000);
  };

  const handleSignOutClick = async () => {
    try {
      await handleSignOut();
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderViewTab = () => (
    <div className="space-y-3">
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('about')}</h4>
        {editMode ? (
          <textarea
            value={tempProfileData.about || ''}
            onChange={(e) => handleInputChange('about', e.target.value)}
            className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder={t('feedbackPlaceholder')}
          />
        ) : (
          <p className="text-sm text-gray-700">{userData.about || t('noInfo')}</p>
        )}
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('contact')}</h4>
        {editMode ? (
          <input
            type="email"
            value={tempProfileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <p className="text-sm text-gray-700">{userData.email}</p>
        )}
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('subscription')}</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{userData.subscription} {t('subscription')}</span>
          <button className="text-xs text-blue-600 hover:text-blue-800">{t('upgrade')}</button>
        </div>
      </div>
      {editMode && (
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleSaveProfile}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            {t('saveChanges')}
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setTempProfileData({ ...userData });
            }}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('settings')}</h4>
        <div className="space-y-2">
          <button 
            onClick={() => {
              setEditMode(true);
              setActiveTab('view');
            }}
            className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center"
          >
            <i className="fas fa-user-edit mr-2 text-blue-500"></i>
            {t('editProfile')}
          </button>
          <button 
            onClick={() => setActiveSetting('privacy')}
            className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center"
          >
            <i className="fas fa-shield-alt mr-2 text-blue-500"></i>
            {t('privacySettings')}
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('language')}</h4>
        <div className="relative">
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="w-full p-2 pl-3 pr-8 border border-gray-300 rounded-md text-black appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <i className="fas fa-chevron-down text-xs"></i>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('helpSupport')}</h4>
        <div className="space-y-2">
          <button 
            onClick={() => setActiveSetting('help')}
            className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center"
          >
            <i className="fas fa-question-circle mr-2 text-blue-500"></i>
            {t('helpCenter')}
          </button>
          <button 
            onClick={() => setActiveSetting('feedback')}
            className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center"
          >
            <i className="fas fa-comment-alt mr-2 text-blue-500"></i>
            {t('giveFeedback')}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-4">
      <button 
        onClick={() => setActiveSetting(null)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
      >
        <i className="fas fa-arrow-left mr-2"></i> {t('back')}
      </button>
      
      <h3 className="font-medium text-gray-900">{t('privacyTitle')}</h3>
      <p className="text-sm text-gray-500 mb-4">
        {t('privacyDesc')}
      </p>
      
      <div className="space-y-3">
        {privacyOptions[currentLanguage]?.map((option) => (
          <div 
            key={option.id}
            onClick={() => handlePrivacyChange(option.id)}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              tempProfileData.privacy === option.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`h-4 w-4 rounded-full border flex items-center justify-center mr-3 ${
                tempProfileData.privacy === option.id 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {tempProfileData.privacy === option.id && (
                  <i className="fas fa-check text-white text-xs"></i>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{option.label}</h4>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4">
        <button
          onClick={() => {
            handleSaveProfile();
            setActiveSetting(null);
          }}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          {t('saveChanges')}
        </button>
      </div>
    </div>
  );

  const renderHelpCenter = () => (
    <div className="space-y-4">
      <button 
        onClick={() => setActiveSetting(null)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
      >
        <i className="fas fa-arrow-left mr-2"></i> {t('back')}
      </button>
      
      <h3 className="font-medium text-gray-900">{t('helpTitle')}</h3>
      <p className="text-sm text-gray-500 mb-4">
        {t('helpDesc')}
      </p>
      
      <div className="space-y-2">
        {helpTopics[currentLanguage]?.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => setActiveHelpTopic(activeHelpTopic === topic.id ? null : topic.id)}
            className="p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">{topic.title}</h4>
              <i className={`fas fa-chevron-${activeHelpTopic === topic.id ? 'up' : 'down'} text-gray-400`}></i>
            </div>
            {activeHelpTopic === topic.id && (
              <p className="mt-2 text-sm text-gray-600">{topic.content}</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">{t('stillNeedHelp')}</h4>
        <button 
          onClick={() => setActiveSetting('feedback')}
          className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md flex items-center justify-center"
        >
          <i className="fas fa-headset mr-2"></i>
          {t('contactSupport')}
        </button>
      </div>
    </div>
  );

  const renderFeedbackForm = () => (
    <div className="space-y-4">
      <button 
        onClick={() => setActiveSetting(null)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
      >
        <i className="fas fa-arrow-left mr-2"></i> {t('back')}
      </button>
      
      <h3 className="font-medium text-gray-900">{t('feedbackTitle')}</h3>
      <p className="text-sm text-gray-500">
        {t('feedbackDesc')}
      </p>
      
      {feedbackSubmitted ? (
        <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-center">
          <i className="fas fa-check-circle mr-2"></i>
          {currentLanguage === 'en' && "Thank you for your feedback! We appreciate your input."}
          {currentLanguage === 'es' && "¡Gracias por tus comentarios! Apreciamos tu opinión."}
          {currentLanguage === 'fr' && "Merci pour vos commentaires ! Nous apprécions votre contribution."}
        </div>
      ) : (
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
              {t('feedback')}
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder={t('feedbackPlaceholder')}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('feedbackType')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className={`p-2 border rounded-md text-sm ${
                  feedback.includes('bug') 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setFeedback(prev => prev.includes('bug') ? prev : prev + ' [bug]')}
              >
                <i className="fas fa-bug mr-1"></i> {t('bugReport')}
              </button>
              <button
                type="button"
                className={`p-2 border rounded-md text-sm ${
                  feedback.includes('suggestion') 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setFeedback(prev => prev.includes('suggestion') ? prev : prev + ' [suggestion]')}
              >
                <i className="fas fa-lightbulb mr-1"></i> {t('suggestion')}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            {t('submitFeedback')}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="relative">
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <Image
          src={userData.image}
          alt="User"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover border-2 border-white/30 hover:border-white/50 transition-all"
        />
        <span className="hidden md:inline text-sm font-medium">{userData.name}</span>
        <i className={`fas fa-chevron-down text-xs transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`}></i>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 divide-y divide-gray-100">
          {/* Profile Header */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={tempProfileData.image}
                  alt="User"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                {editMode && (
                  <button 
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-all"
                  >
                    <i className="fas fa-camera text-xs"></i>
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="flex-1 min-w-0">
                {editMode ? (
                  <input
                    type="text"
                    value={tempProfileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h3 className="font-semibold text-gray-900 truncate">{tempProfileData.name}</h3>
                )}
                {editMode ? (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={tempProfileData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full text-xs text-gray-600 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="Position"
                    />
                    <input
                      type="text"
                      value={tempProfileData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full text-xs text-gray-600 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="Company"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-600 truncate">{tempProfileData.position} {t('positionAt')} {tempProfileData.company}</p>
                    <p className="text-xs text-gray-500 truncate">{tempProfileData.email}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {!activeSetting && (
            <div className="p-2 grid grid-cols-2 gap-1">
              <button 
                onClick={() => {
                  setActiveTab('view');
                  setEditMode(false);
                }}
                className={`p-2 rounded-md text-sm flex flex-col items-center ${activeTab === 'view' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                <i className="fas fa-user text-lg mb-1"></i>
                <span>{t('viewProfile')}</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab('settings');
                  setEditMode(false);
                }}
                className={`p-2 rounded-md text-sm flex flex-col items-center ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                <i className="fas fa-cog text-lg mb-1"></i>
                <span>{t('settings')}</span>
              </button>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {activeSetting === 'privacy' ? renderPrivacySettings() :
             activeSetting === 'help' ? renderHelpCenter() :
             activeSetting === 'feedback' ? renderFeedbackForm() :
             activeTab === 'view' ? renderViewTab() :
             renderSettingsTab()}
          </div>

          {/* Footer */}
          <div className="p-2 bg-gray-50">
            <button
              onClick={handleSignOutClick}
              className="w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center justify-center"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              {t('signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
