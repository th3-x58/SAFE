
import React from 'react';
import { SearchIcon, UserCircleIcon } from '../../lib/icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 px-8 bg-sky-100 border-b border-sky-200 shrink-0">
      <div className="relative flex-1 max-w-xl">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search transactions, goals..."
          className="w-full h-10 pl-10 pr-4 bg-sky-50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center ml-6">
        <button className="p-2 rounded-full hover:bg-sky-200">
          <UserCircleIcon className="h-8 w-8 text-sky-800" />
          <span className="sr-only">User menu</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
