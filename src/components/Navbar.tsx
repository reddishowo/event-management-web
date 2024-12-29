"use client"
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
              {/* Replace with your logo */}
              <div className="w-8 h-9 relative">
                <img
                  src="/images/evenity-logo.jpg"
                  alt="Logo"
                  className="rounded-md"
                />
              </div>
              <span className="text-xl font-bold text-gray-800">Evenity</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-10 items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/Login"
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300 shadow-sm hover:shadow-md"
            >
              Login
            </Link>
            <Link
              href="/auth/Register"
              className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition duration-300 shadow-sm hover:shadow-md"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition duration-300"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition duration-300"
            >
              About
            </Link>
            <Link
              href="/services"
              className="block text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition duration-300"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="block text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition duration-300"
            >
              Contact
            </Link>
            <div className="pt-4 space-y-2">
              <Link
                href="/auth/Login"
                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition duration-300 shadow-sm hover:shadow-md"
              >
                Login
              </Link>
              <Link
                href="/auth/Register"
                className="block w-full text-center border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-md text-base font-medium hover:bg-blue-50 transition duration-300 shadow-sm hover:shadow-md"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}