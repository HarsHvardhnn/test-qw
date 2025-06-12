import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Download, 
  Share, 
  Printer, 
  Link as LinkIcon,
  FileText,
  CheckSquare,
  Camera,
  AlertCircle,
  User,
  MapPin,
  Briefcase,
  Home,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Inspection } from './types';

interface InspectionDetailModalProps {
  inspection: Inspection;
  onClose: () => void;
  onApprove: (id: string) => void;
  onFail: (id: string, reason: string) => void;
  onReschedule: (id: string, date: string) => void;
}

export const InspectionDetailModal: React.FC<InspectionDetailModalProps> = ({ 
  inspection, 
  onClose,
  onApprove,
  onFail,
  onReschedule
}) => {
  const [failReason, setFailReason] = useState('');
  const [showFailForm, setShowFailForm] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    details: true,
    checklist: true,
    issues: true,
    photos: true,
    conclusion: true
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleFail = () => {
    if (failReason.trim()) {
      onFail(inspection.id, failReason);
      setShowFailForm(false);
    }
  };

  const handleReschedule = () => {
    if (newDate) {
      onReschedule(inspection.id, newDate);
      setShowRescheduleForm(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF or other document format
    alert('Report download started');
  };

  const handleShare = () => {
    // In a real app, this would open a sharing dialog
    alert('Sharing options opened');
  };

  const handleCopyLink = () => {
    // In a real app, this would copy a link to the clipboard
    alert('Link copied to clipboard');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // If we have a report, show the report view
  if (inspection.report) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
          </div>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Inspection Report</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Print Report"
                >
                  <Printer className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Download Report"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Share Report"
                >
                  <Share className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Copy Link"
                >
                  <LinkIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Report Content */}
            <div className="bg-white p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Report Header */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                      <FileText className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{inspection.projectName}</h2>
                        <p className="text-gray-600">{inspection.milestone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        inspection.status === 'completed' ? 'bg-green-100 text-green-800' :
                        inspection.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {inspection.status === 'completed' ? 'Passed' : 
                         inspection.status === 'failed' ? 'Failed' : 
                         inspection.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Inspection Date</p>
                          <p className="text-sm text-gray-900">{formatDate(inspection.report.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Inspector</p>
                          <p className="text-sm text-gray-900">{inspection.inspector}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Briefcase className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Contractor</p>
                          <p className="text-sm text-gray-900">{inspection.contractor}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Home className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Project</p>
                          <p className="text-sm text-gray-900">{inspection.projectName}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p className="text-sm text-gray-900">{inspection.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <CheckSquare className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Milestone</p>
                          <p className="text-sm text-gray-900">{inspection.milestone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inspector Notes */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('details')}
                  >
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      Inspector Notes
                    </h3>
                    {expandedSections.details ? 
                      <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    }
                  </div>
                  
                  {expandedSections.details && (
                    <div className="p-6 bg-white">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-700">{inspection.report.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Inspection Checklist */}
                {inspection.report.checklist && inspection.report.checklist.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection('checklist')}
                    >
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <CheckSquare className="h-5 w-5 text-blue-600 mr-2" />
                        Inspection Checklist
                      </h3>
                      {expandedSections.checklist ? 
                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      }
                    </div>
                    
                    {expandedSections.checklist && (
                      <div className="p-6 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {inspection.report.checklist.map(item => (
                            <div 
                              key={item.id} 
                              className={`p-4 rounded-lg border ${
                                item.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                              }`}
                            >
                              <div className="flex items-start">
                                {item.passed ? (
                                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                                )}
                                <div>
                                  <p className={`text-sm font-medium ${
                                    item.passed ? 'text-green-800' : 'text-red-800'
                                  }`}>
                                    {item.name}
                                  </p>
                                  {item.notes && (
                                    <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Issues Found */}
                {inspection.report.issues && inspection.report.issues.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection('issues')}
                    >
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        Issues Found
                      </h3>
                      {expandedSections.issues ? 
                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      }
                    </div>
                    
                    {expandedSections.issues && (
                      <div className="p-6 bg-white">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <ul className="space-y-2">
                            {inspection.report.issues.map((issue, index) => (
                              <li key={index} className="flex items-start">
                                <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Inspection Photos */}
                {inspection.report.photos && inspection.report.photos.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection('photos')}
                    >
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Camera className="h-5 w-5 text-blue-600 mr-2" />
                        Inspection Photos
                      </h3>
                      {expandedSections.photos ? 
                        <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      }
                    </div>
                    
                    {expandedSections.photos && (
                      <div className="p-6 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {inspection.report.photos.map((photo, index) => (
                            <div key={index} className="group relative">
                              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                                <img 
                                  src={photo} 
                                  alt={`Inspection photo ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex space-x-2">
                                  <button 
                                    className="p-1 bg-white rounded-full"
                                    title="View Full Size"
                                    onClick={() => window.open(photo, '_blank')}
                                  >
                                    <LinkIcon className="h-4 w-4 text-gray-700" />
                                  </button>
                                  <button 
                                    className="p-1 bg-white rounded-full"
                                    title="Download"
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = photo;
                                      link.download = `inspection-photo-${index + 1}.jpg`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }}
                                  >
                                    <Download className="h-4 w-4 text-gray-700" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Conclusion */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleSection('conclusion')}
                  >
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      {inspection.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      Conclusion
                    </h3>
                    {expandedSections.conclusion ? 
                      <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    }
                  </div>
                  
                  {expandedSections.conclusion && (
                    <div className="p-6 bg-white">
                      <div className={`p-4 rounded-lg border ${
                        inspection.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}>
                        <p className={`text-lg font-medium ${
                          inspection.status === 'completed' ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {inspection.status === 'completed' 
                            ? 'Inspection Passed' 
                            : 'Inspection Failed - Corrections Required'}
                        </p>
                        <p className="text-gray-700 mt-2">
                          {inspection.status === 'completed'
                            ? 'All work meets required standards and specifications. Milestone payment can be released.'
                            : 'The inspection has failed due to the issues noted above. Corrections must be made before requesting a re-inspection.'}
                        </p>
                        
                        {/* Digital Signature */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Inspector Signature</p>
                              <p className="text-base font-medium text-gray-900">{inspection.inspector}</p>
                              <p className="text-sm text-gray-500">{formatDate(inspection.report.date)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-500">Report ID</p>
                              <p className="text-base font-medium text-gray-900">{inspection.report.id}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no report, show the inspection details view
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
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center justify-between">
                  <span>Inspection Details</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    inspection.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    inspection.status === 'completed' ? 'bg-green-100 text-green-800' :
                    inspection.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                  </span>
                </h3>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Project:</span>
                      <span className="font-medium text-gray-900">{inspection.projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Milestone:</span>
                      <span className="font-medium text-gray-900">{inspection.milestone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contractor:</span>
                      <span className="font-medium text-gray-900">{inspection.contractor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address:</span>
                      <span className="font-medium text-gray-900">{inspection.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Inspector:</span>
                      <span className="font-medium text-gray-900">{inspection.inspector || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Scheduled Date:</span>
                      <span className="font-medium text-gray-900">{formatDate(inspection.scheduledDate)}</span>
                    </div>
                  </div>
                </div>

                {showFailForm && (
                  <div className="mt-4">
                    <label htmlFor="fail-reason" className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Failure
                    </label>
                    <textarea
                      id="fail-reason"
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                      value={failReason}
                      onChange={(e) => setFailReason(e.target.value)}
                      placeholder="Please provide details about the inspection failure..."
                    />
                  </div>
                )}

                {showRescheduleForm && (
                  <div className="mt-4">
                    <label htmlFor="new-date" className="block text-sm font-medium text-gray-700 mb-1">
                      New Inspection Date
                    </label>
                    <input
                      type="date"
                      id="new-date"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md text-gray-900"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {inspection.status === 'scheduled' && !showFailForm && !showRescheduleForm && (
              <>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => onApprove(inspection.id)}
                >
                  Mark as Passed
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowFailForm(true)}
                >
                  Mark as Failed
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRescheduleForm(true)}
                >
                  Reschedule
                </button>
              </>
            )}
            
            {showFailForm && (
              <>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleFail}
                >
                  Confirm Failure
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowFailForm(false)}
                >
                  Cancel
                </button>
              </>
            )}

            {showRescheduleForm && (
              <>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleReschedule}
                >
                  Confirm Reschedule
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRescheduleForm(false)}
                >
                  Cancel
                </button>
              </>
            )}
            
            {!showFailForm && !showRescheduleForm && (
              <button
                type="button"
                className={`${inspection.status === 'scheduled' ? 'ml-3' : ''} inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm`}
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