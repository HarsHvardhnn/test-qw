import React, { useEffect, useState } from 'react';
import { Home, Package, ShoppingBag, Target, BarChart2, MessageSquare, Settings } from 'lucide-react';
import { QwilloLogo } from '../../components/QwilloLogo';
import { jwtDecode } from 'jwt-decode';

type PanelType = 'overview' | 'products' | 'services' | 'marketing' | 'orders' | 'analytics' | 'settings';

interface SideNavigationProps {
  activePanel: PanelType;
  onPanelChange: (panel: PanelType) => void;
  userData: any;
}

export const SideNavigation: React.FC<SideNavigationProps> = ({ 
  activePanel, 
  onPanelChange,
  userData
}) => {
 
  
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'services', label: 'Services', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-5 h-5" /> },
    { id: 'marketing', label: 'Marketing Plans', icon: <Target className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders & Leads', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'settings', label: 'Account Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="w-64 bg-white shadow-md flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* Company Info */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">{userData?.fullName}</h2>
        <p className="text-sm text-gray-500">Product Vendor Portal</p>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 px-4 pb-4 overflow-y-auto">
        <ul className="space-y-1 pt-4">
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
                <span className="whitespace-nowrap relative">
                  {item.label}
                  {/* Coming Soon Indicator - Positioned above text */}
                  {(item.id === 'orders' || item.id === 'analytics') && (
                    <span className="absolute -top-3 -right-16 px-2 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm whitespace-nowrap">
                      Coming Soon
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Qwillo Logo and Version */}
      <div className="px-4 pt-3 pb-4 border-t border-gray-200 bg-gray-50 text-center">
        <div className="w-32 h-8 mx-auto opacity-75">
          <QwilloLogo variant="full" />
        </div>
        <div className="mt-2 flex flex-col items-center justify-center space-y-1">
          <div className="px-2 py-0.5 bg-white/50 rounded-full">
            <span className="text-[10px] font-medium tracking-wider text-gray-600">
              VERSION 1.3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};