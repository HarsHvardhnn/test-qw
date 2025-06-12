import React, { useState, useEffect } from "react";
import { DollarSign, Download, Clock, Target } from "lucide-react";
import axiosInstance from "../../../axios";
export const BillingSettings: React.FC = () => {
  const [marketingPlan, setMarketingPlan] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current marketing plan
        const planResponse = await axiosInstance.get(
          "/marketing/current"
        );
        setMarketingPlan(planResponse.data.plan);

        // Fetch billing history
        const billingResponse = await axiosInstance.get(
          "/marketing/billing-history"
        );
        setBillingHistory(billingResponse.data.billingHistory);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Function to get plan icon based on planType
  const getPlanIcon = (planType) => {
    return <Target className="h-5 w-5 text-yellow-600" />;
  };

  // Function to get color scheme based on plan type
  const getPlanColors = (planType) => {
    switch (planType) {
      case "Premium":
        return {
          gradient: "from-yellow-50 to-yellow-100",
          border: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
        };
      case "Targeted":
        return {
          gradient: "from-blue-50 to-blue-100",
          border: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
        };
      case "Essential":
        return {
          gradient: "from-green-50 to-green-100",
          border: "border-green-200",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
        };
      default:
        return {
          gradient: "from-gray-50 to-gray-100",
          border: "border-gray-200",
          iconBg: "bg-gray-100",
          iconColor: "text-gray-600",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Current Marketing Plan */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Current Marketing Plan
        </h3>
        {marketingPlan ? (
          <div
            className={`bg-gradient-to-r ${
              getPlanColors(marketingPlan.planType).gradient
            } rounded-lg border ${
              getPlanColors(marketingPlan.planType).border
            } p-4`}
          >
            <div className="space-y-3">
              <div className="flex items-center">
                <div
                  className={`p-2 ${
                    getPlanColors(marketingPlan.planType).iconBg
                  } rounded-lg mr-3`}
                >
                  <Target
                    className={`h-5 w-5 ${
                      getPlanColors(marketingPlan.planType).iconColor
                    }`}
                  />
                </div>
                <h4 className="text-base font-medium text-gray-900">
                  {marketingPlan.name}
                </h4>
              </div>

              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-500 mr-2">
                  Monthly Budget:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ${marketingPlan.budget}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-sm text-gray-500">
                  ${marketingPlan.clickCost}/click • Up to{" "}
                  {marketingPlan.estimatedClicks} clicks per month
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">
                    Started on {formatDate(marketingPlan.startDate)}
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {marketingPlan.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
            <h4 className="text-base font-medium text-gray-500">
              No Marketing Plan Selected
            </h4>
            <p className="text-sm text-gray-400 mt-2">
              Please select a marketing plan to view details
            </p>
          </div>
        )}
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Billing History
        </h3>
        <div className="bg-white rounded-lg border border-gray-200">
          {billingHistory.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Invoice
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Download</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.invoice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Download className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">
                No billing history available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
