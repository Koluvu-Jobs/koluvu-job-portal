// src/components/search/CompanySuggestions.js
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Building2, MapPin, Briefcase } from "lucide-react";

export default function CompanySuggestions({
  query,
  onSelect,
  isVisible,
  onClose,
  className = "",
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (query && query.length >= 2 && isVisible) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query, isVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        onClose && onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isVisible, onClose]);

  const fetchSuggestions = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/companies/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch company suggestions");
      }

      const data = await response.json();
      setSuggestions(data.companies || []);
    } catch (err) {
      console.error("Error fetching company suggestions:", err);
      setError(err.message);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = (company) => {
    onSelect && onSelect(company);
    onClose && onClose();
  };

  if (!isVisible || (!loading && suggestions.length === 0 && !error)) {
    return null;
  }

  return (
    <div
      ref={suggestionsRef}
      className={`absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto ${className}`}
    >
      {loading && (
        <div className="p-4 text-center">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">
              Searching companies...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 text-center text-red-600 text-sm">{error}</div>
      )}

      {!loading && suggestions.length > 0 && (
        <>
          <div className="p-3 border-b border-gray-100">
            <h4 className="text-sm font-medium text-gray-700">
              Company Suggestions
            </h4>
          </div>
          <div className="py-2">
            {suggestions.map((company) => (
              <div
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className="flex items-center p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
              >
                <div className="flex-shrink-0 w-12 h-12 mr-3">
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        // Fallback to company initial if image fails to load
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full ${
                      company.logo ? "hidden" : "flex"
                    } items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg`}
                  >
                    <span className="text-white font-bold text-lg">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center mb-1">
                    <Building2 className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
                    <h5 className="font-medium text-gray-900 truncate">
                      {company.name}
                    </h5>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                      {company.industry}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{company.location}</span>
                    </div>
                    <div className="flex items-center ml-2">
                      <Briefcase className="w-3 h-3 mr-1" />
                      <span>{company.jobCount} jobs</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {suggestions.length >= 8 && (
            <div className="p-3 border-t border-gray-100 text-center">
              <button
                onClick={onClose}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all results →
              </button>
            </div>
          )}
        </>
      )}

      {!loading && suggestions.length === 0 && query && query.length >= 2 && (
        <div className="p-4 text-center text-gray-500 text-sm">
          No companies found for "{query}"
        </div>
      )}
    </div>
  );
}
