import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  Flag, 
  Download, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';

interface Milestone {
  id: number;
  name: string;
  amount: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'pending-approval';
  dueDate: string;
  completedDate?: string;
}

interface Document {
  id: number;
  name: string;
  type: 'contract' | 'inspection' | 'invoice' | 'permit';
  date: string;
  url: string;
}

export interface Project {
  id: number;
  name: string;
  contractor: string;
  contractorContact: {
    name: string;
    phone: string;
    email: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  address: string;
  amount: string;
  progress: number;
  status: 'active' | 'completed' | 'on-hold' | 'pending';
  startDate: string;
  endDate: string;
  nextMilestone: string;
  nextPayment: string;
  dueDate: string;
  flagged: boolean;
  flagReason?: string;
  milestones: Milestone[];
  documents: Document[];
}

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  project, 
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get milestone status badge styling
  const getMilestoneBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-gray-100 text-gray-800';
      case 'pending-approval':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get document type icon
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'inspection':
        return <CheckSquare className="w-4 h-4 text-purple-500" />;
      case 'invoice':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'permit':
        return <ExternalLink className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        {/* Modal Panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">Project ID: {project.id}</span>
                {project.flagged && (
                  <div className="ml-2 flex items-center text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {project.flagReason || 'Flagged'}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'overview'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'milestones'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('milestones')}
              >
                Milestones & Payments
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'documents'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
              <button
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'communication'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('communication')}
              >
                Communication
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-6 max-h-[70vh] overflow-y-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Project Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Project Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <DollarSign className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Loan Amount</p>
                          <p className="text-sm text-gray-500">{project.amount}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Project Timeline</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Project Address</p>
                          <p className="text-sm text-gray-500">{project.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Status</p>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              project.status === 'active' ? 'bg-green-100 text-green-800' :
                              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              project.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Contact Information</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Contractor</p>
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{project.contractorContact.name}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{project.contractorContact.phone}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Mail className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{project.contractorContact.email}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Customer</p>
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{project.customer.name}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{project.customer.phone}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Mail className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{project.customer.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress and Next Steps */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Progress & Next Steps</h4>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Project Progress</span>
                      <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          project.status === 'on-hold' 
                            ? 'bg-orange-500' 
                            : project.status === 'completed'
                              ? 'bg-green-500'
                              : 'bg-blue-600'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Next Milestone */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Next Milestone</p>
                      <p className="text-sm font-medium text-gray-800">{project.nextMilestone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Next Payment</p>
                      <p className="text-sm font-medium text-gray-800">{project.nextPayment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 text-gray-500 mr-1" />
                        <p className="text-sm font-medium text-gray-800">
                          {formatDate(project.dueDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Approve Payment
                  </button>
                  <button className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Schedule Inspection
                  </button>
                  <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Contractor
                  </button>
                  {project.flagged ? (
                    <button className="px-4 py-2 text-sm text-orange-700 bg-orange-100 rounded-md hover:bg-orange-200 transition-colors flex items-center">
                      <Flag className="w-4 h-4 mr-2" />
                      Remove Flag
                    </button>
                  ) : (
                    <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                      <Flag className="w-4 h-4 mr-2" />
                      Flag Issue
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Milestones Tab */}
            {activeTab === 'milestones' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Milestones & Payments</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Total Loan Amount: {project.amount}
                  </div>
                </div>

                {/* Milestones Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Milestone
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completed Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {project.milestones.map((milestone) => (
                        <tr key={milestone.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {milestone.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {milestone.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMilestoneBadge(milestone.status)}`}>
                              {milestone.status === 'completed' ? 'Completed' :
                               milestone.status === 'in-progress' ? 'In Progress' :
                               milestone.status === 'upcoming' ? 'Upcoming' :
                               'Pending Approval'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(milestone.dueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {milestone.completedDate ? formatDate(milestone.completedDate) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {milestone.status === 'pending-approval' && (
                              <div className="flex justify-end space-x-2">
                                <button className="text-green-600 hover:text-green-900 flex items-center">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </button>
                                <button className="text-red-600 hover:text-red-900 flex items-center">
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </button>
                              </div>
                            )}
                            {milestone.status === 'in-progress' && (
                              <button className="text-purple-600 hover:text-purple-900 flex items-center justify-end">
                                <CheckSquare className="w-4 h-4 mr-1" />
                                Schedule Inspection
                              </button>
                            )}
                            {milestone.status === 'completed' && (
                              <button className="text-blue-600 hover:text-blue-900 flex items-center justify-end">
                                <FileText className="w-4 h-4 mr-1" />
                                View Details
                              </button>
                            )}
                            {milestone.status === 'upcoming' && (
                              <span className="text-gray-400">No actions</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Payment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Payment Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <p className="text-xs text-gray-500">Total Disbursed</p>
                      <p className="text-lg font-semibold text-green-600">
                        {project.milestones
                          .filter(m => m.status === 'completed')
                          .reduce((sum, m) => sum + parseFloat(m.amount.replace(/[^0-9.-]+/g, '')), 0)
                          .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <p className="text-xs text-gray-500">Pending Approval</p>
                      <p className="text-lg font-semibold text-yellow-600">
                        {project.milestones
                          .filter(m => m.status === 'pending-approval')
                          .reduce((sum, m) => sum + parseFloat(m.amount.replace(/[^0-9.-]+/g, '')), 0)
                          .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <p className="text-xs text-gray-500">Remaining Balance</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {(parseFloat(project.amount.replace(/[^0-9.-]+/g, '')) - 
                          project.milestones
                            .filter(m => m.status === 'completed')
                            .reduce((sum, m) => sum + parseFloat(m.amount.replace(/[^0-9.-]+/g, '')), 0))
                          .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Project Documents</h4>
                  <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Upload Document
                  </button>
                </div>

                {/* Documents List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.documents.map((doc) => (
                    <div key={doc.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-4 flex items-start">
                        <div className="p-2 bg-gray-100 rounded-lg mr-3">
                          {getDocumentIcon(doc.type)}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{doc.name}</h5>
                          <p className="text-xs text-gray-500 mt-1">Added on {formatDate(doc.date)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Document Categories */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Document Categories</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                      <FileText className="w-6 h-6 text-blue-500 mb-2" />
                      <span className="text-sm text-gray-700">Contracts</span>
                      <span className="text-xs text-gray-500 mt-1">
                        {project.documents.filter(d => d.type === 'contract').length} files
                      </span>
                    </button>
                    <button className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                      <CheckSquare className="w-6 h-6 text-purple-500 mb-2" />
                      <span className="text-sm text-gray-700">Inspections</span>
                      <span className="text-xs text-gray-500 mt-1">
                        {project.documents.filter(d => d.type === 'inspection').length} files
                      </span>
                    </button>
                    <button className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                      <DollarSign className="w-6 h-6 text-green-500 mb-2" />
                      <span className="text-sm text-gray-700">Invoices</span>
                      <span className="text-xs text-gray-500 mt-1">
                        {project.documents.filter(d => d.type === 'invoice').length} files
                      </span>
                    </button>
                    <button className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex flex-col items-center">
                      <ExternalLink className="w-6 h-6 text-orange-500 mb-2" />
                      <span className="text-sm text-gray-700">Permits</span>
                      <span className="text-xs text-gray-500 mt-1">
                        {project.documents.filter(d => d.type === 'permit').length} files
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Communication Tab */}
            {activeTab === 'communication' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-gray-900">Communication</h4>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Contractor
                    </button>
                    <button className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Customer
                    </button>
                  </div>
                </div>

                {/* Message Thread Placeholder */}
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h5 className="text-gray-700 font-medium">Communication History</h5>
                  <p className="text-gray-500 mt-2">
                    The communication history will be implemented in the next phase.
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors flex items-center">
                      <CheckSquare className="w-5 h-5 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-700">Schedule Inspection</span>
                    </button>
                    <button className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors flex items-center">
                      <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">Request Payment Update</span>
                    </button>
                    <button className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors flex items-center">
                      <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                      <span className="text-sm text-gray-700">Report Issue</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};