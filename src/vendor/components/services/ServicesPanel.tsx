import React, { useEffect, useState } from 'react';
import { Clock, Plus, Search, Filter, ChevronDown, Package, Star, BarChart, DollarSign, Users } from 'lucide-react';
import { ServiceForm } from './ServiceForm';
import { ServicesList } from './ServicesList';
import axiosInstance from '../../../axios';

interface Service {
  id: string;
  name: string;
  companyName: string;
  description: string;
  details: string[];
  image: string;
  ctaType: 'schedule' | 'callback';
  status: 'active' | 'draft' | 'archived';
  isPremium: boolean;
  performance: {
    views: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

export const ServicesPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddService, setShowAddService] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Sample services data
  const [services, setServices] = useState<Service[]>([
    {
      id: 's1',
      name: 'Culligan Water Filtration - Whole Home Solutions',
      companyName: 'Culligan Water',
      description: 'Professional water filtration solutions for your entire home. Get cleaner, safer water from every tap.',
      details: [
        'Free Home Consultation',
        'Professional Installation',
        'Affordable Monthly Plans',
        'Whole-Home Coverage',
        '24/7 Emergency Service'
      ],
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',
      ctaType: 'schedule',
      status: 'active',
      isPremium: true,
      performance: {
        views: 1250,
        clicks: 320,
        conversions: 45,
        revenue: 67500
      }
    },
    {
      id: 's2',
      name: 'Home Insurance for Renovations',
      companyName: 'SafeGuard Insurance',
      description: 'Specialized insurance coverage for home renovation projects. Protect your investment with our comprehensive plans.',
      details: [
        'Project-Specific Coverage',
        'Contractor Liability Protection',
        'Materials Coverage',
        'Flexible Payment Options',
        'Quick Claims Process'
      ],
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
      ctaType: 'callback',
      status: 'active',
      isPremium: false,
      performance: {
        views: 850,
        clicks: 210,
        conversions: 28,
        revenue: 42000
      }
    }
  ]);

  const fetchServices = async (): Promise<Service[]> => {
    try {
      const response = await axiosInstance.get<Service[]>("/service");
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      return [];
    }
  };
   useEffect(() => {
     const getServices = async () => {
       const data = await fetchServices();
       setServices(data);
     };

     getServices();
   }, []);
  const handleAddService = (service: Omit<Service, 'id' | 'performance'>) => {
    const newService: Service = {
      ...service,
      id: `s${services.length + 1}`,
      performance: {
        views: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0
      }
    };
    setServices(prev => [...prev, newService]);
    setShowAddService(false);
  };

  const handleEditService = (service: Service) => {
    setServices(prev => prev.map(s => s.id === service.id ? service : s));
    setSelectedService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  // Filter services based on search term and status
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate service stats
  const stats = {
    totalServices: services.length,
    activeServices: services.filter(s => s.status === 'active').length,
    totalViews: services.reduce((sum, s) => sum + s.performance.views, 0),
    totalConversions: services.reduce((sum, s) => sum + s.performance.conversions, 0),
    totalRevenue: services.reduce((sum, s) => sum + s.performance.revenue, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Services</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              Last updated: Today, 10:45 AM
            </span>
          </div>
          <button
            onClick={() => setShowAddService(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-blue-600">
              {stats.activeServices} active
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Services</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">
            {stats.totalServices}
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
          <p className="text-2xl font-semibold text-gray-800 mt-1">
            {stats.totalViews.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-purple-600">
              +8% this month
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Conversions</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">
            {stats.totalConversions.toLocaleString()}
          </p>
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
          <p className="text-2xl font-semibold text-gray-800 mt-1">
            {((stats.totalConversions / stats.totalViews) * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-700">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-orange-600">MTD</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">
            ${stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 flex">
            <div className="flex items-center bg-gray-100 rounded-l-md px-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search services..."
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
                <option value="all">All Services</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="cta-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CTA Type
              </label>
              <select
                id="cta-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="schedule">Schedule Consultation</option>
                <option value="callback">Request Callback</option>
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
                <option value="views-high">Views: High to Low</option>
                <option value="conversions-high">
                  Conversions: High to Low
                </option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Services List */}
      <ServicesList
        services={filteredServices}
        onEdit={setSelectedService}
        onDelete={handleDeleteService}
      />

      {/* Add/Edit Service Modal */}
      {(showAddService || selectedService) && (
        <ServiceForm
          isOpen={true}
          onClose={() => {
            setShowAddService(false);
            setSelectedService(null);
          }}
          onSubmit={fetchServices}
          service={selectedService}
        />
      )}
    </div>
  );
};