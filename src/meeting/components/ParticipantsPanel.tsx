import React from 'react';
import { ChevronRight, Mic, MicOff, Video, VideoOff, Share } from 'lucide-react';
import { GlassmorphicButton } from '../../components/GlassmorphicButton';
import type { Participant } from "@videosdk.live/react-sdk";

interface ParticipantsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Map<string, Participant>;
}

export const ParticipantsPanel: React.FC<ParticipantsPanelProps> = ({
  isOpen,
  onClose,
  participants
}) => {

  const getInitials = (name: string) =>
    name.split(' ').map(part => part[0]).join('').toUpperCase();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="h-full bg-black/80 border-l border-white/10 rounded-l-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Participants</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3">
          {[...participants.values()].map(({ id, displayName, micOn, webcamOn }) => (
            <div key={id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5">
              <span className="w-10 h-10 bg-blue-400/20 text-white rounded-full flex items-center justify-center">
                {getInitials(displayName || "P")}
              </span>
              <p className="text-sm text-white">{displayName}</p>
              {micOn ? (<Mic className="text-blue-400"/>) : (<MicOff className="text-red-400"/>)}
              {webcamOn ? (<Video className="text-blue-400"/>) : (<VideoOff className="text-gray-400"/>)}
            </div>
          ))}
        </div>

        <GlassmorphicButton variant='secondary' onClick={() => {/* invite logic */}}>
          <Share /> Invite Others
        </GlassmorphicButton>
      </div>
    </div>
  );
};
