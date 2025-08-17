import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Clock,
  DollarSign,
  Phone,
  MessageSquare,
  User,
  Award
} from 'lucide-react';
import { SERVICE_CATEGORIES, NIGERIAN_STATES } from '../types';

export function ServiceSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock handymen data
  const handymen = [
    {
      id: '1',
      name: 'Ahmed Ibrahim',
      rating: 4.9,
      reviews: 127,
      skills: ['Plumbing', 'Electrical'],
      experience: 8,
      priceRange: { min: 5000, max: 15000 },
      location: 'Lagos, Nigeria',
      responseTime: '1 hour',
      profileImage: null,
      verified: true,
      completedJobs: 156,
      description: 'Expert plumber with 8 years experience. Specializes in residential and commercial plumbing repairs.'
    },
    {
      id: '2',
      name: 'John Okafor',
      rating: 4.8,
      reviews: 89,
      skills: ['Electrical', 'Generator Repair'],
      experience: 6,
      priceRange: { min: 4000, max: 12000 },
      location: 'Abuja, Nigeria',
      responseTime: '2 hours',
      profileImage: null,
      verified: true,
      completedJobs: 98,
      description: 'Licensed electrician specializing in home wiring, repairs, and generator maintenance.'
    },
    {
      id: '3',
      name: 'Samuel Adebayo',
      rating: 4.7,
      reviews: 156,
      skills: ['Carpentry', 'Tiling'],
      experience: 12,
      priceRange: { min: 8000, max: 25000 },
      location: 'Lagos, Nigeria',
      responseTime: '30 minutes',
      profileImage: null,
      verified: true,
      completedJobs: 234,
      description: 'Master carpenter with over 12 years experience in custom furniture and home improvements.'
    },
    {
      id: '4',
      name: 'Grace Emeka',
      rating: 4.9,
      reviews: 203,
      skills: ['Cleaning', 'Painting'],
      experience: 5,
      priceRange: { min: 3000, max: 8000 },
      location: 'Rivers, Nigeria',
      responseTime: '45 minutes',
      profileImage: null,
      verified: true,
      completedJobs: 267,
      description: 'Professional cleaner and painter. Provides thorough residential and commercial cleaning services.'
    }
  ];

  const filteredHandymen = handymen.filter(handyman => {
    const matchesSearch = searchQuery === '' || 
      handyman.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      handyman.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || 
      handyman.skills.some(skill => skill.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    const matchesState = selectedState === '' ||
      handyman.location.includes(selectedState);
    
    const matchesRating = rating === '' || handyman.rating >= parseFloat(rating);

    return matchesSearch && matchesCategory && matchesState && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for handymen or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              >
                <option value="">All Services</option>
                {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              >
                <option value="">All States</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredHandymen.length} Handymen Found
          </h2>
          
          <select className="px-3 py-2 border border-gray-300 rounded-md">
            <option>Sort by Relevance</option>
            <option>Highest Rated</option>
          </select>
        </div>

        {/* Handymen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHandymen.map(handyman => (
            <HandymanCard
              key={handyman.id}
              handyman={handyman}
              onBook={(id) => console.log('Book handyman:', id)}
              onMessage={(id) => console.log('Message handyman:', id)}
              onCall={(id) => console.log('Call handyman:', id)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredHandymen.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No handymen found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or browse all available services.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}