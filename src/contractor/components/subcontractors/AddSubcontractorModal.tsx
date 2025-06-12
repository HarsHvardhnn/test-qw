import React, { useState } from 'react';
import { X, Phone, Mail, MapPin } from 'lucide-react';

interface AddSubcontractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (subcontractor: {
    name: string;
    email: string;
    phone: string;
    projectType: string;
    location: string;
    serviceTypes: string[];
  }) => void;
}

const serviceTypeOptions = [
  'Electrical',
  'Plumbing',
  'HVAC',
  'Carpentry',
  'Painting',
  'Flooring',
  'Roofing',
  'Landscaping',
  'Smart Home Installation',
  'General Construction'
];

// Mock database of existing users
const EXISTING_USERS = [
  { email: 'michael@eliteelectrical.com', phone: '5551234567' },
  { email: 'sarah@premiumplumbing.com', phone: '5552345678' },
  { email: 'david@wilsonhvac.com', phone: '5553456789' },
  { email: 'neysha.moore@gmail.com', phone: '5802227090' },
  { email: 'neyshamoore@gmail.com', phone: '5802227090' }
];

export const AddSubcontractorModal: React.FC<AddSubcontractorModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectType: '',
    location: '',
    serviceTypes: [] as string[],
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isChecking, setIsChecking] = useState(false);

  // Function to normalize phone number for comparison
  const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

  // Function to check if a user exists
  const checkExistingUser = (email: string, phone: string): boolean => {
    const normalizedPhone = normalizePhone(phone);
    const normalizedEmail = email.toLowerCase();

    const existingUser = EXISTING_USERS.find(user => 
      user.email.toLowerCase() === normalizedEmail || 
      normalizePhone(user.phone) === normalizedPhone
    );

    if (existingUser) {
      if (existingUser.email.toLowerCase() === normalizedEmail) {
        setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
      }
      if (normalizePhone(existingUser.phone) === normalizedPhone) {
        setErrors(prev => ({ ...prev, phone: 'This phone number is already registered' }));
      }
      return true;
    }

    return false;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.serviceTypes.length === 0) {
      newErrors.serviceTypes = 'Select at least one service type';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Check for existing user only if basic validation passes
      const userExists = checkExistingUser(formData.email, formData.phone);
      return !userExists;
    }

    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onAdd({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      projectType: formData.projectType,
      location: formData.location,
      serviceTypes: formData.serviceTypes
    });
    
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Real-time validation for email and phone
    if ((name === 'email' || name === 'phone') && value) {
      const normalizedValue = name === 'phone' ? normalizePhone(value) : value.toLowerCase();
      const exists = EXISTING_USERS.some(user => {
        if (name === 'email') {
          return user.email.toLowerCase() === normalizedValue;
        } else {
          return normalizePhone(user.phone) === normalizedValue;
        }
      });

      if (exists) {
        setErrors(prev => ({
          ...prev,
          [name]: `This ${name} is already registered`
        }));
      }
    }
  };

  const toggleServiceType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.includes(type)
        ? prev.serviceTypes.filter(t => t !== type)
        : [...prev.serviceTypes, type]
    }));
    if (errors.serviceTypes) {
      setErrors(prev => ({ ...prev, serviceTypes: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          />
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Add New Subcontractor
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.fullName ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className=" ">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address *
                    </label>
                    <div className="mt-1 flex border border-gray-200 rounded-lg">
                      <div className="flex items-center border-r bg-gray-100  px-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`block w-full rounded-none  sm:text-sm ${
                          errors.email ? "border-red-300" : "border-none"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number *
                    </label>
                    <div className="mt-1 flex border border-gray-200 rounded-lg">
                      <div className="flex items-center border-r bg-gray-100  px-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`block w-full rounded-none  sm:text-sm ${
                          errors.phone ? "border-red-300" : "border-none"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Address *
                    </label>
                    <div className="mt-1 flex border border-gray-200 rounded-lg">
                      <div className="flex items-center border-r bg-gray-100  px-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className={`block w-full rounded-none  sm:text-sm ${
                          errors.location ? "border-red-300" : "border-none"
                        }`}
                      />
                    </div>
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Types *
                      {errors.serviceTypes && (
                        <span className="ml-2 text-xs text-red-500">
                          {errors.serviceTypes}
                        </span>
                      )}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {serviceTypeOptions.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleServiceType(type)}
                          className={`px-3 py-2 rounded-md text-sm font-medium ${
                            formData.serviceTypes.includes(type)
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          } transition-colors text-left`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isChecking || Object.keys(errors).length > 0}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? "Checking..." : "Add Subcontractor"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};