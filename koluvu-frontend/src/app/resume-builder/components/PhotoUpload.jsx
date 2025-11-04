import React, { useState } from 'react';

const PhotoUpload = ({ 
  src, 
  alt = "Profile Photo", 
  className = "", 
  size = "w-32 h-32",
  shape = "rounded-full",
  onPhotoChange 
}) => {
  const [photoUrl, setPhotoUrl] = useState(src || '');
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhotoUrl = e.target.result;
        setPhotoUrl(newPhotoUrl);
        if (onPhotoChange) {
          onPhotoChange(newPhotoUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    document.getElementById('photo-upload-input').click();
  };

  return (
    <div className="relative inline-block">
      <div 
        className={`${size} ${shape} ${className} relative cursor-pointer group overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all duration-200`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {photoUrl ? (
          <img 
            src={photoUrl} 
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Add Photo</span>
            </div>
          </div>
        )}
        
        {/* Overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center">
              <svg className="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium">Change Photo</span>
            </div>
          </div>
        )}
      </div>
      
      <input
        id="photo-upload-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default PhotoUpload;
