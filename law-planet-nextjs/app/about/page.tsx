import { Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">About Us</h1>
          <p className="text-xl text-blue-100">
            Welcome to Law Planet — your trusted destination for legal guidance, expert advice, and lawyer recommendations across India.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Vision & Mission */}
        <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-10 h-10 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Our Vision & Mission</h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              At <strong>Law Planet</strong>, we believe that access to quality legal services is a fundamental right for every Indian citizen. Our vision is to create a transparent, accessible, and user-friendly platform that bridges the gap between legal professionals and those seeking justice.
            </p>
            <p>
              We are committed to empowering individuals by providing:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Comprehensive legal information in simple, understandable language</li>
              <li>A verified directory of qualified lawyers across 700+ cities</li>
              <li>Tools to help you make informed decisions about your legal needs</li>
              <li>Educational resources about Indian law and the judicial system</li>
            </ul>
          </div>
        </section>

        {/* Expert Legal Help */}
        <section className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-10 h-10 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Expert Legal Help — When You Need It</h2>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Law Planet connects you with over <strong>5,000 verified lawyers</strong> practicing across <strong>3,000+ courts</strong> in India. Whether you need representation in a District Court, High Court, or the Supreme Court, our platform helps you find the right legal expert.
            </p>
            <p>
              Our lawyers specialize in diverse practice areas including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {['Criminal Law', 'Civil Law', 'Family Law', 'Property Law', 'Corporate Law', 'Tax Law', 'Labour Law', 'Constitutional Law', 'Consumer Law'].map((area) => (
                <div key={area} className="bg-white rounded-lg px-4 py-2 text-sm font-medium text-gray-800 shadow-sm">
                  {area}
                </div>
              ))}
            </div>
            <p className="mt-6">
              We serve citizens across <strong>700+ cities and towns</strong>, from metro cities to tier-3 towns, ensuring that quality legal assistance is available wherever you are in India.
            </p>
          </div>
        </section>

        {/* Our Team */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-10 h-10 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>
              <div className="p-6 -mt-16">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    AT
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Abhigyan Singh Thakur</h3>
                <p className="text-blue-600 font-medium mb-3">Founder</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Founder of Law Planet, focused on making legal support accessible, transparent, and user-friendly across India. Passionate about leveraging technology to democratize access to justice.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 h-32"></div>
              <div className="p-6 -mt-16">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    AA
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Anam Ali</h3>
                <p className="text-teal-600 font-medium mb-3">Technical Lead, B.Tech Final Year Student</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Technical Lead responsible for platform architecture, security, and overall product experience. Specializes in full-stack development and building scalable applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600 text-sm">
                Clear pricing, verified profiles, and honest information for all users
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Accessibility</h3>
              <p className="text-gray-600 text-sm">
                Making legal services reachable for every Indian, in every city
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600 text-sm">
                Only verified, qualified legal professionals on our platform
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <h3 className="font-bold text-gray-900 mb-2">Important Disclaimer</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            <strong>Law Planet is NOT a law firm.</strong> We do not provide legal advice, representation, or services. We are an informational platform that connects users with independent legal professionals. Always consult with a licensed attorney for legal matters specific to your situation.
          </p>
        </section>

      </div>
    </div>
  );
}
