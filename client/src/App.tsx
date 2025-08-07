import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import FormBuilder from './pages/FormBuilder'
import FormPreview from './pages/FormPreview'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FormBuilder />} />
          <Route path="form/:id" element={<FormPreview />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App 