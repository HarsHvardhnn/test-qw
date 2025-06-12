import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronRight,
  Link,
  Mic,
  MicOff,
  Share,
  Upload,
  Users,
  Video,
  VideoOff,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Trash2,
  MessageSquare,
  PhoneOffIcon,
} from "lucide-react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";

import { GlassmorphicButton } from "../components/GlassmorphicButton";
import { MeetingSummary } from "../components/MeetingSummary";
import { SubmissionComplete } from "../components/SubmissionComplete";
import { MeetingHeader } from "../components/MeetingHeader";
import { QwilloAIChat } from "../components/QwilloAIChat";
import { QwilloLogo } from "../components/QwilloLogo";
import { ParticipantsPanel } from "../components/ParticipantsPanel";
import ParticipantView from "./ParticipantView";
import { ContractorCommunication } from "../customer/components/ContractorCommunication";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { DynamicLoader } from "./DynamicLoader";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_PUBLIC_GENAI_API_KEY!);

// Add SpeechRecognition types
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

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
}

interface MediaItem {
  id: string;
  type: "photo" | "video";
  url: string;
  timestamp: number;
  name: string;
}

interface Topic {
  id: number;
  title: string;
  details: string[];
  completed?: boolean;
  notes?: string;
}

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

const kitchenTopics: Topic[] = [
  {
    id: 1,
    title: "Current Kitchen Layout",
    details: ["Dimensions", "Current pain points", "Storage needs"],
  },
  {
    id: 2,
    title: "Design Preferences",
    details: [
      "Style (modern, traditional, etc.)",
      "Color scheme",
      "Cabinet style",
    ],
  },
  {
    id: 3,
    title: "Appliances",
    details: [
      "What needs replacing",
      "Preferred brands",
      "Special requirements",
    ],
  },
  {
    id: 4,
    title: "Countertops",
    details: ["Material preferences", "Color preferences", "Usage patterns"],
  },
  {
    id: 5,
    title: "Lighting",
    details: ["Current issues", "Desired ambiance", "Special requirements"],
  },
  {
    id: 6,
    title: "Plumbing",
    details: ["Sink preferences", "Faucet style", "Water filtration needs"],
  },
  {
    id: 7,
    title: "Storage Solutions",
    details: [
      "Pantry requirements",
      "Organizational needs",
      "Specialty storage",
    ],
  },
  {
    id: 8,
    title: "Timeline & Budget",
    details: ["Start date preferences", "Completion timeline", "Budget range"],
  },
  {
    id: 9,
    title: "Additional Features",
    details: ["Island requirements", "Specialty areas", "Smart features"],
  },
  {
    id: 10,
    title: "Permits & HOA",
    details: ["Known restrictions", "Required approvals", "Timeline impact"],
  },
];

interface MeetingRoomProps {
  userData?: {
    name: string;
    email: string;
    phone: string;
  };
  projectId: any;
  meetingId?: string;
  userRole?: string;
}

