import React, { useState } from 'react';
import { Menu, Bell, Search, User, Settings, MessageSquare } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className={`relative mx-4 ${searchFocused ? 'flex-grow md:max-w-lg' : 'w-48 md:w-64'}`}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 rounded-md bg-gray-100 border-transparent focus:border-blue-500 focus:bg-white focus:ring-0 text-sm"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
            <MessageSquare className="h-5 w-5" />
          </button>
          
          <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
            <Settings className="h-5 w-5" />
          </button>
          
          <div className="border-l pl-4 border-gray-200">
            <button className="flex items-center text-sm focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
              <span className="ml-2 font-medium text-gray-700 hidden md:block">Nitesh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;