// src/app/show-schools/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SchoolCard from '../../components/SchoolCard';
import FilterSection from '../../components/FilterSection';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    city: 'All',
    board: 'All',
    type: 'All',
    hostel: 'All'
  });
  const router = useRouter();

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    applyClientSideFiltering();
  }, [filters]);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools');
      const data = await response.json();
      setSchools(data);
      setFilteredSchools(data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredSchools = async () => {
    try {
      const queryParams = new URLSearchParams();
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'All') {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`/api/schools?${queryParams.toString()}`);
      const data = await response.json();
      setFilteredSchools(data);
    } catch (error) {
      console.error('Error fetching filtered schools:', error);
      // Fallback to client-side filtering if API doesn't support search
      applyClientSideFiltering();
    }
  };

  const applyClientSideFiltering = () => {
    let filtered = [...schools];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(school => 
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.board.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All') {
        filtered = filtered.filter(school => {
          if (key === 'hostel') {
            return value === 'Yes' ? school.hostel : !school.hostel;
          }
          return school[key] === value;
        });
      }
    });
    
    setFilteredSchools(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    fetchFilteredSchools();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Real-time search as user types
    if (value.length === 0 || value.length >= 2) {
      // Debounce the search
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        applyClientSideFiltering();
      }, 300);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">School Search</h1>
            <p className="text-lg text-gray-500 italic">Find the right school for your child.</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative flex">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="School Name..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                className="flex-1 pl-12 pr-4 py-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
              <button
                onClick={handleSearch}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-r-lg font-medium text-lg transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* City Filter */}
              <div className="relative">
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange({ ...filters, city: e.target.value })}
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-lg appearance-none cursor-pointer hover:bg-green-600 transition-colors duration-200 font-medium"
                >
                  <option value="All">Choose City</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Board Filter */}
              <div className="relative">
                <select
                  value={filters.board}
                  onChange={(e) => handleFilterChange({ ...filters, board: e.target.value })}
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-lg appearance-none cursor-pointer hover:bg-green-600 transition-colors duration-200 font-medium"
                >
                  <option value="All">Choose Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="IB">IB</option>
                  <option value="IGCSE">IGCSE</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange({ ...filters, type: e.target.value })}
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-lg appearance-none cursor-pointer hover:bg-green-600 transition-colors duration-200 font-medium"
                >
                  <option value="All">Choose Type</option>
                  <option value="Co-Education">Co-Education</option>
                  <option value="All Boys">All Boys</option>
                  <option value="All Girls">All Girls</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Hostel Filter */}
              <div className="relative">
                <select
                  value={filters.hostel}
                  onChange={(e) => handleFilterChange({ ...filters, hostel: e.target.value })}
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-lg appearance-none cursor-pointer hover:bg-green-600 transition-colors duration-200 font-medium"
                >
                  <option value="All">Hostel Facility</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-x-4 mb-8">
              <button
                onClick={() => router.push('/add-school')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Add New School
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 text-lg">
              Showing <span className="font-semibold text-gray-900">{filteredSchools.length}</span> of <span className="font-semibold text-gray-900">{schools.length}</span> schools
            </p>
          </div>

          {/* Schools Grid */}
          {filteredSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredSchools.map((school) => (
                <div key={school.id} className="group">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
                    {/* School Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-green-100">
                      {school.image ? (
                        <img 
                          src={school.image} 
                          alt={school.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                      {/* Add to Favorites Button */}
                      <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* School Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">
                        {school.name}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{school.city}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>{school.board}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{school.type}</span>
                        </div>
                        {school.hostel && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Hostel Available</span>
                          </div>
                        )}
                      </div>
                      
                      {/* View Details Button */}
                      <button className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-6">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No schools found</h3>
              <p className="text-gray-600 mb-8 text-lg">We couldn't find any schools matching your criteria. Try adjusting your filters or add a new school to our database.</p>
              <button
                onClick={() => router.push('/add-school')}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium text-lg"
              >
                Add First School
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}