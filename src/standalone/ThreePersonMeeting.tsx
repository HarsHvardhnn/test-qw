import React, { useState } from 'react';
import { Camera, ChevronRight, Link, Mic, MicOff, Share, Users, Video, VideoOff } from 'lucide-react';
import { GlassmorphicButton } from '../components/GlassmorphicButton';
import { MeetingHeader } from '../components/MeetingHeader';
import { QwilloLogo } from '../components/QwilloLogo';

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  initials: string;
  image?: string;
}

const participants: Participant[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    isHost: true,
    audioEnabled: true,
    videoEnabled: true,
    initials: 'SJ',
    image: 'https://images.unsplash.com/photo-1580923368248-877f237696cd?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    name: 'Michael Chen',
    isHost: false,
    audioEnabled: true,
    videoEnabled: true,
    initials: 'MC',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    isHost: false,
    audioEnabled: true,
    videoEnabled: false,
    initials: 'ER',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80'
  }
];

export const ThreePersonMeeting = () => {
  const [showParticipants, setShowParticipants] = useState(false);
  const [activeParticipant, setActiveParticipant] = useState<string>(participants[0].id);
  const [isScreenshotHovered, setIsScreenshotHovered] = useState(false);

  const handleScreenshot = () => {
    // Screenshot functionality would go here
    console.log('Taking screenshot...');
  };

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* Header */}
      <MeetingHeader companyName="Kitchen Remodel Consultation" timeLeft={300} />

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Main Meeting Area */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Video Grid */}
          <div 
            className="flex-1 glassmorphic rounded-xl relative overflow-hidden min-h-0 p-4" 
            style={{ height: 'calc(100vh - 264px)' }}
          >
            <div className="h-full flex gap-4">
              {/* Main Active Video */}
              <div className="flex-1 rounded-lg overflow-hidden relative">
                {participants.find(p => p.id === activeParticipant)?.videoEnabled ? (
                  <img 
                    src={participants.find(p => p.id === activeParticipant)?.image}
                    alt={participants.find(p => p.id === activeParticipant)?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-blue-400/20 flex items-center justify-center text-white text-3xl mx-auto mb-4">
                        {participants.find(p => p.id === activeParticipant)?.initials}
                      </div>
                      <p className="text-white">{participants.find(p => p.id === activeParticipant)?.name}</p>
                    </div>
                  </div>
                )}

                {/* Floating Screenshot Button */}
                <button
                  onClick={handleScreenshot}
                  onMouseEnter={() => setIsScreenshotHovered(true)}
                  onMouseLeave={() => setIsScreenshotHovered(false)}
                  className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-300 ${
                    isScreenshotHovered
                      ? 'bg-blue-400/30 scale-110'
                      : 'bg-black/40'
                  }`}
                >
                  <Camera className={`w-5 h-5 ${
                    isScreenshotHovered ? 'text-white' : 'text-white/70'
                  }`} />
                </button>

                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  {participants.find(p => p.id === activeParticipant)?.audioEnabled ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-white text-sm">
                    {participants.find(p => p.id === activeParticipant)?.name}
                  </span>
                </div>
              </div>

              {/* Other Participants - Stacked Vertically */}
              <div className="w-64 flex flex-col gap-4">
                <div 
                  className="flex-1 rounded-lg overflow-hidden relative cursor-pointer group"
                  onClick={() => setActiveParticipant(participants[1].id)}
                >
                  <img 
                    src={participants[1].image}
                    alt={participants[1].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-white" />
                    <span className="text-white text-sm">{participants[1].name}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div 
                  className="flex-1 rounded-lg overflow-hidden relative cursor-pointer group bg-black/30"
                  onClick={() => setActiveParticipant(participants[2].id)}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-blue-400/20 flex items-center justify-center text-white text-xl mx-auto mb-2">
                        {participants[2].initials}
                      </div>
                      <p className="text-white text-sm">{participants[2].name}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-white" />
                    <VideoOff className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="h-16 glassmorphic rounded-xl flex items-center justify-center space-x-4">
            <button className="p-3 rounded-lg bg-blue-400/20 text-white">
              <Mic className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-lg bg-blue-400/20 text-white">
              <Video className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Users className="w-6 h-6" />
            </button>
            <button className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              <div className="w-6 h-6">
                <QwilloLogo variant="icon" />
              </div>
            </button>
            <GlassmorphicButton
              variant="primary"
              className="px-6"
            >
              Generate Summary 
            </GlassmorphicButton>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 flex flex-col gap-4">
          {/* Topics List */}
          <div className="glassmorphic rounded-xl p-4 flex flex-col" style={{ height: 'calc(100vh - 264px)' }}>
            <h3 className="text-white font-semibold mb-4">Kitchen Remodel Topics</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Topics content would go here */}
            </div>
          </div>

          {/* Media Tools */}
          <div className="h-16 glassmorphic rounded-xl flex items-center justify-center px-4">
            <div className="grid grid-cols-2 gap-2 w-full">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex flex-col items-center justify-center">
                <Camera className="w-4 h-4 mb-0.5" />
                <span className="text-xs">Capture</span>
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white flex flex-col items-center justify-center">
                <Share className="w-4 h-4 mb-0.5" />
                <span className="text-xs">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};