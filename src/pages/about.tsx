// File: /src/pages/about.tsx

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6" data-aos="fade-right" data-aos-duration="1000">
                <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 leading-tight">
                  About Event Management
                </h1>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Discover how we're revolutionizing event planning and management.
                </p>
                <div className="mt-6">
                  <a 
                    href="#our-mission" 
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <div className="flex justify-center" data-aos="fade-left" data-aos-duration="1000">
                <Image
                  src="/images/about-hero-Photoroom.png"
                  alt="About Us Illustration"
                  width={500}
                  height={500}
                  className="max-w-full h-auto transform transition-transform hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="py-16" id="our-mission">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-4">
              <h2
                className="text-3xl md:text-4xl font-extrabold text-blue-800"
                data-aos="fade-down"
                data-aos-duration="1000"
              >
                Our Mission
              </h2>
              <p
                className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
                data-aos="fade-down"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
                At Event Management, we're dedicated to simplifying the process of planning and executing events of all sizes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Simplicity',
                  description: 'We believe in making event management easy and intuitive for everyone.',
                  icon: 'fa-solid fa-handshake',
                },
                {
                  title: 'Innovation',
                  description: 'We continuously innovate to bring you the latest tools and features.',
                  icon: 'fa-solid fa-lightbulb',
                },
                {
                  title: 'Community',
                  description: 'We foster a community of event professionals to learn and grow together.',
                  icon: 'fa-solid fa-users',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay={index * 100}
                >
                  <div className="flex justify-center mb-4 text-blue-500">
                    <i className={`text-4xl ${item.icon}`}></i>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-blue-800 text-center">{item.title}</h3>
                  <p className="text-gray-700 text-center">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-4">
              <h2
                className="text-3xl md:text-4xl font-extrabold text-blue-800"
                data-aos="fade-down"
                data-aos-duration="1000"
              >
                Our Team
              </h2>
              <p
                className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
                data-aos="fade-down"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
                Meet the passionate individuals behind Event Management.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Farriel Arrianta',
                  role: 'Backend & Frontend Engineer',
                  image: '/images/team/osudefault.png',
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay={index * 100}
                >
                  <div className="flex justify-center mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={150}
                      height={150}
                      className="rounded-full object-cover border-4 border-white shadow-md"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-1 text-center text-blue-800">{member.name}</h3>
                  <p className="text-gray-600 text-center">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}