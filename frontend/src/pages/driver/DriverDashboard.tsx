import { useQuery } from '@tanstack/react-query'
import { Bus, Users, QrCode, AlertTriangle, Navigation, Fuel, Gauge } from 'lucide-react'
import api from '../../services/api'

export default function DriverDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['driver-dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard/driver')
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
      {/* Trip Status */}
      <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{d.todayRoute?.name || 'Route A - Morning'}</h2>
            <p className="text-blue-100 mt-1">
              {d.todayRoute?.completed || 3} of {d.todayRoute?.stops || 8} stops completed
            </p>
          </div>
          <Bus className="w-12 h-12 text-blue-200" />
        </div>
        <div className="mt-4 flex gap-4">
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors">
            Start Trip
          </button>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors">
            Pause
          </button>
          <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors">
            End Trip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-slate-500">Passengers</p>
              <p className="text-2xl font-bold">{d.currentTrip?.passengers || 42}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <Gauge className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-slate-500">Avg Speed</p>
              <p className="text-2xl font-bold">{d.metrics?.avgSpeed || 38} km/h</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <Fuel className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-slate-500">Fuel Used</p>
              <p className="text-2xl font-bold">{d.metrics?.fuel || 3.2} L</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <Navigation className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-slate-500">Distance</p>
              <p className="text-2xl font-bold">{d.metrics?.distance || 12.5} km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger List & QR Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Passenger List
          </h3>
          <div className="space-y-2">
            {(d.passengerList || []).map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${p.status === 'BOARDED' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="font-medium text-slate-800">{p.name}</span>
                </div>
                <span className="text-sm text-slate-500">{p.stop}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-500" />
            QR Scanner
          </h3>
          <div className="bg-slate-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
            <QrCode className="w-16 h-16 text-slate-400 mb-4" />
            <p className="text-slate-500">Point camera at student QR code</p>
            <button className="btn-primary mt-4">Open Scanner</button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Alerts
        </h3>
        <div className="space-y-2">
          {(d.alerts || []).map((alert: any, i: number) => (
            <div key={i} className={`p-3 rounded-lg ${
              alert.severity === 'WARNING' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
            }`}>
              <p className={`text-sm font-medium ${
                alert.severity === 'WARNING' ? 'text-yellow-800' : 'text-blue-800'
              }`}>{alert.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}