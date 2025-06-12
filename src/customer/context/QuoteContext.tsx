import React, { createContext, useContext, useEffect, useState } from 'react';

import axiosInstance from '../../axios';
import { useProducts } from './ProductContext';

// Define quote item interfaces
export interface QuoteProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
}

export interface QuoteMaterial {
  id: string;
  name: string;
  description: string;
  price: number;
}

// Define the quote interface
export interface Quote {
  _id?: string; // Ensure the quote has an ID
  quoteNumber: string;
  date: string;
  products: QuoteProduct[];
  materials: QuoteMaterial[];
  labor: number;
  notes?: string;
}

// Define the quote context interface
interface QuoteContextType {
  quote: Quote | null;
  updateQuote: (updates: Partial<Quote>) => void;
  addProduct: (product: QuoteProduct) => void;
  removeProduct: (id: string) => void;
  addMaterial: (material: QuoteMaterial) => void;
  removeMaterial: (id: string) => void;
  updateLabor: (amount: number) => void;
}

// Create the context
const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

// Provider component
export const QuoteProvider: React.FC<{ children: React.ReactNode; projectId: string,p:string }> = ({ children, projectId,p }) => {
  const { products, selectedProducts } = useProducts();
  const [quote, setQuote] = useState<Quote | null>(null);

  // Fetch quote when projectId or selectedProducts change
  const fetchQuote = async () => {
    if (!projectId) return;

    try {
      const response = await axiosInstance.get(`/quote/v2/project/${projectId}`);
      setQuote(response.data);
    } catch (error) {
      alert("Error fetching quote: " + ((error as any).response?.data?.error || (error as any).message));
    }
  };

  useEffect(() => {
  
    fetchQuote();
  }, [projectId, p]); // Refetch when products change


  const updateQuote = (updates: Partial<Quote>) => {
    setQuote(prevQuote => (prevQuote ? { ...prevQuote, ...updates } : null));
  };

  const addProduct = (product: QuoteProduct) => {
    setQuote(prevQuote => prevQuote ? { ...prevQuote, products: [...prevQuote.products, product] } : null);
  };

  const removeProduct = (id: string) => {
    setQuote(prevQuote => prevQuote ? { ...prevQuote, products: prevQuote.products.filter(p => p.id !== id) } : null);
  };

  const addMaterial = (material: QuoteMaterial) => {
    setQuote(prevQuote => prevQuote ? { ...prevQuote, materials: [...prevQuote.materials, material] } : null);
  };

  const removeMaterial = (id: string) => {
    setQuote(prevQuote => prevQuote ? { ...prevQuote, materials: prevQuote.materials.filter(m => m.id !== id) } : null);
  };

  const updateLabor = (amount: number) => {
    setQuote(prevQuote => prevQuote ? { ...prevQuote, labor: amount } : null);
  };

  const value = { quote, updateQuote, addProduct, removeProduct, addMaterial, removeMaterial, updateLabor,fetchQuote };

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
};

// Custom hook to use the quote context
export const useQuote = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return context;
};
