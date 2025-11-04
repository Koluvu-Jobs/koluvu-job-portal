import React from "react";
import PhotoUpload from "./PhotoUpload";

const PersonalInfoSection = ({ personalInfo, onInputChange }) => {
  const fields = [
    {
      key: "fullName",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      required: true,
    },
    {
      key: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john.doe@example.com",
      required: true,
    },
    {
      key: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "+1 (555) 123-4567",
      required: true,
    },
    {
      key: "address",
      label: "Address",
      type: "text",
      placeholder: "City, State, Country",
    },
    {
      key: "linkedin",
      label: "LinkedIn Profile",
      type: "url",
      placeholder: "https://linkedin.com/in/johndoe",
    },
    {
      key: "website",
      label: "Personal Website",
      type: "url",
      placeholder: "https://johndoe.com",
    },
    {
      key: "designation",
      label: "Professional Title",
      type: "text",
      placeholder: "Software Engineer, Marketing Manager, etc.",
      required: true,
    },
  ];

  return (
    <section className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-blue-100 p-2 rounded-lg mr-3">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </span>
        Personal Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 flex items-center gap-6">
          <PhotoUpload
            src={personalInfo.photo}
            size="w-24 h-24"
            onPhotoChange={(newUrl) =>
              onInputChange({ target: { name: "photo", value: newUrl } })
            }
          />
          <div>
            <div className="text-sm text-gray-600">
              Upload a professional profile photo (optional)
            </div>
          </div>
        </div>
        {fields.map((field) => (
          <div
            key={field.key}
            className={
              field.key === "address" || field.key === "designation"
                ? "md:col-span-2"
                : ""
            }
          >
            <label
              htmlFor={field.key}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              id={field.key}
              name={field.key}
              value={personalInfo[field.key] || ""}
              onChange={onInputChange}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
              required={field.required}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-gray-50 border-l-4 border-blue-500 rounded">
        <div className="flex gap-3">
          <span className="text-blue-500 text-lg">💡</span>
          <div className="flex-1">
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-gray-900">Quick tips:</strong> Use a
              professional email • Add your location • Keep contact info current
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalInfoSection;
