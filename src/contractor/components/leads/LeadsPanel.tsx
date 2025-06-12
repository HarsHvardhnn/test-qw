import React, { useEffect, useState } from "react";
import { Search, Filter, ChevronDown, Plus } from "lucide-react";
import { CustomersList } from "./CustomersList";
import { LeadsList } from "./LeadsList";
import { MeetingsList } from "./MeetingsList";
import AddCustomerModal from "./AddCustomerModal";
import axiosInstance from "../../../axios";
import { useLoader } from "../../../context/LoaderContext";


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
}

export const LeadsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "customers" | "leads" | "meetings"
  >("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
    const {showLoader,hideLoader}=useLoader()
  
    const [customers, setCustomers] = useState<Customer[]>([]);

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
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        hideLoader();
      }
    };
    useEffect(() => {
    

      fetchCustomers();
    }, []); 

  return (
    <div className="space-y-6">
      <AddCustomerModal isOpen={showModal} onClose={() => {
        setShowModal(false)
        fetchCustomers()
      }}/>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Customers & Leads
        </h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("customers")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "customers"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "leads"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Leads
          </button>
          <button
            onClick={() => setActiveTab("meetings")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "meetings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Meetings
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      {activeTab !== "meetings" && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 flex">
              <div className="flex items-center bg-gray-100 rounded-l-md px-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${
                  activeTab === "customers" ? "customers" : "leads"
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
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

            {/* Add New Button */}
            <button
            onClick={()=>{activeTab=="customers"?setShowModal(true):('')}}
             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add {activeTab === "customers" ? "Customer" : "Lead"}
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
                  <option value="all">All</option>
                  {activeTab === "customers" ? (
                    <>
                      <option value="active">Active Projects</option>
                      <option value="past">Past Projects</option>
                      <option value="favorite">Favorites</option>
                    </>
                  ) : (
                    <>
                      <option value="new">New Leads</option>
                      <option value="contacted">Contacted</option>
                      <option value="meeting">Meeting Scheduled</option>
                      <option value="quoted">Quoted</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="project-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project Type
                </label>
                <select
                  id="project-type"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Types</option>
                  <option value="kitchen">Kitchen Remodel</option>
                  <option value="bathroom">Bathroom Remodel</option>
                  <option value="addition">Home Addition</option>
                  <option value="outdoor">Outdoor Living</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="date-range"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date Range
                </label>
                <select
                  id="date-range"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === "customers" ? (
          <CustomersList searchTerm={searchTerm} statusFilter={statusFilter} customers={customers} setCustomers={setCustomers} />
        ) : activeTab === "leads" ? (
          <LeadsList searchTerm={searchTerm} statusFilter={statusFilter} leads={customers} />
        ) : (
          <MeetingsList />
        )}
      </div>
    </div>
  );
};
