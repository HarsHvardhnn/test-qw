import React, { useState, useRef } from "react";
import axiosInstance from "../../../axios";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define response types for the CSV upload
interface CSVUploadResponse {
  message: string;
  successfullyAdded: string[];
  failedToAdd: {
    email: string;
    reason: string;
  }[];
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneCode: "+91", // Default phone code
    phoneNumber: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploadResponse, setCsvUploadResponse] =
    useState<CSVUploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common phone codes
  const phoneCodes = ["+91", "+1", "+44", "+61", "+86", "+33", "+49", "+81"];

  // Handle input change for single customer form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection for CSV upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      // Reset any previous response when a new file is selected
      setCsvUploadResponse(null);
      setError("");
    }
  };

  // Handle single customer form submit
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create submission data with concatenated phone number
      const submissionData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneCode + formData.phoneNumber,
        location: formData.location,
      };

      const response = await axiosInstance.post(
        "/quote/v2/add-customer",
        submissionData
      );
      console.log("Customer added:", response.data);
      onClose(); // Close modal after success
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV file upload
  const handleCsvUpload = async () => {
    if (!csvFile) {
      setError("Please select a CSV file first");
      return;
    }

    setLoading(true);
    setError("");
    setCsvUploadResponse(null);

    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const response = await axiosInstance.post(
        "/quote/v2/upload-customers",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("CSV upload response:", response.data);
      setCsvUploadResponse(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload CSV file");
    } finally {
      setLoading(false);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setCsvFile(null);
    setCsvUploadResponse(null);
    setError("");
  };

  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-black">Add Customer</h2>

        {/* Tab navigation */}
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "single"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("single");
              setError("");
              setCsvUploadResponse(null);
            }}
          >
            Add Single Customer
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "bulk"
                ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("bulk");
              setError("");
            }}
          >
            Bulk Upload (CSV)
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {activeTab === "single" ? (
          // Single customer form
          <form onSubmit={handleSingleSubmit} className="space-y-3">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />

            {/* Phone number with country code - fixed width for code */}
            <div className="flex space-x-2">
              <select
                name="phoneCode"
                value={formData.phoneCode}
                onChange={handleChange}
                className="p-2 border rounded w-20"
              >
                {phoneCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="flex-1 p-2 border rounded"
              />
            </div>

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Customer"}
              </button>
            </div>
          </form>
        ) : (
          // CSV upload form
          <div className="space-y-4">
            {!csvUploadResponse ? (
              <>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  {!csvFile ? (
                    <div>
                      <p className="text-gray-500 mb-2">
                        Upload a CSV file with customer data
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                      >
                        Select CSV File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 mb-2">
                        Selected file:{" "}
                        <span className="font-medium">{csvFile.name}</span> (
                        {(csvFile.size / 1024).toFixed(1)} KB)
                      </p>
                      <button
                        type="button"
                        onClick={resetFileInput}
                        className="text-red-500 text-sm underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={handleCsvUpload}
                    disabled={!csvFile || loading}
                  >
                    {loading ? "Uploading..." : "Upload CSV"}
                  </button>
                </div>
              </>
            ) : (
              // CSV upload response display
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="font-medium text-green-700">
                    {csvUploadResponse.message}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-green-600 mb-2">
                    Successfully Added (
                    {csvUploadResponse.successfullyAdded.length})
                  </h3>
                  <div className="max-h-32 overflow-y-auto border rounded p-2">
                    <ul className="space-y-1">
                      {csvUploadResponse.successfullyAdded.map((email) => (
                        <li key={email} className="text-sm text-black">
                          {email}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {csvUploadResponse.failedToAdd.length > 0 && (
                  <div>
                    <h3 className="font-medium text-red-600 mb-2">
                      Failed to Add ({csvUploadResponse.failedToAdd.length})
                    </h3>
                    <div className="max-h-32 overflow-y-auto border rounded p-2">
                      <ul className="space-y-1">
                        {csvUploadResponse.failedToAdd.map((item) => (
                          <li key={item.email} className="text-sm text-black">
                            {item.email} -{" "}
                            <span className="text-red-500">{item.reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => {
                      setCsvFile(null);
                      setCsvUploadResponse(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    Upload Another CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCustomerModal;
