import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Upload,
  Camera,
  Save,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import axiosInstance from "../../../axios";
import { jwtDecode } from "jwt-decode";
import { useLoader } from "../../../context/LoaderContext";
import { useUser } from "../../../context/UserContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QwilloLogo } from "../../../components/QwilloLogo";
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_PUBLIC_GENAI_API_KEY!
);

export const SettingsPanel: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState({
    businessProfile: true,
    contractorProfile: true,
  });

  const { fetchBusinessProfilePicture, fetchUserProfilePicture } = useUser();
  const { showLoader, hideLoader } = useLoader();

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveAnimation, setSaveAnimation] = useState(false);
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    // Business Profile
    businessName: "J9 Construction, LLC",
    businessEmail: "info@j9construction.com",
    businessPhone: "(555) 123-4567",
    businessAddress: "123 Main St, Portland, OR 97201",
    businessWebsite: "www.j9construction.com",
    businessLogo: "",

    // Contractor Profile
    firstName: "Josh",
    lastName: "Householder",
    email: "josh@j9construction.com",
    phone: "(555) 987-6543",
    title: "Owner",
    bio: "Experienced contractor specializing in high-end residential remodels.",
    profilePicture: "",
  });

  const fetchContractorProfile = async (userId) => {
    try {
      showLoader();
      const response = await axiosInstance.get(`/quote/v2/contractor/profile`, {
        params: { userId }, // Pass userId as query param
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching contractor profile:", error);
      throw error.response?.data || { error: "Something went wrong" };
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.id);
    if (!userId) return;

    const getProfile = async () => {
      try {
        const data = await fetchContractorProfile(decodedToken.id);
        setFormData(data);
      } catch (err) {
        // setError(err.error || "Failed to load profile");
      }
    };

    getProfile();
  }, [userId]);

  const businessLogoRef = useRef<HTMLInputElement>(null);
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState<"business" | "profile" | null>(
    null
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDrag = (e: React.DragEvent, type: "business" | "profile") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(type);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = async (
    e: React.DragEvent,
    type: "business" | "profile"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          [type === "business" ? "businessLogo" : "profilePicture"]:
            reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveContractorProfile = async (profileData: any) => {
    try {
      showLoader();
      const response = await axiosInstance.post(
        "/quote/v2/contractor/save-profile",
        profileData
      );
      fetchBusinessProfilePicture();
      fetchUserProfilePicture();

      return response.data;
    } catch (error) {
      console.error("Error saving contractor profile:", error);
      throw error.response?.data || { error: "Something went wrong" };
    } finally {
      hideLoader();
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "business" | "profile"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axiosInstance.post(
        "/api/auth/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data?.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          [type === "business" ? "businessLogo" : "profilePicture"]:
            response.data.imageUrl,
        }));
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleSaveSettings = async () => {
    await saveContractorProfile(formData);
    // In a real app, this would save to a backend
    console.log("Saving settings:", formData);

    // Trigger success animation
    setSaveAnimation(true);
    setSaveSuccess(true);

    // Reset animation state after completion
    setTimeout(() => {
      setSaveAnimation(false);
      // Keep success message a bit longer
      setTimeout(() => {
        setSaveSuccess(false);
      }, 1500);
    }, 1500);
  };

  const fetchAIResponse = async (userMessage) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(
        `Summarize the following text concisely while keeping the key details but not in third person give response in pov of author:\n\n"${userMessage}"`
      );
      const response = await result.response;
      const aiText = response.text().trim();

      return aiText || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Oops! Something went wrong while communicating with AI.";
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Success Notification */}
      {saveSuccess && (
        <div
          className={`fixed top-4 right-4 z-50 transition-all duration-500 transform ${
            saveAnimation
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white shadow-lg rounded-lg p-4 border-l-4 border-green-500 flex items-center space-x-3 max-w-md">
            <div
              className={`bg-green-100 p-2 rounded-full ${
                saveAnimation ? "animate-bounce" : ""
              }`}
            >
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Success!</h3>
              <p className="text-sm text-gray-600">
                Your settings have been saved
              </p>
            </div>
            <button
              onClick={() => setSaveSuccess(false)}
              className="text-gray-400 hover:text-gray-500 ml-auto"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
      </div>

      {/* Business Profile */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div
          className="px-6 py-4 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("businessProfile")}
        >
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-medium text-gray-900">
              Business Profile
            </h3>
          </div>
          {expandedSections.businessProfile ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>

        {expandedSections.businessProfile && (
          <div className="p-6 border-t border-gray-200">
            {/* Business Logo Upload */}
            <div className="mb-6 w-[10%]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Logo
              </label>

              {formData.businessLogo ? (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={formData.businessLogo}
                    alt="Business Logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, businessLogo: "" }))
                    }
                    className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="business-logo"
                  className="flex flex-col items-center justify-center w-32 h-32 mx-auto p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  onDragEnter={(e) => handleDrag(e, "business")}
                  onDragLeave={(e) => handleDrag(e, "business")}
                  onDragOver={(e) => handleDrag(e, "business")}
                  onDrop={(e) => handleDrop(e, "business")}
                >
                  <Upload className="h-10 w-10 text-gray-400" />
                  <div className="mt-2 text-sm text-center">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Upload a file
                    </span>
                    <span className="text-gray-600 ml-1">or drag and drop</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  <input
                    ref={businessLogoRef}
                    id="business-logo"
                    name="business-logo"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "business")}
                  />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg h-11"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="businessEmail"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Email
                </label>
                <div className=" flex border border-gray-300 rounded-lg">
                  <span className="inline-flex items-center px-4 rounded-l-lg  border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    id="businessEmail"
                    name="businessEmail"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-none h-11"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="businessPhone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Phone
                </label>
                <div className="flex border border-gray-300 rounded-lg">
                  <span className="inline-flex items-center px-4 rounded-l-lg  border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <Phone className="h-5 w-5" />
                  </span>
                  <input
                    type="number"
                    id="businessPhone"
                    name="businessPhone"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-none h-11"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="businessWebsite"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Website
                </label>
                <div className="flex border border-gray-300 rounded-lg">
                  <span className="inline-flex items-center px-4 rounded-l-lg  border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <Globe className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    id="businessWebsite"
                    name="businessWebsite"
                    value={formData.businessWebsite}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-none  h-11"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="businessAddress"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Address
                </label>
                <div className="flex border border-gray-300 rounded-lg">
                  <span className="inline-flex items-center px-4 rounded-l-lg  border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    id="businessAddress"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-none block w-full sm:text-sm border-none  h-11"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contractor Profile */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div
          className="px-6 py-4 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection("contractorProfile")}
        >
          <div className="flex items-center">
            <User className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-medium text-gray-900">
              Contractor Profile
            </h3>
          </div>
          {expandedSections.contractorProfile ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>

        {expandedSections.contractorProfile && (
          <div className="p-6 border-t border-gray-200">
            {/* Profile Picture Upload */}
            <div className="mb-6 w-[10%]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>

              {formData.profilePicture ? (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={formData.profilePicture}
                    alt="Profile Picture"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        profilePicture: "",
                      }))
                    }
                    className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="profile-picture"
                  className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  onDragEnter={(e) => handleDrag(e, "profile")}
                  onDragLeave={(e) => handleDrag(e, "profile")}
                  onDragOver={(e) => handleDrag(e, "profile")}
                  onDrop={(e) => handleDrop(e, "profile")}
                >
                  <Camera className="h-10 w-10 text-gray-400" />
                  <div className="mt-2 text-sm text-gray-600 text-center">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Upload
                    </span>
                    <p className="text-gray-500">or drag & drop</p>
                    <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    ref={profilePictureRef}
                    id="profile-picture"
                    name="profile-picture"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profile")}
                  />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg h-11"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg h-11"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <div className=" flex border border-gray-300 rounded-lg">
                  <span className="inline-flex items-center px-4 rounded-l-lg  border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <Mail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-none rounded-none  h-11"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <div className="flex border border-gray-300 rounded-lg">
                  <span className="inline-flex items-center px-4 rounded-l-lg  border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm h-11">
                    <Phone className="h-5 w-5" />
                  </span>
                  <input
                    type="number"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-none rounded-none  h-11"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg h-11"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bio
                </label>
                <div className="relative">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg resize-none pr-10"
                    placeholder="Tell customers about yourself and your experience..."
                  />

                  {/* AI Summarize Button (only visible when bio has text) */}
                  {formData.bio?.trim() && (
                    <button
                      id="bio-ai-summarize-btn"
                      onClick={async () => {
                        const btn = document.getElementById(
                          "bio-ai-summarize-btn"
                        );
                        if (btn) {
                          btn.textContent = "Summarizing...";
                          btn.classList.add("animate-pulse");
                        }

                        const summarizedText = await fetchAIResponse(
                          formData.bio
                        );

                        if (btn) {
                          btn.textContent = "AI Summarize";
                          btn.classList.remove("animate-pulse");
                        }

                        handleInputChange({
                          target: { name: "bio", value: summarizedText },
                        });
                      }}
                      className="absolute bottom-2 right-2 px-2 py-1 rounded-md text-gray-400 hover:text-blue-500 transition-opacity bg-white"
                      title="AI Summarize"
                    >
                      <div className="w-4 h-4 inline-block mr-1">
                        <QwilloLogo variant="icon" />
                      </div>
                      <span>AI Summarize</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleSaveSettings}
          className={`inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            saveAnimation ? "animate-pulse" : ""
          }`}
        >
          <Save className="h-5 w-5 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
};
