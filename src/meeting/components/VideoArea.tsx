import React, { useRef, useState } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface VideoAreaProps {
  isVideoEnabled: boolean;
  participants: any[];
  onScreenshot: () => void;
}

export const VideoArea: React.FC<VideoAreaProps> = ({
  isVideoEnabled,
  participants,
  onScreenshot
}) => {
  const [isCameraFlipped, setIsCameraFlipped] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contractorVideoRef = useRef<HTMLVideoElement>(null);
  const { customerName } = useUser();

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  return (
    <div className="flex-1 glassmorphic rounded-xl relative overflow-hidden min-h-0" style={{ height: 'calc(100vh - 264px)' }}>
      {/* Customer's Video/Avatar */}
      {isVideoEnabled ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ transform: isCameraFlipped ? 'scaleX(-1)' : 'none' }}
          autoPlay
          playsInline
          muted
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-blue-400/20 flex items-center justify-center text-white text-3xl mx-auto mb-4">
              {getInitials(customerName)}
            </div>
            <p className="text-white">{customerName}</p>
          </div>
        </div>
      )}

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={onScreenshot}
          className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
          title="Take Screenshot"
        >
          <Camera className="w-5 h-5" />
        </button>
        {isVideoEnabled && (
          <button
            onClick={() => setIsCameraFlipped(!isCameraFlipped)}
            className="p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors"
            title="Flip Camera"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Contractor's Picture-in-Picture */}
      <div className="absolute bottom-4 right-4 w-48 h-32 rounded-lg overflow-hidden glassmorphic border border-white/20 shadow-lg">
        {participants[1].videoEnabled ? (
          <video
            ref={contractorVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/30">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center text-white text-lg mx-auto mb-2">
                {getInitials(participants[1].name)}
              </div>
              <p className="text-white text-sm">{participants[1].name}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};