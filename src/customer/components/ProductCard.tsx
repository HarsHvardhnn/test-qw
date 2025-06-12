import React, { useState } from "react";
import { Info, Star, Check, Plus, Minus, Ruler } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import axiosInstance from "../../axios";
import { useQuote } from "../context/QuoteContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating?: number;
    reviewCount?: number;
    isContractorChoice?: boolean;
    sponsored?: boolean;
    quantity?: number;
    model?: string;
    dimensions?: {
      width: number;
      depth: number;
      height: number;
    };
    capacity?: number;
    depthType?: string;
    features?: string[];
    colors?: string[];
    deliveryDate?: string;
    savings?: {
      amount: number;
      type: string;
    };
    collection?: string;
  };
  onClick: () => void;
  className?: string;
  size?: "small" | "large";
  productId:any;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  className = "",
  size = "large",
  projectId
}) => {
  console.log("priducts", product);
  const { toggleProductSelection, selectedProducts, updateProduct } =
    useProducts();

    const {quote,fetchQuote}=useQuote();
    
  const isSelected = selectedProducts.includes(product.id);
  const [quantity, setQuantity] = useState(product.quantity || 1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    updateProduct(product.id, { quantity: newQuantity });
  };

  const addProductsToQuote = async (quoteId: string, products: string[]) => {
    try {
      const response = await axiosInstance.post(`/quote/v2/${quoteId}/products`, { products });
      await fetchQuote();
      return response.data; // Returns updated quote data
    } catch (error: any) {
      console.error("Error adding products:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Failed to add products");
    }
  };
  const isPremium = product.isContractorChoice || product.sponsored;

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden cursor-pointer group border shadow-sm hover:shadow-md transition-all ${
        isPremium ? "border-blue-200" : "border-gray-200"
      } ${className || ""}`}
    >
      Product Image with Overlay
      <div
        className={`relative ${size === "small" ? "h-32" : "h-48"}`}
        onClick={onClick}
      >
        {product?.image ? (
          <img
            src={product.image}
            alt={product?.name || "Product Image"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}

        {/* Badges */}
        {product?.isContractorChoice && (
          <div
            className={`absolute top-1 right-1 bg-blue-500 text-white px-1.5 py-0.5 rounded-full flex items-center z-20 ${
              size === "small" ? "text-[10px]" : "text-xs"
            }`}
          >
            <Star
              className={`${
                size === "small" ? "w-2 h-2" : "w-3 h-3"
              } mr-0.5 fill-current`}
            />
            Contractor's Choice
          </div>
        )}
        {product?.sponsored && !product?.isContractorChoice && (
          <div
            className={`absolute top-1 left-1 bg-blue-500 text-white px-1.5 py-0.5 rounded-full z-20 ${
              size === "small" ? "text-[10px]" : "text-xs"
            }`}
          >
            Featured
          </div>
        )}

        {/* Savings Badge */}
        {product?.savings?.amount && (
          <div className="absolute bottom-1 left-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            Save {formatCurrency(product.savings.amount)}
          </div>
        )}
      </div>
      {/* Product Info */}
      <div className={`${size === "small" ? "p-2" : "p-3"}`}>
        {/* Brand and Collection */}
        <div className="mb-1">
          {product?.brand && (
            <p
              className={`text-blue-600 ${
                size === "small" ? "text-[10px]" : "text-xs"
              }`}
            >
              {product?.brand?.brandName ?? "Unknown Brand"}
              {product?.collection && (
                <span className="text-gray-500"> • {product.collection}</span>
              )}
            </p>
          )}
        </div>

        {/* Product Name and Model */}
        <div className="mb-2">
          <h3
            className={`font-medium text-gray-900 ${
              size === "small" ? "text-xs" : "text-sm"
            } line-clamp-2`}
          >
            {product?.name || "No Name"}
          </h3>
          {product?.model && (
            <p className="text-[10px] text-gray-500">Model: {product.model}</p>
          )}
        </div>

        {/* Rating and Reviews */}
        {product?.rating !== undefined && (
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`${size === "small" ? "w-2 h-2" : "w-3 h-3"} ${
                    star <= (product.rating || 5)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span
              className={`ml-1 text-gray-500 ${
                size === "small" ? "text-[10px]" : "text-xs"
              }`}
            >
              {product?.reviewCount ?? 128}
            </span>
          </div>
        )}

        {/* Specifications */}
        {(product?.dimensions || product?.capacity || product?.depthType) && (
          <div className="mb-2 space-y-1">
            {product?.dimensions && (
              <div className="flex items-center text-[10px] text-gray-600">
                <Ruler className="w-3 h-3 mr-1" />
                {product.dimensions?.width || "N/A"}"W x{" "}
                {product.dimensions?.depth || "N/A"}"D x{" "}
                {product.dimensions?.height || "N/A"}"H
              </div>
            )}
            {product?.capacity && (
              <p className="text-[10px] text-gray-600">
                Capacity: {product.capacity} cu ft
              </p>
            )}
            {product?.depthType && (
              <p className="text-[10px] text-gray-600">{product.depthType}</p>
            )}
          </div>
        )}

        {/* Colors */}
        {product?.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mb-2">
            {product.colors.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                title={color}
                style={{
                  backgroundColor: color.toLowerCase(),
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}

        {/* Price and Savings */}
        <div className="flex items-baseline mb-2">
          <p
            className={`font-medium text-gray-900 ${
              size === "small" ? "text-sm" : "text-base"
            }`}
          >
            {formatCurrency(product?.price ?? 0)}
          </p>
          {product?.originalPrice && (
            <p className="ml-2 text-[10px] text-gray-500 line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
        </div>

        {/* Delivery Info */}
        {product?.deliveryDate && (
          <p className="text-[10px] text-gray-600 mb-2">
            Get it by {product.deliveryDate}
          </p>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1">
          <button
            className={`px-2 py-1 rounded bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center ${
              size === "small" ? "text-[10px]" : "text-xs"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Details
            <Info
              className={`ml-0.5 ${size === "small" ? "w-2 h-2" : "w-3 h-3"}`}
            />
          </button>

          <button
            className={`px-2 py-1 rounded ${
              isSelected
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white border border-blue-500 text-blue-500 hover:bg-blue-50"
            } transition-colors flex items-center justify-center ${
              size === "small" ? "text-[10px]" : "text-xs"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              addProductsToQuote(quote?._id,[product?.id]);
              // fetchQuote()
                toggleProductSelection(product?.id || "");
             
              console.log('selected products',selectedProducts)
            }}
          >
            {isSelected ? (
              <>
                Selected
                <Check
                  className={`ml-0.5 ${
                    size === "small" ? "w-2 h-2" : "w-3 h-3"
                  }`}
                />
              </>
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
