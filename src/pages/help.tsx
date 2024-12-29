// File: /src/pages/helpcenter.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Rocket, Calendar, Users, CreditCard, BarChart, LifeBuoy } from 'lucide-react';

export default function HelpCenter() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const helpSections = [
    {
      title: 'Getting Started',
      description: 'Learn how to set up your Eventify account and start planning your first event.',
      icon: Rocket,
    },
    {
      title: 'Event Creation',
      description: 'Step-by-step guide on creating and customizing your event pages.',
      icon: Calendar,
    },
    {
      title: 'Attendee Management',
      description: 'Tips and tricks for managing your attendees and keeping them engaged.',
      icon: Users,
    },
    {
      title: 'Payments and Ticketing',
      description: 'Understand how to set up and manage payments and ticketing for your events.',
      icon: CreditCard,
    },
    {
      title: 'Analytics and Reporting',
      description: 'How to use Eventify\'s analytics tools to track your event\'s performance.',
      icon: BarChart,
    },
    {
      title: 'Troubleshooting',
      description: 'Common issues and solutions to help you resolve any problems you may encounter.',
      icon: LifeBuoy,
    },
  ];

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
                  Help Center
                </h1>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Get the support you need to make your events successful with Eventify.
                </p>
                <div className="mt-6">
                  <a
                    href="#help-sections"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
                  >
                    Explore Help Sections
                  </a>
                </div>
              </div>
              <div className="flex justify-center" data-aos="fade-left" data-aos-duration="1000">
                <Rocket size={200} className="text-blue-800" />
              </div>
            </div>
          </div>
        </section>

        {/* Help Sections */}
        <section className="py-16 bg-white" id="help-sections">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {helpSections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay={index * 100}
                >
                  <div className="flex justify-center mb-4">
                    <section.icon size={64} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-blue-800 text-center">{section.title}</h3>
                  <p className="text-gray-700 text-center">{section.description}</p>
                  <div className="mt-4 text-center">
                    <a
                      href={`#${section.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-blue-600 hover:underline"
                    >
                      Learn More
                    </a>
                  </div>
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