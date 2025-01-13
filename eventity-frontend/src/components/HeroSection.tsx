// File: /src/components/HeroSection.tsx
"use client"
import Link from 'next/link';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function HeroSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="relative overflow-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 space-y-6">
            <h1
              className="text-4xl md:text-6xl font-extrabold text-blue-800 mb-4 leading-tight"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              Evenity - Simplify Your Event Management
            </h1>
            <p
              className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed"
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              Create, manage, and track your events with our comprehensive platform. From small gatherings to large conferences, we've got you covered.
            </p>
            <div
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
              <Link href="/auth/Login" className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
                Get Started
              </Link>
              <Link href="/about" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 transition-colors">
                Learn More
              </Link>
            </div>
            <div
              className="mt-6 flex items-center space-x-4"
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="600"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((_, index) => (
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
          <div
            className="order-1 md:order-2 flex justify-center"
            data-aos="fade-left"
            data-aos-duration="1000"
          >
            <Image
              src="/images/event2.png"
              alt="Event Management Illustration"
              width={500}
              height={500}
              className="max-w-full h-auto transform transition-transform hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
}