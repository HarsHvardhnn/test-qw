import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../axios";
import { QwilloLogo } from "../QwilloLogo";

const AccountForm1: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    phoneCode: "+1", // Default country code
    phoneNumber: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isRegisterRoute, setIsRegisterRoute] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the current route is /register
    setIsRegisterRoute(location.pathname === "/register");
  }, [location]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits
    return phoneRegex.test(phone);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axiosInstance.post(
        "/api/auth/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadedImageUrl = response.data.imageUrl;
      setImageUrl(uploadedImageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName || !formData.address || !formData.phoneNumber) {
      alert("Please fill in all the required fields.");
      return;
    }

    if (!validatePhone(formData.phoneNumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // Concatenate phone code and number
    const fullPhoneNumber = `${formData.phoneCode}${formData.phoneNumber}`;

    // Pass data to the next step via query params
    const queryParams = new URLSearchParams({
      businessName: formData.businessName,
      address: formData.address,
      phone: fullPhoneNumber,
      imageUrl: imageUrl || "",
    }).toString();

    navigate(`/register2?${queryParams}`);
  };

  return (
    <div>
      <div className="bg-white">
        <div className="bg-gradient-to-b from-white to-[#628EFF45]">
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-32 h-12 mb-4">
              <QwilloLogo variant="full" />
            </div>

            <p className="text-center text-2xl text-black font-[700] mb-6 mt-6">
              Creating Account
            </p>

            <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full justify-center items-center border border-[#CFD6EC]">
              {/* Steps Indicator */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col items-center">
                  <span
                    className={`${
                      isRegisterRoute ? "text-blue-600" : "text-[#7A7A7A]"
                    } font-medium`}
                  >
                    Step 1
                  </span>
                  <span
                    className={`font-[700] ${
                      isRegisterRoute ? "text-blue-600" : "text-black"
                    }`}
                  >
                    Business Info
                  </span>
                </div>
                <div className="w-12 h-1 text-center bg-gray-300 rounded-full mx-2 md:mx-4"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[#7A7A7A] font-medium">Step 2</span>
                  <span className="font-[700] text-black">Your Info</span>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="flex flex-col justify-center items-center mb-4 px-36">
                <div className="relative w-20 h-20">
                  <button
                    type="button"
                    className="bg-gray-200 rounded-xl w-20 h-20 flex items-center justify-center overflow-hidden"
                    onClick={() =>
                      document.getElementById("imageUpload")?.click()
                    }
                  >
                    {isUploading ? (
                      <span className="text-sm text-gray-500">
                        Uploading...
                      </span>
                    ) : previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">Upload Image</span>
                    )}
                  </button>
                </div>

                {/* Label and Hidden Input for File Selection */}
                {/* <label
                  htmlFor="imageUpload"
                  className="text-[#5772A7] border-b text-[10px] border-[#5772A7] text-center cursor-pointer hover:text-blue-500"
                >
                  {isUploading ? "Uploading..." : "Choose Image"}
                </label> */}
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Form Fields */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-[#808080] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-[#808080] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Phone number with country code - adjusted ratio */}
                <div className="flex">
                  <select
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleChange}
                    className="w-20 px-1 py-2 text-[#808080] border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+91">+91</option>
                    <option value="+61">+61</option>
                    <option value="+86">+86</option>
                    <option value="+33">+33</option>
                    {/* Add more country codes as needed */}
                  </select>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 text-[#808080] border-t border-b border-r rounded-r-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Next
                </button>
              </form>
            </div>

            <p className="flex gap-2 text-center text-sm text-[#1A1A1A] mt-8 mb-8">
              <span>Already have an account?</span>
              <Link to="/" className="text-blue-600">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountForm1;
