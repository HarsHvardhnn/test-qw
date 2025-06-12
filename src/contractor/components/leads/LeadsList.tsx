import React, { useEffect, useState } from 'react';
import { MessageSquare, Calendar, Phone, Mail, MapPin, Video, Plus, ChevronRight } from 'lucide-react';
import { MeetingScheduler } from './MeetingScheduler';
import { useLoader } from '../../../context/LoaderContext';
import axiosInstance from '../../../axios';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  projectType: string;
  budget: string;
  status: 'new' | 'contacted' | 'meeting' | 'quoted';
  notes?: string;
  avatar?: string;
  lastContact?: string;
}

interface LeadsListProps {
  searchTerm: string;
  statusFilter: string;
  leads:Lead[]
}

export const LeadsList: React.FC<LeadsListProps> = ({ searchTerm, statusFilter,leads }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [isInstantMeeting, setIsInstantMeeting] = useState(false);


  // Filter leads based on search term and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.projectType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateMeeting = (leadId: number, instant: boolean) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setShowMeetingScheduler(true);
      setIsInstantMeeting(instant);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      case 'quoted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          {filteredLeads.length} Leads
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                {lead.avatar ? (
                  <img
                    src={lead.avatar}
                    alt={lead.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}

                {/* Lead Info */}
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{lead.name}</h3>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(lead.status)}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {lead.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-2" />
                      {lead.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {lead.address}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="mt-4 space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Project Type:</span>
                      <span className="ml-2 text-gray-600">{lead.projectType}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Budget Range:</span>
                      <span className="ml-2 text-gray-600">{lead.budget}</span>
                    </div>
                    {lead.lastContact && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Last Contact:</span>
                        <span className="ml-2 text-gray-600">
                          {new Date(lead.lastContact).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleCreateMeeting(lead.id, true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Instant Meeting
                </button>
                <button
                  onClick={() => handleCreateMeeting(lead.id, false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </button>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </button>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quote
                </button>
              </div>
            </div>

            {/* Notes */}
            {lead.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{lead.notes}</p>
              </div>
            )}
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No leads found matching your criteria.
          </div>
        )}
      </div>

      {/* Meeting Scheduler Modal */}
      {selectedLead && (
        <MeetingScheduler
          isOpen={showMeetingScheduler}
          onClose={() => {
            setShowMeetingScheduler(false);
            setSelectedLead(null);
          }}
          contactName={selectedLead.name}
          contactEmail={selectedLead.email}
          contactPhone={selectedLead.phone}
          isInstantMeeting={isInstantMeeting}
        />
      )}
    </div>
  );
};