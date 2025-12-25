// src/app/main/dashboard/training/PostTrainingPage.jsx
"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const PostTrainingPage = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    instituteName: "",
    email: "",
    contactPerson: "",
    phone: "",
    website: "",
    courseTitle: "",
    address: "",
    category: "",
    courseType: [],
    teachingMode: "",
    batchType: [],
    courseOverview: "",
    curriculum: [""],
    toolsCovered: [""],
    certifications: [""],
    liveProjects: false,
    trainerName: "",
    trainerExperience: "",
    trainerSpecializations: [""],
    trainerLinkedIn: "",
    aboutTrainer: "",
    duration: "",
    startDate: "",
    endDate: "",
    classTiming: "",
    courseFee: "",
    discountAvailable: false,
    discountPercent: "",
    paymentModes: [],
    refundPolicy: "",
    brochure: null,
    introVideo: "",
    images: [],
    features: [],
    agreeTerms: false,
    confirmAccuracy: false,
    tags: [""],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (name, index, value) => {
    setFormData((prev) => {
      const newArray = [...prev[name]];
      newArray[index] = value;
      return { ...prev, [name]: newArray };
    });
  };

  const addArrayItem = (name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: [...prev[name], ""],
    }));
  };

  const removeArrayItem = (name, index) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].filter((_, i) => i !== index),
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Training Course Submitted",
      description: "Your training course has been submitted for approval!",
      variant: "default",
    });
    console.log("Form submitted:", formData);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const StepIndicator = ({ stepNumber, current }) => {
    const stepLabels = {
      1: "Institute",
      2: "Course",
      3: "Schedule",
      4: "Media",
      5: "Review",
    };

    const fullStepLabels = {
      1: "Institute Info",
      2: "Course Details",
      3: "Schedule & Pricing",
      4: "Media & Features",
      5: "Review & Submit",
    };

    return (
      <div
        className={`flex flex-col items-center transition-all duration-300 ${
          current ? "scale-105" : ""
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-md
          ${
            current
              ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
              : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500"
          }`}
        >
          {stepNumber}
        </div>
        <span
          className={`text-xs md:text-sm font-medium ${
            current ? "text-indigo-600 font-bold" : "text-gray-500"
          } hidden sm:block`}
        >
          {fullStepLabels[stepNumber]}
        </span>
        <span
          className={`text-xs font-medium ${
            current ? "text-indigo-600 font-bold" : "text-gray-500"
          } sm:hidden`}
        >
          {stepLabels[stepNumber]}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-6 md:py-8 bg-gradient-to-b from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 sm:p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-purple-500 opacity-20"></div>
          <div className="absolute -right-5 -bottom-5 w-20 h-20 rounded-full bg-indigo-500 opacity-20"></div>
          <div className="relative z-10">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Training Course Registration</h1>
            <p className="text-purple-100 mt-1 sm:mt-2 text-sm sm:text-base">
              Submit your training course details for approval
            </p>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="px-3 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-5 left-0 right-0 h-1 sm:h-2 bg-gray-200 z-0 mx-8 sm:mx-16 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${(step - 1) * 25}%` }}
              ></div>
            </div>

            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="z-10">
                <StepIndicator
                  stepNumber={stepNumber}
                  current={step === stepNumber}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {step === 1 && (
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 text-sm sm:text-base">
                    1
                  </span>
                  Institute & Course Information
                </h2>
                <p className="text-gray-500 text-sm sm:text-base mt-2 ml-8 sm:ml-11">
                  Tell us about your institute and the course you're offering
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Institute
                    Name
                  </Label>
                  <Input
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    required
                  />
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Contact
                    Person
                  </Label>
                  <Input
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    required
                  />
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Email
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    required
                  />
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Phone
                  </Label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    required
                  />
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium">Website</Label>
                  <Input
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                  />
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Course Title
                  </Label>
                  <Input
                    name="courseTitle"
                    value={formData.courseTitle}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                <Label className="text-gray-700 font-medium flex items-center">
                  <span className="text-purple-500 mr-1">*</span>Institute
                  Address
                </Label>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-2 bg-white"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Category
                  </Label>
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    placeholder="e.g., HR, Software, Marketing"
                    required
                  />
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Course Type
                  </Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {["Online", "Offline", "Hybrid"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`courseType-${type}`}
                          checked={formData.courseType.includes(type)}
                          onCheckedChange={() =>
                            handleMultiSelect("courseType", type)
                          }
                          className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label
                          htmlFor={`courseType-${type}`}
                          className="text-gray-700"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Batch Type
                  </Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[
                      "Weekday",
                      "Weekend",
                      "Fast Track",
                      "Evening",
                      "Morning",
                    ].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`batchType-${type}`}
                          checked={formData.batchType.includes(type)}
                          onCheckedChange={() =>
                            handleMultiSelect("batchType", type)
                          }
                          className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label
                          htmlFor={`batchType-${type}`}
                          className="text-gray-700"
                        >
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    2
                  </span>
                  Course Details & Trainer
                </h2>
                <p className="text-gray-500 text-base mt-2 ml-11">
                  Provide detailed information about the course and trainer
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                <Label className="text-gray-700 font-medium flex items-center">
                  <span className="text-purple-500 mr-1">*</span>Course Overview
                </Label>
                <Textarea
                  name="courseOverview"
                  value={formData.courseOverview}
                  onChange={handleChange}
                  className="mt-2 bg-white"
                  rows={5}
                  required
                />
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                <Label className="text-gray-700 font-medium flex items-center">
                  <span className="text-purple-500 mr-1">*</span>Curriculum
                </Label>
                {formData.curriculum.map((item, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <Input
                      value={item}
                      onChange={(e) =>
                        handleArrayChange("curriculum", index, e.target.value)
                      }
                      className="flex-1 bg-white"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("curriculum", index)}
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("curriculum")}
                  className="mt-2 text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                >
                  + Add Module
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium">
                    Tools/Software Covered
                  </Label>
                  {formData.toolsCovered.map((item, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(
                            "toolsCovered",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 bg-white"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("toolsCovered", index)}
                        className="text-red-600 hover:bg-red-50 border-red-200"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("toolsCovered")}
                    className="mt-2 text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                  >
                    + Add Tool
                  </Button>
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium">
                    Certifications Offered
                  </Label>
                  {formData.certifications.map((item, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(
                            "certifications",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 bg-white"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("certifications", index)}
                        className="text-red-600 hover:bg-red-50 border-red-200"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("certifications")}
                    className="mt-2 text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                  >
                    + Add Certification
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                <Checkbox
                  id="liveProjects"
                  checked={formData.liveProjects}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, liveProjects: checked })
                  }
                  className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="liveProjects" className="text-gray-700">
                  Live Projects / Case Studies Included
                </Label>
              </div>

              <div className="pt-6 border-t border-blue-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Trainer Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <span className="text-purple-500 mr-1">*</span>Trainer
                      Name
                    </Label>
                    <Input
                      name="trainerName"
                      value={formData.trainerName}
                      onChange={handleChange}
                      className="mt-2 bg-white"
                      required
                    />
                  </div>
                  <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <span className="text-purple-500 mr-1">*</span>Experience
                      (Years)
                    </Label>
                    <Input
                      name="trainerExperience"
                      type="number"
                      min="0"
                      value={formData.trainerExperience}
                      onChange={handleChange}
                      className="mt-2 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>
                    Specializations
                  </Label>
                  {formData.trainerSpecializations.map((item, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                      <Input
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(
                            "trainerSpecializations",
                            index,
                            e.target.value
                          )
                        }
                        className="flex-1 bg-white"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          removeArrayItem("trainerSpecializations", index)
                        }
                        className="text-red-600 hover:bg-red-50 border-red-200"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("trainerSpecializations")}
                    className="mt-2 text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                  >
                    + Add Specialization
                  </Button>
                </div>

                <div className="mt-4 bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium">
                    LinkedIn / Profile Link
                  </Label>
                  <Input
                    name="trainerLinkedIn"
                    type="url"
                    value={formData.trainerLinkedIn}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                  />
                </div>

                <div className="mt-4 bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>About Trainer
                    (max 250 characters)
                  </Label>
                  <Textarea
                    name="aboutTrainer"
                    value={formData.aboutTrainer}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    rows={3}
                    maxLength={250}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    3
                  </span>
                  Schedule & Pricing
                </h2>
                <p className="text-gray-500 text-base mt-2 ml-11">
                  Set the course schedule and pricing details
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Duration
                  </Label>
                  <Input
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    placeholder="e.g., 6 weeks, 3 months"
                    required
                  />
                </div>
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Start Date
                  </Label>
                  <Input
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    required
                  />
                </div>
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium">End Date</Label>
                  <Input
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                <Label className="text-gray-700 font-medium flex items-center">
                  <span className="text-purple-500 mr-1">*</span>Class Timing
                </Label>
                <Input
                  name="classTiming"
                  value={formData.classTiming}
                  onChange={handleChange}
                  className="mt-2 bg-white"
                  placeholder="e.g., 7 PM - 9 PM"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium flex items-center">
                    <span className="text-purple-500 mr-1">*</span>Total Course
                    Fee (USD)
                  </Label>
                  <Input
                    name="courseFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.courseFee}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    required
                  />
                </div>
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100 flex items-center">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="discountAvailable"
                      checked={formData.discountAvailable}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, discountAvailable: checked })
                      }
                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label
                      htmlFor="discountAvailable"
                      className="text-gray-700"
                    >
                      Discount Available
                    </Label>
                  </div>
                </div>
              </div>

              {formData.discountAvailable && (
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium">
                    Discount Percentage
                  </Label>
                  <div className="flex items-center">
                    <Input
                      name="discountPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discountPercent}
                      onChange={handleChange}
                      className="mt-1 w-32 bg-white"
                    />
                    <span className="ml-2 text-gray-500">%</span>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                <Label className="text-gray-700 font-medium flex items-center">
                  <span className="text-purple-500 mr-1">*</span>Payment Modes
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {[
                    "UPI",
                    "Bank Transfer",
                    "Credit Card",
                    "Debit Card",
                    "EMI",
                    "Cash",
                  ].map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <Checkbox
                        id={`paymentMode-${mode}`}
                        checked={formData.paymentModes.includes(mode)}
                        onCheckedChange={() =>
                          handleMultiSelect("paymentModes", mode)
                        }
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <Label
                        htmlFor={`paymentMode-${mode}`}
                        className="text-gray-700"
                      >
                        {mode}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                <Label className="text-gray-700 font-medium flex items-center">
                  <span className="text-purple-500 mr-1">*</span>Refund Policy
                </Label>
                <Textarea
                  name="refundPolicy"
                  value={formData.refundPolicy}
                  onChange={handleChange}
                  className="mt-2 bg-white"
                  rows={3}
                  required
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    4
                  </span>
                  Media & Features
                </h2>
                <p className="text-gray-500 text-base mt-2 ml-11">
                  Upload course materials and select additional features
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium">
                    Course Brochure (PDF)
                  </Label>
                  <div className="mt-3">
                    <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-indigo-300 cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          className="w-10 h-10 text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">
                          {formData.brochure
                            ? formData.brochure.name
                            : "Click to upload PDF"}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        name="brochure"
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Label className="text-gray-700 font-medium">
                    Intro Video / YouTube Link
                  </Label>
                  <Input
                    name="introVideo"
                    type="url"
                    value={formData.introVideo}
                    onChange={handleChange}
                    className="mt-2 bg-white"
                    placeholder="https://youtube.com/example"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                <Label className="text-gray-700 font-medium">
                  Course Images
                </Label>
                <div className="mt-3">
                  <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-indigo-300 cursor-pointer hover:border-indigo-500 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-10 h-10 text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        {formData.images.length > 0
                          ? `${formData.images.length} files selected`
                          : "Click to upload images"}
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          images: Array.from(e.target.files),
                        })
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                <Label className="text-gray-700 font-medium">
                  Additional Features
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {[
                    "Internship Opportunity",
                    "Placement Support",
                    "Resume Building Assistance",
                    "Mock Interviews",
                    "One-on-One Mentoring",
                    "Certificate of Completion",
                    "AI Tools Integration",
                    "Industry Expert Sessions",
                    "Lifetime Access",
                    "Community Support",
                  ].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature}`}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() =>
                          handleMultiSelect("features", feature)
                        }
                        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <Label
                        htmlFor={`feature-${feature}`}
                        className="text-gray-700"
                      >
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    5
                  </span>
                  Review & Submit
                </h2>
                <p className="text-gray-500 text-base mt-2 ml-11">
                  Review your information before submission
                </p>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                <Label className="text-gray-700 font-medium">
                  Tags & Keywords
                </Label>
                {formData.tags.map((item, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <Input
                      value={item}
                      onChange={(e) =>
                        handleArrayChange("tags", index, e.target.value)
                      }
                      className="flex-1 bg-white"
                      placeholder="e.g., HR, Excel, Digital Marketing"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("tags", index)}
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("tags")}
                  className="mt-2 text-indigo-600 hover:bg-indigo-50 border-indigo-200"
                >
                  + Add Tag
                </Button>
              </div>

              <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg p-6 border border-blue-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Review Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-blue-100">
                    <span className="text-gray-600">Institute:</span>
                    <span className="font-medium text-gray-800">
                      {formData.instituteName || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-100">
                    <span className="text-gray-600">Trainer:</span>
                    <span className="font-medium text-gray-800">
                      {formData.trainerName || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-100">
                    <span className="text-gray-600">Fee:</span>
                    <span className="font-medium text-gray-800">
                      {formData.courseFee
                        ? `$${formData.courseFee}`
                        : "Not provided"}
                      {formData.discountAvailable &&
                        formData.discountPercent && (
                          <span className="text-green-600 ml-2">
                            ({formData.discountPercent}% discount)
                          </span>
                        )}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-100">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-800">
                      {formData.duration || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-blue-100">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium text-gray-800">
                      {formData.startDate || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Course Type:</span>
                    <span className="font-medium text-gray-800">
                      {formData.courseType.length > 0
                        ? formData.courseType.join(", ")
                        : "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreeTerms: checked })
                    }
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                    required
                  />
                  <Label htmlFor="agreeTerms" className="text-gray-700">
                    I agree to the Terms & Conditions and Privacy Policy
                  </Label>
                </div>
                <div className="flex items-start space-x-3 bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg border border-blue-100">
                  <Checkbox
                    id="confirmAccuracy"
                    checked={formData.confirmAccuracy}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, confirmAccuracy: checked })
                    }
                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                    required
                  />
                  <Label htmlFor="confirmAccuracy" className="text-gray-700">
                    I confirm that all the information provided above is
                    accurate and complete
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg ${
                step === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 border-gray-300 text-gray-700"
              }`}
            >
              <span className="hidden sm:inline">Back</span>
              <span className="sm:hidden">←</span>
            </Button>
            {step < 5 ? (
              <Button
                onClick={nextStep}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md"
              >
                <span className="hidden sm:inline">Continue</span>
                <span className="sm:hidden">→</span>
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.agreeTerms || !formData.confirmAccuracy}
                className={`px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md ${
                  !formData.agreeTerms || !formData.confirmAccuracy
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <span className="hidden sm:inline">Submit Training Course</span>
                <span className="sm:hidden">Submit</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostTrainingPage;
