// src/components/ui/AutocompleteInput.js

"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function AutocompleteInput({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Type to search or select...",
  className = "",
  required = false,
  error = null,
  allowCustom = true,
  maxSuggestions = 10,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter options based on input value
  useEffect(() => {
    if (!value) {
      setFilteredOptions(options.slice(0, maxSuggestions));
    } else {
      const filtered = options
        .filter((option) => option.toLowerCase().includes(value.toLowerCase()))
        .slice(0, maxSuggestions);
      setFilteredOptions(filtered);
    }
    setHighlightedIndex(-1);
  }, [value, options, maxSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange({ target: { name, value: newValue } });
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    onChange({ target: { name, value: option } });
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        } else if (allowCustom && value) {
          setIsOpen(false);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          className={`w-full text-xs font-medium border border-gray-700 bg-gray-800/40 rounded px-2 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-white ${className}`}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={toggleDropdown}
          className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-white transition-colors"
          tabIndex={-1}
        >
          {isOpen ? (
            <FaChevronUp className="w-3 h-3" />
          ) : (
            <FaChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredOptions.length > 0 ? (
            <>
              {filteredOptions.map((option, index) => (
                <div
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? "bg-blue-600 text-white"
                      : "text-gray-200 hover:bg-gray-700"
                  }`}
                >
                  {option}
                </div>
              ))}
              {allowCustom && value && !options.includes(value) && (
                <div className="border-t border-gray-600">
                  <div
                    onClick={() => handleOptionClick(value)}
                    className="px-3 py-2 text-xs cursor-pointer text-blue-400 hover:bg-gray-700 transition-colors"
                  >
                    ✨ Use "{value}" (custom)
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="px-3 py-2 text-xs text-gray-400">
              {allowCustom ? (
                value ? (
                  <span className="text-blue-400">
                    Press Enter to use "{value}"
                  </span>
                ) : (
                  "Type to search or add custom value..."
                )
              ) : (
                "No matching options found"
              )}
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && <p className="mt-0.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}
