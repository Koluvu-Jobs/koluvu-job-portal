// src/components/SubscriptionPopup.js

"use client";

import React, { useEffect, useState } from "react";
import { FaUser, FaWhatsapp, FaEnvelope, FaLightbulb } from "react-icons/fa";
import supabase from "@koluvu/lib/supabaseClient";

const SubscriptionPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  
  // Check if in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    setHasMounted(true);

    const checkEmailAndShowPopup = async () => {
      if (typeof window !== "undefined") {
        // First check if the user has seen the popup before
        const hasSeenPopup = localStorage.getItem("hasSeenPopup");
        if (hasSeenPopup === "true") {
          return; // User has already seen the popup, don't show it
        }

        // Check if we have a saved email in localStorage
        const savedEmail = localStorage.getItem("registeredEmail");
        if (savedEmail) {
          // Check if this email exists in Supabase
          try {
            const { data, error } = await supabase
              .from("waiting_list")
              .select("email")
              .eq("email", savedEmail)
              .maybeSingle();

            if (error) {
              console.error("Error checking email:", error);
            }

            if (data) {
              // Email found in database, don't show popup
              localStorage.setItem("hasSeenPopup", "true");
              return;
            }
          } catch (err) {
            console.error("Error checking email in Supabase:", err);
          }
        }

        // If we get here, show the popup
        setShowPopup(true);
      }
    };

    const timer = setTimeout(() => {
      checkEmailAndShowPopup();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("hasSeenPopup", "true");
    }
  };

  // Dev-only function to reset popup
  const resetPopup = () => {
    localStorage.removeItem("hasSeenPopup");
    localStorage.removeItem("registeredEmail");
    setShowPopup(true);
  };

  const handleSubscription = async () => {
    if (!userName || !contactNumber || !email) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Check if email already exists in Supabase
      const { data, error: checkError } = await supabase
        .from("waiting_list")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking email in Supabase:", checkError);
      }

      if (data) {
        // Email already exists in the database
        alert("This email is already subscribed. Thank you!");
        
        // Save this email in localStorage to remember this user
        if (typeof window !== "undefined") {
          localStorage.setItem("registeredEmail", email);
          localStorage.setItem("hasSeenPopup", "true");
        }
        
        setShowPopup(false);
        return;
      }

      // Email is new, insert into Supabase
      const { error: insertError } = await supabase
        .from("waiting_list")
        .insert([
          {
            user_name: userName,
            contact_number: contactNumber,
            email: email,
            user_suggestions: suggestions,
          }
        ]);

      if (insertError) {
        console.error("Insert error:", insertError.message);
        alert("Failed to save your details: " + insertError.message);
        return;
      }

      // Save the email in localStorage to remember this user
      if (typeof window !== "undefined") {
        localStorage.setItem("registeredEmail", email);
        localStorage.setItem("hasSeenPopup", "true");
      }

      alert("Thank you for subscribing!");
      handleClose();
    } catch (err) {
      console.error("Submission error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Don't render anything during server-side rendering
  if (typeof window === "undefined") return null;
  
  // Don't render anything if component hasn't mounted yet
  if (!hasMounted) return null;

  return (
    <>
      {/* Development-only debug button */}
      {isDevelopment && (
        <button 
          onClick={resetPopup}
          className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-[9999] text-sm"
        >
          Show Popup (Dev Only)
        </button>
      )}
      
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[9998] p-4">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full relative mx-auto my-8 overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-red-500 z-[9999]"
              aria-label="Close popup"
            >
              &times;
            </button>

            <h2 className="text-2xl md:text-3xl text-center text-white font-extrabold mb-2">
              Join Our Waitlist
            </h2>
            <p className="text-sm md:text-base text-center text-gray-300 mb-6">
              By signing up, you agree to receive awesome emails and updates.
            </p>

            {/* Full Name */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <FaUser className="text-blue-500" />
                <label htmlFor="name" className="text-white text-sm md:text-base">
                  Your Full Name
                </label>
              </div>
              <input
                id="name"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                type="text"
                placeholder="Enter your full name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            {/* Contact Number */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <FaWhatsapp className="text-blue-500" />
                <label htmlFor="contact" className="text-white text-sm md:text-base">
                  Your Contact Number
                </label>
              </div>
              <input
                id="contact"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                type="tel"
                placeholder="Enter your contact number (Preferably WhatsApp)"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <FaEnvelope className="text-blue-500" />
                <label htmlFor="email" className="text-white text-sm md:text-base">
                  Your Email Address
                </label>
              </div>
              <input
                id="email"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Suggestions */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <FaLightbulb className="text-blue-500" />
                <label htmlFor="suggestions" className="text-white text-sm md:text-base">
                  Any Suggestions?
                </label>
              </div>
              <textarea
                id="suggestions"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm min-h-[100px]"
                placeholder="Enter any suggestions or feedback"
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubscription}
              className="w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-bold text-sm md:text-base"
            >
              SUBSCRIBE
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPopup;
