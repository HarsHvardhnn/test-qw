import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Paperclip,
  Image,
  File,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { useProject } from "../context/ProjectContext";
import { CreateConversationModal } from "./CreateConversationModal";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

import axiosInstance from "../../axios";
import { useLoader } from "../../context/LoaderContext";

interface Message {
  id: string;
  content: string;
  sender: "customer" | "contractor" | "stakeholder";
  senderName: string;
  senderRole: string;
  timestamp: Date;
  attachments?: {
    id: string;
    type: "image" | "document";
    url: string;
    name: string;
    size?: string;
  }[];
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: "contractor" | "stakeholder";
    company: string;
    avatar?: string;
  }[];
  lastMessage?: {
    content: string;
    timestamp: string;
    isRead: boolean;
  };
}

interface Participant {
  id: string;
  name: string;
  role:
    | "contractor"
    | "financial"
    | "insurance"
    | "inspector"
    | "realtor"
    | "investor";
  company: string;
  avatar?: string;
}

//customer side
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

export const ContractorCommunication: React.FC = ({
  contractorName = "contractor",
  meeting = false,
}) => {
  console.log("meetin vbool", meeting);
  const { showLoader, hideLoader } = useLoader();

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [pendingAttachments, setPendingAttachments] = useState<
    {
      id: string;
      type: "image" | "document";
      url: string;
      name: string;
      size?: string;
      file?: File;
    }[]
  >([]);

  const [userID, setUserId] = useState(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Fetch token from storage

    if (token) {
      const decoded = jwtDecode(token);
      console.log("got user id", decoded);
      setUserId(decoded?.id);
    }
  }, []);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "c1",
      participants: [
        {
          id: "contractor1",
          name: contractorName,
          role: "contractor",
          company: contractorName,
        },
      ],
      lastMessage: {
        content: "I will send you the updated timeline shortly.",
        timestamp: "10:30 AM",
        isRead: false,
      },
    },
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Socket connection management function
  const connectSocket = useCallback(() => {
    // Only create a new socket if one doesn't exist already
    if (!socketRef.current) {
      console.log("Creating new socket connection");
      socketRef.current = io(SOCKET_URL);

      // Set up event listeners only once when socket is created
      socketRef.current.on("connect", () => {
        console.log("✅ Connected to socket:", socketRef.current.id);
      });

      socketRef.current.on("send-message", (data) => {
        console.log("📩 New message received:", data);

        if (selectedConversation && data.roomId === selectedConversation.id) {
          const receivedMsg = {
            id: Date.now().toString(),
            content: data.message,
            sender: data.senderId,
            senderName: data.senderName || "Unknown",
            senderRole: data.senderRole || "customer",
            timestamp: new Date(),
            attachments: data.attachments || [],
          };

          console.log("📝 Adding message to state:", receivedMsg);
          setMessages((prev) => [...prev, receivedMsg]);
        }
      });
    }

    // Join the room if we have the required information
    if (socketRef.current && selectedConversation?.id && userID) {
      console.log("Joining room:", selectedConversation.id);
      socketRef.current.emit("join-chat", {
        roomId: selectedConversation.id,
        userId: userID,
      });
    }
  }, [selectedConversation, userID]);

  // Handle room joining when conversation or userID changes
  useEffect(() => {
    if (selectedConversation?.id && userID) {
      connectSocket();
    }
  }, [selectedConversation, userID, connectSocket]);

  // Clean up socket connection when component unmounts
  useEffect(() => {
    return () => {
      console.log("Component unmounting, cleaning up socket");
      if (socketRef.current) {
        if (selectedConversation?.id && userID) {
          socketRef.current.emit("leave-room", {
            roomId: selectedConversation.id,
            userId: userID,
          });
        }

        socketRef.current.off("connect");
        socketRef.current.off("send-message");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const fetchGroupConversations = async (): Promise<Conversation[]> => {
    try {
      showLoader();
      const response = await axiosInstance.get("/quote/v2/group/conversations");

      return response.data.map((group: any) => ({
        id: group.id,
        participants: group.participants.map((participant: any) => ({
          id: participant.id,
          name: participant.name,
          role: "member", // Modify if specific roles exist
          company: participant.company || "N/A",
          avatar: participant.avatar || "https://via.placeholder.com/150",
        })),
        lastMessage: {
          content: group.lastMessage.content,
          timestamp: group.lastMessage.timestamp,
          isRead: group.lastMessage.isRead,
        },
        messages: group.messages,
      }));
    } catch (error) {
      console.error("Error fetching group conversations:", error);
      return [];
    } finally {
      hideLoader();
    }
  };

  const getConversations = async () => {
    const fetchedConversations = await fetchGroupConversations();
    console.log("data", fetchedConversations);
    setConversations(fetchedConversations);

    // setMessages(fetchedConversations.filter((conv)=>conv.id==selectedConversation.id))
    if (selectedConversation) {
      console.log("select", selectedConversation);
      const selectedConv = fetchedConversations.find(
        (conv) => conv.id === selectedConversation?.id
      );

      setMessages(selectedConv?.messages || []);
    }
  };

  useEffect(() => {
    getConversations();
  }, [selectedConversation]);

  const addUsersToGroupChat = async (groupName, userIds) => {
    try {
      showLoader();
      const response = await axiosInstance.post("/quote/v2/group/add-users", {
        groupName,
        userIds,
      });

      if (response.status === 200) {
        console.log("Group chat updated:", response.data);
      }
    } catch (error) {
      console.error(
        "Error adding users to group chat:",
        error.response?.data || error.message
      );
      return;
    } finally {
      hideLoader();
    }
  };

  const handleCreateConversation = async (participants: Participant[]) => {
    try {
      showLoader();
      const response = await addUsersToGroupChat(
        "Conversation",
        participants.map((e) => e.id)
      );

      const newConversation: Conversation = {
        id: `c${conversations.length + 1}`,
        participants: participants.map((participant) => ({
          id: participant.id,
          name: participant.name,
          role: "stakeholder",
          company: participant.company,
          avatar: participant.avatar,
        })),
      };

      getConversations();

      setConversations((prev) => [...prev, newConversation]);
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      hideLoader();
    }
  };

  const handleAttachmentClick = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };

  const handleFileUpload = (type: "image" | "document") => {
    if (fileInputRef.current) {
      fileInputRef.current.accept =
        type === "image" ? "image/*" : ".pdf,.doc,.docx,.txt";
      fileInputRef.current.click();
    }
    setShowAttachmentOptions(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each selected file
    for (const file of files) {
      const isImage = file.type.startsWith("image/");
      const fileSize = formatFileSize(file.size);

      // Add to pending attachments
      setPendingAttachments((prev) => [
        ...prev,
        {
          id: `upload-${Date.now()}-${file.name}`,
          type: isImage ? "image" : "document",
          url: URL.createObjectURL(file), // For preview only
          file, // Store the actual file
          name: file.name,
          size: fileSize,
        },
      ]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleSendMessage = async () => {
    if (
      (!newMessage.trim() && pendingAttachments.length === 0) ||
      !selectedConversation
    )
      return;

    let uploadedFiles = [];

    if (pendingAttachments.length > 0) {
      const formData = new FormData();
      console.log("pending attachments", pendingAttachments);

      pendingAttachments.forEach((attachment) => {
        if (attachment.file) {
          formData.append("files", attachment.file);
        }
      });

      try {
        showLoader();
        const { data } = await axiosInstance.post(
          "/api/auth/upload/files",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (data.success) {
          uploadedFiles = data.urls;
        }
      } catch (error) {
        console.error("File upload failed:", error);
        return;
      } finally {
        hideLoader();
      }
    }

    const newMsg = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: userID,
      senderName: contractorName,
      senderRole: "contractor",
      timestamp: new Date(),
      attachments: pendingAttachments,
    };

    // Make sure socket exists before trying to emit
    if (socketRef.current) {
      socketRef.current.emit("send-message", {
        senderId: userID,
        roomId: selectedConversation.id,
        message: newMessage.trim(),
        messageType: uploadedFiles.length > 0 ? "file" : "text",
        attachments: uploadedFiles,
      });
    } else {
      console.error("Socket not connected, attempting to reconnect");
      connectSocket();
      // After reconnection, try to send message again
      if (socketRef.current) {
        socketRef.current.emit("send-message", {
          senderId: userID,
          roomId: selectedConversation.id,
          message: newMessage.trim(),
          messageType: uploadedFiles.length > 0 ? "file" : "text",
          attachments: uploadedFiles,
        });
      }
    }

    // Optimistically update UI
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
    setPendingAttachments([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== id)
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const getOtherParticipantNames = (
    participants: { id: string; name: string }[]
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return "";

    try {
      const decoded = jwtDecode<any>(token);
      const currentUserId = decoded.id;

      return participants
        .filter((p) => p.id !== currentUserId)
        .map((p) => p.name)
        .join(", ");
    } catch (error) {
      console.error("Error decoding token:", error);
      return "";
    }
  };
  return (
    <div className="flex flex-col h-full">
      {!selectedConversation ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!meeting && (
            <button
              onClick={() => setShowCreateModal(true)}
              className={`w-full flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors mb-4 `}
            >
              <Plus className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-600">Create Conversation</span>
            </button>
          )}

          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className="flex items-center p-4 bg-gradient-to-r from-blue-600/5 to-blue-600/10 border border-blue-100 rounded-lg hover:from-blue-600/10 hover:to-blue-600/15 transition-all duration-300 cursor-pointer"
            >
              <div className="flex -space-x-2 mr-4">
                {conversation.participants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className={`w-8 h-8 rounded-full border-2 border-white shadow-sm ${
                      index > 2 ? "hidden" : ""
                    }`}
                  >
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                        <span
                          className={`text-sm font-medium  ${
                            meeting ? "text-white" : "text-blue-600"
                          }`}
                        >
                          {participant.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {conversation.participants.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center">
                    <span className="text-xs text-blue-600">
                      +{conversation.participants.length - 3}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {getOtherParticipantNames(conversation.participants)}
                    </h3>
                  </div>
                  {conversation.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessage.timestamp}
                    </span>
                  )}
                </div>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {formatTime(new Date(conversation.lastMessage.timestamp))}{" "}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Conversations
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {selectedConversation.participants.length} Participants
                  </span>
                  {showParticipants ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showParticipants && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    {selectedConversation.participants.map(
                      (participant, index) => (
                        <div
                          key={participant.id}
                          className={`px-4 py-2 ${
                            index !== 0 ? "border-t border-gray-100" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            {participant.avatar ? (
                              <img
                                src={participant.avatar}
                                alt={participant.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {participant.name.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="ml-3">
                              <p
                                className={`text-sm font-medium  ${
                                  meeting ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {participant.name}
                              </p>
                              {/* <p className="text-xs text-gray-500">
                                {participant.company}
                              </p> */}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender == userID ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender != userID && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium mr-1">
                    {message.senderName
                      ? message.senderName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()
                          .substring(0, 2)
                      : "?"}
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender == userID
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.sender != userID && (
                    <p className="text-xs text-gray-500 font-medium">
                      {message.senderName}
                    </p>
                  )}
                  <div className="max-w-full">
                    <p className="whitespace-pre-wrap break-words overflow-hidden">
                      {message.content.split(urlRegex).map((part, index) =>
                        urlRegex.test(part) ? (
                          <a
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white-500 underline"
                          >
                            {part}
                          </a>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  </div>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className={`rounded-lg overflow-hidden ${
                            attachment.type === "image"
                              ? ""
                              : "bg-white bg-opacity-10"
                          }`}
                        >
                          {attachment.type === "image" ? (
                            <button
                              onClick={() => setPreviewImage(attachment.url)}
                            >
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="w-full h-auto max-h-40 object-cover rounded-lg cursor-pointer"
                              />
                            </button>
                          ) : (
                            <div
                              className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                              onClick={() => {
                                console.log("Opening document");
                                window.open(attachment.url, "_blank");
                              }}
                            >
                              <div className="p-1 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <File className="w-4 h-4" />
                              </div>
                              <div className="ml-2 flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                  {attachment.name}
                                </p>
                                {attachment.size && (
                                  <p className="text-xs text-gray-500">
                                    {attachment.size}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-xs mt-1 ${
                      message.sender == userID
                        ? "text-blue-200"
                        : "text-gray-500"
                    } text-right`}
                  >
                    {formatTime(new Date(message.timestamp))}
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {previewImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={() => setPreviewImage(null)}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setPreviewImage(null)}
                >
                  ✖
                </button>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-[90vh] rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="p-4 border-t border-gray-200">
            {pendingAttachments.length > 0 && (
              <div className="mb-4 space-y-2">
                {pendingAttachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center bg-gray-50 p-2 rounded-lg"
                  >
                    {attachment.type === "image" ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <File className="w-10 h-10 text-gray-400" />
                    )}
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">{attachment.size}</p>
                    </div>
                    <button
                      onClick={() => removePendingAttachment(attachment.id)}
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: "40px", maxHeight: "120px" }}
                />
                <div className="absolute right-2 bottom-2 flex space-x-1">
                  <div className="relative">
                    <button
                      onClick={handleAttachmentClick}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Paperclip className="h-5 w-5 text-gray-500" />
                    </button>

                    {showAttachmentOptions && (
                      <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden min-w-[160px]">
                        <button
                          onClick={() => handleFileUpload("image")}
                          className="flex items-center w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group"
                        >
                          <div className="p-1.5 rounded bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <Image className="w-4 h-4" />
                          </div>
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-gray-700">
                              Upload Image
                            </span>
                            <span className="block text-xs text-gray-500">
                              PNG, JPG up to 10MB
                            </span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleFileUpload("document")}
                          className="flex items-center w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group"
                        >
                          <div className="p-1.5 rounded bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                            <File className="w-4 h-4" />
                          </div>
                          <div className="ml-3">
                            <span className="block text-sm font-medium text-gray-700">
                              Upload Document
                            </span>
                            <span className="block text-xs text-gray-500">
                              PDF, DOC up to 25MB
                            </span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                  />
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && pendingAttachments.length === 0}
                className={`p-2 rounded-full ${
                  newMessage.trim() || pendingAttachments.length > 0
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                } transition-colors`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}

      {!meeting && (
        <CreateConversationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateConversation={handleCreateConversation}
        />
      )}
    </div>
  );
};
