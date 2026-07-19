import { useQuery } from '@tanstack/react-query'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Activity,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import api from '../../services/api'

export default function AdminDashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard/admin')
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

  const kpiCards = dashboardData?.kpiCards || []
  const charts = dashboardData?.charts || {}
  const recentActivity = dashboardData?.recentActivity || []
  const liveFleet = dashboardData?.liveFleet || []

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  const getTrendClass = (trend: string) => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-slate-500'
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi: any, index: number) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">{kpi.title}</span>
              {getTrendIcon(kpi.trend)}
            </div>
            <div className="text-2xl font-bold text-slate-900">{kpi.value.toLocaleString()}</div>
            <div className={`text-sm mt-1 ${getTrendClass(kpi.trend)}`}>
              {kpi.change > 0 ? '+' : ''}{kpi.change} from last period
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Daily Trips</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={charts.dailyTrips?.data?.map((v: number, i: number) => ({
              name: charts.dailyTrips?.labels?.[i],
              value: v,
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">On-Time Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={charts.onTimePerformance?.data?.map((v: number, i: number) => ({
              name: charts.onTimePerformance?.labels?.[i],
              value: v,
            })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Fleet & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Live Fleet
          </h3>
          <div className="space-y-3">
            {liveFleet.map((bus: any) => (
              <div key={bus.busId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${bus.status === 'ON_TRIP' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                  <div>
                    <p className="font-medium text-slate-900">{bus.registrationNumber}</p>
                    <p className="text-sm text-slate-500">{bus.route}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{bus.speed} km/h</p>
                  <p className="text-xs text-slate-500">ETA: {bus.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'TRIP_START' ? 'bg-green-500' :
                  activity.type === 'ALERT' ? 'bg-red-500' :
                  activity.type === 'ATTENDANCE' ? 'bg-blue-500' : 'bg-slate-400'
                }`} />
                <div>
                  <p className="text-sm text-slate-800">{activity.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}