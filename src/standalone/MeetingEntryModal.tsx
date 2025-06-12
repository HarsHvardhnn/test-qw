import React, { useState, FormEvent } from "react";
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { useUser } from '../context/UserContext';
import axiosInstance from '../axios';

interface MeetingEntryModalProps {
  onComplete: (userData: {name: string, email: string, phone: string}) => void;
  meetingId:string | any;
}

const projectTypes = [
  'Kitchen Remodeling',
  'Bathroom Renovation',
  'Home Addition',
  'Roofing',
  'Landscaping',
  'Interior Design',
  'Electrical Work',
  'Plumbing',
  'Custom Home Build',
  'Other'
];

export const MeetingEntryModal: React.FC<MeetingEntryModalProps> = ({ onComplete,meetingId  }) => {
  const { setCustomerName } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: '',
    location: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const createProject = async (formData : any) => {
    try {
      const response = await axiosInstance.post("/project-v2", {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        projectLocation: formData.location, // Match API field name
        projectType: formData.projectType,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        isConditionsAccepted: formData.agreeToTerms,
        meetingId,
      });
  
      console.log("Project created successfully:", response.data.project);


      // alert(response.data.project._id)
       localStorage.setItem('project',response.data.project._id)
      return response.data; // Return response for further use
  
    } catch (error:any) {
      console.error("Error creating project:", error.response?.data || error.message);
      throw error; // Rethrow for handling in UI
    }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.projectType) newErrors.projectType = 'Project type is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
   
    try {
      setCustomerName(formData.name);
    //  await createProject(formData);
      onComplete(formData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-xl glassmorphic rounded-xl p-8 transform transition-all duration-300 animate-fade-in max-h-[90vh] overflow-y-auto no-scrollbar">
        <h2 className="text-2xl font-semibold text-white text-center mb-2">
          Welcome to Your Qwillo Meeting
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Please provide your details to join the consultation
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-white/10 border ${
                errors.name ? "border-red-400" : "border-white/20"
              } 
            rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-400 
            focus:ring-2 focus:ring-blue-400/20 transition-colors`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Email and Phone Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-white/10 border ${
                  errors.email ? "border-red-400" : "border-white/20"
                } 
              rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-400 
              focus:ring-2 focus:ring-blue-400/20 transition-colors`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full bg-white/10 border ${
                  errors.phone ? "border-red-400" : "border-white/20"
                } 
              rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-400 
              focus:ring-2 focus:ring-blue-400/20 transition-colors`}
                placeholder="(555) 555-5555"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Project Type */}
          <div>
            <label
              htmlFor="projectType"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Project Type *
            </label>
            <div className="relative">
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className={`w-full bg-white/10 border ${
                  errors.projectType ? "border-red-400" : "border-white/20"
                } 
              rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-400 
              focus:ring-2 focus:ring-blue-400/20 transition-colors appearance-none`}
              >
                <option value="" disabled>
                  Select project type
                </option>
                {projectTypes.map((type) => (
                  <option key={type} value={type} className="bg-gray-900">
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
            </div>
            {errors.projectType && (
              <p className="mt-1 text-sm text-red-400">{errors.projectType}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Project Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full bg-white/10 border ${
                  errors.location ? "border-red-400" : "border-white/20"
                } 
              rounded-lg px-4 py-2.5 pl-10 text-white placeholder-gray-400 focus:border-blue-400 
              focus:ring-2 focus:ring-blue-400/20 transition-colors`}
                placeholder="Enter project location"
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-400">{errors.location}</p>
            )}
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-white/10 border ${
                  errors.password ? "border-red-400" : "border-white/20"
                } 
              rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-400 
              focus:ring-2 focus:ring-blue-400/20 transition-colors`}
                placeholder="Create password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-white/10 border ${
                  errors.confirmPassword ? "border-red-400" : "border-white/20"
                } 
              rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:border-blue-400 
              focus:ring-2 focus:ring-blue-400/20 transition-colors`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleCheckboxChange}
              className="mt-1"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-300">
              I agree to Qwillo's{" "}
              <a
                href="/tos.pdf"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Terms of Use
              </a>{" "}
              and{" "}
              <a
                href="/pp.pdf"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {errors.agreeToTerms && (
            <p className="text-sm text-red-400 mt-1">{errors.agreeToTerms}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-8 py-4 rounded-lg transition-all duration-300 backdrop-blur-md
          bg-blue-500/20 hover:bg-blue-500/30 text-white border border-blue-400/30
          transform hover:scale-105 flex items-center justify-center space-x-2
          ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue to Your Meeting</span>
                <Check className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};