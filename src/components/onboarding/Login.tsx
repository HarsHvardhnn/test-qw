import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QwilloLogo } from "../QwilloLogo";
import { Eye, EyeOff, User, X, ArrowLeft } from "lucide-react";
import { useLoader } from "../../context/LoaderContext";
import { GoArrowUpLeft } from "react-icons/go";

interface SavedAccount {
  email: string;
  password: string;
}

type UserRole = "customer" | "contractor" | "vendor" | null;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  // Step management state
  const [currentStep, setCurrentStep] = useState<"roleSelection" | "loginForm">(
    "roleSelection"
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [redirected, setRedirected] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [showSavedAccounts, setShowSavedAccounts] = useState(false);

  // Load saved accounts on component mount
  useEffect(() => {
    const redirected = localStorage.getItem("csx-redirect");
    if (redirected === "true") {
      setRedirected(true);
    }

    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/contractor");
    }

    // Load saved accounts
    const accounts = localStorage.getItem("savedAccounts");
    if (accounts) {
      setSavedAccounts(JSON.parse(accounts));
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSavedAccountSelect = (account: SavedAccount) => {
    setFormData({
      email: account.email,
      password: account.password,
      rememberMe: true,
    });
    setShowSavedAccounts(false);
  };

  const saveAccount = (email: string, password: string) => {
    const accountToSave: SavedAccount = {
      email,
      password,
    };

    // Check if account already exists
    const existingIndex = savedAccounts.findIndex((acc) => acc.email === email);

    let updatedAccounts = [...savedAccounts];
    if (existingIndex >= 0) {
      // Update existing account
      updatedAccounts[existingIndex] = accountToSave;
    } else {
      // Add new account
      updatedAccounts.push(accountToSave);
    }

    localStorage.setItem("savedAccounts", JSON.stringify(updatedAccounts));
    setSavedAccounts(updatedAccounts);
  };

  const removeAccount = (email: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click handler

    const updatedAccounts = savedAccounts.filter((acc) => acc.email !== email);
    localStorage.setItem("savedAccounts", JSON.stringify(updatedAccounts));
    setSavedAccounts(updatedAccounts);

    if (updatedAccounts.length === 0) {
      setShowSavedAccounts(false);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep("loginForm");
  };

  const goBackToRoleSelection = () => {
    setCurrentStep("roleSelection");
    setSelectedRole(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      showLoader();

      const response = await axiosInstance.post("/auth/v2/login", {
        email: formData.email,
        password: formData.password,
        role: selectedRole, // Pass the selected role to the backend
      });

      const { token, user } = response.data;

      // Save credentials only after successful login and if remember me is checked
      if (formData.rememberMe) {
        saveAccount(formData.email, formData.password);
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("Login successful:", token);
      toast.success("Login successful");

      // Navigate based on role (either from user or selected role)
      const navigateRole = user.role || selectedRole;
      console.log("User role:", navigateRole);
      if (navigateRole === "business") {

        navigate("/contractor");
      } else if (navigateRole === "vendor") {
        navigate("/vendor");
      } else {
        const savedPath = localStorage.getItem("saved-path");
        if (savedPath) {
          navigate(savedPath);
        } else {
          navigate("/customer");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "An error occurred during login";
      toast.error(errorMessage);
      // Do NOT save account details on failed login
    } finally {
      hideLoader();
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".saved-accounts-container") &&
        !target.closest(".user-icon-button")
      ) {
        setShowSavedAccounts(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // User role icons
  const CustomerIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        fill="white"
      />
      <path
        d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z"
        fill="white"
      />
    </svg>
  );

  const ContractorIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
      <path d="M2 17L12 22L22 17" fill="white" />
      <path d="M2 12L12 17L22 12" fill="white" />
    </svg>
  );

  const VendorIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z"
        fill="white"
      />
    </svg>
  );

  // Render the Role Selection Step
  const renderRoleSelection = () => {
    return (
      <div className="w-full max-w-md bg-white border border-gray-200 mx-auto rounded-xl p-6 shadow-lg relative z-10">
        <div className="flex items-start mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-black hover:text-gray-700 focus:outline-none"
          >
            <GoArrowUpLeft height={16} width={16} />
          </button>
          <h2 className="text-base font-normal text-center text-gray-800 flex-grow">
            Log in as
          </h2>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect("customer")}
            className="w-full py-3 px-4 flex items-center justify-center text-white bg-[#21416D] rounded-md hover:bg-blue-900 transition-colors"
          >
            <img src="/user-round.png" alt="Contractor Icon" className="w-5 h-5" />
            <span className="ml-2 text-base font-normal">Customer</span>
          </button>

          <button
            onClick={() => handleRoleSelect("contractor")}
            className="w-full py-3 px-4 flex items-center justify-center text-white bg-[#21416D] rounded-md hover:bg-blue-900 transition-colors"
          >
            <img
              src="/hard-hat.png"
              alt="Contractor Icon"
              className="w-5 h-5"
            />
            <span className="ml-2 text-base font-normal">Contractor</span>
          </button>

          <button
            onClick={() => handleRoleSelect("vendor")}
            className="w-full py-3 px-4 flex items-center justify-center text-white bg-[#21416D] rounded-md hover:bg-blue-900 transition-colors"
          >
            <img src="/box.png" alt="vendor Icon" className="w-5 h-5" />
            <span className="ml-2 text-base font-normal">Vendor</span>
          </button>
        </div>
      </div>
    );
  };

  // Render the Login Form Step
  const renderLoginForm = () => {
    return (
      <div className="w-full max-w-md bg-[#FFFFFFEB] border border-[#CFD6EC] mx-auto rounded-xl p-6 shadow-lg relative z-10">
        <div className="flex items-center mb-4">
          <button
            onClick={goBackToRoleSelection}
            className="text-gray-600 hover:text-gray-800 mr-2 focus:outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            Sign In{" "}
            {selectedRole &&
              `as ${
                selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
              }`}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Email Input with Saved Accounts Dropdown */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full px-4 py-2 rounded-xl border-[1px] border-gray-300 outline-none bg-gray-50 focus:border-blue-500"
              required
              onFocus={() =>
                savedAccounts.length > 0 && setShowSavedAccounts(true)
              }
            />

            {savedAccounts.length > 0 && (
              <button
                type="button"
                onClick={() => setShowSavedAccounts(!showSavedAccounts)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none user-icon-button"
                title="Show saved accounts"
              >
                <User size={20} />
              </button>
            )}

            {/* Saved Accounts Dropdown */}
            {showSavedAccounts && savedAccounts.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 saved-accounts-container">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 flex justify-between items-center">
                  <span>Saved Accounts</span>
                  <span className="text-xs text-gray-500">
                    Click to auto-fill
                  </span>
                </div>
                {savedAccounts.map((account, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    onClick={() => handleSavedAccountSelect(account)}
                  >
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-500" />
                      <span>{account.email}</span>
                    </div>
                    <button
                      onClick={(e) => removeAccount(account.email, e)}
                      className="text-gray-400 hover:text-red-500 focus:outline-none"
                      title="Remove account"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-xl border-gray-300 outline-none bg-gray-50 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Options and Button */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-[#1A1A1A]">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="mr-2"
              />
              Remember me
            </label>
            <Link
              to="/forget-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="relative flex w-screen h-screen bg-gradient-to-b from-white to-[#628EFF45] text-slate-800 flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="w-32 h-12 mb-8">
          <QwilloLogo variant="full" />
        </div>

        {/* Render the current step */}
        {currentStep === "roleSelection"
          ? renderRoleSelection()
          : renderLoginForm()}

        {/* Footer - now included in the role selection component */}
        {!redirected && (
          <p className="mt-8 text-center text-sm text-black">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium hover:underline text-[#21416D]"
            >
              Sign up now
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
