// koluvu-app/src/app/dashboard/employee/feedback/sections/FeedbackForm.js

"use client";

import { useState } from "react";
import {
  Building,
  User,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";

// Small QuestionField component (memoized for performance)
const QuestionField = ({ index, value, onChange, onRemove, canRemove }) => (
  <div className="mb-4 flex gap-3">
    <div className="flex-1">
      <label className="block text-sm font-bold text-gray-700 mb-1">
        Question {index + 1}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder="Write genuinely what was asked"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        rows="2"
      />
    </div>
    {canRemove && (
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-6 px-3 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold"
      >
        Remove
      </button>
    )}
  </div>
);

export default function FeedbackForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    department: "",
    interviewDate: "",
    interviewMode: "",
    hrName: "",
    contactNumber: "",
    emailId: "",
    companyPrimaryEmail: "",
    companySecondaryEmail: "",
    interviewQuestions: ["", "", "", "", ""],
    companyReview: "",
  });

  const [expanded, setExpanded] = useState({
    companyDetails: true,
    hrDetails: true,
    interviewQuestions: true,
    companyReview: true,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const toggle = (section) =>
    setExpanded((p) => ({ ...p, [section]: !p[section] }));

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleQuestionChange = (index, value) => {
    const newQ = [...formData.interviewQuestions];
    newQ[index] = value;
    setFormData((p) => ({ ...p, interviewQuestions: newQ }));
  };

  const addQuestion = () =>
    formData.interviewQuestions.length < 10 &&
    setFormData((p) => ({
      ...p,
      interviewQuestions: [...p.interviewQuestions, ""],
    }));

  const removeQuestion = (index) => {
    if (formData.interviewQuestions.length > 5) {
      setFormData((p) => ({
        ...p,
        interviewQuestions: p.interviewQuestions.filter((_, i) => i !== index),
      }));
    }
  };

  const isFormValid = () => {
    const required = [
      "companyName",
      "position",
      "department",
      "interviewDate",
      "interviewMode",
      "hrName",
      "contactNumber",
      "emailId",
    ];
    const hasQuestions =
      formData.interviewQuestions.filter((q) => q.trim() !== "").length >= 5;
    return required.every((f) => formData[f].trim() !== "") && hasQuestions;
  };

  const handleSubmit = () => {
    const submission = {
      ...formData,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    onSubmit(submission);
    setShowSuccess(true);

    setFormData({
      companyName: "",
      position: "",
      department: "",
      interviewDate: "",
      interviewMode: "",
      hrName: "",
      contactNumber: "",
      emailId: "",
      companyPrimaryEmail: "",
      companySecondaryEmail: "",
      interviewQuestions: ["", "", "", "", ""],
      companyReview: "",
    });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Interview Feedback Form
      </h2>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-bold">
              Submitted successfully!
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Company Details */}
        <SectionToggle
          title="Company Details"
          icon={<Building className="w-5 h-5 text-indigo-600 mr-3" />}
          expanded={expanded.companyDetails}
          onClick={() => toggle("companyDetails")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Company Name *"
              value={formData.companyName}
              onChange={(v) => handleInputChange("companyName", v)}
            />
            <InputField
              label="Position Attended *"
              value={formData.position}
              onChange={(v) => handleInputChange("position", v)}
            />
            <InputField
              label="Department *"
              value={formData.department}
              onChange={(v) => handleInputChange("department", v)}
            />
            <InputField
              type="date"
              label="Date of Interview *"
              value={formData.interviewDate}
              onChange={(v) => handleInputChange("interviewDate", v)}
            />
            <SelectField
              label="Mode of Interview *"
              value={formData.interviewMode}
              onChange={(v) => handleInputChange("interviewMode", v)}
            />
            <InputField
              type="email"
              label="Company Primary Email *"
              value={formData.companyPrimaryEmail}
              onChange={(v) => handleInputChange("companyPrimaryEmail", v)}
            />
            <InputField
              type="email"
              label="Company Secondary Email *"
              value={formData.companySecondaryEmail}
              onChange={(v) => handleInputChange("companySecondaryEmail", v)}
            />
          </div>
        </SectionToggle>

        {/* HR Details */}
        <SectionToggle
          title="HR Details"
          icon={<User className="w-5 h-5 text-teal-600 mr-3" />}
          expanded={expanded.hrDetails}
          onClick={() => toggle("hrDetails")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="HR Name *"
              value={formData.hrName}
              onChange={(v) => handleInputChange("hrName", v)}
            />
            <InputField
              type="tel"
              label="Contact Number *"
              value={formData.contactNumber}
              onChange={(v) => handleInputChange("contactNumber", v)}
            />
            <InputField
              type="email"
              label="Email ID *"
              value={formData.emailId}
              onChange={(v) => handleInputChange("emailId", v)}
            />
          </div>
        </SectionToggle>

        {/* Interview Questions */}
        <SectionToggle
          title="Interview Questions *"
          subtitle="(Min 5, Max 10)"
          icon={<MessageSquare className="w-5 h-5 text-amber-600 mr-3" />}
          expanded={expanded.interviewQuestions}
          onClick={() => toggle("interviewQuestions")}
        >
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={addQuestion}
                disabled={formData.interviewQuestions.length >= 10}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-bold"
              >
                Add Question
              </button>
            </div>

            {formData.interviewQuestions.map((q, i) => (
              <QuestionField
                key={i}
                index={i}
                value={q}
                onChange={handleQuestionChange}
                onRemove={removeQuestion}
                canRemove={formData.interviewQuestions.length > 5}
              />
            ))}
          </div>
        </SectionToggle>

        {/* Company Review */}
        <SectionToggle
          title="Company Review"
          icon={<Building className="w-5 h-5 text-purple-600 mr-3" />}
          expanded={expanded.companyReview}
          onClick={() => toggle("companyReview")}
        >
          <textarea
            value={formData.companyReview}
            onChange={(e) => handleInputChange("companyReview", e.target.value)}
            placeholder="Share your overall experience..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows="4"
          />
        </SectionToggle>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-bold"
          >
            Submit Interview Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Small Reusable Helpers ---
const SectionToggle = ({
  title,
  subtitle,
  icon,
  expanded,
  onClick,
  children,
}) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onClick}
      className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50"
    >
      <div className="flex items-center">
        {icon}
        <h3 className="text-lg font-bold text-gray-800">
          {title}
          {subtitle && (
            <span className="ml-2 text-sm text-gray-500">{subtitle}</span>
          )}
        </h3>
      </div>
      {expanded ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>
    {expanded && <div className="px-6 pb-6">{children}</div>}
  </div>
);

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const SelectField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">Select mode</option>
      <option value="In-person">In-person</option>
      <option value="Video Call">Video Call</option>
      <option value="Phone Call">Phone Call</option>
      <option value="Hybrid">Hybrid</option>
    </select>
  </div>
);
