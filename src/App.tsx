import React from 'react';
import { Link } from 'react-router-dom';
import { QwilloLogo } from './components/QwilloLogo';
import { GlassmorphicButton } from './components/GlassmorphicButton';
import { ArrowRight, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';
import {clearUserSessionData} from "../src/utils/logout"

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-x-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-purple-600/20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          {/* Logo */}
          <div className="w-64 h-32 mb-12">
            <QwilloLogo variant="full" />
          </div>

          {/* Main content */}
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Click. Quote. Close.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12">
              Experience the Future of Contracting with Qwillo
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <GlassmorphicButton variant="primary">
                Start Using Qwillo
              </GlassmorphicButton>
              <GlassmorphicButton variant="secondary">
                See How It Works
              </GlassmorphicButton>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
              Transform Your Contracting Business
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="glassmorphic p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <Clock className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">
                    Instant Connection
                  </h3>
                </div>
                <p className="text-gray-300">
                  Connect with customers instantly through live phone or video
                  meetings. No more waiting for callbacks.
                </p>
              </div>

              <div className="glassmorphic p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">
                    Interactive Shopping
                  </h3>
                </div>
                <p className="text-gray-300">
                  Customers can select materials and options directly in their
                  estimate, just like an e-commerce store.
                </p>
              </div>

              <div className="glassmorphic p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-white">
                    Instant Approvals
                  </h3>
                </div>
                <p className="text-gray-300">
                  Get project approvals faster with our streamlined
                  decision-making process.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Links */}
        <div className="py-20 px-4 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
              Choose Your Platform
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link
                to="/contractor"
                onClick={() => {
                  clearUserSessionData();
                }}
                className="glassmorphic p-6 rounded-xl hover:scale-105 transition-transform"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Contractor
                </h3>
                <p className="text-gray-300 mb-4">
                  Manage projects, generate quotes, and grow your business.
                </p>
                <div className="flex items-center text-blue-400">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>

              <Link
                to="/customer?rd=csx"
                onClick={() => {
                  localStorage.setItem("csx-redirect", "true");
                }}
                className="glassmorphic p-6 rounded-xl hover:scale-105 transition-transform"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Customer
                </h3>
                <p className="text-gray-300 mb-4">
                  Track your project progress and make material selections.
                </p>
                <div className="flex items-center text-blue-400">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>

              <Link
                to="/vendor?rd=csx"
                onClick={() => {
                  localStorage.setItem("csx-redirect", "true");
                }}
                className="glassmorphic p-6 rounded-xl hover:scale-105 transition-transform"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Vendor
                </h3>
                <p className="text-gray-300 mb-4">
                  List your products and reach more customers.
                </p>
                <div className="flex items-center text-blue-400">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>

              <Link
                to="/stakeholder"
                className="glassmorphic p-6 rounded-xl hover:scale-105 transition-transform"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Stakeholder
                </h3>
                <p className="text-gray-300 mb-4">
                  Manage approvals, inspections, and fund disbursement.
                </p>
                <div className="flex items-center text-blue-400">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/10">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center">
            <div className="flex flex-wrap gap-8">
              <a
                href="/tos.pdf"
                target="_blank"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Terms of Use
              </a>
              <a
                href="/pp.pdf"
                target="_blank"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-400 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Support
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Blog
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Careers
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Press
              </a>
            </div>
            <GlassmorphicButton
              variant="primary"
              onClick={() => (window.location.href = "/meeting")}
              className="mt-4 md:mt-0"
            >
              Get a Quote
            </GlassmorphicButton>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;