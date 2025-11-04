// src/app/main/dashboard/employee/profile/components/SecurityNote.js

import React from 'react';

const SecurityNote = ({ isDarkMode }) => {
    return (
        <div className={`mt-10 p-6 rounded-xl ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-red-100 text-red-800'} shadow-md border ${isDarkMode ? 'border-gray-600' : 'border-red-200'}`}>
            <h3 className="font-bold text-lg mb-3">Important Security Note:</h3>
            <p className="text-sm leading-relaxed">
                Client-side JavaScript provides *basic deterrents* for screenshotting and content downloading. However, 
                for robust and foolproof protection, especially for sensitive data, it is crucial to implement server-side 
                security measures, DRM (Digital Rights Management) solutions, and consider system-level controls. These 
                client-side methods can often be bypassed by tech-savvy users.
            </p>
            <ul className="list-disc list-inside text-sm mt-4 space-y-2">
                <li>
                    <strong>Screenshot Prevention:</strong> Reliable screenshot prevention is largely a browser/OS 
                    level control and cannot be guaranteed by client-side JavaScript alone. We apply basic JavaScript 
                    event listeners as a deterrent, but they are not foolproof.
                </li>
                <li>
                    <strong>Restrict Downloads/Data Copying:</strong> Preventing content download and copy-pasting is also 
                    primarily a browser/OS concern. Client-side JavaScript event listeners are used as a deterrent, but 
                    they can be bypassed. Server-side headers and backend logic are needed for stronger control over 
                    content distribution.
                </li>
            </ul>
        </div>
    );
};

export default SecurityNote;
