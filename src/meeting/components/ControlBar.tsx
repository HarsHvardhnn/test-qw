import React from 'react';
import { Mic, MicOff, Video, VideoOff, Users } from 'lucide-react';
import { GlassmorphicButton } from '../../components/GlassmorphicButton';
import { QwilloLogo } from '../../components/QwilloLogo';

interface ControlBarProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onAudioToggle: () => void;
  onVideoToggle: () => void;
  onParticipantsToggle: () => void;
  onAIToggle: () => void;
  onSummary: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  onAudioToggle,
  onVideoToggle,
  onParticipantsToggle,
  onAIToggle,
  onSummary
}) => {
  return (
    <div className="h-16 glassmorphic rounded-xl flex items-center justify-center space-x-4">
      <button
        onClick={onAudioToggle}
        className={`p-3 rounded-lg transition-colors ${
          isAudioEnabled ? 'bg-blue-400/20 text-white' : 'bg-red-400/20 text-red-400'
        }`}
      >
        {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </button>
      <button
        onClick={onVideoToggle}
        className={`p-3 rounded-lg transition-colors ${
          isVideoEnabled ? 'bg-blue-400/20 text-white' : 'bg-white/10 text-gray-400'
        }`}
      >
        {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
      </button>
      <button
        onClick={onParticipantsToggle}
        className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <Users className="w-6 h-6" />
      </button>
      <button
        onClick={onAIToggle}
        className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <div className="w-6 h-6">
          <QwilloLogo variant="icon" />
        </div>
      </button>
      <GlassmorphicButton
        variant="primary"
        onClick={onSummary}
        className="px-6"
      >
        Generate Summary
      </GlassmorphicButton>
    </div>
  );
};