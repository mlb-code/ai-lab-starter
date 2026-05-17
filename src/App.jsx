import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProgressProvider } from './context/ProgressContext.jsx'
import { CourseProvider } from './context/CourseContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Presentation from './components/Presentation.jsx'
import Community from './pages/Community.jsx'
import AIToolsIndex from './pages/AIToolsIndex.jsx'
import AIToolDetail from './pages/AIToolDetail.jsx'
import DevToolsIndex from './pages/DevToolsIndex.jsx'
import DevToolDetail from './pages/DevToolDetail.jsx'
import Setup from './pages/Setup.jsx'
import SystemRequirements from './pages/SystemRequirements.jsx'
import Prompts from './pages/Prompts.jsx'
import Glossary from './pages/Glossary.jsx'
import Projects from './pages/Projects.jsx'
import Library from './pages/Library.jsx'

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <CourseProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/lessons/:id" element={<ProtectedRoute><Presentation /></ProtectedRoute>} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/tools/ai" element={<AIToolsIndex />} />
            <Route path="/tools/ai/:id" element={<AIToolDetail />} />
            <Route path="/tools/dev" element={<DevToolsIndex />} />
            <Route path="/tools/dev/:id" element={<DevToolDetail />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/system-requirements" element={<SystemRequirements />} />
            <Route path="/prompts" element={<Prompts />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/library" element={<Library />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </CourseProvider>
      </ProgressProvider>
    </AuthProvider>
  )
}
