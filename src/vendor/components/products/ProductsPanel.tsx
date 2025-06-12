import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  Package,
  Star,
  BarChart,
  DollarSign,
  Users,
} from "lucide-react";
import { ProductForm } from "./ProductForm";
import { ProductsList } from "./ProductsList";
import axiosInstance from "../../../axios";

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
  isMaterial:boolean;
  performance: {
    views: number;
    clicks: number;
    conversionRate: number;
    revenue: number;
  };
}

export const ProductsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "materials">(
    "products"
  );

  // Sample products data
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/inventory/items");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (
    product: Omit<Product, "id" | "performance">
  ) => {
    try {
      const formData = new FormData();
      formData.append("itemName", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("subCategory", product.subcategory);
      formData.append("price", product.price.toString());
      formData.append("status", product.status);
      formData.append("isPremium", product.isPremium.toString());
      formData.append("quantity", product.stock.toString());
      formData.append("image", product.image);
      formData.append("isMaterial",product?.isMaterial)

      // Send API request
      const response = await axiosInstance.post("/inventory/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Extract saved product data
      const savedProduct = response.data;

      // Update frontend state
      const newProduct: Product = {
        ...product,
        id: `p${savedProduct._id}`, // Use backend ID instead of local index
        performance: {
          views: 0,
          clicks: 0,
          conversionRate: 0,
          revenue: 0,
        },
      };

      setProducts((prev) => [...prev, newProduct]);
      setShowAddProduct(false);

      console.log("Product added successfully:", savedProduct);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      const formData = new FormData();
      formData.append("itemName", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("brand", product.subcategory);
      formData.append("price", product.price.toString());
      formData.append("status", product.status);
      formData.append("isPremium", product.isPremium.toString());
      formData.append("quantity", product.stock.toString());

      // If an image is updated, include it in the formData
      if (product.image) {
        formData.append("image", product.image);
      }

      console.log("Updating product:", product);

      // Send PUT request to update product
      const response = await axiosInstance.put(
        `/inventory/items/${product.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const updatedProduct = response.data;

        // Map response to match frontend structure
        const newProduct: Product = {
          id: updatedProduct._id,
          name: updatedProduct.itemName,
          description: updatedProduct.description,
          category: updatedProduct.category,
          subcategory: updatedProduct.brand, // Assuming 'brand' is the subcategory
          price: updatedProduct.price,
          image: updatedProduct.imageUrl || product.image,
          status: updatedProduct.status,
          isPremium: updatedProduct.isPremium,
          stock: updatedProduct.quantity,
          performance: product.performance, // Keep existing performance data
        };

        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? newProduct : p))
        );
        setSelectedProduct(null);
      } else {
        console.error("Failed to update product");
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await axiosInstance.delete(`/inventory/items/${productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  };

  // Filter products based on search term and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate inventory stats
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === "active").length,
    totalInventory: products.reduce((sum, p) => sum + p.stock, 0),
    lowStockCount: products.filter((p) => p.stock < 10).length,
    totalCategories: new Set(products.map((p) => p.category)).size,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Products & Services
        </h1>
        <button
          onClick={() => setShowAddProduct(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-blue-600">
              {stats.activeProducts} active
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">
            {stats.totalProducts}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-700">
              <BarChart className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-green-600">
              +12% this month
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">12,500</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700">
              <Star className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-yellow-600">
              +15% this month
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">2.8%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-purple-600">MTD</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">$45,250</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search and Type Selection */}
          <div className="flex-1 flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 flex">
              <div className="flex items-center bg-gray-100 rounded-l-md px-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Products/Materials Toggle */}
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "products"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("materials")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "materials"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Materials
              </button>
            </div>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filters
            <ChevronDown
              className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Products</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Categories</option>
                <option value="filtration">Water Filtration</option>
                <option value="treatment">Water Treatment</option>
                <option value="softeners">Water Softeners</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sort-by"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sort By
              </label>
              <select
                id="sort-by"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="stock-low">Stock: Low to High</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Products List */}
      <ProductsList
        products={filteredProducts}
        onEdit={setSelectedProduct}
        onDelete={handleDeleteProduct}
        activeTab={activeTab}
      />

      {/* Add/Edit Product Modal */}
      {(showAddProduct || selectedProduct) && (
        <ProductForm
          isOpen={true}
          onClose={() => {
            setShowAddProduct(false);
            setSelectedProduct(null);
          }}
          onSubmit={selectedProduct ? handleEditProduct : handleAddProduct}
          product={selectedProduct}
        />
      )}
    </div>
  );
};
