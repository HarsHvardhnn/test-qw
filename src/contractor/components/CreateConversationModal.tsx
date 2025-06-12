import React, { useEffect, useState } from 'react';
import { X, Users, Building2, Shield, User, Search, PenTool as Tool } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import axiosInstance from '../../axios';

interface Participant {
  id: string;
  name: string;
  role: 'customer' | 'financial' | 'insurance' | 'inspector' | 'realtor' | 'investor' | 'subcontractor';
  company: string;
  avatar?: string;
}

interface CreateConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConversation: (participants: Participant[]) => void;
}

export const CreateConversationModal: React.FC<CreateConversationModalProps> = ({
  isOpen,
  onClose,
  onCreateConversation
}) => {
  const { customerName } = useProject();
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');


  // Sample participants data including the customer and subcontractors
  const [availableParticipants,setParticipants]=   useState<Participant[]>( [
    {
      id: 'customer1',
      name: customerName,
      role: 'customer',
      company: 'Homeowner',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
    },
    {
      id: 'fin1',
      name: 'John Smith',
      role: 'financial',
      company: 'First National Bank',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80'
    },
    {
      id: 'ins1',
      name: 'Emily Johnson',
      role: 'insurance',
      company: 'SafeGuard Insurance',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'
    },
    {
      id: 'insp1',
      name: 'Michael Brown',
      role: 'inspector',
      company: 'City Building Department',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
    },
    {
      id: 'real1',
      name: 'Sarah Davis',
      role: 'realtor',
      company: 'Premium Realty',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80'
    },
    {
      id: 'inv1',
      name: 'David Wilson',
      role: 'investor',
      company: 'Growth Capital Partners',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80'
    },
    // Active Subcontractors
    {
      id: 'sub1',
      name: 'Michael Chen',
      role: 'subcontractor',
      company: 'Elite Electrical Services',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
    },
    {
      id: 'sub2',
      name: 'Sarah Rodriguez',
      role: 'subcontractor',
      company: 'Premium Plumbing Co',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80'
    }
  ])

 

  const fetchMinimalCustomers = async () => {
    try {
      const response = await axiosInstance.get("/quote/v2/msg/customers");
  
      if (response.data.success) {
        setParticipants(response.data.customers)// Return the array of customers
      } else {
        console.error("Failed to fetch customers:", response.data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  };

  useEffect(()=>{
    fetchMinimalCustomers()
  },[])

  const filteredParticipants = availableParticipants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleParticipant = (participant: Participant) => {
    setSelectedParticipants(prev => {
      const isSelected = prev.find(p => p.id === participant.id);
      if (isSelected) {
        return prev.filter(p => p.id !== participant.id);
      } else {
        return [...prev, participant];
      }
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'customer':
        return <User className="w-5 h-5 text-green-500" />;
      case 'user':
        return <User className="w-5 h-5 text-green-500" />;
      case 'financial':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'insurance':
        return <Shield className="w-5 h-5 text-green-500" />;
      case 'inspector':
        return <User className="w-5 h-5 text-purple-500" />;
      case 'realtor':
        return <Building2 className="w-5 h-5 text-orange-500" />;
      case 'investor':
        return <Building2 className="w-5 h-5 text-yellow-500" />;
      case 'subcontractor':
        return <Tool className="w-5 h-5 text-blue-500" />;
      default:
        return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleCreateConversation = () => {
    if (selectedParticipants.length > 0) {
      onCreateConversation(selectedParticipants);
      console.log("selected participants",selectedParticipants);
      setSelectedParticipants([]);
      setSearchTerm('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  Create New Conversation
                </h3>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Selected Participants */}
              {selectedParticipants.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Participants ({selectedParticipants.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedParticipants.map(participant => (
                      <div
                        key={participant.id}
                        className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm"
                      >
                        <span>{participant.name}</span>
                        <button
                          onClick={() => toggleParticipant(participant)}
                          className="ml-1 p-1 hover:bg-blue-100 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Participants List */}
              <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredParticipants.map(participant => (
                  <div
                    key={participant.id}
                    onClick={() => toggleParticipant(participant)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedParticipants.find(p => p.id === participant.id)
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-shrink-0 mr-3">
                      {participant.avatar ? (
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {getRoleIcon(participant.role)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                      <p className="text-sm text-gray-500">{participant.company}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                        participant.role === 'subcontractor' ? 'bg-blue-100 text-blue-800' :
                        participant.role === 'customer' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border ${
                      selectedParticipants.find(p => p.id === participant.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedParticipants.find(p => p.id === participant.id) && (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Create Button */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateConversation}
                  disabled={selectedParticipants.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};