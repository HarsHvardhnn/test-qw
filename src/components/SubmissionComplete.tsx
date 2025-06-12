import React from 'react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { GlassmorphicButton } from './GlassmorphicButton';
import { useUser } from '../context/UserContext';

interface SubmissionCompleteProps {
  onExit: () => void;
}

export const SubmissionComplete: React.FC<SubmissionCompleteProps> = ({ onExit }) => {
  const { customerName } = useUser();

  const handleContinue = () => {
    // Navigate to the customer dashboard
    window.location.href = '/customer';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl glassmorphic rounded-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-400/20 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <h2 className="text-3xl font-semibold text-white mb-6">
          Thank you, {customerName}!
        </h2>

        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          We've prepared your custom project store based on our consultation. You'll be able to browse and select products that perfectly match your requirements, with AI assistance to help you make informed decisions.
        </p>

        <p className="text-gray-400 mb-8">
          All product selections and customization options will be at your fingertips, helping you create your perfect kitchen remodel.
        </p>

        {/* Glowing CTA Button */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-xl animate-pulse" />
          <GlassmorphicButton
            variant="primary"
            className="w-full py-5 relative z-10 border-blue-400/50"
            onClick={handleContinue}
          >
            <span className="flex items-center justify-center">
              Continue to your Project Store
              <ExternalLink className="w-5 h-5 ml-2" />
            </span>
          </GlassmorphicButton>
        </div>

        <GlassmorphicButton
          variant="secondary"
          className="w-full"
          onClick={onExit}
        >
          Exit Meeting
        </GlassmorphicButton>
      </div>
    </div>
  );
};