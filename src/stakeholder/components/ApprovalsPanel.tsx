import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  CheckSquare,
  FileText,
  ArrowRight,
  User,
  Phone,
  Mail
} from 'lucide-react';

// Types
interface Approval {
  id: string;
  projectId: number;
  projectName: string;
  contractor: string;
  milestone: string;
  amount: string;
  requestDate: string;
  dueDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'inspection-required';
  inspectionStatus?: 'scheduled' | 'completed' | 'failed';
  inspectionDate?: string;
  notes?: string;
}

interface ApprovalDetailProps {
  approval: Approval;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onRequestInspection: (id: string) => void;
}

// Approval Detail Component
const ApprovalDetail: React.FC<ApprovalDetailProps> = ({ 
  approval, 
  onClose, 
  onApprove, 
  onReject,
  onRequestInspection
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(approval.id, rejectReason);
      setShowRejectForm(false);
    }
  };

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
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Payment Approval Request
                </h3>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{approval.projectName}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                      approval.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {approval.status.charAt(0).toUpperCase() + approval.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contractor:</span>
                      <span className="font-medium text-gray-900">{approval.contractor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Milestone:</span>
                      <span className="font-medium text-gray-900">{approval.milestone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount:</span>
                      <span className="font-medium text-gray-900">{approval.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Request Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(approval.requestDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Due Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(approval.dueDate)}</span>
                    </div>
                    
                    {approval.inspectionStatus && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Inspection Status:</span>
                        <span className={`font-medium ${
                          approval.inspectionStatus === 'completed' ? 'text-green-600' :
                          approval.inspectionStatus === 'failed' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {approval.inspectionStatus.charAt(0).toUpperCase() + approval.inspectionStatus.slice(1)}
                        </span>
                      </div>
                    )}
                    
                    {approval.inspectionDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Inspection Date:</span>
                        <span className="font-medium text-gray-900">{formatDate(approval.inspectionDate)}</span>
                      </div>
                    )}
                    
                    {approval.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-gray-500 block mb-1">Notes:</span>
                        <p className="text-gray-700">{approval.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {showRejectForm ? (
                  <div className="mt-4">
                    <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Rejection
                    </label>
                    <textarea
                      id="reject-reason"
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {approval.status === 'pending' && !showRejectForm && (
              <>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => onApprove(approval.id)}
                >
                  Approve Payment
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRejectForm(true)}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => onRequestInspection(approval.id)}
                >
                  Request Inspection
                </button>
              </>
            )}
            
            {showRejectForm && (
              <>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleReject}
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRejectForm(false)}
                >
                  Cancel
                </button>
              </>
            )}
            
            {!showRejectForm && (
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ApprovalsPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  
  // Sample approvals data
  const [approvals, setApprovals] = useState<Approval[]>([
    {
      id: 'apr-001',
      projectId: 1,
      projectName: 'Smith Home Remodel',
      contractor: 'J9 Construction',
      milestone: 'Foundation Complete',
      amount: '$25,000',
      requestDate: '2025-06-01',
      dueDate: '2025-06-15',
      status: 'pending'
    },
    {
      id: 'apr-002',
      projectId: 2,
      projectName: 'Johnson Kitchen Renovation',
      contractor: 'Modern Designs Inc.',
      milestone: 'Cabinets Installed',
      amount: '$15,000',
      requestDate: '2025-06-05',
      dueDate: '2025-06-10',
      status: 'pending'
    },
    {
      id: 'apr-003',
      projectId: 4,
      projectName: 'Wilson Basement Finishing',
      contractor: 'Basement Experts LLC',
      milestone: 'Framing Complete',
      amount: '$20,000',
      requestDate: '2025-06-12',
      dueDate: '2025-06-20',
      status: 'inspection-required',
      inspectionStatus: 'scheduled',
      inspectionDate: '2025-06-18'
    },
    {
      id: 'apr-004',
      projectId: 3,
      projectName: 'Davis Bathroom Remodel',
      contractor: 'Luxury Bath Solutions',
      milestone: 'Demo & Preparation',
      amount: '$10,000',
      requestDate: '2025-05-20',
      dueDate: '2025-05-25',
      status: 'approved'
    },
    {
      id: 'apr-005',
      projectId: 7,
      projectName: 'Brown Pool Installation',
      contractor: 'Aqua Pools & Spas',
      milestone: 'Shell Installation',
      amount: '$40,000',
      requestDate: '2025-05-10',
      dueDate: '2025-05-15',
      status: 'approved'
    },
    {
      id: 'apr-006',
      projectId: 5,
      projectName: 'Thompson Roof Replacement',
      contractor: 'Superior Roofing Co.',
      milestone: 'Tear Off Old Roof',
      amount: '$10,000',
      requestDate: '2025-04-05',
      dueDate: '2025-04-10',
      status: 'approved'
    },
    {
      id: 'apr-007',
      projectId: 5,
      projectName: 'Thompson Roof Replacement',
      contractor: 'Superior Roofing Co.',
      milestone: 'New Roof Installation',
      amount: '$20,000',
      requestDate: '2025-04-18',
      dueDate: '2025-04-25',
      status: 'approved'
    },
    {
      id: 'apr-008',
      projectId: 3,
      projectName: 'Davis Bathroom Remodel',
      contractor: 'Luxury Bath Solutions',
      milestone: 'Plumbing Rough-In',
      amount: '$10,000',
      requestDate: '2025-06-02',
      dueDate: '2025-06-08',
      status: 'rejected',
      notes: 'Inspection revealed issues with the plumbing work. Needs to be corrected before approval.'
    }
  ]);

  // Filter approvals based on search term and status filter
  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          approval.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          approval.milestone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Calculate days remaining or overdue
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'inspection-required':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle approval
  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(approval => 
      approval.id === id ? { ...approval, status: 'approved' } : approval
    ));
    setSelectedApproval(null);
  };

  // Handle rejection
  const handleReject = (id: string, reason: string) => {
    setApprovals(prev => prev.map(approval => 
      approval.id === id ? { ...approval, status: 'rejected', notes: reason } : approval
    ));
    setSelectedApproval(null);
  };

  // Handle request inspection
  const handleRequestInspection = (id: string) => {
    setApprovals(prev => prev.map(approval => 
      approval.id === id ? { 
        ...approval, 
        status: 'inspection-required',
        inspectionStatus: 'scheduled',
        inspectionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      } : approval
    ));
    setSelectedApproval(null);
  };

  // Calculate summary statistics
  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const pendingAmount = approvals
    .filter(a => a.status === 'pending')
    .reduce((sum, a) => sum + parseFloat(a.amount.replace(/[^0-9.-]+/g, '')), 0);
  
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const approvedAmount = approvals
    .filter(a => a.status === 'approved')
    .reduce((sum, a) => sum + parseFloat(a.amount.replace(/[^0-9.-]+/g, '')), 0);
  
  const inspectionCount = approvals.filter(a => a.status === 'inspection-required').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Approvals & Fund Disbursement</h1>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-500">Last updated: Today, 10:45 AM</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-700">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-yellow-600">{pendingCount} requests</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">
            ${pendingAmount.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-700">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-green-600">{approvedCount} payments</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Approved This Month</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">
            ${approvedAmount.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
              <CheckSquare className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-blue-600">{inspectionCount} required</span>
          </div>
          <h3 className="text-sm font-medium text-gray-500">Pending Inspections</h3>
          <p className="text-2xl font-semibold text-gray-800 mt-1">
            {inspectionCount} Projects
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="inspection-required">Inspection Required</option>
            </select>
          </div>
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
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="amount-range" className="block text-sm font-medium text-gray-700 mb-1">
                Amount Range
              </label>
              <select
                id="amount-range"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              >
                <option value="all">All Amounts</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10k-25k">$10,000 - $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="over-50k">Over $50,000</option>
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
                <option value="due-today">Due Today</option>
                <option value="due-this-week">Due This Week</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Approvals List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {filteredApprovals.length} Payment {filteredApprovals.length === 1 ? 'Request' : 'Requests'}
          </h2>
        </div>

        {filteredApprovals.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No payment requests found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project / Milestone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contractor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApprovals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{approval.projectName}</div>
                          <div className="text-sm text-gray-500">{approval.milestone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{approval.contractor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{approval.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(approval.dueDate)}</div>
                      <div className={`text-xs ${
                        getDaysRemaining(approval.dueDate).includes('overdue') 
                          ? 'text-red-600' 
                          : getDaysRemaining(approval.dueDate) === 'Due today'
                            ? 'text-yellow-600'
                            : 'text-gray-500'
                      }`}>
                        {getDaysRemaining(approval.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(approval.status)}`}>
                        {approval.status === 'inspection-required' 
                          ? 'Inspection Required' 
                          : approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                      </span>
                      {approval.inspectionStatus && (
                        <div className="text-xs text-gray-500 mt-1">
                          Inspection: {approval.inspectionStatus.charAt(0).toUpperCase() + approval.inspectionStatus.slice(1)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedApproval(approval)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View Details
                      </button>
                      
                      {approval.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(approval.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRequestInspection(approval.id)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Inspect
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <a href="#" className="font-medium text-gray-900">Payment Approved</a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Approved $40,000 payment for Brown Pool Installation - Shell Installation
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Today at 9:30 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <CheckSquare className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <a href="#" className="font-medium text-gray-900">Inspection Scheduled</a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Scheduled inspection for Wilson Basement Finishing - Framing Complete
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Today at 11:15 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              
              <li>
                <div className="relative pb-8">
                  <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                        <XCircle className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <a href="#" className="font-medium text-gray-900">Payment Rejected</a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Rejected $10,000 payment for Davis Bathroom Remodel - Plumbing Rough-In
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Yesterday at 2:45 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              
              <li>
                <div className="relative">
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="text-sm">
                          <a href="#" className="font-medium text-gray-900">New Payment Request</a>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Received $15,000 payment request for Johnson Kitchen Renovation - Cabinets Installed
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Yesterday at 10:30 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="mt-6">
            <a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              View All Activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Approval Detail Modal */}
      {selectedApproval && (
        <ApprovalDetail
          approval={selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestInspection={handleRequestInspection}
        />
      )}
    </div>
  );
};