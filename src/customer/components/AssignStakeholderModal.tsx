import React, { useState } from 'react';
import { X, Plus, Building2, Shield, User, MapPin, DollarSign, Phone, Mail } from 'lucide-react';

interface AssignStakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StakeholderType = 'financial' | 'insurance' | 'inspector' | 'realtor' | 'investor';

interface Stakeholder {
  id: string;
  name: string;
  company: string;
  type: StakeholderType;
  email: string;
  address: string;
  phone?: string;
  logo?: string;
}

export const AssignStakeholderModal: React.FC<AssignStakeholderModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedType, setSelectedType] = useState<StakeholderType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newStakeholder, setNewStakeholder] = useState({
    name: '',
    company: '',
    email: '',
    address: '',
    phone: ''
  });

  // Sample stakeholders data
  const stakeholders: Stakeholder[] = [
    {
      id: '1',
      name: 'First National Bank',
      company: 'First National Bank',
      type: 'financial',
      email: 'contact@fnb.com',
      address: '123 Financial Ave, New York, NY 10001',
      phone: '(212) 555-0123',
      logo: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80'
    },
    {
      id: '2',
      name: 'SafeGuard Insurance',
      company: 'SafeGuard Insurance Co.',
      type: 'insurance',
      email: 'info@safeguard.com',
      address: '456 Insurance Blvd, Chicago, IL 60601',
      phone: '(312) 555-0456',
      logo: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&q=80'
    },
    {
      id: '3',
      name: 'City Inspections',
      company: 'City Inspections',
      type: 'inspector',
      email: 'info@cityinspections.com',
      address: '789 Inspector St, Los Angeles, CA 90001',
      phone: '(323) 555-0789',
      logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80'
    },
    {
      id: '4',
      name: 'Realty Experts',
      company: 'Realty Experts',
      type: 'realtor',
      email: 'info@realtyexperts.com',
      address: '321 Realtor Way, Miami, FL 33101',
      phone: '(305) 555-0321',
      logo: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80'
    },
    {
      id: '5',
      name: 'Growth Capital Partners',
      company: 'Growth Capital Partners LLC',
      type: 'investor',
      email: 'info@growthcapital.com',
      address: '555 Investment Ave, Boston, MA 02110',
      phone: '(617) 555-0555',
      logo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80'
    }
  ];

  const stakeholderTypes = [
    { id: 'financial', label: 'Financial Institution', icon: Building2 },
    { id: 'insurance', label: 'Insurance Provider', icon: Shield },
    { id: 'inspector', label: 'Inspector', icon: User },
    { id: 'realtor', label: 'Realtor', icon: Building2 },
    { id: 'investor', label: 'Investor', icon: DollarSign }
  ];

  const filteredStakeholders = stakeholders.filter(stakeholder => 
    stakeholder.type === selectedType &&
    (stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     stakeholder.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
     stakeholder.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
     stakeholder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (stakeholder.phone && stakeholder.phone.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleAssign = (stakeholder: Stakeholder) => {
    console.log('Assigning stakeholder:', stakeholder);
    // Here you would typically make an API call to assign the stakeholder
    onClose();
  };

  const handleAddNew = () => {
    if (!newStakeholder.name || !newStakeholder.email || !newStakeholder.address) return;

    console.log('Adding new stakeholder:', {
      ...newStakeholder,
      type: selectedType
    });
    // Here you would typically make an API call to create the new stakeholder
    setShowAddNew(false);
    setNewStakeholder({ name: '', company: '', email: '', address: '', phone: '' });
    onClose();
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
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Assign Stakeholder
              </h3>

              {!selectedType ? (
                <div className="grid grid-cols-2 gap-4">
                  {stakeholderTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id as StakeholderType)}
                      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <type.icon className="w-8 h-8 text-blue-500 mb-2" />
                      <span className="text-sm font-medium text-gray-900">{type.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      setSelectedType(null);
                      setSearchTerm('');
                      setShowAddNew(false);
                    }}
                    className="mb-4 text-sm text-blue-600 hover:text-blue-500"
                  >
                    ← Choose different type
                  </button>

                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search stakeholders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {!showAddNew ? (
                    <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
                      {filteredStakeholders.map(stakeholder => (
                        <div
                          key={stakeholder.id}
                          className="flex flex-col p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-start space-x-4">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                              {stakeholder.logo ? (
                                <img 
                                  src={stakeholder.logo} 
                                  alt={stakeholder.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <Building2 className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Company Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{stakeholder.name}</h4>
                                  <p className="text-sm text-gray-500">{stakeholder.company}</p>
                                </div>
                                <button
                                  onClick={() => handleAssign(stakeholder)}
                                  className="ml-4 px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                  Assign
                                </button>
                              </div>

                              <div className="mt-2 space-y-1">
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {stakeholder.address}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {stakeholder.phone}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Mail className="w-4 h-4 mr-1" />
                                  {stakeholder.email}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {filteredStakeholders.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No stakeholders found</p>
                          <button
                            onClick={() => setShowAddNew(true)}
                            className="mt-2 text-blue-600 hover:text-blue-500 flex items-center justify-center w-full"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add New Stakeholder
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={newStakeholder.name}
                          onChange={(e) => setNewStakeholder(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter stakeholder name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={newStakeholder.company}
                          onChange={(e) => setNewStakeholder(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={newStakeholder.email}
                          onChange={(e) => setNewStakeholder(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          value={newStakeholder.address}
                          onChange={(e) => setNewStakeholder(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter complete address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={newStakeholder.phone}
                          onChange={(e) => setNewStakeholder(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    {showAddNew && (
                      <button
                        onClick={handleAddNew}
                        disabled={!newStakeholder.name || !newStakeholder.email || !newStakeholder.address}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add & Assign
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};