interface TranscriptEntry {
  participantId: string;
  text: string;
  timestamp: number;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  userData,
  projectId,
  meetingId,
  userRole,
}) => {
  const navigate = useNavigate();
  const { participants, localParticipant, toggleMic, toggleWebcam, leave } =
    useMeeting({
      onMeetingLeft: () => {
        if (userRole == "business") {
          window.location.href = "/contractor";
        } else {
          window.location.href = "/customer";
        }
      },
    });

  const [timeLeft] = useState(300);
  const [transcriptHistory, setTranscriptHistory] = useState<TranscriptEntry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showTranscripts, setShowTranscripts] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isWebcamOn, setIsWebcamOn] = useState(true);
  const transcriptsRef = useRef<HTMLDivElement>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [partcs, setParticipants] = useState([]);
  
  // For sentence buffering
  const sentenceBufferRef = useRef<string>("");
  const sentenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Add retry mechanism state
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  const getActiveParticipants = async (meetingId: string) => {
    try {
      const response = await axiosInstance.get(
        `/meeting/${meetingId}/active-participants`
      );
      return response.data.activeParticipants;
    } catch (error: any) {
      console.error(
        "Error fetching active participants:",
        error.response?.data || error.message
      );
      return [];
    }
  };

  useEffect(() => {
    const joinMeeting = async () => {
      try {
        if (!meetingId) {
          console.warn("No meeting ID provided for joining meeting");
          return;
        }
        await axiosInstance.post(`/meeting/${meetingId}/join`);
        console.log("Joined meeting successfully");
      } catch (error: any) {
        console.error(
          "Error joining meeting:",
          error.response?.data || error.message
        );
      }
    };
    const fetchParticipants = async () => {
      if (meetingId) {
        const active = await getActiveParticipants(meetingId);
        setParticipants(active);
      }
    };

    if (meetingId) {
      joinMeeting();
      fetchParticipants();
    }
  }, [meetingId]);

  const leaveMeeting = async () => {
    if (!meetingId) {
      console.warn("No meeting ID provided for leaving meeting");
      return;
    }
    
    try {
      await axiosInstance.post(`/meeting/${meetingId}/leave`);
      console.log("Left meeting successfully");
    } catch (error: any) {
      console.error(
        "Error leaving meeting:",
        error.response?.data || error.message
      );
    }
  };

  // Add these functions to handle showing/hiding the dialog and exiting
  const handleShowExitConfirmation = () => {
    setShowExitConfirmation(true);
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const handleConfirmExit = async () => {
    await leaveMeeting();
    leave(); // This uses the existing leave() function from useMeeting
    if (userRole == "business") {
      window.location.href = "/contractor";
    } else {
      window.location.href = "/customer";
    }
  };
  
  // Auto-scroll to the bottom of transcripts when new content is added
  useEffect(() => {
    if (transcriptsRef.current) {
      transcriptsRef.current.scrollTop = transcriptsRef.current.scrollHeight;
    }
  }, [transcriptHistory]);

  // Helper to check if speech recognition is supported
  const isSpeechRecognitionSupported = () => {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  };

  // Initialize speech recognition once on mount and start it automatically
  useEffect(() => {
    // Wait a bit longer before initializing speech recognition
    // to ensure other browser audio contexts are fully initialized
    const initTimeout = setTimeout(() => {
      initializeSpeechRecognition();
    }, 2000); // Wait 2 seconds after component mount
    
    return () => {
      clearTimeout(initTimeout);
    };
  }, []);
  
  // Separate function for speech recognition initialization
  const initializeSpeechRecognition = () => {
    setPermissionError(null);
    
    if (!isSpeechRecognitionSupported()) {
      setPermissionError(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    try {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        console.log("Initializing speech recognition, attempt:", retryCount + 1);
        
        // Create and configure the recognition instance
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        // Set up event handlers
        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let finalText = "";

          // Process all results
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = (event.results[i][0] as SpeechRecognitionAlternative).transcript;

            if (event.results[i].isFinal) {
              finalText += transcript + " ";
            }
          }

          if (finalText.trim()) {
            // Clear any existing timer
            if (sentenceTimerRef.current) {
              clearTimeout(sentenceTimerRef.current);
            }
            
            // Add to buffer with space if needed
            const needsSpace = sentenceBufferRef.current.length > 0 
              && !sentenceBufferRef.current.endsWith(' ') 
              && !finalText.startsWith(' ');
            
            sentenceBufferRef.current += (needsSpace ? ' ' : '') + finalText;
            
            // Check if the text contains sentence ending punctuation
            if (finalText.includes('.') || finalText.includes('!') || finalText.includes('?')) {
              // Process immediately
              processCompleteSentence(localParticipant?.id || "local");
            } else {
              // Set timer to process after pause
              sentenceTimerRef.current = setTimeout(() => {
                processCompleteSentence(localParticipant?.id || "local");
              }, 3000); // 3 second pause = complete sentence
            }
          }
        };

        // Handle recognition end
        recognitionInstance.onend = () => {
          // Process any remaining text
          if (sentenceBufferRef.current.trim()) {
            processCompleteSentence(localParticipant?.id || "local");
          }
          
          console.log("Speech recognition ended, will attempt restart");
          
          // Restart with delay to allow system to reset
          setTimeout(() => {
            try {
              if (recognitionInstance && document.visibilityState !== 'hidden') {
                console.log("Attempting to restart speech recognition");
                recognitionInstance.start();
                setIsListening(true);
              }
            } catch (error) {
              console.error("Could not restart recognition:", error);
              setIsListening(false);
            }
          }, 1000); // Longer delay for more reliable restart
        };

        // Handle errors
        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          if (event.error === "not-allowed") {
            setPermissionError(
              "Microphone access denied. Please allow microphone access."
            );
          } else if (event.error === "no-speech") {
            // This is normal, just no speech detected
            console.log("No speech detected");
          } else if (event.error === "aborted") {
            console.log("Speech recognition aborted");
            
            // If we haven't exceeded max retries, try again
            if (retryCount < maxRetries) {
              setRetryCount(prevCount => prevCount + 1);
              
              // Clear any old errors first
              setPermissionError(null);
              
              // Wait and try again
              setTimeout(() => {
                console.log("Retrying speech recognition after abort");
                initializeSpeechRecognition();
              }, 2000);
            } else {
              // Too many retries, show permanent error
              setPermissionError(`Speech recognition repeatedly aborted. Please refresh the page.`);
            }
          } else {
            setPermissionError(`Error: ${event.error}`);
          }
          setIsListening(false);
        };

        // Save instance to state
        setRecognition(recognitionInstance);
        
        // Use a more resilient way to get microphone permissions
        const startSpeechRecognition = async () => {
          try {
            // First verify we can get audio permissions
            const stream = await navigator.mediaDevices.getUserMedia({ 
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              } 
            });
            
            // Wait a moment for the audio system to stabilize
            setTimeout(() => {
              try {
                console.log("Starting speech recognition...");
                recognitionInstance.start();
                setIsListening(true);
                console.log("Speech recognition started successfully");
                
                // Reset retry count on success
                setRetryCount(0);
              } catch (err) {
                console.error("Error starting recognition:", err);
                if (retryCount < maxRetries) {
                  // Try again with delay
                  setRetryCount(prevCount => prevCount + 1);
                  setTimeout(() => {
                    console.log("Retrying speech recognition start");
                    startSpeechRecognition();
                  }, 2000);
                } else {
                  setPermissionError("Failed to start speech recognition after multiple attempts. Please refresh the page.");
                }
              } finally {
                // Release the audio stream
                stream.getTracks().forEach(track => track.stop());
              }
            }, 500);
          } catch (err) {
            console.error("Microphone permission error:", err);
            setPermissionError("Microphone access denied. Please allow microphone access in browser settings.");
          }
        };
        
        // Start the process
        startSpeechRecognition();
      }
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
      setPermissionError("Failed to initialize speech recognition.");
    }
  };

  // Process and add a complete sentence to the transcript
  const processCompleteSentence = (participantId: string) => {
    if (!sentenceBufferRef.current.trim()) return;
    
    // Format the sentence
    let text = sentenceBufferRef.current.trim();
    
    // Capitalize first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);
    
    // Add period if missing
    if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) {
      text += '.';
    }
    
    // Add to transcript
    setTranscriptHistory(prev => [
      ...prev,
      {
        participantId,
        text,
        timestamp: Date.now(),
      },
    ]);
    
    // Clear buffer
    sentenceBufferRef.current = "";
  };

  // Start speech recognition with proper error handling
  const startListening = async () => {
    setPermissionError(null);

    if (!recognition) {
      setPermissionError("Speech recognition not available.");
      return;
    }

    try {
      // First attempt to get microphone permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start recognition
      recognition.start();
      setIsListening(true);

      // Stop the microphone stream we used for permission
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setPermissionError(
        "Microphone access denied. Please allow microphone access in your browser settings."
      );
      setIsListening(false);
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognition) {
      try {
        // Process any remaining buffered text
        if (sentenceBufferRef.current.trim()) {
          processCompleteSentence(localParticipant?.id || "local");
        }
        
        // Clear any pending timers
        if (sentenceTimerRef.current) {
          clearTimeout(sentenceTimerRef.current);
          sentenceTimerRef.current = null;
        }
        
        recognition.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
    setIsListening(false);
  };

  // Handle transcript updates from ParticipantView
  const handleTranscriptUpdate = (
    participantId: string,
    transcript: string,
    items: any[]
  ) => {
    if (!transcript.trim()) return;
    
    // Skip transcripts from local participant if we're already listening
    if (isListening && (participantId === localParticipant?.id || participantId === "local")) {
      console.log("Skipping local participant transcript while already listening");
      return;
    }

    // Add transcript directly for remote participants
    setTranscriptHistory(prev => [
      ...prev,
      {
        participantId,
        text: transcript.trim(),
        timestamp: Date.now(),
      },
    ]);
  };

  // Clean up on unmount - make sure to stop listening
  useEffect(() => {
    return () => {
      // Clean up speech recognition
      if (recognition) {
        try {
          recognition.stop();
        } catch (err) {
          console.error("Error stopping recognition on unmount:", err);
        }
      }
      
      // Clear any timers
      if (sentenceTimerRef.current) {
        clearTimeout(sentenceTimerRef.current);
        sentenceTimerRef.current = null;
      }
    };
  }, [recognition]);

  // Helper function to get participant name
  const getParticipantName = (participantId: string) => {
    if (participantId === localParticipant?.id || participantId === "local") {
      return userData?.name || "You";
    }
    return participants.get(participantId)?.displayName || "Participant";
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Controls functions
  const handleMicToggle = () => {
    toggleMic();
    setIsMicOn(!isMicOn);
  };

  const handleWebcamToggle = () => {
    toggleWebcam();
    setIsWebcamOn(!isWebcamOn);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      // First, process all transcripts with AI
      const allTranscripts = Object.values(transcriptHistory).map(entry => entry.text).join(" ");
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
      setTimeout(() => {
        const nameInput = document.querySelector(
          'input[name="personName"]'
        ) as HTMLInputElement;
        const emailInput = document.querySelector(
          'input[name="email"]'
        ) as HTMLInputElement;
        const phoneInput = document.querySelector(
          'input[name="phone"]'
        ) as HTMLInputElement;

        if (nameInput) nameInput.value = userData.name || "";
        if (emailInput) emailInput.value = userData.email || "";
        if (phoneInput) phoneInput.value = userData.phone || "";
      }, 0);
    }
  };

  const fetchInventorySummary = async () => {
    try {
      const response = await axiosInstance.get("/category");
      return response.data; // This will be an array of { _id, itemName }
    } catch (error) {
      console.error("Error fetching inventory summary:", error);
      return [];
    }
  };
  
  const handleGenerateSummary = async (meetingId: string | undefined) => {
    const user = localStorage.getItem("user");

    if (user && JSON.parse(user).role == "user") {
      navigate(`/customer?projectId=${projectId}`);
      return;
    }

    if (!meetingId) {
      toast.error("Meeting ID is required");
      return;
    }

    try {
      setIsGeneratingSummary(true);
      setSummaryError(null);

      const transcriptText = transcriptHistory
        .map((entry) => entry.text)
        .join(" ");

      const inventory = await fetchInventorySummary(); // [{ _id, itemName }]
      const matchedItemIds = await fetchAIResponseForCategories(
        transcriptText,
        inventory
      ); // [ _id1, _id2 ]

      console.log("matched items", matchedItemIds);

      const cleanedTranscriptions = transcriptHistory.map(
        (entry) => entry.text
      );

      const payload = {
        meetingId,
        transcriptions: cleanedTranscriptions,
        matchedItemIds,
      };

      console.log("payload", payload);

      const response = await axiosInstance.post(
        "/meeting/save-summary",
        payload
      );
      console.log("Meeting summary saved:", response.data);

      // Success handling
      toast.success("Meeting summary generated successfully!");

      navigate("/contractor");
    } catch (err) {
      console.error("Error saving meeting summary:", err);
      setSummaryError("Failed to generate summary. Please try again.");
      toast.error("Failed to generate summary");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const fetchAIResponseForCategories = async (transcriptions: any, categories: any[]) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Build a detailed category/subcategory list for context
      const categoryListString = categories
        .map((category: any) => {
          const subCats = category.subCategories
            .map(
              (sub: any) =>
                `  - Subcategory: ${sub.subCategoryName} (ID: ${category._id})`
            )
            .join("\n");
          return `Category: ${category.categoryName} (ID: ${category._id})\n${subCats}`;
        })
        .join("\n\n");

      const userMessage = `
You're an AI assistant helping to analyze project discussion transcripts.

Here is a list of product categories and subcategories in the system:
${categoryListString}

Now here is a transcript of a spoken conversation related to a project:
"${transcriptions}"

Based on the content of the transcript, identify which **categories** were **mentioned directly or indirectly**, including any subcategory mentions or synonyms (e.g., if "filters" is mentioned, match it to the "Filtration" category).

Return ONLY the matched category IDs as a JSON array, like this:
["category_id_1", "category_id_2"]
`;

      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text().trim();
      console.log("AI Response:", text);

      try {
        const cleaned = text
          .trim()
          .replace(/```json|```/g, "")
          .trim();

        const ids = JSON.parse(cleaned);
        return Array.isArray(ids) ? ids : [];
      } catch (parseErr) {
        console.warn("Failed to parse AI response as JSON:", text);
        return [];
      }
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return [];
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 px-2 py-4">
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-z bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">
              Exit Meeting?
            </h3>
            <p className="text-gray-300 mb-6">
              All information discussed and transcripts will be lost. Are you
              sure you want to leave?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelExit}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExit}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <MeetingHeader
        companyName={userData?.name || "User"}
        timeLeft={timeLeft}
        participants={partcs}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:flex-row py-4 gap-4">
        {/* Video Section */}
        <div className="flex-1 bg-gray-800 rounded-xl glassmorphic relative overflow-hidden">
          <div className="grid grid-cols-1 gap-2 w-full h-[100%] rounded-xl overflow-hidden aspect-video">
            {[...participants.keys()]
              .filter((pid) => pid !== localParticipant?.id)
              .map((participantId) => (
                <ParticipantView
                  key={participantId}
                  participantId={participantId.toString()}
                  onTranscriptUpdate={handleTranscriptUpdate}
                  disableSpeechRecognition={true}
                />
              ))}
          </div>

          {/* Local Participant (Fixed at Bottom Right) */}
          {localParticipant && (
            <div className="absolute bottom-5 right-4 w-32 h-24 sm:w-72 sm:h-72 rounded-xl shadow-md overflow-hidden">
              <ParticipantView
                participantId={localParticipant.id}
                onTranscriptUpdate={handleTranscriptUpdate}
                isSmallView
                disableSpeechRecognition={isListening}
              />
            </div>
          )}

          {/* Permission Error Message - Update to automatically dismiss after a while */}
          {permissionError && (
            <div className="absolute top-16 right-4 bg-red-600/90 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <X className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Microphone Error</p>
                  <p className="text-sm">{permissionError}</p>
                  {permissionError.includes("aborted") && (
                    <button 
                      onClick={() => {
                        setPermissionError(null);
                        setRetryCount(0);
                        setTimeout(initializeSpeechRecognition, 500);
                      }}
                      className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                    >
                      Try Again
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setPermissionError(null)}
                  className="flex-shrink-0 text-white hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Transcription Panel - Overlay at the bottom of the video */}
          {showTranscripts && (
            <div className="absolute left-0 bottom-0 w-full mb-16 px-4">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-t-lg">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                  <h3 className="text-white font-medium flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Live Transcription
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowTranscripts(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div
                  ref={transcriptsRef}
                  className="max-h-40 overflow-y-auto p-3 text-sm text-gray-200 space-y-2"
                >
                  {transcriptHistory.length > 0 ? (
                    transcriptHistory.map((entry, index) => (
                      <div key={index} className="mb-2">
                        <span className="font-medium text-blue-400">
                          {getParticipantName(entry.participantId)}:{" "}
                        </span>
                        <span>{entry.text}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {formatTime(entry.timestamp)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="italic text-gray-400">
                      <p>No transcriptions yet.</p>
                      {!isSpeechRecognitionSupported() ? (
                        <p className="mt-1 text-yellow-400">
                          Speech recognition is not supported in your browser.
                          Please use Chrome, Edge, or Safari.
                        </p>
                      ) : (
                        <p className="mt-1">
                          Transcription is active. Start speaking to see transcriptions.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Minimized Transcription Toggle (when hidden) */}
          {!showTranscripts && (
            <button
              onClick={() => setShowTranscripts(true)}
              className="absolute left-4 bottom-16 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 flex items-center gap-2 shadow-lg border border-gray-700"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">Show Transcripts</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Controls (Full Width at Bottom) */}
      <div className="w-full py-3 border-t border-gray-700 bg-gray-900 flex items-center justify-center rounded-lg">
        <div className="max-w-4xl w-full flex flex-wrap items-center justify-center gap-3 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleMicToggle}
              className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 bg-gray-800 text-white"
            >
              {isMicOn ? (
                <Mic className="w-6 h-6" />
              ) : (
                <MicOff className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={handleWebcamToggle}
              className="p-3 rounded-xl transition-all duration-200 hover:bg-gray-700 bg-gray-800 text-white"
            >
              {isWebcamOn ? (
                <Video className="w-6 h-6" />
              ) : (
                <VideoOff className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <GlassmorphicButton
              onClick={() => {
                handleGenerateSummary(meetingId);
              }}
              className="px-6 rounded-xl w-full sm:w-auto"
            >
              Generate Summary
            </GlassmorphicButton>
            <button
              onClick={handleShowExitConfirmation}
              className="p-4 rounded-xl transition-all duration-200 hover:bg-red-700 bg-red-800 text-white"
            >
             <PhoneOffIcon />
            </button>
          </div>
        </div>
      </div>

      <DynamicLoader
        isLoading={isGeneratingSummary}
        onComplete={() => {}}
        onError={summaryError}
      />
    </div>
  );
};
