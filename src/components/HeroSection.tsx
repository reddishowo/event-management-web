// src/components/HeroSection.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Simplify Your Event Management
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Create, manage, and track your events with our comprehensive platform. 
              From small gatherings to large conferences, we've got you covered.
            </p>
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                <Image 
                  src="/placeholder-avatar-1.jpg" 
                  alt="User Avatar" 
                  width={40} 
                  height={40} 
                  className="rounded-full border-2 border-white"
                />
                <Image 
                  src="/placeholder-avatar-2.jpg" 
                  alt="User Avatar" 
                  width={40} 
                  height={40} 
                  className="rounded-full border-2 border-white"
                />
                <Image 
                  src="/placeholder-avatar-3.jpg" 
                  alt="User Avatar" 
                  width={40} 
                  height={40} 
                  className="rounded-full border-2 border-white"
                />
              </div>
              <span className="text-gray-600 text-sm">
                Join 10,000+ event organizers
              </span>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <Image 
              src="/event-management-illustration.svg" 
              alt="Event Management Illustration" 
              width={500} 
              height={500} 
              className="max-w-full h-auto dark:invert"
            />
          </div>
        </div>
      </div>
    </div>
  );
}