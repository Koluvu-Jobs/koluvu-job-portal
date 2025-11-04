// src/app/main/mock-interview/setup.js

"use client";

import { useState, useEffect, useRef } from "react";
import styles from "@koluvu/styles/employee/mock-interview/mock-interview.module.css";
import {
  FiSettings,
  FiUser,
  FiAward,
  FiMic,
  FiType,
  FiUpload,
  FiCamera,
  FiChevronRight,
  FiChevronLeft,
  FiSkipForward,
} from "react-icons/fi";

export default function InterviewSetup({
  onStart,
  currentStep,
  nextStep,
  prevStep,
  resume,
  setResume,
}) {
  const [jobRole, setJobRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("medium");
  const [interviewType, setInterviewType] = useState("technical");
  const [interviewMode, setInterviewMode] = useState("voice");
  const [desiredCompany, setDesiredCompany] = useState("");
  const [desiredRole, setDesiredRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [audioPermission, setAudioPermission] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCustomRoleInput, setShowCustomRoleInput] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const jobRoles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "Product Manager",
    "UX Designer",
    "DevOps Engineer",
  ];

  const popularCompanies = [
    "Google",
    "Microsoft",
    "Apple",
    "Amazon",
    "Facebook",
    "Netflix",
    "Tesla",
    "Uber",
    "Airbnb",
    "Twitter",
    "LinkedIn",
    "Adobe",
    "Intel",
    "IBM",
    "Oracle",
    "Salesforce",
    "Spotify",
    "Stripe",
    "Twitch",
    "Zoom",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({
      jobRole,
      difficulty,
      interviewType,
      interviewMode,
      desiredCompany,
      desiredRole: showCustomRoleInput ? customRole : desiredRole,
      resume,
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const requestAudioPermission = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioPermission(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for voice interviews");
    }
  };

  const requestCameraPermission = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });
      setStream(cameraStream);
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
      setCameraPermission(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access is required for video interviews");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraPermission(false);
    }
  };

  const handleSkipStep = () => {
    nextStep();
  };

  const handleCompanyInputChange = (e) => {
    const value = e.target.value;
    setDesiredCompany(value);

    if (value.length > 1) {
      const filtered = popularCompanies.filter((company) =>
        company.toLowerCase().includes(value.toLowerCase())
      );
      setCompanySuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setCompanySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectCompany = (company) => {
    setDesiredCompany(company);
    setShowSuggestions(false);
  };

  const toggleCustomRoleInput = () => {
    if (!showCustomRoleInput) {
      // Switching to custom input
      setCustomRole(desiredRole || "Software Engineer");
    } else {
      // Switching back to select
      setDesiredRole(customRole || "Software Engineer");
    }
    setShowCustomRoleInput((prev) => !prev);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles["form-group"]}>
            <label>
              <FiUser className={styles["label-icon"]} />
              Desired Company:
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                value={desiredCompany}
                onChange={handleCompanyInputChange}
                onFocus={() =>
                  desiredCompany.length > 1 && setShowSuggestions(true)
                }
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className={styles["text-input"]}
                placeholder="Enter your dream company"
              />
              {showSuggestions && companySuggestions.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    zIndex: 10,
                    maxHeight: "200px",
                    overflowY: "auto",
                    marginTop: "4px",
                  }}
                >
                  {companySuggestions.map((company, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "8px 16px",
                        cursor: "pointer",
                        listStyle: "none",
                      }}
                      onMouseDown={() => selectCompany(company)}
                    >
                      {company}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label>
              <FiUser className={styles["label-icon"]} />
              Desired Role:
            </label>

            {showCustomRoleInput ? (
              <div>
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className={styles["text-input"]}
                  placeholder="Enter your desired role"
                  required
                />
                <button
                  type="button"
                  onClick={toggleCustomRoleInput}
                  style={{
                    marginTop: "8px",
                    background: "transparent",
                    border: "none",
                    color: "#4361ee",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  ← Select from list instead
                </button>
              </div>
            ) : (
              <div>
                <select
                  value={desiredRole}
                  onChange={(e) => setDesiredRole(e.target.value)}
                  className={styles["select-input"]}
                  required
                >
                  {jobRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={toggleCustomRoleInput}
                  style={{
                    marginTop: "8px",
                    background: "transparent",
                    border: "none",
                    color: "#4361ee",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Can&apos;t find your role? Enter manually →
                </button>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className={styles["form-group"]}>
            <label>
              <FiUpload className={styles["label-icon"]} />
              Upload Resume:
            </label>
            <div className={styles["upload-container"]}>
              <input
                type="file"
                id="resume-upload"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className={styles["file-input"]}
              />
              <label htmlFor="resume-upload" className={styles["upload-label"]}>
                {resume ? resume.name : "Choose file"}
              </label>
              {resume && (
                <div className={styles["file-preview"]}>
                  Resume uploaded: {resume.name}
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles["form-group"]}>
            <label>
              <FiMic className={styles["label-icon"]} />
              Audio Permissions:
            </label>
            <div className={styles["permission-container"]}>
              <button
                type="button"
                onClick={requestAudioPermission}
                className={styles["permission-button"]}
                disabled={audioPermission}
              >
                {audioPermission
                  ? "Microphone Access Granted"
                  : "Allow Microphone Access"}
              </button>
              {audioPermission && (
                <span className={styles["permission-check"]}>✓</span>
              )}
            </div>

            <label>
              <FiCamera className={styles["label-icon"]} />
              Camera Permissions:
            </label>
            <div className={styles["permission-container"]}>
              <button
                type="button"
                onClick={
                  cameraPermission ? stopCamera : requestCameraPermission
                }
                className={styles["permission-button"]}
              >
                {cameraPermission ? "Turn Off Camera" : "Allow Camera Access"}
              </button>
              {cameraPermission && (
                <span className={styles["permission-check"]}>✓</span>
              )}
            </div>

            {cameraPermission && (
              <div className={styles["camera-preview"]}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={styles["camera-feed"]}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <>
            <div className={styles["form-group"]}>
              <label>
                <FiUser className={styles["label-icon"]} />
                Job Role:
              </label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className={styles["select-input"]}
              >
                {jobRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label>
                <FiAward className={styles["label-icon"]} />
                Difficulty:
              </label>
              <div className={styles["radio-group"]}>
                {["easy", "medium", "hard"].map((level) => (
                  <label key={level} className={styles["radio-label"]}>
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={difficulty === level}
                      onChange={() => setDifficulty(level)}
                    />
                    <span>
                      {level === "easy"
                        ? "Beginner"
                        : level === "medium"
                        ? "Intermediate"
                        : "Advanced"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles["form-group"]}>
              <label>
                <FiSettings className={styles["label-icon"]} />
                Interview Type:
              </label>
              <div className={styles["radio-group"]}>
                {["technical", "behavioral", "mixed"].map((type) => (
                  <label key={type} className={styles["radio-label"]}>
                    <input
                      type="radio"
                      name="interviewType"
                      value={type}
                      checked={interviewType === type}
                      onChange={() => setInterviewType(type)}
                    />
                    <span>
                      {type === "technical"
                        ? "Technical"
                        : type === "behavioral"
                        ? "Behavioral"
                        : "Mixed"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles["form-group"]}>
              <label>
                <FiMic className={styles["label-icon"]} />
                Interview Mode:
              </label>
              <div className={styles["radio-group"]}>
                {["voice", "text"].map((mode) => (
                  <label key={mode} className={styles["radio-label"]}>
                    <input
                      type="radio"
                      name="interviewMode"
                      value={mode}
                      checked={interviewMode === mode}
                      onChange={() => setInterviewMode(mode)}
                    />
                    {mode === "voice" ? (
                      <>
                        <FiMic />
                        <span>Voice Interview</span>
                      </>
                    ) : (
                      <>
                        <FiType />
                        <span>Text Interview</span>
                      </>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles["setup-container"]} ${
        isMounted ? styles["animate-in"] : ""
      }`}
    >
      <div className={styles["setup-header"]}>
        <FiSettings className={styles["header-icon"]} />
        <h1>AI Mock Interview</h1>
        <p>
          Practice with realistic AI-powered interviews tailored to your role
          and experience level
        </p>

        <div className={styles["progress-steps"]}>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`${styles["step"]} ${
                currentStep === step ? styles["active"] : ""
              } ${currentStep > step ? styles["completed"] : ""}`}
            >
              <div className={styles["step-number"]}>{step}</div>
              <div className={styles["step-label"]}>
                {step === 1
                  ? "Basic Info"
                  : step === 2
                  ? "Resume"
                  : step === 3
                  ? "Permissions"
                  : "Interview Setup"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles["interview-setup-form"]}>
        {renderStep()}

        <div className={styles["step-navigation"]}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className={styles["prev-button"]}
            >
              <FiChevronLeft /> Previous
            </button>
          )}

          <div className={styles["step-action-buttons"]}>
            <button
              type="button"
              onClick={handleSkipStep}
              className={styles["skip-button"]}
            >
              <FiSkipForward /> Skip
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className={styles["next-button"]}
                disabled={
                  (currentStep === 1 &&
                    (!desiredCompany ||
                      (!showCustomRoleInput && !desiredRole) ||
                      (showCustomRoleInput && !customRole))) ||
                  (currentStep === 3 &&
                    interviewMode === "voice" &&
                    !audioPermission)
                }
              >
                Next <FiChevronRight />
              </button>
            ) : (
              <button
                type="submit"
                className={styles["start-button"]}
                disabled={interviewMode === "voice" && !audioPermission}
              >
                Start Interview
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}