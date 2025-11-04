// src/app/main/dashboard/employee/profile/utils/formatDate.js

export const formatDate = (dateString) => {
    if (!dateString || dateString === 'Present') return dateString;
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
};
