import React from 'react';
import { Edit2, Trash2, Star, Eye, MousePointer, DollarSign, Package, ArrowUpRight } from 'lucide-react';
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

interface ServicesListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onEdit,
  onDelete
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const deleteService = async (id: string) => {
    const res = await axiosInstance.delete(`/service/${id}`);
    return res.data.message;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          {services.length} Services
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {services.map((service) => (
          <div key={service.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Service Image */}
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                {/* Service Info */}
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                    {service.isPremium && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Premium
                      </span>
                    )}
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(service.status)}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">{service.description}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {service.details.map((detail, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {detail}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Company:</span>
                      <span className="ml-1 text-gray-600">{service.companyName}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">CTA Type:</span>
                      <span className="ml-1 text-gray-600">
                        {service.ctaType === 'schedule' ? 'Schedule Consultation' : 'Request Callback'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(service)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    onDelete(service.id)
                    deleteService(service.id)
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Views</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{service.performance.views.toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <MousePointer className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Clicks</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{service.performance.clicks.toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Conversions</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{service.performance.conversions.toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">Revenue</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(service.performance.revenue)}</p>
              </div>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="p-6 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500">Add your first service to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};