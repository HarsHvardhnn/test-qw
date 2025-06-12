import React, { useState } from "react";
import {
  X,
  Download,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface VerificationViewerProps {
  type: "photo" | "video";
  isOpen: boolean;
  onClose: () => void;
  contentUrls: string[];
}

export const VerificationViewer: React.FC<VerificationViewerProps> = ({
  type,
  isOpen,
  onClose,
  contentUrls,
  videoUrls
}) => {
  console.log('contetnt',videoUrls)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [verificationLink] = useState(`/verifications/${type}/${Date.now()}`); // In a real app, this would be a proper URL

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? contentUrls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === contentUrls.length - 1 ? 0 : prev + 1));
  };

  const handleMessageClick = () => {
    // Store verification data in localStorage
    localStorage.setItem("verificationLink", verificationLink);
    localStorage.setItem("verificationType", type);

    // Get the parent element that contains the messages panel
    const dashboardLayout = document.querySelector(".min-h-screen.bg-gray-50");
    if (!dashboardLayout) return;

    // Find the messages button in the header
    const messagesButton = dashboardLayout.querySelector(
      'button[aria-label="Open Messages"]'
    );
    if (messagesButton instanceof HTMLButtonElement) {
      messagesButton.click();
    }

    // Close the verification viewer
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {type === "photo" ? "Photo Verification" : "Video Verification"}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleMessageClick}
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              <span className="text-sm">Share in Message</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {type === "photo" && (
            <div className="space-y-6">
              <div className="relative">
                <div className="w-1/2 mx-auto relative">
                  {contentUrls.length > 0 ? (
                    <img
                      src={contentUrls[currentIndex]}
                      alt={`Verification photo ${currentIndex + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">No photo available</p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  {contentUrls.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-12 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-12 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Photo counter */}
              {contentUrls.length > 1 && (
                <div className="text-center text-sm text-gray-500">
                  {currentIndex + 1} of {contentUrls.length}
                </div>
              )}
            </div>
          )}

          {type === "video" && (
            <div className="w-1/2 mx-auto aspect-video bg-black rounded-lg overflow-hidden">
              {contentUrls.length > 0 ? (
                <video controls className="w-full h-full" poster={videoUrls[0]}>
                  <source
                    src={
                      "https://res.cloudinary.com/di6baswzt/video/upload/v1743757918/uploads/videos/1743757897692-SampleVideo_1280x720_1mb.mp4.mp4"
                    }
                    type="video/mp4"
                  />
                </video>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No video available</p>
                </div>
              )}
            </div>
          )}

          {/* Download Button */}
          {contentUrls.length > 0 && (
            <div className="flex justify-end mt-4">
              <a
                href={contentUrls[currentIndex]}
                download
                className="flex items-center px-4 py-2 text-sm text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download {type === "photo" ? "Photo" : "Video"}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
