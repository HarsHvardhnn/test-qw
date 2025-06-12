import React from 'react';
import { ChevronRight, Mic, MicOff, Video, VideoOff, Share } from 'lucide-react';
import { GlassmorphicButton } from './GlassmorphicButton';
import { Participant } from "@videosdk.live/react-sdk";

interface ParticipantsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Map<string, Participant>; // Updated to use VideoSDK's participant structure
}

export const ParticipantsPanel: React.FC<ParticipantsPanelProps> = ({
  isOpen,
  onClose,
  participants
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full bg-black/80 border-l border-white/10 rounded-l-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Participants</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-grow space-y-3 overflow-y-auto">
          {[...participants.values()].map((participant) => (
            <div
              key={participant.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5"
            >
              <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center text-white">
                {getInitials(participant.displayName)}
              </div>
              <div className="flex-grow">
                <p className="text-white text-sm">{participant.displayName}</p>
                <p className="text-xs text-gray-400">
                  {participant.mode === "CONFERENCE" ? "Host" : "Guest"}
                </p>
              </div>
              <div className="flex space-x-1">
                {participant.micOn ? (
                  <Mic className="w-4 h-4 text-blue-400" />
                ) : (
                  <MicOff className="w-4 h-4 text-red-400" />
                )}
                {participant.webcamOn ? (
                  <Video className="w-4 h-4 text-blue-400" />
                ) : (
                  <VideoOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        <GlassmorphicButton
          variant="secondary"
          className="mt-4"
          onClick={() => {/* Handle invite */}}
        >
          <Share className="w-4 h-4 mr-2" />
          Invite Others
        </GlassmorphicButton>
      </div>
    </div>
  );
};
