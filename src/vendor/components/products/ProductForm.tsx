import React, { useState, useRef, useEffect } from "react";
import { X, AlertCircle, Camera, FileText, XCircle } from "lucide-react";
import axiosInstance from "../../../axios";

interface Category {
  _id: string;
  categoryName: string;
  description?: string;
}

interface Brand {
  _id: string;
  brandName: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  image: string;
  status: "active" | "draft" | "archived";
  isPremium: boolean;
  stock: number;
  performance: {
    views: number;
    clicks: number;
    conversionRate: number;
    revenue: number;
  };
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, "id" | "performance">) => void;
  product?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/category");
        setCategories(response.data);
        setSelectedCategory(response.data[0]._id);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axiosInstance.get(
          `/sub-category?category=${selectedCategory}`
        );
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    if (selectedCategory) {
      fetchBrands();
    }
  }, [selectedCategory]);

  const [formData, setFormData] = useState({
    id: product?.id || null,
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    subcategory: product?.subcategory || "",
    price: product?.price || 0,
    image: product?.image || "",
    status: product?.status || "draft",
    isPremium: product?.isPremium || false,
    stock: product?.stock || 0,
    isMaterial: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [csvDragActive, setCsvDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subcategory)
      newErrors.subcategory = "Subcategory is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (!formData.image) newErrors.image = "Product image is required";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";
    // if (formData.sistock < 0) newErrors.stock = "Stock cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const handleDrag = (e: React.DragEvent, type: "image" | "csv") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      return type === "image" ? setDragActive(true) : setCsvDragActive(true);
    } else if (e.type === "dragleave") {
      return type === "image" ? setDragActive(false) : setCsvDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "image" | "csv") => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "image") {
      setDragActive(false);
    } else {
      setCsvDragActive(false);
    }

    const file = e.dataTransfer.files[0];
    if (type === "image" && file && file.type.startsWith("image/")) {
      handleImageFile(file);
    } else if (type === "csv" && file.name.endsWith(".csv")) {
      handleCsvFile(file);
    }
  };

  const handleImageFile = async (file: File) => {
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

      if (response.data.success) {
        setFormData((prev) => ({
          ...prev,
          image: response.data.imageUrl,
        }));
      } else {
        console.error("Image upload failed");
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    }
  };

  const handleCsvFile = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split("\n").filter((row) => row.trim() !== ""); // Remove empty lines
          const headers = rows[0].split(",");

          const products = rows.slice(1).map((row) => {
            const values = row.split(",");
            const product: any = {};
            headers.forEach((header, index) => {
              const value = values[index]?.trim();
              if (header === "price" || header === "stock") {
                product[header] = parseFloat(value) || 0;
              } else if (header === "isPremium") {
                product[header] = value.toLowerCase() === "true";
              } else {
                product[header] = value;
              }
            });
            return product;
          });

          console.log("Processed products:", file);

          // Prepare FormData
          const formData = new FormData();
          formData.append("csvFile", file, file.name); // Ensure file name is included

          // Debugging: Check FormData content
          console.log("FormData Entries:");
          for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]); // Should log "csvFile" and the File object
          }

          // Send data using axiosInstance
          const response = await axiosInstance.post(
            "/inventory/bulk-create",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          alert(
            `Success: ${response.data.message || "CSV uploaded successfully!"}`
          );
          window.location.reload();
        } catch (error: any) {
          console.error("Upload error:", error);
          alert(
            `Error: ${
              error.response?.data?.message ||
              error.message ||
              "Failed to upload CSV"
            }`
          );
        }
      };
      reader.readAsText(file);
    } catch (error: any) {
      alert(`Error processing file: ${error.message}`);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "csv"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image" && file.type.startsWith("image/")) {
      handleImageFile(file);
    } else if (type === "csv" && file.name.endsWith(".csv")) {
      handleCsvFile(file);
    }

    // Reset the input
    e.target.value = "";
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
                {product ? "Edit Product" : "Add New Product"}
              </h3>

              {/* CSV Upload Section */}
              {!product && (
                <div className="mt-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Bulk Upload
                    </h4>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.preventDefault();
                        // Here you would typically trigger download of the template
                        alert("Downloading CSV template...");
                      }}
                    >
                      Download Template
                    </a>
                  </div>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 ${
                      csvDragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onDragEnter={(e) => handleDrag(e, "csv")}
                    onDragLeave={(e) => handleDrag(e, "csv")}
                    onDragOver={(e) => handleDrag(e, "csv")}
                    onDrop={(e) => handleDrop(e, "csv")}
                  >
                    <div className="flex items-center justify-center">
                      <input
                        ref={csvInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "csv")}
                      />
                      <button
                        type="button"
                        onClick={() => csvInputRef.current?.click()}
                        className="flex items-center justify-center space-x-2 text-sm text-gray-600"
                      >
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span>Click to upload or drag and drop CSV file</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-center">
                    <div className="border-t border-gray-200 w-full"></div>
                    <span className="bg-white px-3 text-sm text-gray-500">
                      or add manually
                    </span>
                    <div className="border-t border-gray-200 w-full"></div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Product Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
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
                    onDragEnter={(e) => handleDrag(e, "image")}
                    onDragLeave={(e) => handleDrag(e, "image")}
                    onDragOver={(e) => handleDrag(e, "image")}
                    onDrop={(e) => handleDrop(e, "image")}
                  >
                    <div className="space-y-1 text-center">
                      {formData.image ? (
                        <div className="relative w-32 h-32 mx-auto">
                          <img
                            src={formData.image}
                            alt="Product"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {/* Remove Image Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, image: "" }));
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ""; // Reset input field
                              }
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                          >
                            <XCircle className="w-4 h-4" />
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
                                onChange={(e) => handleFileChange(e, "image")}
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

                {/* Product Details */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product Name *
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
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.name ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Is Material? *
                    </label>
                    {errors.isMaterial && (
                      <span className="ml-2 text-xs text-red-500">
                        {errors.isMaterial}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isMaterial: !prev.isMaterial, // Toggle the value
                        }))
                      }
                      className={`ml-4 px-4 py-2 text-white rounded-md transition ${
                        formData.isMaterial ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      {formData.isMaterial ? "Yes" : "No"}
                    </button>
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
                        errors.description
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Category Dropdown */}
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Category *
                        {errors.category && (
                          <span className="ml-2 text-xs text-red-500">
                            {errors.category}
                          </span>
                        )}
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) =>{
                          setSelectedCategory(e.target.value as any)
                          setFormData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))}
                        }
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.category ? "border-red-300" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory Dropdown (Mapped to Brand) */}
                    <div>
                      <label
                        htmlFor="subcategory"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Subcategory *
                        {errors.subcategory && (
                          <span className="ml-2 text-xs text-red-500">
                            {errors.subcategory}
                          </span>
                        )}
                      </label>
                      <select
                        id="subcategory"
                        value={formData.subcategory}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            subcategory: e.target.value,
                          }))
                        }
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.subcategory
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select subcategory</option>
                        {brands.map((brand) => (
                          <option key={brand._id} value={brand._id}>
                            {brand.subCategoryName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price *
                        {errors.price && (
                          <span className="ml-2 text-xs text-red-500">
                            {errors.price}
                          </span>
                        )}
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="price"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              price: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className={`pl-7 mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                            errors.price ? "border-red-300" : "border-gray-300"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="stock"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Stock *
                        {errors.stock && (
                          <span className="ml-2 text-xs text-red-500">
                            {errors.stock}
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        id="stock"
                        min="0"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            stock: parseInt(e.target.value) || 0,
                          }))
                        }
                        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                          errors.stock ? "border-red-300" : "border-gray-300"
                        }`}
                      />
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
                        Premium Product
                      </label>
                    </div>
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
                    {product ? "Save Changes" : "Add Product"}
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
