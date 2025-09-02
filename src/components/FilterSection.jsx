// src/components/FilterSection.jsx
"use client";

import { useState, useEffect } from 'react';

const FilterSection = ({ onFilterChange, schools }) => {
  const [filters, setFilters] = useState({
    city: 'All',
    board: 'All',
    type: 'All',
    hostel: 'All'
  });

  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Extract unique cities from schools data
    const uniqueCities = [...new Set(schools.map(school => school.city))];
    setCities(uniqueCities);
  }, [schools]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose City</label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Board Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose Board</label>
          <select
            value={filters.board}
            onChange={(e) => handleFilterChange('board', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Boards</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="State Board">State Board</option>
            <option value="IB">IB</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose Type</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Co-ed">Co-ed</option>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
          </select>
        </div>

        {/* Hostel Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hostel Facility</label>
          <select
            value={filters.hostel}
            onChange={(e) => handleFilterChange('hostel', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;