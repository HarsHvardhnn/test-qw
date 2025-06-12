import React from 'react';
import { Camera, Clock, List, Upload } from 'lucide-react';
import { GlassmorphicButton } from '../components/GlassmorphicButton';

interface WelcomeMessageProps {
  onBegin: () => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onBegin }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Welcome Card */}
      <div className="relative w-full max-w-2xl glassmorphic rounded-xl p-8 transform transition-all duration-300 animate-fade-in">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">
          Welcome to Your Qwillo Meeting!
        </h2>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Time Limit */}
          <div className="flex items-start space-x-4">
            <Clock className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">5-Minute Discussion</h3>
              <p className="text-gray-300 text-sm">
                Make the most of your consultation time to discuss your project details
              </p>
            </div>
          </div>

          {/* Topics List */}
          <div className="flex items-start space-x-4">
            <List className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">Guided Topics</h3>
              <p className="text-gray-300 text-sm">
                Follow the customized topics list to ensure all details are covered
              </p>
            </div>
          </div>

          {/* Upload Feature */}
          <div className="flex items-start space-x-4">
            <Upload className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">Share Media</h3>
              <p className="text-gray-300 text-sm">
                Upload photos or videos to better illustrate your project needs
              </p>
            </div>
          </div>

          {/* QView Feature */}
          <div className="flex items-start space-x-4">
            <Camera className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-1">QView Screenshots</h3>
              <p className="text-gray-300 text-sm">
                Take live screenshots during the meeting to capture important details
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-gray-300 text-center mb-8">
          Be as detailed as possible! Any unknown details can be addressed in the interactive shopping experience after your estimate is generated.
        </p>

        {/* Begin Button */}
        <GlassmorphicButton
          variant="primary"
          className="w-full text-lg py-5 hover:scale-105"
          onClick={onBegin}
        >
          Begin Meeting
        </GlassmorphicButton>
      </div>
    </div>
  );
};