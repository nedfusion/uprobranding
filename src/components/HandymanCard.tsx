import React from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  User, 
  Award, 
  MessageSquare, 
  Phone,
  CheckCircle
} from 'lucide-react';
import { SERVICE_CATEGORIES, ServiceCategory } from '../types';

interface HandymanCardProps {
  handyman: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    skills: string[];
    serviceCategories: ServiceCategory[];
    experience: number;
    priceRange: { min: number; max: number };
    location: string;
    responseTime: string;
    profileImage?: string | null;
    verified: boolean;
    completedJobs: number;
    description: string;
  };
  onBook?: (handymanId: string) => void;
  onMessage?: (handymanId: string) => void;
  onCall?: (handymanId: string) => void;
}

export function HandymanCard({ handyman, onBook, onMessage, onCall }: HandymanCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3 sm:gap-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-forest-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {handyman.profileImage ? (
                <img
                  src={handyman.profileImage}
                  alt={handyman.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-forest-600" />
              )}
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {handyman.name}
                </h3>
                {handyman.verified && (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-600 ml-1 hidden sm:inline">Verified</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    {handyman.rating}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    ({handyman.reviews} reviews)
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 mt-1 gap-1 sm:gap-0">
                <span>{handyman.experience} years experience</span>
                <span className="mx-2 hidden sm:inline">•</span>
                <span>{handyman.completedJobs} jobs completed</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              ₦{handyman.priceRange.min.toLocaleString()} - ₦{handyman.priceRange.max.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Starting price</p>
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {handyman.serviceCategories.map(category => (
              <span
                key={category}
                className="px-2 sm:px-3 py-1 bg-forest-100 text-forest-800 text-xs sm:text-sm rounded-full"
              >
                {SERVICE_CATEGORIES[category]}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">
          {handyman.description}
        </p>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 mb-4 gap-2 sm:gap-0">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {handyman.location}
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Responds in {handyman.responseTime}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button 
            onClick={() => onBook?.(handyman.id)}
            className="flex-1 bg-forest-600 text-white py-2 px-4 rounded-md hover:bg-forest-700 transition-colors text-sm sm:text-base"
          >
            Book Now
          </button>
          
          <div className="flex space-x-2 sm:space-x-3">
            <button 
              onClick={() => onMessage?.(handyman.id)}
              className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              <MessageSquare className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Message</span>
            </button>
            
            <button 
              onClick={() => onCall?.(handyman.id)}
              className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              <Phone className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}