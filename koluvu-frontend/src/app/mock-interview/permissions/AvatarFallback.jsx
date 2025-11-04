// src/app/main/mock-interview/permissions/AvatarFallback.jsx

"use client";

export default function AvatarFallback({ denied }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 animate-pulse-subtle">
      {denied ? (
        <span className="text-6xl" role="img" aria-label="avatar">🧑‍💻</span>
      ) : (
        <span className="text-6xl" role="img" aria-label="avatar">👤</span>
      )}
    </div>
  );
}
