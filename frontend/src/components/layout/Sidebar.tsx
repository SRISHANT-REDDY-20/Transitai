import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Bus,
  Route,
  Users,
  CreditCard,
  Wrench,
  AlertTriangle,
  Bell,
  MapPin,
  Settings,
  ChevronLeft,
  ChevronRight,
  QrCode,
  BarChart3,
} from 'lucide-react'

interface SidebarProps {
  userRole?: string
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER', 'ACCOUNTANT', 'SECURITY_GUARD'] },
  { icon: Bus, label: 'Fleet', path: '/fleet', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER'] },
  { icon: Route, label: 'Routes', path: '/routes', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER'] },
  { icon: Users, label: 'Users', path: '/users', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'] },
  { icon: QrCode, label: 'Attendance', path: '/attendance', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER', 'SECURITY_GUARD'] },
  { icon: CreditCard, label: 'Fees', path: '/fees', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'ACCOUNTANT'] },
  { icon: Wrench, label: 'Maintenance', path: '/maintenance', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER'] },
  { icon: AlertTriangle, label: 'Complaints', path: '/complaints', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER'] },
  { icon: MapPin, label: 'Live Tracking', path: '/tracking', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER', 'SECURITY_GUARD'] },
  { icon: BarChart3, label: 'Analytics', path: '/analytics', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER'] },
  { icon: Bell, label: 'Notifications', path: '/notifications', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'TRANSPORT_MANAGER', 'ACCOUNTANT'] },
  { icon: Settings, label: 'Settings', path: '/settings', roles: ['SUPER_ADMIN', 'COLLEGE_ADMIN'] },
]

export default function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const filteredItems = menuItems.filter(item => 
    !userRole || item.roles.includes(userRole)
  )

  return (
    <aside className={`bg-slate-900 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Bus className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold">TransitAI</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}