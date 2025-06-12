import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  Link as LinkIcon,
  Copy,
  Share2,
  Mail,
  Phone,
  X,
  AlertCircle,
  ChevronDown,
  Plus,
  User,
} from "lucide-react";
import axiosInstance from "../../../axios";
import { jwtDecode } from "jwt-decode";
import { generateToken } from "../../../utils/videosdk";
import { useLoader } from "../../../context/LoaderContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "customer" | "lead";
  avatar?: string;
}

interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  isInstantMeeting?: boolean;
  customerId: any;
  contacts: any;
}

export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  isOpen,
  onClose,
  contactName,
  contactEmail,
  contactPhone,
  isInstantMeeting = false,
  customerId,
  contacts,
}) => {
  console.log("seected", customerId);
  const { showLoader, hideLoader } = useLoader();
  const [meetingType, setMeetingType] = useState<"video" | "phone">("video");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [meetingLink, setMeetingLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<
    "copy" | "email" | "sms" | null
  >(null);
  const [contactInfo, setContactInfo] = useState("");
  const [showContactSelector, setShowContactSelector] = useState(!contactName);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(
    contactName
      ? {
          id: "0",
          name: contactName,
          email: contactEmail || "",
          phone: contactPhone || "",
          type: "customer",
        }
      : null
  );
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    type: "lead" as const,
  });

  // Sample contacts data - in a real app this would come from a database

  const scheduleMeeting = async (meetingLink: string) => {
    // if (selectedContact.id == "0") {
    //   toast.warn("Customer  not selected");
    // }
    try {
      showLoader();
      const response = await axiosInstance.post("/meeting/schedule", {
        participantId: customerId, // Replace with selected participant's userId
        meetingType,
        selectedDate,
        selectedTime,
        duration,
        meetingLink,
      });

      console.log("Meeting scheduled:", response.data);
    } catch (error) {
      console.error(
        "Error scheduling meeting:",
        error.response?.data || error.message
      );
      // toast.error("Error scheduling meeting");
      throw new Error("Error scheduling meeting");
    } finally {
      hideLoader();
    }
  };

  const generateMeetingLink = async () => {
    // setIsGenerating(true);

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
      await scheduleMeeting(data.roomId);
      console.log(data);
      setMeetingLink(`${window.location.origin}/meeting/${data.roomId}`);
    } catch (error) {
      console.error("Error generating meeting link:", error);
    } finally {
      // setIsGenerating(false);
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
        window.location.href = `mailto:${contactInfo}?subject=Meeting%20Invitation&body=Join%20our%20meeting:%20${meetingLink}`;
        break;
      case "sms":
        window.location.href = `sms:${contactInfo}?body=Join%20our%20meeting:%20${meetingLink}`;
        break;
      default:
        handleCopy();
    }
    setShareMethod(null);
    setContactInfo("");
  };

  const sendMessageToGroup = async ({
    senderId,
    message,
    messageType,
    attachments,
    userIds,
  }) => {
    try {
      showLoader();
      const response = await axiosInstance.post("/quote/v2/invite/meeting", {
        senderId,
        message,
        messageType: messageType || "text",
        attachments: attachments || [],
        userIds,
      });

      console.log("Message sent successfully:", response.data);
      return response.data; // Return response for further handling (optional)
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
      return null;
    } finally {
      hideLoader();
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactSelector(false);
  };

  const navigate = useNavigate();
  const handleAddNewContact = () => {
    if (!newContact.name || !newContact.email || !newContact.phone) return;

    const contact: Contact = {
      id: `new-${Date.now()}`,
      ...newContact,
    };

    setSelectedContact(contact);
    setShowContactSelector(false);
    setShowNewContactForm(false);
    setNewContact({ name: "", email: "", phone: "", type: "lead" });
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = () => {
    // In a real app, this would fetch available times from a calendar API
    return [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "01:00 PM",
      "01:30 PM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
    ];
  };

  // Get minimum date (today) for date picker
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
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
                {isInstantMeeting
                  ? "Create Instant Meeting"
                  : "Schedule Meeting"}
              </h3>
              {selectedContact && (
                <p className="mt-1 text-sm text-gray-500">
                  with {selectedContact.name}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Contact Selector */}
          {showContactSelector && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Contact
              </label>
              {!showNewContactForm ? (
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleSelectContact(contact)}
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      {contact.avatar ? (
                        <img
                          src={contact.avatar}
                          alt={contact.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
                      <div className="ml-3 flex-1 text-left">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {contact.name}
                          </p>
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                              contact.type === "customer"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {contact?.type?.charAt(0).toUpperCase() +
                              contact?.type?.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                  <button
                    onClick={() => setShowNewContactForm(true)}
                    className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Add New Contact
                    </span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newContact.name}
                      onChange={(e) =>
                        setNewContact((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newContact.email}
                      onChange={(e) =>
                        setNewContact((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) =>
                        setNewContact((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Type
                    </label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() =>
                          setNewContact((prev) => ({
                            ...prev,
                            type: "customer",
                          }))
                        }
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
                          newContact.type === "customer"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Customer
                      </button>
                      <button
                        onClick={() =>
                          setNewContact((prev) => ({ ...prev, type: "lead" }))
                        }
                        className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
                          newContact.type === "lead"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Lead
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setShowNewContactForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNewContact}
                      disabled={
                        !newContact.name ||
                        !newContact.email ||
                        !newContact.phone
                      }
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Contact
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Meeting Info */}
          {selectedContact && (
            <>
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
                      {isInstantMeeting
                        ? "5-Minute Meeting"
                        : "Duration: " + duration + " minutes"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isInstantMeeting
                        ? "Quick consultation to understand needs"
                        : "Select your preferred duration"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {isInstantMeeting
                        ? "Instant Availability"
                        : "Schedule for Later"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isInstantMeeting
                        ? "No scheduling required - start immediately"
                        : "Pick a convenient time"}
                    </p>
                  </div>
                </div>
              </div>

              {!isInstantMeeting && (
                <>
                  {/* Meeting Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meeting Type
                    </label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setMeetingType("video")}
                        className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          meetingType === "video"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Video className="w-5 h-5 mx-auto mb-1" />
                        Video Call
                      </button>
                      <button
                        onClick={() => setMeetingType("phone")}
                        className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          meetingType === "phone"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <Phone className="w-5 h-5 mx-auto mb-1" />
                        Phone Call
                      </button>
                    </div>
                  </div>

                  {/* Date & Time Selection */}
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        min={getMinDate()}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="time"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Time
                      </label>
                      <select
                        id="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select time</option>
                        {getAvailableTimeSlots().map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Duration Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <div className="flex space-x-4">
                      {["30", "45", "60"].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => setDuration(mins)}
                          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            duration === mins
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {mins} mins
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Meeting Link Section */}
              {!meetingLink ? (
                <button
                  onClick={generateMeetingLink}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isInstantMeeting
                    ? "Generate Meeting Link"
                    : "Schedule Meeting"}
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
                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
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
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      <Mail className="w-4 h-4 mx-auto" />
                      <span className="mt-1 block">Email</span>
                    </button>
                    <button
                      onClick={() => setShareMethod("sms")}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      <Phone className="w-4 h-4 mx-auto" />
                      <span className="mt-1 block">SMS</span>
                    </button>
                    <button
                      // onClick={() => setShareMethod('sms')}
                      onClick={() => {
                        const token = localStorage.getItem("token");
                        const decoded = jwtDecode(token);
                        sendMessageToGroup({
                          senderId: decoded.id,
                          message: `You have been invited to join the meeting please use this url to join: ${meetingLink}`,
                          messageType: "text",
                          attachments: [],
                          userIds: [decoded.id, customerId],
                        });
                      }}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      <Phone className="w-4 h-4 mx-auto" />
                      <span className="mt-1 block">Text</span>
                    </button>
                    <button
                      onClick={() => setShareMethod("copy")}
                      className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
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

                  {/* Important Notes */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Important Notes
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Meeting link expires in 24 hours</li>
                            <li>Customer must sign in to join the meeting</li>
                            <li>
                              Screen sharing is available for both parties
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setMeetingLink("")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                      Generate New Link
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        window.location.href = meetingLink;
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Join now{" "}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
