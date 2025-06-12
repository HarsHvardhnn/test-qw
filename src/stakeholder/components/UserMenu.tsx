import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User } from 'lucide-react';

interface UserMenuProps {
  onSettingsClick?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onSettingsClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
    setIsOpen(false);
    // Navigate to settings page
    window.location.href = '#settings';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
          JD
        </div>
        <span className="text-sm font-medium text-gray-700">John Doe</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <a
            href="#profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="w-4 h-4 mr-2" />
            Your Profile
          </a>
          <button
            onClick={handleSettingsClick}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <a
            href="#logout"
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </a>
        </div>
      )}
    </div>
  );
};