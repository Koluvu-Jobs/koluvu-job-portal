// src/app/auth/register/employer/form.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { signInWithGoogle } from "@/utils/auth/googleAuth";
import { initiateGitHubOAuth } from "@/utils/auth/githubAuth";
import { USER_TYPES, getRedirectPath } from "@/utils/auth";
import { toast } from "react-hot-toast";
import AutocompleteInput from "@/components/ui/AutocompleteInput";
import { useAuth } from "@/contexts/AuthContext";
import CaptchaVerification, {
  verifyCaptchaValue,
} from "@koluvu/components/auth/CaptchaVerification";

const FORM_CACHE_KEY = "employerRegistrationFormData";
const LOCAL_DB_KEY = "koluvu_employers";

// Autocomplete options
const INDUSTRY_OPTIONS = [
  "Information Technology (IT) & Software",
  "Healthcare & Pharmaceuticals",
  "Finance, Banking & Insurance",
  "Marketing, Advertising & PR",
  "Education & Training",
  "Manufacturing & Production",
  "Retail & E-Commerce",
  "Construction & Real Estate",
  "Telecommunication & Networking",
  "Hospitality, Travel & Tourism",
  "Automobile & Auto Components",
  "Energy, Oil, Gas & Utilities",
  "Agriculture, Farming & Forestry",
  "Media, Publishing & Entertainment",
  "Aerospace, Aviation & Defense",
  "Legal, Law & Compliance",
  "Government & Public Sector",
  "Transportation & Logistics",
  "FMCG (Fast-Moving Consumer Goods)",
  "Textile & Apparel",
  "Mining & Metals",
  "Consulting & Advisory Services",
  "Electronics & Semiconductors",
  "Chemicals & Petrochemicals",
  "Environmental Services & Sustainability",
  "Real Estate Investment & Property Management",
  "Consumer Durables",
  "NGOs & Social Enterprises",
  "Education Technology (EdTech)",
  "Financial Technology (FinTech)",
];

const COMPANY_TYPE_OPTIONS = [
  "MNC",
  "Foreign MNC",
  "Startup",
  "Manufacturing MNC",
  "Healthcare MNC",
  "NGO",
  "MSME",
  "Public Sector",
  "Small Industry",
  "Partnership",
  "Cooperative",
  "Nonprofit",
  "Sole Proprietorship",
  "Government Organization",
  "Private Limited Company",
  "Public Limited Company",
  "Educational Institution",
  "Research Organization",
  "Healthcare Institution",
];

const POSITION_OPTIONS = [
  "Software Development",
  "HR",
  "Finance and Accounts",
  "Marketing",
  "Operations",
  "Customer Support",
  "Sales",
  "Research & Development",
  "Business Development",
  "Legal",
  "Public Relations",
  "Administration",
  "Product Management",
  "Quality Assurance",
  "Design",
  "Technical Support",
  "Supply Chain Management",
  "Consulting",
];

