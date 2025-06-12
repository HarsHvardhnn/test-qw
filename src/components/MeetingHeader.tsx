import React from "react";
import { QwilloLogo } from "./QwilloLogo";
import { Clock } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface User {
  _id: string;
  fullName: string;
  role: string;
  businessLogo?: string;
}

interface Participant {
  _id: string; // participant._id is the same as user._id
  fullName: string;
  role: string;
  businessLogo?: string;
}

interface MeetingHeaderProps {
  companyName: string;
  timeLeft: number;
  participants?: Participant[];
}

export const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  companyName,
  timeLeft,
  participants = [],
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded: any = jwtDecode(token);
      return decoded.id || decoded._id;
    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  };

  const currentUserId = getUserIdFromToken();

  const currentParticipant = participants.find((p) => p._id === currentUserId);
  const otherParticipants = participants.filter((p) => p._id !== currentUserId);

  const participantNames = otherParticipants
    .map((p) => p.fullName)
    .filter(Boolean);

  // ✅ Find business participant (even if current user isn't one)
  const businessParticipant = participants.find((p) => p.role === "business");

  const displayCompanyName = businessParticipant?.fullName || companyName;
  const displayLogo = businessParticipant?.businessLogo;

  return (
    <div className="flex gap-4">
      {/* Main Header Section */}
      <div className="hidden md:flex flex-1 h-16 glassmorphic rounded-xl items-center justify-between px-6 relative">
        {/* Dynamic Company Name */}
        <div className="text-white font-medium">{displayCompanyName}</div>

        {/* Centered Logo or Business Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
          {displayLogo ? (
            <img
              src={displayLogo}
              alt="Business Logo"
              className="w-8 h-8 object-contain rounded-full"
            />
          ) : (
            <QwilloLogo variant="icon" />
          )}
        </div>

        {/* Opposite Participant Names for 'user' */}
        <div className="text-sm text-white text-right">
          {participantNames.length > 0
            ? `Joined: ${participantNames.join(", ")}`
            : "No user joined"}
        </div>
      </div>

      {/* Topics Panel Header Section */}
      <div className="w-80 h-10 md:h-16 glassmorphic rounded md:rounded-xl flex items-center justify-between px-6">
        <div className="text-gray-400">Today | {formatDate()}</div>
        <div className="flex items-center text-white">
          <Clock className="w-4 h-4 mr-2 text-blue-400" />
          <span className="font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  );
};
