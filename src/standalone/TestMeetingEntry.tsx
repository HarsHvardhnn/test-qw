import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MeetingConsumer, MeetingProvider } from "@videosdk.live/react-sdk";
import { generateToken } from "../utils/videosdk.js";
import { MeetingEntryModal } from "./MeetingEntryModal";
import { WelcomeMessage } from "./WelcomeMessage";
import { MeetingRoom } from "./MeetingRoom";
import axiosInstance from "../axios.js";
import { toast } from "react-toastify";
import { ContractorCommunication as CustomerCommunication } from "../customer/components/ContractorCommunication.js";
import { ContractorCommunication as ContractorCommunication } from "../contractor/components/ContractorCommunication.js";
import { useProject } from "../customer/context/ProjectContext.js";

export const TestMeetingEntry: React.FC = () => {
  const { id: meetingId } = useParams();
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const { contractorName } = useProject();

  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const userRole = parsedUser?.role || null;
  const isAuthenticated = !!localStorage.getItem("token");

  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWelcome, setShowWelcome] = useState(userRole);
  const [showMeeting, setShowMeeting] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔐 Token and auth check
  useEffect(() => {
    // Check if authenticated
    if (!isAuthenticated) {
      setShowAuthOptions(true);
      return;
    }

    // Continue with existing logic for authenticated users
    if (meetingId) {
      axiosInstance
        .get(`/meeting/meet/${meetingId}`)
        .then((res) => {
          if (res?.data?.project?._id) {
            localStorage.setItem("project", res.data.project._id);
            setProjectId(res.data.project._id);
          }
        })
        .catch((err) =>
          console.error(
            "Error fetching meeting info:",
            err?.response?.data || err
          )
        );
    }
  }, [isAuthenticated, meetingId]);

  // 🎯 Handle signup logic (create if doesn't exist)
  const handleSignupComplete = async (formData: {
    name: string;
    email: string;
    phone: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        "/meeting/signup-from-meeting",
        formData
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // backend handles existence
      setUserData(formData);
      setShowSuccess(true);
      setShowWelcome(true);
      setShowEntryModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
      console.error("Signup error:", error);
    }
  };

  // 🔑 Fetch token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const generatedToken = await generateToken();
        setToken(generatedToken);
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    if (!token && isAuthenticated) fetchToken();
  }, [token, isAuthenticated]);


  console.log("user role",userRole)

  const handleBeginMeeting = () => {
    setShowWelcome(false);
    setShowMeeting(true);
  };

  const handleLoginClick = () => {
    localStorage.setItem("saved-path", `/meeting/${meetingId}`);
    navigate("/login", { state: { redirectTo: `/meeting/${meetingId}` } });
  };

  const handleJoinMeetingClick = () => {
    setShowAuthOptions(false);
    setShowEntryModal(true);
  };

  return (
    // <div className="min-h-screen  bg-gradient-to-b from-gray-900 to-black relative flex">
    //   {/* Main Content */}
    //   <div className="flex-1">
    //     {/* Authentication Options */}
    //     {showAuthOptions && (
    //       <div className="flex flex-col items-center justify-center min-h-screen p-4">
    //         <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
    //           <h2 className="text-2xl font-bold text-white mb-6 text-center">
    //             Join Meeting
    //           </h2>
    //           <div className="space-y-4">
    //             <button
    //               onClick={handleLoginClick}
    //               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
    //             >
    //               Login to Join
    //             </button>
    //             <div className="relative">
    //               <div className="absolute inset-0 flex items-center">
    //                 <div className="w-full border-t border-gray-600"></div>
    //               </div>
    //               <div className="relative flex justify-center text-sm">
    //                 <span className="px-2 bg-gray-800 text-gray-400">Or</span>
    //               </div>
    //             </div>
    //             <button
    //               onClick={handleJoinMeetingClick}
    //               className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
    //             >
    //               Join Meeting and Sign Up
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     )}

    //     {/* Entry Modal for signup */}
    //     {showEntryModal && (
    //       <MeetingEntryModal
    //         onComplete={handleSignupComplete}
    //         meetingId={meetingId}
    //       />
    //     )}

    //     {/* Regular flow for authenticated users */}
    //     {!isAuthenticated &&
    //       !showAuthOptions &&
    //       !showEntryModal &&
    //       !showWelcome &&
    //       !showMeeting && (
    //         <MeetingEntryModal
    //           onComplete={handleSignupComplete}
    //           meetingId={meetingId}
    //         />
    //       )}

    //     {showWelcome && <WelcomeMessage onBegin={handleBeginMeeting} />}

    //     {showMeeting && token && meetingId && (
    //       <MeetingProvider
    //         config={{
    //           meetingId: meetingId || "",
    //           micEnabled: true,
    //           webcamEnabled: true,
    //           name: userData.name || "Test User",
    //           mode: "SEND_AND_RECV",
    //           multiStream: true,
    //           debugMode: false,
    //         }}
    //         token={token}
    //         reinitialiseMeetingOnConfigChange={true}
    //         joinWithoutUserInteraction={true}
    //       >
    //         <MeetingConsumer>
    //           {() => <MeetingRoom userData={userData} projectId={projectId} />}
    //         </MeetingConsumer>
    //       </MeetingProvider>
    //     )}
    //   </div>

    //   {/* Right Sidebar */}
    //   {!showAuthOptions && !showEntryModal && (
    //     <div className="w-96 bg-gray-800 border-l border-gray-700 p-4 hidden md:block">
    //       {userRole === "user" ? (
    //         <CustomerCommunication
    //           meeting={true}
    //           contratorName={contractorName}
    //         />
    //       ) : (
    //         <ContractorCommunication onClose={() => {}} meeting={true} />
    //       )}
    //     </div>
    //   )}
    //   {/* Hamburger for mobile */}
    //   {!showAuthOptions && !showEntryModal && (
    //     <button
    //       onClick={() => setSidebarOpen(true)}
    //       className="fixed top-2 right-4 z-50 p-2 mb-6 bg-gray-800 text-white rounded sm:hidden"
    //     >
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         className="h-6 w-6"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         stroke="currentColor"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth="2"
    //           d="M4 6h16M4 12h16M4 18h16"
    //         />
    //       </svg>
    //     </button>
    //   )}
    //   {/* Sidebar */}
    //   {!showAuthOptions && !showEntryModal && (
    //     <>
    //       {/* Mobile overlay sidebar */}
    //       <div
    //         className={`fixed inset-0 z-40 bg-black/50 sm:hidden transition-opacity mb-4 duration-300 ${
    //           sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
    //         }`}
    //         onClick={() => setSidebarOpen(false)}
    //       />

    //       <div
    //         className={`fixed top-0 right-0 h-full w-80 bg-gray-800 border-l border-gray-700 p-4 z-50 transition-transform duration-300 md:relative md:translate-x-0 md:block ${
    //           sidebarOpen ? "translate-x-0" : "translate-x-full"
    //         }`}
    //       >
    //         {/* Close Button on Mobile */}
    //         <button
    //           onClick={() => setSidebarOpen(false)}
    //           className="md:hidden absolute top-4 right-4 text-white"
    //         >
    //           ✕
    //         </button>

    //         {userRole === "user" ? (
    //           <CustomerCommunication
    //             meeting={true}
    //             contratorName={contractorName}
    //           />
    //         ) : (
    //           <ContractorCommunication onClose={() => {}} meeting={true} />
    //         )}
    //       </div>
    //     </>
    //   )}

    //   {/* Success Toast */}
    //   {showSuccess && (
    //     <div className="fixed top-4 right-4 bg-green-500/20 border border-green-400/30 text-white px-6 py-3 rounded-lg animate-fade-in">
    //       Successfully joined the meeting!
    //     </div>
    //   )}
    // </div>
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative flex">
      {/* Main Content */}
      <div className="flex-1">
        {/* Authentication Options */}
        {showAuthOptions && (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Join Meeting
              </h2>
              <div className="space-y-4">
                <button
                  onClick={handleLoginClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Login to Join
                </button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">Or</span>
                  </div>
                </div>
                <button
                  onClick={handleJoinMeetingClick}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Join Meeting and Sign Up
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Entry Modal for signup */}
        {showEntryModal && (
          <MeetingEntryModal
            onComplete={handleSignupComplete}
            meetingId={meetingId}
          />
        )}

        {/* Regular flow for authenticated users */}
        {!isAuthenticated &&
          !showAuthOptions &&
          !showEntryModal &&
          !showWelcome &&
          !showMeeting && (
            <MeetingEntryModal
              onComplete={handleSignupComplete}
              meetingId={meetingId}
            />
          )}

        {showWelcome && <WelcomeMessage onBegin={handleBeginMeeting} />}

        {showMeeting && token && meetingId && (
          <MeetingProvider
            config={{
              meetingId: meetingId || "",
              micEnabled: true,
              webcamEnabled: true,
              name: userData.name || "Test User",
              mode: "SEND_AND_RECV",
              multiStream: true,
              debugMode: false,
            }}
            token={token}
            reinitialiseMeetingOnConfigChange={true}
            joinWithoutUserInteraction={true}
          >
            <MeetingConsumer>
              {() => (
                <MeetingRoom
                  userData={userData}
                  projectId={projectId}
                  meetingId={meetingId}
                  userRole={userRole}
                />
              )}
            </MeetingConsumer>
          </MeetingProvider>
        )}
      </div>

      {/* Right Sidebar (Desktop only) */}
      {!showAuthOptions && !showEntryModal && (
        <div className="w-96 bg-gray-800 border-l border-gray-700 p-4 hidden md:block" >
          {userRole === "user" ? (
            <CustomerCommunication
              meeting={true}
              contratorName={contractorName}
            />
          ) : (
            <ContractorCommunication onClose={() => {}} meeting={true} />
          )}
        </div>
      )}

      {/* Hamburger for mobile only */}
      {!showAuthOptions && !showEntryModal && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded sm:block md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Mobile overlay sidebar */}
      {!showAuthOptions && !showEntryModal && (
        <>
          <div
            className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 sm:block md:hidden ${
              sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            onClick={() => setSidebarOpen(false)}
          />

          <div
            className={`fixed top-0 right-0 h-full w-80 bg-gray-800 border-l border-gray-700 p-4 z-50 transition-transform duration-300 sm:block md:hidden ${
              sidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Close Button on Mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white md:hidden"
            >
              ✕
            </button>

            {userRole === "user" ? (
              <CustomerCommunication
                meeting={true}
                contratorName={contractorName}
              />
            ) : (
              <ContractorCommunication onClose={() => {}} meeting={true} />
            )}
          </div>
        </>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500/20 border border-green-400/30 text-white px-6 py-3 rounded-lg animate-fade-in">
          Successfully joined the meeting!
        </div>
      )}
    </div>
  );
};
