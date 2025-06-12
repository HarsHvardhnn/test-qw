import React from 'react';
import { CheckCircle, Calendar, XCircle, FileText, ArrowRight } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  return (
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
                        <a href="#" className="font-medium text-gray-900">Inspection Passed</a>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Johnson Kitchen Renovation - Framing Complete inspection passed
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
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <a href="#" className="font-medium text-gray-900">Inspection Scheduled</a>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Wilson Basement Finishing - Electrical Rough- In Rough-In inspection scheduled
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Yesterday at 11:15 AM</p>
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
                        <a href="#" className="font-medium text-gray-900">Inspection Failed</a>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Davis Bathroom Remodel - Plumbing Rough-In inspection failed
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>June 2, 2025 at 2:45 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            
            <li>
              <div className="relative">
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <a href="#" className="font-medium text-gray-900">Inspection Report Uploaded</a>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Thompson Roof Replacement - Final Inspection report uploaded
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>April 28, 2025 at 4:30 PM</p>
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
  );
};