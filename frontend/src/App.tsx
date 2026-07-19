import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentDashboard from './pages/student/StudentDashboard'
import ParentDashboard from './pages/parent/ParentDashboard'
import DriverDashboard from './pages/driver/DriverDashboard'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Login />
  }

  const getDashboard = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
      case 'COLLEGE_ADMIN':
      case 'TRANSPORT_MANAGER':
      case 'ACCOUNTANT':
      case 'SECURITY_GUARD':
        return <AdminDashboard />
      case 'STUDENT':
        return <StudentDashboard />
      case 'PARENT':
        return <ParentDashboard />
      case 'DRIVER':
        return <DriverDashboard />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={getDashboard()} />
        <Route path="/dashboard" element={getDashboard()} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App