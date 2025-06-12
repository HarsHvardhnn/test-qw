import React, { useEffect, useState } from "react";
import { Clock, Plus, Users, UserPlus, X } from "lucide-react";
import { PendingQuoteCard } from "./quotes/PendingQuoteCard";
import axiosInstance from "../../axios";
import { useLoader } from "../../context/LoaderContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AddCustomerModal from "./leads/AddCustomerModal";

interface Quote {
  _id: string;
  fullName: string;
  projectType: string;
  totalPrice: number;
  status: string;
  quote?: {
    _id: string;
    customer?: {
      fullName: string;
    };
    combinedCosts?: boolean;
  };
  reviewMessage?: string;
}

interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
}

export const QuotesPanel: React.FC = ({ setContext }) => {
  const { showLoader, hideLoader } = useLoader();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const navigate = useNavigate();

  const fetchQuotes = async () => {
    try {
      showLoader();
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to continue");
        navigate("/login");
        return;
      }

      const user = jwtDecode(token);
      const response = await axiosInstance.get(
        `/quote/v2/details/quotes?contractor=${user.id}`
      );
      setQuotes(response.data);
    } catch (err) {
      setError("Failed to fetch quotes");
      console.error(err);
    } finally {
      hideLoader();
    }
  };

  const fetchCustomers = async () => {
    try {
      showLoader();
      const response = await axiosInstance.get(
        "/quote/v2/customers/by-contractor"
      );
      if (response.data.success) {
        setCustomers(response.data.customers);
      } else {
        console.error("Failed to fetch customers:", response.data.message);
        toast.error("Failed to fetch customers");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Error loading customers");
    } finally {
      hideLoader();
    }
  };

  const handleCreateQuote = async (customerId: string) => {
    try {
      showLoader();
      const response = await axiosInstance.post(
        `/project-v2/quote/create?customer=${customerId}`
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Quote created successfully!");
        console.log("Quote created:", response.data);

        // Refresh quotes list after creating a new quote
        fetchQuotes();

        // Close the customers modal
        setShowCustomersModal(false);
      }
    } catch (error) {
      console.error(
        "Error creating quote:",
        error.response?.data || error.message
      );
      toast.error("Failed to create quote. Please try again.");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (showCustomersModal) {
      fetchCustomers();
    }
  }, [showCustomersModal]);

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Quotes</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            Last updated: Today, 10:45 AM
          </span>
        </div>
      </div>

      {/* Handle Loading & Error */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">
              Pending Quotes
            </h2>
            <button
              onClick={() => setShowCustomersModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Quote
            </button>
          </div>

          {quotes.length > 0 ? (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <PendingQuoteCard
                  key={quote._id}
                  projectName={quote.fullName}
                  id={quote?.quote?._id}
                  customerName={
                    quote?.quote?.customer?.fullName || "Unknown Customer"
                  }
                  projectType={quote.projectType}
                  setContext={setContext}
                  doCombineCosts={quote?.quote?.combinedCosts || false}
                  status={quote?.status}
                  reviewMessage={quote?.reviewMessage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 mb-2">No quotes available.</p>
              <p className="text-gray-400 text-sm mb-4">
                Create a new quote to get started.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Customers Selection Modal */}
      {showCustomersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-800">
                  Select a Customer
                </h2>
              </div>
              <button
                onClick={() => setShowCustomersModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {customers.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {customers.map((customer) => (
                    <div
                      key={customer._id}
                      className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        {customer.imageUrl ? (
                          <img
                            src={customer.imageUrl}
                            alt={`${customer.name}'s profile`}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {customer.name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCreateQuote(customer.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Create Quote
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No customers found.</p>
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setShowAddCustomerModal(true);
                    setShowCustomersModal(false);
                  }}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add New Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => {
          setShowAddCustomerModal(false);
          // Show the customers modal again and refresh the list
          if (showCustomersModal) {
            fetchCustomers();
            setShowCustomersModal(true);
          }
        }}
      />
    </div>
  );
};
