import { useQuery } from '@tanstack/react-query'
import { Bus,CreditCard, Bell, QrCode, User } from 'lucide-react'
import api from '../../services/api'

export default function StudentDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard/student')
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

  return (
    <div className="space-y-6">
      {/* Bus Status Card */}
      <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Your Bus is on the way!</h2>
            <p className="text-blue-100 mt-1">Arriving in {d.eta || '7 minutes'}</p>
          </div>
          <Bus className="w-12 h-12 text-blue-200" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-blue-200 text-sm">Next Stop</p>
            <p className="font-semibold">{d.nextStop || 'Koramangala'}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-blue-200 text-sm">Driver</p>
            <p className="font-semibold">{d.driverName || 'Suresh Patel'}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-blue-200 text-sm">Bus Number</p>
            <p className="font-semibold">{d.busNumber || 'KA-01-AB-1234'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* QR Pass */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-500" />
            Bus Pass
          </h3>
          <div className="bg-slate-100 rounded-lg p-6 flex flex-col items-center">
            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <QrCode className="w-24 h-24 text-slate-800" />
            </div>
            <p className="text-sm text-slate-500 mt-3">Scan at boarding</p>
            <p className="text-xs text-slate-400">Valid until Dec 31, 2026</p>
          </div>
        </div>

        {/* Attendance */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-green-500" />
            Attendance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Present</span>
              <span className="font-semibold text-green-600">{d.attendance?.present || 22} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Absent</span>
              <span className="font-semibold text-red-600">{d.attendance?.absent || 1} days</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
            <p className="text-sm text-slate-500 text-center">95% attendance rate</p>
          </div>
        </div>

        {/* Fee Status */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            Fee Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total Paid</span>
              <span className="font-semibold text-green-600">Rs.{d.feeStatus?.totalPaid || 15000}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Due Amount</span>
              <span className="font-semibold text-red-600">Rs.{d.feeStatus?.totalDue || 5000}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Last Payment</span>
              <span className="font-semibold">{d.feeStatus?.lastPayment || 'Jun 15, 2026'}</span>
            </div>
            <button className="w-full btn-primary mt-2">Pay Now</button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Notifications
        </h3>
        <div className="space-y-2">
          {(d.notifications || []).map((notif: any, i: number) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${notif.read ? 'bg-slate-50' : 'bg-blue-50'}`}>
              <div className={`w-2 h-2 rounded-full ${notif.read ? 'bg-slate-300' : 'bg-blue-500'}`} />
              <div className="flex-1">
                <p className={`text-sm ${notif.read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>{notif.title}</p>
                <p className="text-xs text-slate-400">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}