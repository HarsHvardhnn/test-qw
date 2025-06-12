import axiosInstance from "../axios";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ParticipantView from "./ParticipantView";

import {
  BsFillMicFill,
  BsFillMicMuteFill,
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsDoorOpenFill,
} from "react-icons/bs";
import { extractInventoryItems } from "@/lib/GeminiAi";
import { Target, UserSearch } from "lucide-react";
import { Mic, MicOff, Video, VideoOff, Users } from "lucide-react";
import { GlassmorphicButton } from "../components/GlassmorphicButton";
import { useNavigate } from "react-router-dom";
interface Product {
  id: number;
  productId: string;
  itemName: string;
  description: string;
  img: string;
  brand: string;
  category: string;
  quantity: number;
  addedOn: string;
  lastUpdated: string;
  inStock: boolean;
}

interface ControlsProps {
  transcripts: Record<string, string>;
  products: Product[];
  userData?: {
    name: string;
    email: string;
    phone: string;
  };
  projectId: any;
}

function Controls({
  transcripts,
  products,
  userData,
  projectId,
}: ControlsProps) {
  const { toggleMic, toggleWebcam, leave } = useMeeting();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isWebcamOn, setIsWebcamOn] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const navigate = useNavigate();

  const handleMicToggle = () => {
    toggleMic();
    setIsMicOn(!isMicOn);
  };

  const handleWebcamToggle = () => {
    toggleWebcam();
    setIsWebcamOn(!isWebcamOn);
  };

  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      // First, process all transcripts with AI
      const allTranscripts = Object.values(transcripts).join(" ");
      const { items } = { items: "this" };
      console.log("items ", items);

      // Then submit everything to the server
      const response = await axiosInstance.post("/meetings", {
        projectName: formData.get("projectName"),
        personName: formData.get("personName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        location: formData.get("location"),
        end: new Date(),
        inventory: items,
        subtitle: allTranscripts, // Optional: include the transcript
      });

      if (response.status === 201) {
        toast.success("Quote created successfully");
        setShowQuoteModal(false);
        leave();
      }
    } catch (error) {
      toast.error("Failed to create quote");
      console.error(error);
    }
  };

  const handleShowQuoteModal = () => {
    setShowQuoteModal(true);
    if (userData) {
      // Pre-fill the form data if we have user information
      document
        .querySelector<HTMLInputElement>('input[name="personName"]')
        ?.setAttribute("value", userData.name);
      document
        .querySelector<HTMLInputElement>('input[name="email"]')
        ?.setAttribute("value", userData.email);
      document
        .querySelector<HTMLInputElement>('input[name="phone"]')
        ?.setAttribute("value", userData.phone);
    }
  };

  return (
    // <>
    //   <div className="  rounded-xl w-full">
    //     <div className="bg-gray-900/90 glassmorphic w-full items-center flex flex-col backdrop-blur-sm rounded-xl shadow-lg px-2 py-2">
    //       <div className="flex items-center space-x-2">
    //         <button
    //           onClick={handleMicToggle}
    //           className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 bg-gray-800"
    //           title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
    //         >
    //           {isMicOn ? (
    //             <Mic size={20} className="text-white" />
    //           ) : (
    //             <MicOff size={20} className="text-white" />
    //           )}
    //         </button>

    //         <button
    //           onClick={handleWebcamToggle}
    //           className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 bg-gray-800"
    //           title={isWebcamOn ? "Turn Off Camera" : "Turn On Camera"}
    //         >
    //           {isWebcamOn ? (
    //             <Video size={20} className="text-white" />
    //           ) : (
    //             <VideoOff size={20} className="text-white" />
    //           )}
    //         </button>

    //         <button
    //           onClick={() => {}}
    //           className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 bg-gray-800"
    //         >
    //           <Users size={20} className="text-white" />
    //         </button>

    //         <button
    //           onClick={handleShowQuoteModal}
    //           className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 bg-gray-800"
    //         >
    //           <Target size={20} className="text-white" />
    //         </button>

    //         <GlassmorphicButton
    //           variant="primary"
    //           onClick={() => {
    //            const user  = localStorage.getItem('user');
    //            if(JSON.parse(user).role=='user'){
    //             navigate(
    //               `/customer?projectId=${projectId}`
    //             );
    //            }
    //            else{
    //             navigate(
    //               `/contractor`
    //             );
    //            }
    //           }}
    //           className="px-6 rounded-xl"
    //         >
    //           Generate Summary
    //         </GlassmorphicButton>
    //       </div>
    //     </div>
    //   </div>
    //   {/* Modal - Moved outside the controls container */}
    //   {showQuoteModal && (
    //     <div
    //       className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/90  glassmorphic backdrop-blur-md"
    //       aria-labelledby="modal-title"
    //       role="dialog"
    //       aria-modal="true"
    //     >
    //       {/* Background Overlay */}
    //       <div
    //         className="fixed inset-0 bg-black/30 backdrop-blur-md"
    //         aria-hidden="true"
    //         onClick={() => setShowQuoteModal(false)}
    //       ></div>

    //       {/* Modal Content */}
    //       <div className="relative z-[101] w-full max-w-lg p-6   bg-gray-800 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl">
    //         <div className="flex justify-between items-center mb-5">
    //           <h3 className="text-lg font-semibold text-white">
    //             Convert to Quote
    //           </h3>
    //           <button
    //             onClick={() => setShowQuoteModal(false)}
    //             className="text-gray-300 hover:text-white"
    //           >
    //             <span className="sr-only">Close</span>
    //             <svg
    //               className="h-6 w-6"
    //               fill="none"
    //               viewBox="0 0 24 24"
    //               stroke="currentColor"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M6 18L18 6M6 6l12 12"
    //               />
    //             </svg>
    //           </button>
    //         </div>

    //         <form onSubmit={handleQuoteSubmit} className="space-y-4">
    //           <div>
    //             <input
    //               type="text"
    //               name="projectName"
    //               placeholder="Project name"
    //               className="w-full px-3 py-2 glassmorphic bg-gray-800  border border-white/30 rounded-xl shadow-sm text-white placeholder-gray-300 focus:outline-none focus:ring-white/50 focus:border-white/50"
    //               required
    //             />
    //           </div>
    //           <div>
    //             <input
    //               type="text"
    //               name="personName"
    //               placeholder="Person Name"
    //               className="w-full px-3 py-2 glassmorphic bg-gray-800  border border-white/30  rounded-xl shadow-sm text-white placeholder-gray-300 focus:outline-none focus:ring-white/50 focus:border-white/50"
    //               required
    //             />
    //           </div>
    //           <div>
    //             <input
    //               type="tel"
    //               name="phone"
    //               placeholder="Phone"
    //               className="w-full px-3 py-2 glassmorphic bg-gray-800  border border-white/30  rounded-xl shadow-sm text-white placeholder-gray-300 focus:outline-none focus:ring-white/50 focus:border-white/50"
    //               required
    //             />
    //           </div>
    //           <div>
    //             <input
    //               type="email"
    //               name="email"
    //               placeholder="Email"
    //               className="w-full px-3 py-2 glassmorphic bg-gray-800  border border-white/30  rounded-xl shadow-sm text-white placeholder-gray-300 focus:outline-none focus:ring-white/50 focus:border-white/50"
    //               required
    //             />
    //           </div>
    //           <div>
    //             <input
    //               type="text"
    //               name="location"
    //               placeholder="Location"
    //               className="w-full px-3 rounded-xl py-2 glassmorphic bg-gray-800  border border-white/30  shadow-sm text-white placeholder-gray-300 focus:outline-none focus:ring-white/50 focus:border-white/50"
    //               required
    //             />
    //           </div>

    //           <div className="mt-5 sm:mt-6">
    //             <button
    //               type="submit"
    //               className="w-full rounded-xl inline-flex justify-center px-4 py-2 bg-white/20 border border-white/30 text-white font-medium shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
    //             >
    //               Convert
    //             </button>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   )}
    // </>
    <>
      <div className="rounded-xl w-full sm:max-w-fit sm:mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2">
        <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-2">
          <button
            onClick={handleMicToggle}
            className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 bg-gray-800"
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isMicOn ? (
              <Mic size={20} className="text-white" />
            ) : (
              <MicOff size={20} className="text-white" />
            )}
          </button>

          <button
            onClick={handleWebcamToggle}
            className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 bg-gray-800"
            title={isWebcamOn ? "Turn Off Camera" : "Turn On Camera"}
          >
            {isWebcamOn ? (
              <Video size={20} className="text-white" />
            ) : (
              <VideoOff size={20} className="text-white" />
            )}
          </button>

          <button
            onClick={() => {}}
            className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 bg-gray-800"
          >
            <Users size={20} className="text-white" />
          </button>

          <button
            onClick={handleShowQuoteModal}
            className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 bg-gray-800"
          >
            <Target size={20} className="text-white" />
          </button>
        </div>

        <div className="sm:ml-2">
          <GlassmorphicButton
            variant="primary"
            onClick={() => {
              const user = localStorage.getItem("user");
              if (JSON.parse(user).role === "user") {
                navigate(`/customer?projectId=${projectId}`);
              } else {
                navigate(`/contractor`);
              }
            }}
            className="px-6 rounded-xl w-full sm:w-auto"
          >
            Generate Summary
          </GlassmorphicButton>
        </div>
      </div>

      {showQuoteModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/90 glassmorphic backdrop-blur-md p-4 sm:p-0"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
            aria-hidden="true"
            onClick={() => setShowQuoteModal(false)}
          ></div>

          <div className="relative z-[101] w-full max-w-lg p-4 sm:p-6 bg-gray-800 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-white">
                Convert to Quote
              </h3>
              <button
                onClick={() => setShowQuoteModal(false)}
                className="text-gray-300 hover:text-white"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <input
                type="text"
                name="projectName"
                placeholder="Project name"
                className="w-full px-3 py-2 glassmorphic bg-gray-800 border border-white/30 rounded-xl shadow-sm text-white placeholder-gray-300 focus:outline-none focus:ring-white/50 focus:border-white/50"
                required
              />
              <input
                type="text"
                name="personName"
                placeholder="Person Name"
                className="w-full px-3 py-2 glassmorphic bg-gray-800 border border-white/30 rounded-xl shadow-sm text-white placeholder-gray-300 focus:outline-none focus:ring-white/50 focus:border-white/50"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className="w-full px-3 py-2 glassmorphic bg-gray-800 border border-white/30 rounded-xl shadow-sm text-white placeholder-gray-300 focus:outline-none focus:ring-white/50 focus:border-white/50"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-3 py-2 glassmorphic bg-gray-800 border border-white/30 rounded-xl shadow-sm text-white placeholder-gray-300 focus:outline-none focus:ring-white/50 focus:border-white/50"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="w-full px-3 py-2 glassmorphic bg-gray-800 border border-white/30 rounded-xl shadow-sm text-white placeholder-gray-300 focus:outline-none focus:ring-white/50 focus:border-white/50"
                required
              />
              <div className="mt-5 sm:mt-6">
                <button
                  type="submit"
                  className="w-full rounded-xl inline-flex justify-center px-4 py-2 bg-white/20 border border-white/30 text-white font-medium shadow-sm hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
                >
                  Convert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Controls;
