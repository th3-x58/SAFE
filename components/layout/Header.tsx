
import React from 'react';
import { SearchIcon, UserCircleIcon } from '../../lib/icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 px-8 bg-white border-b border-gray-200 shrink-0">
      <div className="relative flex-1 max-w-xl">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search transactions, goals..."
          className="w-full h-10 pl-10 pr-4 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center ml-6">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <UserCircleIcon className="h-8 w-8 text-gray-600" />
          <span className="sr-only">User menu</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
