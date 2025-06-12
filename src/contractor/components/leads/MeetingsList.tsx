import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video, Phone, User, Plus, Search, Filter, ChevronDown, MapPin, Mail, X } from 'lucide-react';
import { MeetingScheduler } from './MeetingScheduler';
import axiosInstance from '../../../axios';
import { useLoader } from '../../../context/LoaderContext';

interface Meeting {
  id: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactType: 'customer' | 'lead';
  meetingType: 'video' | 'phone';
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  avatar?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'customer' | 'lead';
  avatar?: string;
}

export const MeetingsList: React.FC = () => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const {showLoader,hideLoader}=useLoader()
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [meetingToReschedule, setMeetingToReschedule] = useState<Meeting | null>(null);

  const fetchScheduledMeetings = async () => {
    try {
      const response = await axiosInstance.get("/meeting/scheduled");
      console.log("Scheduled meetings:", response.data);
      setMeetings(response.data);
    } catch (error) {
      console.error("Error fetching meetings:", error.response?.data || error.message);
    }
  };

  // Sample contacts for the dropdown
  const [contacts,setCustomers] = useState<Contact[]>([
    {
      id: 'c1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 123-4567',
      type: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
    },
    {
      id: 'c2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '(555) 234-5678',
      type: 'lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
    }
  ]);
    useEffect(() => {
      const fetchCustomers = async () => {
        try {
          showLoader()
          const response = await axiosInstance.get("/quote/v2/customers/by-contractor");
          if (response.data.success) {
            setCustomers(response.data.customers);
          } else {
            console.error("Failed to fetch customers:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching customers:", error);
        }finally{
          hideLoader()
        }
      };
    
      fetchCustomers();
      fetchScheduledMeetings()
    }, []); 

  // Filter meetings based on search term and status
  const filteredMeetings = meetings?.filter(meeting => {
    const matchesSearch = 
      meeting.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    
    return matchesSearch && matchesStatus ;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleScheduleMeeting = (contact: Contact | null = null) => {
    setSelectedContact(contact);
    setMeetingToReschedule(null);
    setShowScheduler(true);
  };

  const handleRescheduleMeeting = (meeting: Meeting) => {
    setMeetingToReschedule(meeting);
    setSelectedContact({
      id: meeting.id,
      name: meeting.contactName,
      email: meeting.contactEmail,
      phone: meeting.contactPhone,
      type: meeting.contactType
    });
    setShowScheduler(true);
  };

  const handleMeetingScheduled = (newDate: string, newTime: string) => {
    if (meetingToReschedule) {
      // Update the existing meeting
      setMeetings(prevMeetings => 
        prevMeetings.map(meeting => 
          meeting.id === meetingToReschedule.id
            ? { ...meeting, date: newDate, time: newTime }
            : meeting
        )
      );
    } else {
      // Handle new meeting creation
      // This would be handled by your existing new meeting logic
    }
    setShowScheduler(false);
    setMeetingToReschedule(null);
    setSelectedContact(null);
  };

  const updateMeetingStatus = async (meetingId, newStatus) => {
    try {
      showLoader()
      const response = await axiosInstance.put(`/meeting/update-status/${meetingId}`, {
        status: newStatus,
      });
  
      console.log("Meeting status updated:", response.data);
    } catch (error) {
      console.error("Error updating meeting status:", error.response?.data || error.message);
    }
    finally{
      hideLoader()
    }
  };
  const handleCancelMeeting = async (meetingId: string) => {
    await updateMeetingStatus(meetingId, 'cancelled');
    setMeetings(prevMeetings =>
      prevMeetings.map(meeting =>
        meeting.id === meetingId
          ? { ...meeting, status: 'cancelled' }
          : meeting
      )
    );
  };

  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {filteredMeetings?.length} Scheduled Meetings
          </h2>
          <button
            onClick={() => handleScheduleMeeting()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 flex">
            <div className="flex items-center bg-gray-100 rounded-l-md px-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            Filters
            <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Meetings</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Type
              </label>
              <select
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Types</option>
                <option value="video">Video Calls</option>
                <option value="phone">Phone Calls</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Meetings List */}
      <div className="divide-y divide-gray-200">
        {filteredMeetings?.map((meeting) => (
          <div key={meeting.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                {meeting.avatar ? (
                  <img
                    src={meeting.avatar}
                    alt={meeting.contactName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {meeting?.contactName.split(' ').map(n => n[0]).join('')}
                  </div>
                )}

                {/* Meeting Info */}
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{meeting.contactName}</h3>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                      meeting.contactType === 'customer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {meeting.contactType.charAt(0).toUpperCase() + meeting.contactType.slice(1)}
                    </span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                      meeting.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                      meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(meeting.date)} at {meeting.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {meeting.duration} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      {meeting.meetingType === 'video' ? (
                        <Video className="w-4 h-4 mr-2" />
                      ) : (
                        <Phone className="w-4 h-4 mr-2" />
                      )}
                      {meeting.meetingType === 'video' ? 'Video Call' : 'Phone Call'}
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {meeting.contactEmail}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-2" />
                      {meeting.contactPhone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                {meeting.status === 'scheduled' && (
                  <>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm">
                      <Video className="w-4 h-4 mr-2" />
                      Join Meeting
                    </button>
                    <button 
                      onClick={() => handleRescheduleMeeting(meeting)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Reschedule
                    </button>
                    <button 
                      onClick={() =>  handleCancelMeeting(meeting.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center text-sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            {meeting.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{meeting.notes}</p>
              </div>
            )}
          </div>
        ))}

        {filteredMeetings?.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No meetings found matching your criteria.
          </div>
        )}
      </div>

      {/* Meeting Scheduler Modal */}
      {showScheduler && (
        <MeetingScheduler
          isOpen={showScheduler}
          onClose={() => {
            setShowScheduler(false);
            setSelectedContact(null);
            setMeetingToReschedule(null);
                fetchScheduledMeetings();

          }}
          contactName={selectedContact?.name || ''}
          contactEmail={selectedContact?.email}
          contactPhone={selectedContact?.phone}
          isInstantMeeting={false}
          contacts={contacts}
        />
      )}
    </div>
  );
};