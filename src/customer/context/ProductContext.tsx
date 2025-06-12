import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { useQuote } from "./QuoteContext";
// Define product interface
export interface Product {
  id: string;
  name: string;
  brand: string;
  model?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory: string;
  type?: string;
  rating?: number;
  reviewCount?: number;
  isContractorChoice?: boolean;
  sponsored?: boolean;
  isPremium:boolean;
  quantity?: number;
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
}

// Define the product context interface
interface ProductContextType {
  products: Product[];
  categories: string[];
  selectedProducts: string[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  toggleProductSelection: (id: string) => void;
}

// Create the context with default values
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Provider component
export const ProductProvider: React.FC<{ children: React.ReactNode, onProductChange?:(callback: (prev: number) => number) => void }> = ({
  children,
  onProductChange
}) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Fetch categories and products
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // Fetch categories from /category/cats
        const categoryResponse = await axiosInstance.get("/category/cats");
        const fetchedCategories = categoryResponse.data.map(
          (cat: { name: string }) => cat.name
        );
        setCategories(fetchedCategories);

        // Fetch products from /inventory/items
        const productResponse = await axiosInstance.get("/inventory/items/v2");
        const fetchedProducts: Product[] = productResponse.data;

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching categories or products:", error);
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((productId) => productId !== id));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const toggleProductSelection = (id: string) => {
    console.log('id received :{}',id)
    setSelectedProducts((prev) => {
      if (prev.includes(id)) {
        return prev.filter((productId) => productId != id);
      } else {
        return [...prev, id];
      }
    }
  
  );
onProductChange((prev)=>prev+1);

    // console.log('returrning set',  setSelectedProducts((prev) => {
    //   if (prev.includes(id)) {
    //     return prev.filter((productId) => productId != id);
    //   } else {
    //     return [...prev, id];
    //   }
    // }))
  };

  const value = {
    products,
    categories,
    selectedProducts,
    addProduct,
    removeProduct,
    updateProduct,
    toggleProductSelection,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the product context
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
