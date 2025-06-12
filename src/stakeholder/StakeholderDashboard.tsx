import React, { useState } from 'react';
import { QwilloLogo } from '../components/QwilloLogo';
import { SideNavigation } from './components/SideNavigation';
import { OverviewPanel } from './components/OverviewPanel';
import { ProjectsPanel } from './components/projects/ProjectsPanel';
import { ApprovalsPanel } from './components/ApprovalsPanel';
import { InspectionsPanel } from './components/InspectionsPanel';
import { MessagesPanel } from './components/MessagesPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { NotificationsPanel } from './components/NotificationsPanel';
import { UserMenu } from './components/UserMenu';

type PanelType = 'overview' | 'projects' | 'approvals' | 'inspections' | 'messages' | 'settings';

export const StakeholderDashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const renderPanel = () => {
    switch (activePanel) {
      case 'overview':
        return <OverviewPanel onPanelChange={handlePanelChange} />;
      case 'projects':
        return <ProjectsPanel onPanelChange={handlePanelChange} />;
      case 'approvals':
        return <ApprovalsPanel />;
      case 'inspections':
        return <InspectionsPanel />;
      case 'messages':
        return <MessagesPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <OverviewPanel onPanelChange={handlePanelChange} />;
    }
  };

  const handlePanelChange = (panel: string) => {
    setActivePanel(panel as PanelType);
  };

  const handleNotificationNavigate = (panel: string) => {
    setActivePanel(panel as PanelType);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Side Navigation */}
      <SideNavigation 
        activePanel={activePanel} 
        onPanelChange={setActivePanel} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center">
            <div className="w-32 h-8">
              <QwilloLogo variant="full" />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            <UserMenu onSettingsClick={() => setActivePanel('settings')} />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderPanel()}
        </main>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationsPanel 
          onClose={() => setShowNotifications(false)} 
          onNavigate={handleNotificationNavigate}
        />
      )}
    </div>
  );
};