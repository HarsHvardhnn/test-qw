import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

// Type declarations for SpeechRecognition are kept for compatibility,
// but the actual implementation is removed since we're using VideoSDK transcription
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface ParticipantViewProps {
  participantId: string;
  onTranscriptUpdate: (
    participantId: string,
    transcript: string,
    items: any[]
  ) => void;
  isSmallView?: boolean;
  disableSpeechRecognition?: boolean;
}

function ParticipantView({
  participantId,
  onTranscriptUpdate,
  isSmallView = false,
  disableSpeechRecognition = false,
}: ParticipantViewProps) {
  const {
    displayName,
    webcamStream,
    micStream,
    screenShareStream,
    webcamOn,
    micOn,
    screenShareOn,
    isLocal,
  } = useParticipant(participantId);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [caption, setCaption] = useState<string>("");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const participantName = isLocal ? "You" : displayName;
  const initials = getInitials(participantName);

  useEffect(() => {
    if (webcamStream && videoRef.current) {
      videoRef.current.srcObject = new MediaStream([webcamStream.track]);
    }
  }, [webcamStream]);

  useEffect(() => {
    if (micStream && audioRef.current && !isLocal) {
      const mediaStream = new MediaStream([micStream.track]);
      audioRef.current.srcObject = mediaStream;
      audioRef.current.play().catch((error) => {
        console.error("Audio playback error:", error);
      });
      return () => {
        if (audioRef.current) {
          audioRef.current.srcObject = null;
        }
      };
    }
  }, [micStream, isLocal]);

  // Speech recognition logic is completely removed because we now use VideoSDK's transcription

  const containerClasses = isSmallView
    ? "absolute bottom-0 right-0 rounded-lg  overflow-hidden shadow-lg z-10 object-fit-contain bg-transparent"
    : "relative w-full h-full rounded-lg overflow-hidden flex flex-col";

  return (
    <div className={`${containerClasses} bg-transparent`}>
      <div className="w-full h-full flex items-center justify-center relative">
        {webcamOn ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className="w-full h-full items-center justify-center object-cover rounded-lg"
          />
        ) : (
          <div
            className={`absolute inset-0  flex items-center justify-center `}
          >
            <span
              className={`${
                isSmallView ? "text-lg" : "text-2xl"
              } font-medium text-white`}
            >
              {initials}
            </span>
          </div>
        )}
        <audio
          ref={audioRef}
          autoPlay
          playsInline
          controls={false}
          muted={isLocal}
        />
      </div>

      {/* Name overlay */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
        <span
          className={`text-white ${
            isSmallView ? "text-sm" : "text-lg"
          } font-medium`}
        >
          {participantName}
        </span>
      </div>

      {/* Camera off overlay */}
      {!webcamOn && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-1.5 rounded-lg bg-gray-800/50">
            <Camera
              className={`${isSmallView ? "w-4 h-4" : "w-5 h-5"} text-gray-400`}
            />
          </div>
        </div>
      )}

      {/* Captions */}
      {!isSmallView && micOn && caption && (
        <div className="absolute bottom-12 left-4 right-4">
          <div className="bg-gray-900/80 text-white p-2 rounded text-sm">
            {caption}
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantView;
