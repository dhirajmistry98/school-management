// src/components/SchoolCard.jsx - Enhanced with better image handling
"use client";

import Image from 'next/image';
import { useState } from 'react';

const SchoolCard = ({ school }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-100">
        {school.image && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <Image
              src={school.image}
              alt={school.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority={false}
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400 mb-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                />
              </svg>
              <span className="text-gray-500 text-sm">School Image</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {school.name}
        </h3>
        <p className="text-gray-600 text-sm mb-1 line-clamp-1">{school.address}</p>
        <p className="text-gray-600 text-sm mb-3">
          {school.city}, {school.state}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
            {school.board}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
            {school.type}
          </span>
          {school.hostel_facility === 'Yes' && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded font-medium">
              Hostel
            </span>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">📞 {school.contact}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 truncate">✉️ {school.email_id}</span>
          </div>
          <button className="w-full bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition-colors duration-200 font-medium">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolCard;