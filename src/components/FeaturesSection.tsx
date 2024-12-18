// src/components/FeaturesSection.tsx
import { 
    CalendarIcon, 
    UsersIcon, 
    ChartBarIcon, 
    TicketIcon 
  } from 'lucide-react';
  
  export default function FeaturesSection() {
    const features = [
      {
        icon: CalendarIcon,
        title: "Easy Event Creation",
        description: "Quickly create and customize events with our intuitive interface.",
        color: "text-blue-600"
      },
      {
        icon: UsersIcon,
        title: "Attendee Management",
        description: "Track registrations, send invitations, and manage guest lists effortlessly.",
        color: "text-green-600"
      },
      {
        icon: ChartBarIcon,
        title: "Detailed Analytics",
        description: "Gain insights with comprehensive event performance reports.",
        color: "text-purple-600"
      },
      {
        icon: TicketIcon,
        title: "Ticketing & Payments",
        description: "Seamless ticket sales and secure payment processing.",
        color: "text-red-600"
      }
    ];
  
    return (
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Powerful Features for Event Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides everything you need to plan, promote, and manage successful events.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center"
              >
                <div className={`mb-4 flex justify-center ${feature.color}`}>
                  <feature.icon size={48} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }