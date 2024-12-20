import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-white via-blue-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 leading-tight">
              Evenity - Simplify Your Event Management
            </h1>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Create, manage, and track your events with our comprehensive platform. 
              From small gatherings to large conferences, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth/Login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
                Get Started
              </Link>
              <Link href="/auth/Login" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                Learn More
              </Link>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1].map((_, index) => (
                  <Image 
                    key={index}
                    src="/images/eventistry.avif" 
                    alt="User Avatar" 
                    width={40} 
                    height={40} 
                    className="rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm font-medium">
                Join 10,000+ event organizers
              </span>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <Image 
              src="/images/event2.png" 
              alt="Event Management Illustration" 
              width={500} 
              height={500} 
              className="max-w-full h-auto transform transition-transform hover:scale-105 dark:invert"
            />
          </div>
        </div>
      </div>
    </div>
  );
}