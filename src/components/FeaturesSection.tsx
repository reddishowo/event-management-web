// File: /src/components/FeaturesSection.tsx
"use client"
import {
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  TicketIcon
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function FeaturesSection() {
  const features = [
    {
      icon: CalendarIcon,
      title: "Easy Event Creation",
      description: "Quickly create and customize events with our intuitive interface.",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      aos: "fade-up",
      aosDelay: "0"
    },
    {
      icon: UsersIcon,
      title: "Attendee Management",
      description: "Track registrations, send invitations, and manage guest lists effortlessly.",
      color: "bg-green-50",
      iconColor: "text-green-600",
      aos: "fade-up",
      aosDelay: "100"
    },
    {
      icon: ChartBarIcon,
      title: "Detailed Analytics",
      description: "Gain insights with comprehensive event performance reports.",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      aos: "fade-up",
      aosDelay: "200"
    },
    {
      icon: TicketIcon,
      title: "Ticketing & Payments",
      description: "Seamless ticket sales and secure payment processing.",
      color: "bg-red-50",
      iconColor: "text-red-600",
      aos: "fade-up",
      aosDelay: "300"
    }
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <h2
            className="text-3xl md:text-4xl font-extrabold text-blue-800"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            Powerful Features for Event Professionals
          </h2>
          <p
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            data-aos="fade-down"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            Our platform provides everything you need to plan, promote, and manage successful events.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300`}
              data-aos={feature.aos}
              data-aos-duration="1000"
              data-aos-delay={feature.aosDelay}
            >
              <div className={`mb-4 flex justify-center ${feature.iconColor}`}>
                <div className={`p-4 rounded-full bg-white shadow-md ${feature.iconColor}`}>
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}