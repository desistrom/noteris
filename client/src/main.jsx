import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import App from './App.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Deeds from './pages/Deeds.jsx'
import DeedDetail from './pages/DeedDetail.jsx'
import CreateDeed from './pages/CreateDeed.jsx'
import Users from './pages/Users.jsx'
import Templates from './pages/Templates.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="deeds" element={<Deeds />} />
            <Route path="deeds/:id" element={<DeedDetail />} />
            <Route path="deeds/create" element={<CreateDeed />} />
            <Route path="templates" element={<Templates />} />
            <Route path="users" element={<Users />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
