import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { QwilloLogo } from '../QwilloLogo';

const OtpVerification: React.FC = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState<string[]>(['', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        // Handle resend OTP logic here
        console.log('Resending OTP...');
    };

    const handleSubmit = () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 4) {
            return;
        }
        // Handle verification logic here
        console.log('Verifying OTP:', otpValue);
    };

    return (
      <div>
        <div className="bg-white text-black">
          <div className="bg-gradient-to-b from-white to-[#628EFF45]">
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-[#628EFF45] px-4">
              <div className="w-32 h-12 mb-12">
                <QwilloLogo variant="full" />
              </div>

              <div className="bg-[#FFFFFFEB] border border-[#CFD6EC]  max-w-sm sm:max-w-md  rounded-xl shadow-lg flex flex-col justify-between px-9 py-8">
                <div>
                  <button
                    className="flex items-center text-sm text-gray-500 mb-4 sm:mb-6"
                    onClick={() => navigate(-1)}
                  >
                    <AiOutlineArrowLeft className="mr-2" />
                    Back
                  </button>
                  <h2 className="text-xl font-semibold text-[#1A1A1A] mb-8">
                    An verification code has been
                    <br />
                    sent to your email
                  </h2>

                  <div className="flex justify-between gap-4 w-full">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-[78px] h-[103px] text-center text-3xl font-medium border border-gray-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <button
                    onClick={handleResend}
                    className="mt-6 mb-10 text-sm text-white bg-[#0057FF] px-6 py-2 rounded-full hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Resend OTP
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="w-full py-2 text-lg font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default OtpVerification;
