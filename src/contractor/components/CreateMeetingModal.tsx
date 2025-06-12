import React, { useState } from "react";
import {
  Copy,
  X,
  Calendar,
  Clock,
  Video,
  Link as LinkIcon,
  Share2,
  Mail,
  Phone,
} from "lucide-react";
import { generateToken } from "../../utils/videosdk.js";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios.js";
import { toast } from "react-toastify";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [meetingLink, setMeetingLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareMethod, setShareMethod] = useState<
    "copy" | "email" | "sms" | null
  >(null);
  const [contactInfo, setContactInfo] = useState("");

  const navigate = useNavigate();

    const scheduleMeeting = async (meetingLink: string) => {
      // if (selectedContact.id == "0") {
      //   toast.warn("Customer  not selected");
      // }
      try {
        // showLoader();
        const response = await axiosInstance.post("/meeting/schedule", {
          participantId: "", // Replace with selected participant's userId
          meetingType:"",
          selectedDate:"",
          selectedTime:"",
          duration:"",
          meetingLink,
        });

        console.log("Meeting scheduled:", response.data);
      } catch (error) {
        console.error(
          "Error scheduling meeting:",
          error.response?.data || error.message
        );
        toast.error("Error scheduling meeting");
        // throw new Error("Error scheduling meeting");
      } finally {
        // hideLoader();
      }
    };
  const generateMeetingLink = async () => {
    setIsGenerating(true);

    try {
      const token = await generateToken(); // Replace with your generated token

      const response = await fetch("https://api.videosdk.live/v2/rooms", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data);
      setMeetingLink(`${window.location.origin}/meeting/${data.roomId}`);
      await scheduleMeeting(data.roomId)
    } catch (error) {
      console.error("Error generating meeting link:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    switch (shareMethod) {
      case "email":
        window.location.href = `mailto:${contactInfo}?subject=Join%20my%20Qwillo%20meeting&body=Click%20this%20link%20to%20join%20our%20meeting:%20${meetingLink}`;
        break;
      case "sms":
        window.location.href = `sms:${contactInfo}?body=Click%20this%20link%20to%20join%20our%20meeting:%20${meetingLink}`;
        break;
      default:
        handleCopy();
    }
    setShareMethod(null);
    setContactInfo("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Create Instant Meeting
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Generate a meeting link to share with your customer
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Meeting Info */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Video Consultation
                </p>
                <p className="text-sm text-gray-500">
                  Face-to-face meeting with screen sharing
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  5-Minute Meeting
                </p>
                <p className="text-sm text-gray-500">
                  Quick consultation to understand needs
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Instant Availability
                </p>
                <p className="text-sm text-gray-500">
                  No scheduling required - start immediately
                </p>
              </div>
            </div>
          </div>

          {/* Meeting Link Section */}
          {!meetingLink ? (
            <button
              onClick={generateMeetingLink}
              disabled={isGenerating}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating Link...
                </div>
              ) : (
                "Generate Meeting Link"
              )}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <LinkIcon className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  readOnly
                  value={meetingLink}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="flex items-center">
                    <Copy className="w-4 h-4 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>

              {/* Share Options */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setShareMethod("email")}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Mail className="w-4 h-4 mx-auto" />
                  <span className="mt-1 block">Email</span>
                </button>
                <button
                  onClick={() => setShareMethod("sms")}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Phone className="w-4 h-4 mx-auto" />
                  <span className="mt-1 block">SMS</span>
                </button>
                <button
                  onClick={() => setShareMethod("copy")}
                  className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Share2 className="w-4 h-4 mx-auto" />
                  <span className="mt-1 block">Share</span>
                </button>
              </div>

              {/* Contact Input */}
              {(shareMethod === "email" || shareMethod === "sms") && (
                <div className="space-y-2">
                  <input
                    type={shareMethod === "email" ? "email" : "tel"}
                    placeholder={
                      shareMethod === "email"
                        ? "Enter email address"
                        : "Enter phone number"
                    }
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShareMethod(null)}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => setMeetingLink("")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Generate New Link
                </button>
                <button
                    onClick={() => {
                      onClose();
                          window.location.href = meetingLink;
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                 Join now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
