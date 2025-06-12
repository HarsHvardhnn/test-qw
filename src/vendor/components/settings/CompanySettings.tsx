import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Mail, Phone, Globe, AlertCircle } from 'lucide-react';
import axiosInstance from '../../../axios';
import { useLoader } from '../../../context/LoaderContext';
import { toast } from 'react-toastify';

export const CompanySettings: React.FC = () => {
  const {showLoader,hideLoader}=useLoader()
  const [formData, setFormData] = useState({
    companyName: 'Culligan Water',
    companyLogo: '',
    email: 'contact@culliganwater.com',
    phone: '(555) 123-4567',
    website: 'www.culliganwater.com',
    address: '123 Water Way, Portland, OR 97201',
    description: 'Professional water filtration solutions for residential and commercial properties.',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  });

  const fetchCompanyProfile = async () => {
    try {
      const response = await axiosInstance.get("/quote/v2/user/company-profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching company profile:", error);
      return null;
    }
  };

   useEffect(() => {
     const loadProfile = async () => {
       const data = await fetchCompanyProfile();
       if (data) setFormData(data);
     };

     loadProfile();
   }, []);
  
  
  const updateCompanyProfile = async (formData) => {
    try {
      showLoader()
      const response = await axiosInstance.post(
        "/quote/v2/user/company-profile",
        formData
      );
      toast.success("Profile updated")
      return response.data;
    } catch (error) {
      console.error("Error updating company profile:", error);
      return null;
    } finally {
      hideLoader()
    }
    
  };

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          companyLogo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  console.log("File selected:", file.name); // Debugging

  const formData = new FormData();
  formData.append("image", file);

  try {
    // Show loader while uploading
    showLoader();

    // Upload image
    const response = await axiosInstance.post("/api/auth/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data?.imageUrl) {
      console.log("Image uploaded:", response.data.imageUrl); // Debugging

      setFormData((prev) => ({
        ...prev,
        companyLogo: response.data.imageUrl, // Update form with uploaded image URL
      }));

      toast.success("Image uploaded successfully!"); // Show success message
    } else {
      console.error("Invalid response format", response.data);
      toast.error("Upload failed. Try again.");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("Image upload failed!");
  } finally {
    hideLoader(); // Hide loader after completion
  }
};


  const handleSave = async () => {
    // Handle save logic here

   await updateCompanyProfile(formData)
    console.log('Saving company settings:', formData);
  };

  return (
    <div className="max-w-3xl">
      <div className="space-y-6">
        {/* Company Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          <div 
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              {formData.companyLogo ? (
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={formData.companyLogo}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, companyLogo: '' }))}
                    className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload a file</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-0 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Company Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-0 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 flex rounded-md shadow-sm border">
              <span className="inline-flex items-center px-3 rounded-l-md  border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="flex-1 block w-full rounded-none rounded-r-md border-none focus:border-blue-500 focus:ring-0 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 flex rounded-md shadow-sm border">
              <span className="inline-flex items-center px-3 rounded-l-md  border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                <Phone className="h-5 w-5" />
              </span>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="flex-1 block w-full rounded-none rounded-r-md border-none focus:border-blue-500 focus:ring-0 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <div className="mt-1 flex rounded-md shadow-sm border ">
              <span className="inline-flex items-center px-3 py-2 rounded-l-md  border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                <Globe className="h-5 w-5" />
              </span>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="flex-1 block w-full rounded-none rounded-r-md border-none focus:border-blue-500 focus:ring-0 sm:text-sm"
                placeholder="www.example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Business Address
            </label>
            <div className="mt-1 flex rounded-md shadow-sm border">
              <span className="inline-flex items-center px-3 rounded-l-md  border-r border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                <MapPin className="h-5 w-5" />
              </span>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="flex-1 block w-full rounded-none rounded-r-md border-none focus:border-blue-500 focus:ring-0 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};