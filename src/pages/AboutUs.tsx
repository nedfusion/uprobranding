import React from 'react';
import {
  Target,
  Eye,
  Heart,
  Shield,
  CheckCircle,
  Users,
  TrendingUp,
  Globe,
  Cloud,
  Megaphone,
  Lightbulb,
  ShoppingCart
} from 'lucide-react';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About UPRO</h1>
          <p className="text-xl md:text-2xl text-emerald-50">
            Building the World's Leading Digital Marketplace for Services
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Executive Summary */}
        <section>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Executive Summary</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              <span className="font-semibold text-emerald-600">UPRO BRANDING CONCEPTS LTD</span> is a Nigerian based international E-commerce platform for service providers.
              We provide an enabling platform for seamless and smooth transactions between end to end users.
            </p>
          </div>
        </section>

        {/* Business Areas */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Business Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <ShoppingCart className="h-12 w-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Core Commerce</h3>
              <p className="text-gray-600">Digital marketplace connecting service providers with customers globally</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <Cloud className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloud Computing</h3>
              <p className="text-gray-600">Reliable cloud infrastructure for secure and scalable operations</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <Megaphone className="h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Media & Marketing</h3>
              <p className="text-gray-600">Dedicated marketing support to boost service provider visibility</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Service</h3>
              <p className="text-gray-600">24/7 support ensuring smooth transactions and user satisfaction</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <Lightbulb className="h-12 w-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation Initiatives</h3>
              <p className="text-gray-600">Continuous platform improvements and feature enhancements</p>
            </div>
          </div>
        </section>

        {/* Mission, Vision & Goal */}
        <section className="grid md:grid-cols-3 gap-6">
          {/* Mission */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow-md p-8 border border-emerald-200">
            <div className="flex items-center mb-4">
              <Target className="h-10 w-10 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To provide a world class leading digital marketplace to enable seamless and hitch-free transactions
              between service providers and their customers.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-8 border border-blue-200">
            <div className="flex items-center mb-4">
              <Eye className="h-10 w-10 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To be the Number one digital marketplace First in Nigeria, then Africa and the World at large.
            </p>
          </div>

          {/* Goal */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg shadow-md p-8 border border-orange-200">
            <div className="flex items-center mb-4">
              <Globe className="h-10 w-10 text-orange-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Goal</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To link service providers across the globe to their various customers from the comfort of their homes and offices.
            </p>
          </div>
        </section>

        {/* Core Values - CRIST */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values (CRIST)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Empathy</h3>
              <p className="text-sm text-gray-600">Understanding and prioritizing customer needs</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reliability</h3>
              <p className="text-sm text-gray-600">Consistent and dependable service delivery</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Integrity</h3>
              <p className="text-sm text-gray-600">Honest and ethical business practices</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety</h3>
              <p className="text-sm text-gray-600">Secure platform and protected transactions</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust</h3>
              <p className="text-sm text-gray-600">Building lasting relationships through transparency</p>
            </div>
          </div>
        </section>

        {/* Products & Services */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Products & Services</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Service Providers */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow-lg p-8 border border-emerald-200">
              <div className="flex items-center mb-6">
                <TrendingUp className="h-10 w-10 text-emerald-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">For Service Providers</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">A digital marketplace to showcase your various services</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Access to a wide customer base</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Seamless and smooth means of carrying out transactions from the comfort of your home or office</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">An opportunity for increased revenue for your business</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">A safe and reliable platform to do business internationally</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Dedicated digital marketing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Customer feedback mechanism for continuous service improvement</span>
                </li>
              </ul>
            </div>

            {/* For Consumers */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-lg p-8 border border-blue-200">
              <div className="flex items-center mb-6">
                <Users className="h-10 w-10 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">For Consumers</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">A leading digital service marketplace</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">A safe platform that you can trust to satisfy your need for service</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">A vast network of service providers across the globe to choose from</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Smooth means of carrying out your transactions</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Target Market */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Target Market</h2>
          <p className="text-xl text-emerald-50">
            Service providers of various categories seeking to expand their reach and grow their business globally
          </p>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join Us?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a service provider looking to expand your reach or a customer seeking quality services,
            UPRO is here to connect you seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="bg-emerald-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-emerald-700 transition-colors inline-block"
            >
              Join as Service Provider
            </a>
            <a
              href="/search"
              className="bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-emerald-50 transition-colors inline-block"
            >
              Find Services
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
