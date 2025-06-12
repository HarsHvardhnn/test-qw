import React from 'react';
import { Home, FileText, DollarSign, CheckSquare, MessageSquare, Settings } from 'lucide-react';

type PanelType = 'overview' | 'projects' | 'approvals' | 'inspections' | 'messages' | 'settings';

interface SideNavigationProps {
  activePanel: PanelType;
  onPanelChange: (panel: PanelType) => void;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ 
  activePanel, 
  onPanelChange 
}) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FileText className="w-5 h-5" /> },
    { id: 'approvals', label: 'Approvals & Funds', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'inspections', label: 'Inspections', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800">First National Bank</h2>
        <p className="text-sm text-gray-500">Stakeholder Portal</p>
      </div>
      
      <nav className="flex-1 px-4 pb-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPanelChange(item.id as PanelType)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activePanel === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={activePanel === item.id ? 'text-blue-600' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
                
                {/* Indicator for pending items */}
                {item.id === 'approvals' && (
                  <span className="ml-auto bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    4
                  </span>
                )}
                {item.id === 'messages' && (
                  <span className="ml-auto bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            JD
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700">John Doe</div>
            <div className="text-xs text-gray-500">Loan Officer</div>
          </div>
        </div>
      </div>
    </div>
  );
};