import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axiosInstance from "../../axios";
import { QwilloLogo } from "../QwilloLogo";

const AccountForm2: React.FC<Props> = ({
  businessName,
  address,
  phone,
  location,
  imageUrl,
  role = "business",
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegisterRoute, setIsRegisterRoute] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const loc = useLocation();

  useEffect(() => {
    // Check if the current route is /register
    setIsRegisterRoute(loc.pathname === "/register2");
  }, [loc]);

  const getQueryParams = (query: string) => {
    const params = new URLSearchParams(query);
    return {
      businessName: params.get("businessName") || "",
      address: params.get("address") || "",
      phone: params.get("phone") || "",
      location: params.get("location") || "",
      imageUrl: params.get("imageUrl") || "",
    };
  };

  const businessDetails = getQueryParams(window.location.search);
  const [error, setError] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateOtp = (otp: string) => {
    return /^[0-9]{4}$/.test(otp);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "otp") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 4) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleToggle = () => {
    setIsAgreed(!isAgreed);
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError("Please enter an email first.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/v2/send-otp", {
        email: formData.email,
      });

      if (response.status === 200) {
        alert("OTP sent successfully to " + formData.email);
        setOtpSent(true);
      } else {
        setError(
          response.data.message || "Failed to send OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpSent) {
      await handleSendOtp();
      return;
    }

    if (!isAgreed) {
      setError("Please agree to the Terms and Conditions");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!validateOtp(formData.otp)) {
      setError("Please enter a valid OTP");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/v2/signup", {
        email: formData.email,
        otp: formData.otp,
        fullName: formData.name,
        phone: phone,
        password: formData.password,
        role: role,
        businessDetails,
        vendorDetails: {
          businessName,
          address,
          phone,
          location,
          imageUrl,
        },
      });

      if (response.status == 200 || response.status == 201) {
        alert("Business registered successfully!");
        navigate("/login");
      } else {
        setError(response.data.error || "Signup failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong!");
    }
  };

  return (
    <div>
      <div className="bg-white text-black">
        <div className="bg-gradient-to-b from-white to-[#628EFF45]">
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-32 h-12 mb-4">
              <QwilloLogo variant="full" />
            </div>

            <h2 className="text-center text-2xl font-sans font-[700] mb-4 sm:mb-6">
              Creating Account
            </h2>
            <div className="bg-[#FFFFFFEB] border border-[#CFD6EC] shadow-md rounded-xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full flex flex-col items-center border border-[#CFD6EC]">
              {/* Steps */}
              <div className="flex justify-between items-center mb-6 sm:mb-8 w-full relative">
                <div className="flex-col flex items-center">
                  <span className="text-[#7A7A7A] font-medium text-sm sm:text-base">
                    Step 1
                  </span>
                  <span className="font-[700] text-sm sm:text-base">
                    Business Info
                  </span>
                </div>
                <div className="absolute w-6 h-1 bg-blue-600 top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 rounded-full" />
                <div className="flex-col flex items-center">
                  <span
                    className={`${
                      isRegisterRoute ? "text-blue-600" : "text-[#7A7A7A]"
                    } font-medium`}
                  >
                    Step 2
                  </span>
                  <span
                    className={`${
                      isRegisterRoute ? "text-blue-600" : "text-[#7A7A7A]"
                    } font-medium`}
                  >
                    Your Info
                  </span>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-4 w-full" onSubmit={handleRegister}>
                {/* Full Name */}
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-[#808080] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-[#808080] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={otpSent}
                />

                {/* OTP Input - Only shown after OTP is sent */}
                {otpSent && (
                  <input
                    type="text"
                    name="otp"
                    placeholder="OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-[#808080] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                {/* Error message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Password fields - Only shown after OTP is sent */}
                {otpSent && (
                  <>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-[#808080] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span
                        className="absolute inset-y-0 right-4 flex items-center text-gray-500 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 text-[#808080] border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span
                        className="absolute inset-y-0 right-4 flex items-center text-gray-500 cursor-pointer"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {confirmPasswordVisible ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </span>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={handleToggle}
                        className={`w-10 h-5 rounded-full relative shadow-inner transition-colors duration-200 ${
                          isAgreed ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0 left-0 h-5 w-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
                            isAgreed ? "transform translate-x-full" : ""
                          }`}
                        />
                      </button>
                      <span className="ml-3 text-gray-700 text-sm sm:text-base">
                        Agree to Terms and Conditions
                      </span>
                    </div>
                  </>
                )}

                {/* Dynamic Button - Changes from "Send OTP" to "Register" */}
                <button
                  type="submit"
                  className="w-full py-2 mt-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none"
                >
                  {otpSent ? "Register" : "Send OTP"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountForm2;
