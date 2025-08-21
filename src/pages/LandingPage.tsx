import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Search,
  Star,
  Shield,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  Wrench
} from 'lucide-react';

export function LandingPage() {
  const { user } = useAuth();

  const services = [
    'Plumbing', 'Electrical Work', 'Carpentry', 'Painting',
    'HVAC', 'Appliance Repair', 'General Maintenance', 'Landscaping',
    'Tiling', 'Cleaning', 'Generator Repair', 'Roofing'
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All handymen are verified and background-checked for your safety'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: 'Read reviews and ratings from real customers before booking'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Find help anytime, anywhere across Nigeria'
    },
    {
      icon: MapPin,
      title: 'Nationwide Coverage',
      description: 'Available in all 36 states plus FCT'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Verified Service Providers' },
    { number: '50,000+', label: 'Happy Customers' },
    { number: '37', label: 'States Covered' },
    { number: '4.8/5', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Find Trusted
                <span className="block text-white">Service Providers</span>
                Near You
              </h1>
              <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-forest-100">
                Connect with skilled professionals for all your home repair and maintenance needs across Nigeria.
              </p>
              
              {!user ? (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to="/auth/register"
                    className="bg-white text-forest-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center text-center"
                  >
                    Find Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/auth/register"
                    className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-forest-900 transition-colors inline-flex items-center justify-center text-center"
                  >
                    Join as Service Provider
                  </Link>
                </div>
              ) : (
                <Link
                  to={`/${user.type}/dashboard`}
                  className="bg-white text-forest-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center text-center"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl">
                <div className="flex items-center mb-4">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    className="flex-1 text-gray-900 placeholder-gray-500 outline-none"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.slice(0, 6).map(service => (
                    <button
                      key={service}
                      className="text-left text-gray-700 hover:text-blue-600 py-2 px-3 rounded hover:bg-blue-50 transition-colors text-xs sm:text-sm"
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-forest-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Choose UPRO?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              We make it easy to find and book trusted professionals for all your home service needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-forest-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Get your home services done in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-forest-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg sm:text-xl font-bold">
                1
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Search & Compare
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Browse service providers in your area, compare ratings, and read reviews
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-forest-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg sm:text-xl font-bold">
                2
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Book & Schedule
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Choose your preferred service provider and schedule a convenient time
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-forest-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg sm:text-xl font-bold">
                3
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Get It Done
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Relax while your service provider completes the job professionally
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Popular Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Find experts for all your home maintenance needs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {services.map(service => (
              <div
                key={service}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 text-center border hover:border-forest-200 cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-forest-600 text-lg sm:text-xl">🔧</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-forest-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl text-forest-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust UPRO for their home service needs
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/auth/register"
                className="bg-white text-forest-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Join as Service Provider
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}