import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import PublicLayout from './components/PublicLayout'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './components/LoginPage'
import PublicHome from './pages/PublicHome'
import PublicTeams from './pages/PublicTeams'
import TeamDetail from './pages/TeamDetail'
import AdminDashboard from './pages/AdminDashboard'
import TeamsManagement from './pages/TeamsManagement'
import NotesManagement from './pages/NotesManagement'
import EvaluationsManagement from './pages/EvaluationsManagement'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename="/uit">
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicHome />} />
            <Route path="/teams" element={<PublicTeams />} />
            <Route path="/teams/:teamId" element={<TeamDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="teams" element={<TeamsManagement />} />
            <Route path="notes" element={<NotesManagement />} />
            <Route path="evaluations" element={<EvaluationsManagement />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
