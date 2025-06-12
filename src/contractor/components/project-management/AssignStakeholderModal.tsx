import React, { useState } from 'react';
import { X, Users, Building2, Shield, User, Search, DollarSign } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  role: 'financial' | 'insurance' | 'inspector' | 'realtor' | 'investor';
  company: string;
  avatar?: string;
}

interface AssignStakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (stakeholders: Participant[]) => void;
  existingStakeholders?: Participant[];
}

export const AssignStakeholderModal: React.FC<AssignStakeholderModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  existingStakeholders = []
}) => {
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample stakeholders data
  const availableParticipants: Participant[] = [
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
    }
  ].filter(participant => 
    !existingStakeholders.some(existing => existing.id === participant.id)
  );

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
      case 'financial':
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'insurance':
        return <Shield className="w-5 h-5 text-green-500" />;
      case 'inspector':
        return <User className="w-5 h-5 text-purple-500" />;
      case 'realtor':
        return <Building2 className="w-5 h-5 text-orange-500" />;
      case 'investor':
        return <DollarSign className="w-5 h-5 text-yellow-500" />;
      default:
        return <User className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleAssignStakeholders = () => {
    onAssign(selectedParticipants);
    setSelectedParticipants([]);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Add Project Stakeholder
                  </h3>
                </div>

                {/* Search Input */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search stakeholders..."
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
                      Selected Stakeholders ({selectedParticipants.length})
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
                          participant.role === 'financial' ? 'bg-blue-100 text-blue-800' :
                          participant.role === 'insurance' ? 'bg-green-100 text-green-800' :
                          participant.role === 'inspector' ? 'bg-purple-100 text-purple-800' :
                          participant.role === 'realtor' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
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

                  {filteredParticipants.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No stakeholders found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleAssignStakeholders}
              disabled={selectedParticipants.length === 0}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Stakeholders
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};