"use client";

import React, { useRef } from "react";
import { allTemplates } from "../templates.js";

// Import all template components
import BlueWhiteCleanTemplate from "./templates/Pathfinder.jsx";
import DarkGreenGradientTemplate from "./templates/TheBridge.jsx";
import WhiteGrayInfographicTemplate from "./templates/WhiteGrayInfographicTemplate";
import DarkGreyProfessionalTemplate from "./templates/Trailblazer.jsx";
import BlackWhiteElegantTemplate from "./templates/Milestone.jsx";
import CreamFreshGraduateTemplate from "./templates/Navigator.jsx";

const PreviewSection = ({
  formData,
  selectedTemplate,
  resumeType,
  onEdit,
  sectionOrder,
  setSectionOrder,
  sidebarSectionOrder,
  setSidebarSectionOrder,
  sidebarColor,
  setSidebarColor,
  fontSize,
  setFontSize,
}) => {
  const previewRef = useRef(null);

  const templateComponents = {
    "blue-white-clean": BlueWhiteCleanTemplate,
    "dark-green-gradient": DarkGreenGradientTemplate,
    "white-gray-infographic": WhiteGrayInfographicTemplate,
    "dark-grey-professional": DarkGreyProfessionalTemplate,
    "black-white-elegant": BlackWhiteElegantTemplate,
    "cream-fresh-graduate": CreamFreshGraduateTemplate,
  };

  const handlePrint = () => {
    if (previewRef.current) {
      const printContent = previewRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).jsPDF;

      if (previewRef.current) {
        const element = previewRef.current;
        const originalBackground = element.style.backgroundColor;
        element.style.backgroundColor = "#ffffff";

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        element.style.backgroundColor = originalBackground;

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = 210;
        const pdfHeight = 297;
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        const templateName = getTemplateName();
        pdf.save(
          `resume-${templateName.toLowerCase().replace(/\s+/g, "-")}.pdf`
        );
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again or use the print option.");
    }
  };

  const getSelectedTemplate = () => {
    return allTemplates.find((t) => t.id === selectedTemplate);
  };

  const getTemplateName = () => {
    const template = getSelectedTemplate();
    return template ? template.name : "Resume";
  };

  const renderTemplate = () => {
    if (!selectedTemplate) {
      return (
        <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Template Selected
            </h3>
            <p className="text-gray-500 mb-6">
              Choose a template from the Templates tab to see your resume
              preview.
            </p>
            <button
              onClick={onEdit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Select Template
            </button>
          </div>
        </div>
      );
    }

    const TemplateComponent = templateComponents[selectedTemplate];

    if (!TemplateComponent) {
      return (
        <div className="w-[210mm] h-[297mm] mx-auto bg-white shadow-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Template Not Found
            </h3>
            <p className="text-gray-500 mb-6">
              The selected template could not be loaded. Please select a
              different template.
            </p>
            <button
              onClick={onEdit}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choose Different Template
            </button>
          </div>
        </div>
      );
    }

    return (
      <TemplateComponent
        formData={formData}
        sectionOrder={sectionOrder}
        sidebarSectionOrder={sidebarSectionOrder}
        sidebarColor={sidebarColor}
        fontSize={fontSize}
      />
    );
  };

  const hasData = () => {
    return (
      formData.personal?.name ||
      formData.summary ||
      formData.skillCategories?.length > 0 ||
      (formData.educations && formData.educations.some((edu) => edu.degree)) ||
      (formData.experiences &&
        formData.experiences.some((exp) => exp.designation)) ||
      (formData.projects && formData.projects.some((proj) => proj.title))
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Resume Preview
              </h2>
              {selectedTemplate && (
                <p className="text-sm text-gray-600 mt-1">
                  {getTemplateName()}
                </p>
              )}
            </div>
            {selectedTemplate && hasData() && (
              <div className="flex items-center gap-3">
                <button
                  onClick={onEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  ← Edit
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors inline-flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors inline-flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {selectedTemplate && !hasData() && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Fill out your information in the <strong>Builder</strong> tab
                  to see your resume preview.
                </p>
              </div>
            </div>
          </div>
        )}
        {!selectedTemplate && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Go to the <strong>Templates</strong> tab to select a
                  professional resume template.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex justify-center items-start py-12 bg-gray-50 min-h-[calc(100vh-120px)]">
        <div
          className="relative bg-white shadow-2xl border border-gray-300 print:shadow-none print:border-none"
          style={{
            width: "210mm",
            minHeight: "297mm",
            maxWidth: "210mm",
            maxHeight: "297mm",
            overflow: "auto",
            padding: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div
            ref={previewRef}
            style={{
              width: "210mm",
              minHeight: "297mm",
              maxWidth: "210mm",
              maxHeight: "297mm",
              background: "#ffffff",
              overflow: "hidden",
            }}
            id="preview-root"
          >
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;
