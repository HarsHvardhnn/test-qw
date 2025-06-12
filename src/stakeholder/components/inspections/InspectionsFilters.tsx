import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface InspectionsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onScheduleClick: () => void;
}

export const InspectionsFilters: React.FC<InspectionsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  showFilters,
  setShowFilters,
  onScheduleClick
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search projects, contractors, or milestones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

        {/* Status Filter */}
        <div className="relative">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="pending">Pending</option>
            <option value="completed">Passed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Schedule Button */}
        <button
          onClick={onScheduleClick}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Schedule Inspection
        </button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="date-range"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            >
              <option value="all">All Time</option>
              <option value="this-week">This Week</option>
              <option value="next-week">Next Week</option>
              <option value="this-month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="inspector-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Inspector
            </label>
            <select
              id="inspector-filter"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            >
              <option value="all">All Inspectors</option>
              <option value="John Smith">John Smith</option>
              <option value="Emily Johnson">Emily Johnson</option>
              <option value="Michael Brown">Michael Brown</option>
              <option value="Sarah Davis">Sarah Davis</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
              Urgency
            </label>
            <select
              id="urgency"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            >
              <option value="all">All</option>
              <option value="overdue">Overdue</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="upcoming">Later</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};