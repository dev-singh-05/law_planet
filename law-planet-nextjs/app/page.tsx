'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, Scale, Users, Award, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { icon: <Award className="w-8 h-8" />, number: '2120', label: 'Successful Cases' },
    { icon: <FileText className="w-8 h-8" />, number: '231', label: 'Cases Closed' },
    { icon: <Users className="w-8 h-8" />, number: '3568', label: 'Trusted Clients' },
    { icon: <Scale className="w-8 h-8" />, number: '35', label: 'Expert Teams' },
  ];

  const services = [
    {
      icon: '🔍',
      title: 'Research',
      description: 'Comprehensive legal research and case law analysis to build strong foundations for your case.',
    },
    {
      icon: '⚖️',
      title: 'Advocacy',
      description: 'Expert representation in courts at all levels - District, High Court, and Supreme Court.',
    },
    {
      icon: '💼',
      title: 'Counseling',
      description: 'Professional legal counseling to help you understand your rights and options.',
    },
    {
      icon: '📋',
      title: 'Legal Advice',
      description: 'Get expert legal advice tailored to your specific situation and jurisdiction.',
    },
    {
      icon: '🤝',
      title: 'Caring',
      description: 'Compassionate approach to sensitive legal matters with confidentiality and support.',
    },
    {
      icon: '📄',
      title: 'Conveyancing',
      description: 'Property transfer, documentation, and conveyancing services for seamless transactions.',
    },
  ];

  const faqs = [
    {
      question: 'What types of legal services do you provide?',
      answer: 'Law Planet connects you with lawyers specializing in Criminal Law, Civil Law, Family Law, Property Law, Corporate Law, Tax Law, Labour Law, and Constitutional Law. Our platform helps you find the right expert for your specific legal needs.',
    },
    {
      question: 'How can I select the best Lawyer for my case?',
      answer: 'You can filter lawyers by location (district/state), specialization, court level, and years of experience. View detailed profiles including education, past cases, and client reviews to make an informed decision.',
    },
    {
      question: 'Can I file a complaint / FIR through LawPlanet?',
      answer: 'Law Planet is an informational and lawyer directory platform. For filing FIRs or official complaints, you must visit your local police station or use government portals. However, our lawyers can guide you through the process.',
    },
    {
      question: 'Do you offer free consultations?',
      answer: 'Many lawyers on our platform offer free initial consultations. You can filter by consultation fees and mode (online/offline/phone) when searching for lawyers. Contact lawyers directly to inquire about their consultation policies.',
    },
    {
      question: 'How do I know if I have a strong case?',
      answer: 'The strength of a case depends on evidence, applicable laws, and precedents. Book a consultation with a specialized lawyer who can review your situation, analyze relevant facts, and provide an honest assessment of your case.',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="relative h-[600px] flex items-center justify-center text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&h=900&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            We Help You to Solve Your Legal Situations
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Expert legal guidance for every citizen across India
          </p>
          <Link
            href="/find-a-lawyer"
            className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors shadow-lg"
          >
            Free Consultation <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-teal-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm text-teal-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Work Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">OUR WORK</h2>
            <p className="text-xl text-gray-600 italic">
              "The safety of the people shall be the highest law."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-900">{faq.question}</span>
                      {openFaq === idx ? (
                        <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 text-gray-600">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center items-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Scale className="w-32 h-32 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Legal Help?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Connect with qualified lawyers across India today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find-a-lawyer"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Find a Lawyer
            </Link>
            <Link
              href="/legal-advice"
              className="inline-flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors shadow-lg"
            >
              <MessageSquare className="w-5 h-5" />
              AI Legal Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
