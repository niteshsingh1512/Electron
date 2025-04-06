import React, { useState } from 'react';
import { Menu, User } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const [showUserProfile, setShowUserProfile] = useState(false);

  const userInfo = {
    name: "Nitesh",
    email: "nitesh@example.com"
  };

  return (
    <header className="bg-white shadow-sm z-20 border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="ml-4">
            <h1 className="text-lg font-semibold text-gray-800">Electron</h1>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative">
            <button
              className="flex items-center text-sm focus:outline-none hover:bg-gray-100 p-2 rounded-lg"
              onClick={() => setShowUserProfile(!showUserProfile)}
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
              <span className="ml-2 font-medium text-gray-700 hidden md:block">{userInfo.name}</span>
            </button>

            {/* User Profile Dropdown - Simplified */}
            {showUserProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-3 z-50 border border-gray-200">
                <div className="px-4">
                  <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                  <p className="text-sm font-normal text-gray-500 truncate">{userInfo.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;