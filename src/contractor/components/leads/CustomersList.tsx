import React, { useEffect, useState } from "react";
import {
  Star,
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Video,
  Plus,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { MeetingScheduler } from "./MeetingScheduler";
import { useConversation } from "../../../customer/context/ConversationContext";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../../axios";
import { useLoader } from "../../../context/LoaderContext";
import { toast } from "react-toastify"; // Assuming you use react-toastify for toast notifications

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  projectHistory: Array<{
    id: number;
    type: string;
    date: string;
    amount: string;
  }>;
  rating?: number;
  notes?: string;
  status: "active" | "past" | "favorite";
  avatar?: string;
  scope?: "potential-future-work" | "past-customer" | "current-customer";
}

interface CustomersListProps {
  searchTerm: string;
  statusFilter: string;
  customers: Customer[];
}

export const CustomersList: React.FC<CustomersListProps> = ({
  searchTerm,
  statusFilter,
  customers,
  setCustomers
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [isInstantMeeting, setIsInstantMeeting] = useState(false);
  const { addConversation, clearconvo } = useConversation();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingCustomerId, setRatingCustomerId] = useState<number | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [openScopeDropdown, setOpenScopeDropdown] = useState<number | null>(
    null
  );

  const { showLoader, hideLoader } = useLoader();

  const scopeOptions = [
    { value: "potential-future-work", label: "Potential Future Work" },
    { value: "past-customer", label: "Past Customer" },
    { value: "current-customer", label: "Current Customer" },
  ];

  const getScopeLabel = (scope: string) => {
    const option = scopeOptions.find((option) => option.value === scope);
    return option ? option.label : "Not Set";
  };

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case "potential-future-work":
        return "bg-blue-100 text-blue-800";
      case "past-customer":
        return "bg-gray-100 text-gray-800";
      case "current-customer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

const updateCustomerScope = async (customerId: number, scope: string) => {
  console.log("hi");
  try {
    console.log("ipd");
    showLoader();
    const response = await axiosInstance.patch(
      `/quote/v2/${customerId}/scope`,
      {
        scope: scope,
      }
    );

    if (response.status === 200) {
      toast.success("Customer scope updated successfully!");
      // Update the local state
      const updatedCustomers = customers.map((customer) => {
        if (customer.id === customerId) {
          return { ...customer, scope: scope as any };
        }
        return customer;
      });

      // Add this line to actually update your state
      setCustomers(updatedCustomers);
      
    }
  } catch (error) {
    console.error(
      "Error updating customer scope:",
      error.response?.data || error.message
    );
    toast.error("Failed to update customer scope. Please try again.");
  } finally {
    hideLoader();
    setOpenScopeDropdown(null);
  }
};

  const addUsersToGroupChat = async (groupName, userIds) => {
    try {
      showLoader();
      const response = await axiosInstance.post("/quote/v2/group/add-users", {
        groupName,
        userIds,
      });
      if (response.status === 200) {
        console.log("Group chat updated:", response.data);
        // // Update state with new group chat details
        // setGroupChat({
        //   chatId: response.data.chatId,
        //   groupName: response.data.groupName,
        //   lastMessage: response.data.lastMessage,
        //   participants: response.data.participants,
        //   messages: response.data.messages,
        // });
      }
    } catch (error) {
      console.error(
        "Error adding users to group chat:",
        error.response?.data || error.message
      );
      return;
    } finally {
      hideLoader();
    }
  };

  // Create quote function
  const handleCreateQuote = async (customerId: number) => {
    try {
      showLoader();
      const response = await axiosInstance.post(
        `/project-v2/quote/create?customer=${customerId}`
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Quote created successfully!");
        console.log("Quote created:", response.data);
        // You can add additional logic here if needed, such as navigation to the quote page
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

  // Filter customers based on search term and status
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.projectHistory.some((project) =>
        project.type.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateMeeting = (customerId: number, instant: boolean) => {
    const customer = customers.find((c) => c.id === customerId);
    console.log("customer", customer, customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setShowMeetingScheduler(true);
      setIsInstantMeeting(instant);
    }
  };

  // Handler for opening the rating modal
  const handleOpenRatingModal = (customerId: number) => {
    setRatingCustomerId(customerId);
    setRatingValue(0);
    setReviewText("");
    setShowRatingModal(true);
  };

  // Handler for submitting the rating
  const handleSubmitRating = async () => {
    if (!ratingCustomerId || ratingValue === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      showLoader();
      const response = await axiosInstance.post(
        `/quote/v2/${ratingCustomerId}/rate`,
        {
          rating: ratingValue,
          review: reviewText,
        }
      );

      if (response.status === 200) {
        toast.success("Rating submitted successfully!");
        // Reset form fields
        setRatingValue(0);
        setReviewText("");
        setShowRatingModal(false);
      }
    } catch (error) {
      console.error(
        "Error submitting rating:",
        error.response?.data || error.message
      );
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      hideLoader();
    }
  };

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openScopeDropdown !== null) {
        setOpenScopeDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openScopeDropdown]);

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          {filteredCustomers.length} Customers
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                {customer.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
                {/* Customer Info */}
                {/* Customer Info with Inline Scope */}
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="w-4 h-4 mr-2" />
                    {customer.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="w-4 h-4 mr-2" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {customer.address}
                  </div>

                  {/* Customer Scope - Inline Selector */}
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Customer Status
                    </label>
                    <div className="flex border border-gray-300 rounded-md overflow-hidden divide-x divide-gray-300">
                      <div className="flex-1 py-1.5 px-2 text-xs text-center bg-blue-50 text-blue-700 font-medium">
                        {
                          {
                            "potential-future-work": "Potential Future Work",
                            "past-customer": "Past Customer",
                            "current-customer": "Current Customer",
                          }[customer.scope || "potential-future-work"]
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-col space-y-2">
                {/* Scope Dropdown */}

                <button
                  onClick={() => handleCreateMeeting(customer.id, true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Instant Meeting
                </button>
                <button
                  onClick={() => handleCreateMeeting(customer.id, false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </button>
                <button
                  onClick={() => {
                    clearconvo();
                    const token = localStorage.getItem("token");
                    const userId = jwtDecode(token).id;
                    addConversation(userId);
                    addConversation(customer.id);

                    setTimeout(() => {
                      const dashboardLayout = document.querySelector(
                        ".min-h-screen.bg-gray-100"
                      );
                      if (!dashboardLayout) return;

                      const messagesButton = dashboardLayout.querySelector(
                        'button[aria-label="Open Messages"]'
                      );
                      if (messagesButton instanceof HTMLButtonElement) {
                        messagesButton.click();
                      }
                    }, 300);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </button>
                <button
                  onClick={() => handleCreateQuote(customer.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quote
                </button>
                {/* Rating Button */}
                <button
                  onClick={() => handleOpenRatingModal(customer.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Rate Customer
                </button>
              </div>
            </div>
            {/* Notes */}
            {customer.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{customer.notes}</p>
              </div>
            )}
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No customers found matching your criteria.
          </div>
        )}
      </div>
      {/* Meeting Scheduler Modal */}
      {selectedCustomer && (
        <MeetingScheduler
          isOpen={showMeetingScheduler}
          onClose={() => {
            setShowMeetingScheduler(false);
            setSelectedCustomer(null);
          }}
          customerId={selectedCustomer.id}
          contactName={selectedCustomer.name}
          contactEmail={selectedCustomer.email}
          contactPhone={selectedCustomer.phone}
          isInstantMeeting={isInstantMeeting}
        />
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md border-2 border-purple-200 border-dashed">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium text-gray-800">
                How would you rate the experience with the customer?
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Do you find the app easy to use?
              </p>
            </div>

            {/* Rating Stars */}
            <div className="flex justify-center space-x-2 mb-6 border-2 border-purple-200 border-dashed p-4 rounded-md">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= ratingValue
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 text-sm">
                Can you tell more?
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border-2 border-purple-200 border-dashed rounded-md p-3 text-sm resize-none h-32 focus:outline-none focus:border-purple-400"
                placeholder="Add feedback"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-3 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRating}
                className="flex-1 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
