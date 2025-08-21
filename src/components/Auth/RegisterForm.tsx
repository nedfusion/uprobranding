import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { NIGERIAN_STATES, SERVICE_CATEGORIES, ServiceCategory } from '../../types';
import { Eye, EyeOff, Wrench, Upload, X, Camera } from 'lucide-react';

interface ProfilePictureState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  error: string | null;
}

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'customer' as 'customer' | 'service_provider',
    state: '',
    lga: '',
    address: '',
    serviceCategories: [] as ServiceCategory[],
    agreeToTerms: false
  });
  
  const [profilePicture, setProfilePicture] = useState<ProfilePictureState>({
    file: null,
    preview: null,
    isUploading: false,
    error: null
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCategoryChange = (category: ServiceCategory) => {
    setFormData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(category)
        ? prev.serviceCategories.filter(c => c !== category)
        : [...prev.serviceCategories, category]
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setProfilePicture(prev => ({
        ...prev,
        error: 'Please select a valid image file (JPEG, PNG, or GIF)'
      }));
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setProfilePicture(prev => ({
        ...prev,
        error: 'File size must be less than 5MB'
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicture({
        file,
        preview: e.target?.result as string,
        isUploading: false,
        error: null
      });
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    setProfilePicture({
      file: null,
      preview: null,
      isUploading: false,
      error: null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.userType === 'service_provider' && formData.serviceCategories.length === 0) {
      setError('Please select at least one service category');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        type: formData.userType,
        state: formData.state,
        lga: formData.lga,
        address: formData.address,
        serviceCategories: formData.serviceCategories,
        profilePicture: profilePicture.file,
        password: formData.password
      });

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <img 
              src="/Logo-removebg-preview (1).png" 
              alt="UPRO" 
              className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40"
            />
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Join UPRO
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-medium text-forest-600 hover:text-forest-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Service Categories (only for handymen) */}
        {formData.userType === 'service_provider' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Service Categories *
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Select all services you can provide (you can choose multiple)
            </p>
            <div className="grid grid-cols-1 gap-2 sm:gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3 sm:p-4">
              {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded text-sm">
                  <input
                    type="checkbox"
                    checked={formData.serviceCategories.includes(key as ServiceCategory)}
                    onChange={() => handleCategoryChange(key as ServiceCategory)}
                    className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{value}</span>
                </label>
              ))}
            </div>
            {formData.serviceCategories.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Selected categories:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.serviceCategories.map(category => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-forest-100 text-forest-800"
                    >
                      {SERVICE_CATEGORIES[category]}
                      <button
                        type="button"
                        onClick={() => handleCategoryChange(category)}
                        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-forest-400 hover:bg-forest-200 hover:text-forest-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Picture Upload (only for handymen) */}
        {formData.userType === 'service_provider' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profile Picture
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Upload a professional photo to help customers recognize you (optional)
            </p>
            
            {!profilePicture.preview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  id="profile-picture-upload"
                />
                <label
                  htmlFor="profile-picture-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Camera className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-4" />
                  <span className="text-sm font-medium text-gray-900">Upload a photo</span>
                  <span className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                </label>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={profilePicture.preview}
                  alt="Profile preview"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  type="button"
                  onClick={removeProfilePicture}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-3">
                  <label
                    htmlFor="profile-picture-upload"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-500"
                  >
                    Change photo
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    id="profile-picture-upload"
                  />
                </div>
              </div>
            )}
            
            {profilePicture.error && (
              <p className="mt-2 text-sm text-red-600">{profilePicture.error}</p>
            )}
          </div>
        )}

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* User Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'customer' }))}
                className={`p-3 border rounded-md text-sm font-medium transition-colors text-center ${
                  formData.userType === 'customer'
                    ? 'border-forest-500 bg-forest-50 text-forest-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Find Services
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'service_provider' }))}
                className={`p-3 border rounded-md text-sm font-medium transition-colors text-center ${
                  formData.userType === 'service_provider'
                    ? 'border-forest-500 bg-forest-50 text-forest-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Offer Services
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-forest-500 focus:border-forest-500 text-base sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-forest-500 focus:border-forest-500 text-base sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-forest-500 focus:border-forest-500 text-base sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+2348012345678"
              className="mt-1 block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-forest-500 focus:border-forest-500 text-base sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                id="state"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-forest-500 focus:border-forest-500 text-base sm:text-sm"
              >
                <option value="">Select State</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lga" className="block text-sm font-medium text-gray-700">
                LGA
              </label>
              <input
                id="lga"
                name="lga"
                type="text"
                required
                value={formData.lga}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-forest-500 focus:border-forest-500 text-base sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-forest-500 focus:border-forest-500 text-base sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 sm:py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-forest-500 focus:border-forest-500 text-base sm:text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-forest-500 focus:border-forest-500 text-base sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-gray-300 rounded"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="text-forest-600 hover:text-forest-500 transition-colors">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-forest-600 hover:text-forest-500 transition-colors">
                Join as Service Provider
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 sm:py-2 px-4 border border-transparent text-base sm:text-sm font-medium rounded-md text-white bg-forest-500 hover:bg-forest-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}