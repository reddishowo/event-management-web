import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Contact() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Contact Hero Section */}
        <section className="relative bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6" data-aos="fade-right">
                <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 leading-tight">
                  Get in Touch
                </h1>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>
              <div className="flex justify-center" data-aos="fade-left">
                <Image
                  src="/images/about-hero-Photoroom.png"
                  alt="Contact Illustration"
                  width={500}
                  height={500}
                  className="max-w-full h-auto transform hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div 
                className="bg-white p-8 rounded-2xl shadow-lg"
                data-aos="fade-right"
              >
                <h2 className="text-3xl font-bold text-blue-800 mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div 
                className="space-y-8"
                data-aos="fade-left"
              >
                <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
                  <h2 className="text-3xl font-bold text-blue-800 mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Mail className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                        <p className="text-gray-600">evenity@contact.com</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Phone className="text-green-600 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                        <p className="text-gray-600">+62 (812) 345-6789</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <MapPin className="text-purple-600 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                        <p className="text-gray-600">Veteran Dalam, 6<br />Malang, East Java 65145</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
                  <h2 className="text-3xl font-bold text-blue-800 mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">What are your business hours?</h3>
                      <p className="text-gray-600">We're available Monday through Friday, 9:00 AM to 6:00 PM PST.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">How quickly do you respond?</h3>
                      <p className="text-gray-600">We typically respond to all inquiries within 24 business hours.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}