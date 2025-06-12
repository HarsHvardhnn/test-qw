import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { QwilloLogo } from "../QwilloLogo";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  // State variables
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Flow step state: 1 = Email, 2 = OTP, 3 = Password
  const [flowStep, setFlowStep] = useState(1);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };

  // Handle OTP input change
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (value === "" || /^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setErrorMessage("");

      // Move to next input if value is entered
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle key press for navigation between OTP inputs
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Step 1: Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrorMessage("Email is required");
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Call the API to send OTP
      await axiosInstance.post("/auth/v2/password-otp", { email });
      setFlowStep(2); // Move to OTP verification step
      setErrorMessage("");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and move to password reset step
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit code");
      return;
    }

    setFlowStep(3); // Move to password reset step
    setErrorMessage("");
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (!password) {
      setErrorMessage("Password is required");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Call the API to reset password
      await axiosInstance.post("/auth/v2/reset-password", {
        email,
        otp: otp.join(""),
        newPassword: password,
      });

      // Redirect to login page on success
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage(
        "Failed to reset password. Please check your information and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      await axiosInstance.post("/auth/v2/password-otp", { email });
      // Optional: Show success message for resend
    } catch (error) {
      console.error("Error resending OTP:", error);
      setErrorMessage("Failed to resend verification code. Please try again.");
    }
  };

  // Going back in the flow
  const handleBack = () => {
    if (flowStep > 1) {
      setFlowStep(flowStep - 1);
    } else {
      navigate(-1); // Go back in browser history
    }
    setErrorMessage("");
  };

  return (
    <div className="bg-white text-black">
      <div className="bg-gradient-to-b from-white to-[#628EFF45]">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-32 h-12 mb-12">
            <QwilloLogo variant="full" />
          </div>{" "}
          <div className="bg-[#FFFFFFEB] border border-[#CFD6EC] rounded-xl shadow-lg flex flex-col justify-between px-9 py-8 max-w-md w-full">
            <button
              onClick={handleBack}
              className="flex items-center text-sm text-[#1A1A1A] mb-4 sm:mb-6 hover:text-blue-600 transition-colors"
            >
              <AiOutlineArrowLeft className="mr-2" />
              Back
            </button>

            {/* Step 1: Email Input */}
            {flowStep === 1 && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Forgot Password
                  </h2>
                  <p className="text-sm text-gray-600 mb-8">
                    Enter your email address. We'll send you a verification code
                    to reset your password.
                  </p>
                </div>
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={handleEmailChange}
                      className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errorMessage && (
                      <span className="text-red-500 text-xs">
                        {errorMessage}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-[#0057FF] font-bold text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300"
                  >
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </button>
                </form>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {flowStep === 2 && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Enter Verification Code
                  </h2>
                  <p className="text-sm text-gray-600 mb-8">
                    We've sent a 6-digit verification code to {email}
                  </p>
                </div>
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <div className="flex gap-2 justify-between mb-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          ref={(el) => (inputRefs.current[index] = el)}
                          className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ))}
                    </div>
                    {errorMessage && (
                      <span className="text-red-500 text-xs">
                        {errorMessage}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#0057FF] font-bold text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Verify Code
                  </button>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        className="text-[#0057FF] hover:underline"
                      >
                        Resend
                      </button>
                    </p>
                  </div>
                </form>
              </>
            )}

            {/* Step 3: New Password */}
            {flowStep === 3 && (
              <>
                <div>
                  <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                    Create New Password
                  </h2>
                  <p className="text-sm text-gray-600 mb-8">
                    Your new password must be at least 8 characters long
                  </p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errorMessage && (
                      <span className="text-red-500 text-xs">
                        {errorMessage}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-[#0057FF] font-bold text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300"
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