export default function EmployerRegistrationForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaKey, setCaptchaKey] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    companyName: "",
    companyDescription: "",
    totalEmployees: "",
    industryType: "",
    companyWebsite: "",
    contactPerson: "",
    designation: "",
    phone: "",
    companyLocation: "",
    linkedinOrWebsite: "",
    companyLogo: null,
    password: "",
    confirmPassword: "",
    companyType: "",
  });

  const [fileNames, setFileNames] = useState({
    companyLogo: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const cachedData = localStorage.getItem(FORM_CACHE_KEY);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      setFormData((prev) => ({
        ...prev,
        ...parsedData,
        companyLogo: null,
      }));
      setFileNames({
        companyLogo: parsedData.companyLogoName || "",
      });
    }

    setUseLocalStorage(!process.env.NEXT_PUBLIC_DJANGO_API_URL);

    return () => {
      if (!isSubmitting) {
        localStorage.removeItem(FORM_CACHE_KEY);
      }
    };
  }, [isSubmitting]);

  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 1;
      if (/[A-Z]/.test(formData.password)) strength += 1;
      if (/[0-9]/.test(formData.password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    cacheFormData(updatedFormData);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const updatedFormData = { ...formData, [name]: files[0] };
      const updatedFileNames = { ...fileNames, [name]: files[0].name };
      setFormData(updatedFormData);
      setFileNames(updatedFileNames);
      cacheFormData({
        ...updatedFormData,
        companyLogoName:
          name === "companyLogo" ? files[0].name : fileNames.companyLogo,
      });
    }
  };

  const cacheFormData = (data) => {
    const cacheObject = {
      username: data.username,
      email: data.email,
      companyName: data.companyName,
      companyDescription: data.companyDescription,
      totalEmployees: data.totalEmployees,
      industryType: data.industryType,
      companyWebsite: data.companyWebsite,
      contactPerson: data.contactPerson,
      designation: data.designation,
      phone: data.phone,
      companyLocation: data.companyLocation,
      linkedinOrWebsite: data.linkedinOrWebsite,
      password: data.password,
      confirmPassword: data.confirmPassword,
      companyType: data.companyType,
      companyLogoName: fileNames.companyLogo,
    };
    localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(cacheObject));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, underscore and dash";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.companyName)
      newErrors.companyName = "Company name is required";
    if (!formData.companyDescription)
      newErrors.companyDescription = "Company description is required";
    if (!formData.totalEmployees)
      newErrors.totalEmployees = "Number of employees is required";
    if (!formData.industryType)
      newErrors.industryType = "Industry type is required";
    if (!formData.contactPerson)
      newErrors.contactPerson = "Contact person is required";
    if (!formData.designation)
      newErrors.designation = "Designation is required";

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.companyLocation)
      newErrors.companyLocation = "Company location is required";
    if (!formData.linkedinOrWebsite)
      newErrors.linkedinOrWebsite = "LinkedIn or website URL is required";
    if (!formData.companyLogo)
      newErrors.companyLogo = "Company logo is required";
    if (!formData.companyType)
      newErrors.companyType = "Company type is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCaptchaChange = (value, key) => {
    setCaptchaValue(value);
    setCaptchaKey(key);
  };

  const saveToLocalStorage = async () => {
    try {
      const existingData = JSON.parse(localStorage.getItem(LOCAL_DB_KEY)) || [];

      const employerData = {
        id: Date.now().toString(),
        email: formData.email,
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        totalEmployees: formData.totalEmployees,
        industryType: formData.industryType,
        companyWebsite: formData.companyWebsite,
        contactPerson: formData.contactPerson,
        designation: formData.designation,
        phone: formData.phone,
        companyLocation: formData.companyLocation,
        linkedinOrWebsite: formData.linkedinOrWebsite,
        companyType: formData.companyType,
        companyLogoName: fileNames.companyLogo,
        createdAt: new Date().toISOString(),
        isVerified: false,
      };

      existingData.push(employerData);
      localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(existingData));

      return { success: true, id: employerData.id };
    } catch (error) {
      console.error("Error saving to local storage:", error);
      return { success: false, error: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Note: CAPTCHA verification is now handled within the CaptchaVerification component
    // The component calls onCaptchaChange when verification is successful
    if (!captchaValue || !captchaKey) {
      toast.error("Please complete and verify the CAPTCHA.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("company_name", formData.companyName);
      formDataToSend.append("company_description", formData.companyDescription);
      formDataToSend.append("total_employees", formData.totalEmployees);
      formDataToSend.append("industry_type", formData.industryType);
      formDataToSend.append("company_website", formData.companyWebsite);
      formDataToSend.append("contact_person", formData.contactPerson);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("company_location", formData.companyLocation);
      formDataToSend.append("linkedin_or_website", formData.linkedinOrWebsite);
      formDataToSend.append("company_type", formData.companyType);
      if (formData.companyLogo)
        formDataToSend.append("company_logo", formData.companyLogo);
      if (formData.companyRegistrationDoc)
        formDataToSend.append(
          "company_registration_doc",
          formData.companyRegistrationDoc
        );
      if (formData.gstCertificate)
        formDataToSend.append("gst_certificate", formData.gstCertificate);

      const apiResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/api/employer/register/`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await apiResponse.json();

      if (!apiResponse.ok) {
        setSubmitError(
          data.error || `Registration failed with status: ${apiResponse.status}`
        );
        setIsSubmitting(false);
        return;
      }

      localStorage.removeItem(FORM_CACHE_KEY);
      router.push("/auth/login/employer?registered=true");
    } catch (error) {
      console.error("Registration failed:", error);
      setSubmitError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-gray-300";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const handleOAuthLogin = async (provider) => {
    if (provider === "google") {
      setLoading("google");
      try {
        console.log("Starting Google OAuth for employer registration");
        const result = await signInWithGoogle(USER_TYPES.EMPLOYER);
        console.log("Google OAuth result:", result);

        // Check for multi-user-type error
        if (result.error) {
          if (result.existing_user_type === "employee") {
            toast.error(
              "This account is already registered as an employee. Redirecting to employee login..."
            );
            setTimeout(() => {
              router.push("/auth/login/employee");
            }, 2000);
          } else {
            toast.error(result.error);
          }
          return;
        }

        // Use AuthContext login function
        login(result);
        toast.success("Successfully signed in with Google!");

        // Redirect to employer dashboard
        const redirectPath = getRedirectPath(USER_TYPES.EMPLOYER, result.username);
        console.log("Redirecting to:", redirectPath);
        router.push(redirectPath);
      } catch (error) {
        console.error("Google authentication error:", error);
        toast.error(`Failed to sign in with Google: ${error.message}`);
      } finally {
        setLoading(null);
      }
    } else if (provider === "github") {
      setLoading("github");
      try {
        console.log("Starting GitHub OAuth for employer registration");
        await initiateGitHubOAuth(USER_TYPES.EMPLOYER);
        // Note: initiateGitHubOAuth redirects to GitHub, so code after this won't execute
      } catch (error) {
        console.error("GitHub authentication error:", error);
        toast.error(`Failed to initiate GitHub login: ${error.message}`);
        setLoading(null);
      }
    } else if (provider === "linkedin") {
      // LinkedIn not implemented
      toast.error("LinkedIn login will be available soon!");
    }
  };

  return (
    <div>
      <div className="text-center mb-3">
        <h2 className="text-base sm:text-lg font-bold text-white">
          Employer Registration
        </h2>
        <p className="text-gray-300 text-xs mt-1">
          Register your company to find top talent
        </p>
      </div>

      {submitError && (
        <div className="mb-3 p-2 bg-red-500/20 border border-red-500 rounded text-red-300 text-xs">
          {submitError}
        </div>
      )}

      {useLocalStorage && (
        <div className="mb-3 p-1.5 bg-yellow-500/20 rounded text-yellow-200 text-xs">
          Note: Currently using local storage. Your data will be saved
          temporarily.
        </div>
      )}

      {/* Social Login Buttons */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => handleOAuthLogin("google")}
            disabled={loading === "google"}
            className="flex-1 min-w-[90px] border border-gray-600 bg-gray-800/60 rounded-lg px-2 py-2 flex items-center justify-center gap-1 text-xs hover:bg-gray-700/60 transition-colors text-white disabled:opacity-50"
          >
            {loading === "google" ? (
              <div className="w-3 h-3 border border-white rounded-full animate-spin border-t-transparent"></div>
            ) : (
              <FcGoogle className="w-3 h-3" />
            )}
            <span>Google</span>
          </button>
          <button
            onClick={() => handleOAuthLogin("github")}
            className="flex-1 min-w-[90px] border border-gray-600 bg-gray-800/60 rounded-lg px-2 py-2 flex items-center justify-center gap-1 text-xs hover:bg-gray-700/60 transition-colors text-white"
          >
            <FaGithub className="w-3 h-3" />
            <span>GitHub</span>
          </button>
          <button
            onClick={() => handleOAuthLogin("linkedin")}
            className="flex-1 min-w-[90px] border border-gray-600 bg-gray-800/60 rounded-lg px-2 py-2 flex items-center justify-center gap-1 text-xs hover:bg-gray-700/60 transition-colors text-white"
          >
            <FaLinkedin className="w-3 h-3 text-[#0A66C2]" />
            <span>LinkedIn</span>
          </button>
        </div>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-gray-900 text-gray-400">
            Or register manually
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
        {/* Username Field */}
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username (for your profile URL) *"
            value={formData.username}
            onChange={handleChange}
            className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white"
            required
          />
          {formData.username && (
            <p className="mt-0.5 text-xs text-blue-300">
              Your profile will be: koluvu.com/employer/{formData.username}
            </p>
          )}
          {errors.username && (
            <p className="mt-0.5 text-xs text-red-300">{errors.username}</p>
          )}
        </div>

        {/* Company Info */}
        <div>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name *"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white"
            required
          />
          {errors.companyName && (
            <p className="mt-0.5 text-xs text-red-300">{errors.companyName}</p>
          )}
        </div>

        <div>
          <textarea
            name="companyDescription"
            placeholder="Company Description *"
            value={formData.companyDescription}
            onChange={handleChange}
            className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white h-20"
            required
          />
          {errors.companyDescription && (
            <p className="mt-0.5 text-xs text-red-300">
              {errors.companyDescription}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              name="totalEmployees"
              placeholder="Employees *"
              value={formData.totalEmployees}
              onChange={handleChange}
              className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white"
              required
            />
            {errors.totalEmployees && (
              <p className="mt-0.5 text-xs text-red-300">
                {errors.totalEmployees}
              </p>
            )}
          </div>

          <div>
            <AutocompleteInput
              name="industryType"
              value={formData.industryType}
              onChange={handleChange}
              options={INDUSTRY_OPTIONS}
              placeholder="Industry *"
              required
              error={errors.industryType}
              allowCustom={true}
            />
          </div>
        </div>

        <div>
          <AutocompleteInput
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
            options={COMPANY_TYPE_OPTIONS}
            placeholder="Company Type *"
            required
            error={errors.companyType}
            allowCustom={true}
          />
        </div>

        <div>
          <input
            type="url"
            name="companyWebsite"
            placeholder="Company Website"
            value={formData.companyWebsite}
            onChange={handleChange}
            className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white"
          />
        </div>

        {/* Contact Info */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleChange}
            className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white"
            required
          />
          {errors.email && (
            <p className="mt-0.5 text-xs text-red-300">{errors.email}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person *"
              value={formData.contactPerson}
              onChange={handleChange}
              className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white"
              required
            />
            {errors.contactPerson && (
              <p className="mt-0.5 text-xs text-red-300">
                {errors.contactPerson}
              </p>
            )}
          </div>
          <div>
            <AutocompleteInput
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              options={POSITION_OPTIONS}
              placeholder="Position *"
              required
              error={errors.designation}
              allowCustom={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone *"
              value={formData.phone}
              onChange={handleChange}
              className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white"
              required
            />
            {errors.phone && (
              <p className="mt-0.5 text-xs text-red-300">{errors.phone}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <input
              type="text"
              name="companyLocation"
              placeholder="Location *"
              value={formData.companyLocation}
              onChange={handleChange}
              className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white"
              required
            />
            {errors.companyLocation && (
              <p className="mt-0.5 text-xs text-red-300">
                {errors.companyLocation}
              </p>
            )}
          </div>
        </div>

        <div>
          <input
            type="url"
            name="linkedinOrWebsite"
            placeholder="LinkedIn/Website *"
            value={formData.linkedinOrWebsite}
            onChange={handleChange}
            className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white"
            required
          />
          {errors.linkedinOrWebsite && (
            <p className="mt-0.5 text-xs text-red-300">
              {errors.linkedinOrWebsite}
            </p>
          )}
        </div>

        {/* Documents */}
        <div className="pt-1">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-0.5">
              Company Logo *
            </label>
            <div className="flex">
              <label className="flex-1 flex items-center justify-center w-full h-7 border border-gray-700 rounded bg-gray-800/40 cursor-pointer hover:border-blue-500 transition-colors">
                <span className="text-xs text-gray-300 font-medium truncate px-2">
                  {fileNames.companyLogo || "Upload Logo"}
                </span>
                <input
                  type="file"
                  name="companyLogo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
            {errors.companyLogo && (
              <p className="mt-0.5 text-xs text-red-300">
                {errors.companyLogo}
              </p>
            )}
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
                className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white pr-8"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i <= passwordStrength
                          ? getPasswordStrengthColor()
                          : "bg-gray-700"
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-2xs mt-0.5 text-gray-400">
                  {passwordStrength < 2
                    ? "Weak"
                    : passwordStrength < 4
                    ? "Moderate"
                    : "Strong"}{" "}
                  password
                </p>
              </div>
            )}
            {errors.password && (
              <p className="mt-0.5 text-xs text-red-300">{errors.password}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white pr-8"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={12} />
                ) : (
                  <FaEye size={12} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-0.5 text-xs text-red-300">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* CAPTCHA Verification */}
        <div className="pt-1">
          <CaptchaVerification
            onCaptchaChange={handleCaptchaChange}
            captchaValue={captchaValue}
            deviceType="desktop"
            required={true}
            style={{
              marginBottom: "0.5rem",
            }}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-1 sm:pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-3 py-1.5 rounded hover:opacity-90 transition-opacity text-xs"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-1 h-3 w-3 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Complete Registration"
            )}
          </button>
        </div>

        {/* Login Link */}
        <p className="text-xs text-center mt-2 text-gray-400">
          Already have an account?{" "}
          <a
            href="/auth/login/employer"
            className="text-blue-400 hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </form>
    </div>
  );
}
