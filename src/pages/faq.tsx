// File: /src/pages/faq.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function FAQ() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const faqItems = [
    {
      question: 'What is Eventify?',
      answer: 'Eventify is a comprehensive event management platform that helps you plan, manage, and execute events of all sizes efficiently.',
    },
    {
      question: 'How can I get started with Eventify?',
      answer: 'To get started with Eventify, simply sign up for an account on our website. Once registered, you can start creating and managing your events immediately.',
    },
    {
      question: 'What types of events can I manage with Eventify?',
      answer: 'Eventify supports a wide range of events, including conferences, workshops, weddings, corporate events, and more. Whether it\'s a small gathering or a large-scale event, Eventify has the tools you need.',
    },
    {
      question: 'Is there a mobile app for Eventify?',
      answer: 'Yes, Eventify offers a mobile app for both iOS and Android devices, allowing you to manage your events on the go.',
    },
    {
      question: 'How does Eventify handle payments?',
      answer: 'Eventify integrates with secure payment gateways to process ticket sales and other payments. We support multiple payment methods for your convenience.',
    },
    {
      question: 'Can I customize my event page on Eventify?',
      answer: 'Absolutely! Eventify offers extensive customization options for your event pages, allowing you to match your branding and style.',
    },
    {
      question: 'What kind of support does Eventify offer?',
      answer: 'Eventify provides 24/7 customer support through email, live chat, and phone. Our dedicated support team is always ready to assist you with any questions or issues.',
    },
    {
      question: 'How can I track the success of my event?',
      answer: 'Eventify includes powerful analytics and reporting tools that allow you to track attendee engagement, ticket sales, and overall event performance.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6" data-aos="fade-down" data-aos-duration="1000">
              <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 leading-tight">
                Frequently Asked Questions
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Find answers to common questions about Eventify and our event management services.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay={index * 100}
                >
                  <h3 className="text-2xl font-bold mb-3 text-blue-800">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
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