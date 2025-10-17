import React from 'react';
import { cn } from '../../lib/utils';
import { Page } from '../../App';
import { DashboardIcon, TransactionsIcon, BudgetsIcon, GoalsIcon, InvestmentsIcon, SparklesIcon, LogoIcon, ChevronLeftIcon, ChevronRightIcon, UserCircleIcon, LogoutIcon } from '../../lib/icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
  onLogout: () => void;
}

const navItems: { name: Page; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { name: 'Insights', icon: DashboardIcon },
  { name: 'Transactions', icon: TransactionsIcon },
  { name: 'Budgets', icon: BudgetsIcon },
  { name: 'Goals', icon: GoalsIcon },
  { name: 'Investments', icon: InvestmentsIcon },
  { name: 'AI Chat', icon: SparklesIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isCollapsed, setCollapsed, onLogout }) => {
  return (
    <aside className={cn(
      "fixed top-0 left-0 h-full bg-sky-100 border-r border-sky-200 flex flex-col transition-all duration-300 ease-in-out z-40",
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      <div className="flex items-center h-16 px-6 border-b border-sky-200 shrink-0">
        <LogoIcon className="h-8 w-8 text-sky-900" />
        <span className={cn(
          "ml-3 text-xl font-bold text-sky-900 transition-opacity duration-200",
          isCollapsed ? 'opacity-0' : 'opacity-100'
        )}>
          SAFE
        </span>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => setCurrentPage(item.name)}
                className={cn(
                  'w-full flex items-center h-12 px-4 rounded-lg text-sky-800 hover:bg-sky-200 hover:text-sky-900 transition-colors duration-200',
                  { 'bg-sky-300 text-sky-900 font-semibold': currentPage === item.name },
                  isCollapsed ? 'justify-center' : ''
                )}
              >
                <item.icon className="h-6 w-6 shrink-0" />
                <span className={cn(
                  "ml-4 transition-opacity",
                  isCollapsed ? 'sr-only' : 'opacity-100'
                )}>
                  {item.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile and Logout Section */}
      <div className="px-4 py-4 border-t border-sky-200">
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : ""
        )}>
          <UserCircleIcon className="h-10 w-10 text-sky-800 shrink-0" />
          <div className={cn(
            "ml-3 transition-opacity",
            isCollapsed ? "sr-only" : "opacity-100"
          )}>
            <p className="font-semibold text-sky-900 text-sm">Tims</p>
            <p className="text-xs text-sky-700">Age: 21</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center h-12 mt-4 px-4 rounded-lg text-sky-800 hover:bg-red-50 hover:text-red-700 transition-colors duration-200",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogoutIcon className="h-6 w-6 shrink-0" />
          <span className={cn(
            "ml-4 transition-opacity",
            isCollapsed ? "sr-only" : "opacity-100"
          )}>
            Logout
          </span>
        </button>
      </div>

      <div className="px-4 py-4 border-t border-sky-200">
        <button 
          onClick={() => setCollapsed(!isCollapsed)} 
          className="w-full flex items-center h-12 px-4 rounded-lg text-sky-800 hover:bg-sky-200 justify-center"
        >
          {isCollapsed ? <ChevronRightIcon className="h-6 w-6"/> : <ChevronLeftIcon className="h-6 w-6"/>}
          <span className="sr-only">{isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;