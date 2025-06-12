import React, { useEffect, useState } from 'react';
import { Clock, UserPlus, Search, Filter, ChevronDown, User, MapPin, Phone, Mail, MessageSquare, Star, Send, Trash2 } from 'lucide-react';
import { AddSubcontractorModal } from './AddSubcontractorModal';
import { ReviewsModal } from './ReviewsModal';
import axiosInstance from '../../../axios';
import { useLoader } from '../../../context/LoaderContext';

interface Subcontractor {
  id: string;
  name: string;
  role?: string;
  company: string;
  email: string;
  phone?: string;
  address: string;
  serviceTypes: string[];
  serviceAreas: string[];
  status: 'active' | 'pending';
  avatar?: string;
  rating?: number;
  completedProjects?: number;
}

export const SubContractorsPanel: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<Subcontractor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const { showLoader, hideLoader } = useLoader()
  
  // Sample subcontractors data
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);

  const fetchSubcontractors = async () => {
    try {
     showLoader();
      const response = await axiosInstance.get("/sub");
      setSubcontractors(response.data);
    } catch (error) {
      console.error("Failed to fetch subcontractors:", error);
    } finally {
hideLoader ()   }
  };

  useEffect(() => {
    fetchSubcontractors();
  }, []);
  const handleMessageClick = (subcontractor: Subcontractor) => {
    if (subcontractor.status === 'pending') {
      // Show reminder options modal
      const reminderOptions = ['Email', 'SMS'];
      const option = window.confirm(`Send reminder via:\n${reminderOptions.join(' or ')}`);
      if (option) {
        // Simulate sending reminder
        alert(`Reminder sent to ${subcontractor.name} via ${reminderOptions[0]}`);
      }
    } else {
      // Regular message handling for active subcontractors
      const dashboardLayout = document.querySelector('.min-h-screen.bg-gray-100');
      if (!dashboardLayout) return;

      const messagesButton = dashboardLayout.querySelector('button[aria-label="Open Messages"]');
      if (messagesButton instanceof HTMLButtonElement) {
        messagesButton.click();
      }
    }
  };

  const handleShowReviews = (subcontractor: Subcontractor) => {
    setSelectedSubcontractor(subcontractor);
    setShowReviewsModal(true);
  };
const handleAddSubcontractor = async (newSubcontractor: any) => {
  try {
    showLoader();
    const response = await axiosInstance.post("/sub", {
      name: newSubcontractor?.name,
      email: newSubcontractor?.email,
      phone: newSubcontractor?.phone,
      location: newSubcontractor?.location,
      serviceTypes: newSubcontractor?.serviceTypes,
    });

    const savedSubcontractor = response.data;

    // Add to local state
    setSubcontractors((prev) => [
      ...prev,
      {
        ...savedSubcontractor,
        id: savedSubcontractor._id, // use MongoDB _id
        serviceAreas: savedSubcontractor.serviceAreas || ["Portland Metro"], // fallback if needed
      },
    ]);
  } catch (error) {
    console.error("Error adding subcontractor:", error);
    // Optional: show a toast or error message
  }
  finally {
    hideLoader();
  }

};
  const handleRemoveSubcontractor = async (subcontractorId: string) => {
    try {
      showLoader();
      await axiosInstance.delete(`/sub/${subcontractorId}`);
      setSubcontractors((prev) =>
        prev.filter((sub) => sub.id !== subcontractorId)
      );
    } catch (error) {
      console.error("Error deleting subcontractor:", error);
    } finally {
      hideLoader();
    }
    setSubcontractors((prev) =>
      prev.filter((sub) => sub.id !== subcontractorId)
    );
    setShowDeleteConfirm(null);
  };



  // Filter subcontractors based on search term and filters
  const filteredSubcontractors = subcontractors.filter(sub => {
    const matchesSearch = 
      sub?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      sub?.company?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      sub?.serviceTypes?.some(service => service?.toLowerCase().includes(searchTerm?.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || sub?.status === statusFilter;
    const matchesService = serviceFilter === 'all' || sub?.serviceTypes.includes(serviceFilter);
    
    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Sub Contractors</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search and Find New Subs */}
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1 flex">
              <div className="flex items-center bg-gray-100 rounded-l-md px-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search subcontractors, services, or areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="relative px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center whitespace-nowrap"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Find New Subs
              <div className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full">
                Coming Soon
              </div>
            </button>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filters
            <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Add Subcontractor Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Subcontractor
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'pending')}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label htmlFor="service-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                id="service-filter"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Services</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="HVAC">HVAC</option>
                <option value="Smart Home Installation">Smart Home</option>
              </select>
            </div>

            <div>
              <label htmlFor="area-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Service Area
              </label>
              <select
                id="area-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Areas</option>
                <option value="Portland Metro">Portland Metro</option>
                <option value="Vancouver WA">Vancouver WA</option>
                <option value="Salem">Salem</option>
                <option value="Beaverton">Beaverton</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Subcontractors List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {filteredSubcontractors.length} Subcontractors
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredSubcontractors.map((sub) => (
            <div key={sub.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    {sub.avatar ? (
                      <img 
                        src={sub.avatar} 
                        alt={sub.name} 
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <User className="w-8 h-8 text-blue-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-6">
                    {/* Main Stakeholder Info */}
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{sub.name}</h3>
                        <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                          sub.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sub.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{sub.company}</p>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-2" />
                          {sub.address}
                        </div>
                        {sub.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="w-4 h-4 mr-2" />
                            {sub.phone}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-4 h-4 mr-2" />
                          {sub.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {sub.status === 'active' && (
                    <div>
                      <button
                        onClick={() => handleShowReviews(sub)}
                        className="flex items-center hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
                      >
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < (sub.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">{sub.rating}</span>
                        </div>
                      </button>
                      <p className="text-sm text-gray-500 mt-1">
                        {sub.completedProjects} projects completed
                      </p>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMessageClick(sub)}
                      className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-1"
                    >
                      {sub.status === 'pending' ? (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Remind</span>
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4" />
                          <span>Message</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(sub.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Subcontractor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredSubcontractors.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No subcontractors found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Add Subcontractor Modal */}
      <AddSubcontractorModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSubcontractor}
      />

      {/* Reviews Modal */}
      {selectedSubcontractor && (
        <ReviewsModal
          isOpen={showReviewsModal}
          onClose={() => {
            setShowReviewsModal(false);
            setSelectedSubcontractor(null);
          }}
          subcontractor={selectedSubcontractor}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(null)} />
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Remove Subcontractor</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this subcontractor? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveSubcontractor(showDeleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};