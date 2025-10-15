import React from 'react';
import { cn } from '../../lib/utils';
import { Page } from '../../App';
import { DashboardIcon, TransactionsIcon, BudgetsIcon, GoalsIcon, InvestmentsIcon, FinancialOutlineIcon, LogoIcon, ChevronLeftIcon, ChevronRightIcon } from '../../lib/icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
}

const navItems: { name: Page; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { name: 'Insights', icon: DashboardIcon },
  { name: 'Transactions', icon: TransactionsIcon },
  { name: 'Budgets', icon: BudgetsIcon },
  { name: 'Goals', icon: GoalsIcon },
  { name: 'Investments', icon: InvestmentsIcon },
  { name: 'Financial Outline', icon: FinancialOutlineIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isCollapsed, setCollapsed }) => {
  return (
    <aside className={cn(
      "fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out z-40",
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      <div className="flex items-center h-16 px-6 border-b border-gray-200 shrink-0">
        <LogoIcon className="h-8 w-8 text-teal-950" />
        <span className={cn(
          "ml-3 text-xl font-bold text-gray-800 transition-opacity duration-200",
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
                  'w-full flex items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-teal-50 hover:text-teal-950 transition-colors duration-200',
                  { 'bg-teal-100 text-teal-950 font-semibold': currentPage === item.name },
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
      <div className="px-4 py-4 border-t border-gray-200">
        <button 
          onClick={() => setCollapsed(!isCollapsed)} 
          className="w-full flex items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100 justify-center"
        >
          {isCollapsed ? <ChevronRightIcon className="h-6 w-6"/> : <ChevronLeftIcon className="h-6 w-6"/>}
          <span className="sr-only">{isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;