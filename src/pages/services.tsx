import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Calendar, Users, MessageSquare, Megaphone, CreditCard, BarChart3, Clock, Globe } from 'lucide-react';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Services() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const services = [
    {
      icon: Calendar,
      title: "Event Planning",
      description: "Comprehensive event planning services from concept to execution. Our platform helps you manage every detail efficiently.",
      color: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Users,
      title: "Registration Management",
      description: "Streamlined registration process with customizable forms and automated confirmation emails.",
      color: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: MessageSquare,
      title: "Communication Tools",
      description: "Built-in messaging and notification systems to keep your attendees informed and engaged.",
      color: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Megaphone,
      title: "Marketing & Promotion",
      description: "Integrated marketing tools to promote your events across multiple channels and platforms.",
      color: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Secure payment gateway integration for ticket sales and vendor payments.",
      color: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Detailed insights and analytics to measure your event's success and ROI.",
      color: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      icon: Clock,
      title: "Schedule Management",
      description: "Advanced scheduling tools for managing multiple sessions and tracks.",
      color: "bg-pink-50",
      iconColor: "text-pink-600"
    },
    {
      icon: Globe,
      title: "Virtual Events",
      description: "Complete virtual and hybrid event solutions with integrated streaming capabilities.",
      color: "bg-teal-50",
      iconColor: "text-teal-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6" data-aos="fade-right">
                <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 leading-tight">
                  Our Services
                </h1>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Comprehensive event management solutions tailored to your needs. From planning to execution, we've got you covered.
                </p>
              </div>
              <div className="flex justify-center" data-aos="fade-left">
                <Image
                  src="/images/services-photo.png"
                  alt="Services Illustration"
                  width={500}
                  height={500}
                  className="max-w-full h-auto transform hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`${service.color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className={`mb-4 flex justify-center ${service.iconColor}`}>
                    <div className={`p-4 rounded-full bg-white shadow-md`}>
                      <service.icon size={32} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 text-center">
                    {service.description}
                  </p>
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