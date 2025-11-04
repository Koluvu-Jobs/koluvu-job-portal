// src/app/main/dashboard/training/components/ui/dialog.jsx
'use client';
import * as React from 'react';
import { createPortal } from 'react-dom';

const DialogContext = React.createContext();

export function Dialog({ children, open, onOpenChange }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="border-b border-gray-200 pb-4 mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-semibold text-gray-900">{children}</h2>;
}

export function DialogDescription({ children }) {
  return <p className="text-sm text-gray-500 mt-1">{children}</p>;
}

export function DialogFooter({ children }) {
  return <div className="mt-4 flex justify-end space-x-3">{children}</div>;
}
