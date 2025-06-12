import React, { useState, useRef, useEffect } from "react";
import { X, Upload, AlertCircle, Camera, Plus, Minus } from "lucide-react";
import axiosInstance from "../../../axios";
import { useLoader } from "../../../context/LoaderContext";

interface Service {
  id: string;
  name: string;
  companyName: string;
  description: string;
  details: string[];
  image: string;
  ctaType: "schedule" | "callback";
  status: "active" | "draft" | "archived";
  isPremium: boolean;
  performance: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  service?: Service;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  service,
}) => {
  const { showLoader, hideLoader } = useLoader();
  const [formData, setFormData] = useState({
    name: service?.name || "",
    companyName: service?.companyName || "Culligan Water",
    description: service?.description || "",
    details: service?.details || [""],
    image: service?.image || "",
    ctaType: service?.ctaType || "schedule",
    status: service?.status || "draft",
    isPremium: service?.isPremium || false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    service?.image || ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update image preview when imageFile changes
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Service name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!imagePreview && !imageFile)
      newErrors.image = "Service image is required";
    if (formData.description.length > 250)
      newErrors.description = "Description must be 250 characters or less";
    if (formData.details.some((detail) => !detail.trim()))
      newErrors.details = "All service details must be filled out";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let imageUrl = formData.image;
      showLoader()

      // If we have a new image file, upload it
      if (imageFile) {
        const formDataObj = new FormData();
        formDataObj.append("image", imageFile); // Send the actual File object

        const uploadRes = await axiosInstance.post(
          "/api/auth/upload-image",
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("upload url", uploadRes.data.imageUrl);

        imageUrl = uploadRes.data.imageUrl;
      }

      const servicePayload = {
        name: formData.name,
        companyName: formData.companyName,
        description: formData.description,
        details: formData.details,
        image: imageUrl,
        ctaType: formData.ctaType,
        status: formData.status,
        isPremium: formData.isPremium,
      };

      if (service) {
      await axiosInstance.put(`/service/update/${service.id}`, servicePayload);
        
      }

      else {
      await axiosInstance.post("/service", servicePayload);
        
      }

      onSubmit(); // optional callback
      onClose();
    } catch (error) {
      console.error("Failed to create service:", error);
    }
    finally {
      hideLoader()
    }

  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      // Clear the existing image URL if there was one
      if (formData.image) {
        setFormData((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Clear the existing image URL if there was one
      if (formData.image) {
        setFormData((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleAddDetail = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, ""],
    }));
  };

  const handleRemoveDetail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  const handleDetailChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      details: prev.details.map((detail, i) => (i === index ? value : detail)),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {service ? "Edit Service" : "Add New Service"}
              </h3>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Service Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Image
                    {errors.image && (
                      <span className="ml-2 text-xs text-red-500">
                        {errors.image}
                      </span>
                    )}
                  </label>
                  <div
                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                      dragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="relative w-32 h-32 mx-auto">
                          <img
                            src={imagePreview}
                            alt="Service"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                          >
                            <X className="w-4 h-4" />
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

                {/* Service Details */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Service Name *
                    {errors.name && (
                      <span className="ml-2 text-xs text-red-500">
                        {errors.name}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter service name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description *
                    {errors.description && (
                      <span className="ml-2 text-xs text-red-500">
                        {errors.description}
                      </span>
                    )}
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Brief description of your service (250 characters max)"
                    maxLength={250}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.description.length}/250 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Service Details *
                    {errors.details && (
                      <span className="ml-2 text-xs text-red-500">
                        {errors.details}
                      </span>
                    )}
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Add key features or benefits of your service
                  </p>
                  <div className="space-y-2">
                    {formData.details.map((detail, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) =>
                            handleDetailChange(index, e.target.value)
                          }
                          className="flex-1 rounded-md shadow-sm sm:text-sm border-gray-300"
                          placeholder="Enter service detail"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveDetail(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddDetail}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Detail
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call-to-Action Type
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          ctaType: "schedule",
                        }))
                      }
                      className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        formData.ctaType === "schedule"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Schedule Consultation
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          ctaType: "callback",
                        }))
                      }
                      className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        formData.ctaType === "callback"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Request Callback
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as
                            | "active"
                            | "draft"
                            | "archived",
                        }))
                      }
                      className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      id="isPremium"
                      checked={formData.isPremium}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isPremium: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isPremium"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Premium Service
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {service ? "Save Changes" : "Add Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
