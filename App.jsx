import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Queue from './pages/Queue'
import CommentDetail from './pages/CommentDetail'
import Facebook from './pages/Facebook'
import Instagram from './pages/Instagram'
import LinkedIn from './pages/LinkedIn'
import TikTok from './pages/TikTok'
import AITraining from './pages/AITraining'
import ToneGroups from './pages/ToneGroups'
import Team from './pages/Team'
import Settings from './pages/Settings'

// Auth gate — redirects to /login if not authenticated
function RequireAuth({ children }) {
  const { user } = useWorkspace()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={
        <RequireAuth>
          <AppLayout />
        </RequireAuth>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="queue" element={<Queue />} />
        <Route path="queue/:id" element={<CommentDetail />} />
        <Route path="facebook" element={<Facebook />} />
        <Route path="instagram" element={<Instagram />} />
        <Route path="linkedin" element={<LinkedIn />} />
        <Route path="tiktok" element={<TikTok />} />
        <Route path="training" element={<AITraining />} />
        <Route path="tone-groups" element={<ToneGroups />} />
        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/:tab" element={<Settings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <WorkspaceProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </WorkspaceProvider>
  )
}
