import { useQuery } from '@tanstack/react-query'
import { MapPin, Bell, CreditCard, User, Bus, Clock } from 'lucide-react'
import api from '../../services/api'

export default function ParentDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['parent-dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard/parent')
      return response.data.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const d = data || {}
  const children = d.children || []

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">My Children</h2>

      {children.map((child: any, index: number) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{child.name}</h3>
                <p className="text-sm text-slate-500">Class 10-A • Roll No: 42</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              child.status === 'ON_TRIP' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {child.status === 'ON_TRIP' ? 'On Trip' : 'At School'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bus className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">Bus Location</span>
              </div>
              <p className="text-sm text-slate-600">{child.nextStop || 'Approaching stop'}</p>
              <p className="text-xs text-slate-400 mt-1">ETA: {child.eta || '5 min'}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-slate-700">Boarded At</span>
              </div>
              <p className="text-sm text-slate-600">{child.boardedAt || '07:30 AM'}</p>
              <p className="text-xs text-slate-400 mt-1">Stop: {child.lastStop || 'Koramangala'}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-slate-700">Next Stop</span>
              </div>
              <p className="text-sm text-slate-600">{child.nextStop || 'Tech Campus'}</p>
              <p className="text-xs text-slate-400 mt-1">Arriving in {child.eta || '7 min'}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Fee Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-500" />
          Fee Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">Total Due</p>
            <p className="text-2xl font-bold text-red-600">Rs.{d.feeSummary?.totalDue || 5000}</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">Total Paid</p>
            <p className="text-2xl font-bold text-green-600">Rs.{d.feeSummary?.totalPaid || 15000}</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">Upcoming Due</p>
            <p className="text-2xl font-bold text-blue-600">{d.feeSummary?.upcomingDue || 'Aug 15'}</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Recent Notifications
        </h3>
        <div className="space-y-2">
          {(d.notifications || []).map((notif: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                notif.type === 'BOARDING' ? 'bg-green-500' :
                notif.type === 'ARRIVAL' ? 'bg-blue-500' : 'bg-slate-400'
              }`} />
              <div>
                <p className="text-sm text-slate-800">{notif.title}</p>
                <p className="text-xs text-slate-400">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}