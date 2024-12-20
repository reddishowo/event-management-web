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
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      icon: UsersIcon,
      title: "Attendee Management",
      description: "Track registrations, send invitations, and manage guest lists effortlessly.",
      color: "bg-green-50",
      iconColor: "text-green-600",
      gradient: "from-green-500 to-green-700"
    },
    {
      icon: ChartBarIcon,
      title: "Detailed Analytics",
      description: "Gain insights with comprehensive event performance reports.",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
      gradient: "from-purple-500 to-purple-700"
    },
    {
      icon: TicketIcon,
      title: "Ticketing & Payments",
      description: "Seamless ticket sales and secure payment processing.",
      color: "bg-red-50",
      iconColor: "text-red-600",
      gradient: "from-red-500 to-red-700"
    }
  ];

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
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
              className={`${feature.color} p-6 rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2 group`}
            >
              <div className={`mb-4 flex justify-center ${feature.iconColor}`}>
                <div className={`p-4 rounded-full bg-gradient-to-br ${feature.gradient} text-white group-hover:scale-110 transition-transform`}>
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}