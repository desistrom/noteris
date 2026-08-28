import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Deeds from './pages/Deeds.jsx'
import DeedDetail from './pages/DeedDetail.jsx'
import CreateDeed from './pages/CreateDeed.jsx'
import Users from './pages/Users.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="deeds" element={<Deeds />} />
          <Route path="deeds/:id" element={<DeedDetail />} />
          <Route path="deeds/create" element={<CreateDeed />} />
          <Route path="users" element={<Users />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
