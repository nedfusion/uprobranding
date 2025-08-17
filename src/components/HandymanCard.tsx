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
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center overflow-hidden">
              {handyman.profileImage ? (
                <img
                  src={handyman.profileImage}
                  alt={handyman.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-forest-600" />
              )}
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {handyman.name}
                </h3>
                {handyman.verified && (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-600 ml-1">Verified</span>
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
              
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span>{handyman.experience} years experience</span>
                <span className="mx-2">•</span>
                <span>{handyman.completedJobs} jobs completed</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              ₦{handyman.priceRange.min.toLocaleString()} - ₦{handyman.priceRange.max.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Starting price</p>
          </div>
        </div>

        {/* Service Categories */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {handyman.serviceCategories.map(category => (
              <span
                key={category}
                className="px-3 py-1 bg-forest-100 text-forest-800 text-sm rounded-full"
              >
                {SERVICE_CATEGORIES[category]}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4">
          {handyman.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
        <div className="flex space-x-3">
          <button 
            onClick={() => onBook?.(handyman.id)}
            className="flex-1 bg-forest-600 text-white py-2 px-4 rounded-md hover:bg-forest-700 transition-colors"
          >
            Book Now
          </button>
          
          <button 
            onClick={() => onMessage?.(handyman.id)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </button>
          
          <button 
            onClick={() => onCall?.(handyman.id)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
}