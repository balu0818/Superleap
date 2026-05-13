import { NavLink } from 'react-router-dom';
import { Users, KanbanSquare, Settings, BarChart2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col h-full flex-shrink-0">
      <div className="p-4 flex items-center gap-2 border-b border-gray-100">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
          S
        </div>
        <span className="font-semibold text-lg tracking-tight">Superleap CRM</span>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Workspace</div>
        <nav className="space-y-1">
          <NavLink
            to="/leads"
            className={({isActive}) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
              isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Users className="w-4 h-4" />
            Leads
          </NavLink>
          <NavLink
            to="/board"
            className={({isActive}) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
              isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <KanbanSquare className="w-4 h-4" />
            Board
          </NavLink>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-gray-600 hover:bg-gray-100 mt-1 cursor-not-allowed opacity-60">
            <BarChart2 className="w-4 h-4" />
            Reports
          </a>
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">A</div>
          Admin User
        </button>
      </div>
    </div>
  );
}
