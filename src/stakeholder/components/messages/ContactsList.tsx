import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Contact } from './types';
import { ContactItem } from './ContactItem';

interface ContactsListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterRole: string;
  setFilterRole: (role: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  isHidden: boolean;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  selectedContact,
  setSelectedContact,
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  showFilters,
  setShowFilters,
  isHidden
}) => {
  return (
    <div className={`w-80 border-r border-gray-200 flex flex-col h-[calc(100vh-180px)] ${isHidden ? 'hidden md:flex' : ''}`}>
      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search contacts or projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-3 py-1 text-xs rounded-full ${
                filterRole === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterRole('contractor')}
              className={`px-3 py-1 text-xs rounded-full ${
                filterRole === 'contractor'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Contractors
            </button>
            <button
              onClick={() => setFilterRole('customer')}
              className={`px-3 py-1 text-xs rounded-full ${
                filterRole === 'customer'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Customers
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Filter className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="mb-3">
              <label htmlFor="project-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                id="project-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              >
                <option value="all">All Projects</option>
                <option value="1">Smith Home Remodel</option>
                <option value="2">Johnson Kitchen Renovation</option>
                <option value="3">Davis Bathroom Remodel</option>
                <option value="4">Wilson Basement Finishing</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="flagged">Flagged</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Contacts List - With improved scrolling */}
      <div className="overflow-y-auto flex-1 will-change-scroll overscroll-behavior-y-contain custom-scrollbar">
        {contacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No contacts found matching your criteria.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <ContactItem 
                key={contact.id}
                contact={contact}
                isSelected={selectedContact?.id === contact.id}
                onClick={() => setSelectedContact(contact)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};