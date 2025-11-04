// src/components/ui/table/page.js

"use client";

import React from "react";

const Table = ({ className = "", children, ...props }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={`w-full border-collapse border border-gray-200 ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ className = "", children, ...props }) => {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ className = "", children, ...props }) => {
  return (
    <tbody className={`bg-white ${className}`} {...props}>
      {children}
    </tbody>
  );
};

const TableRow = ({ className = "", children, ...props }) => {
  return (
    <tr
      className={`border-b border-gray-200 hover:bg-gray-50 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};

const TableHead = ({ className = "", children, ...props }) => {
  return (
    <th
      className={`px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

const TableCell = ({ className = "", children, ...props }) => {
  return (
    <td
      className={`px-4 py-3 text-sm text-gray-900 border-r border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
