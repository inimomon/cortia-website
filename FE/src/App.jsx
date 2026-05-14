import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuditPage from './pages/AuditPage';
import AuditDetailPage from './pages/AuditDetailPage';
import FeaturePage from './pages/FeaturePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/feature' element={<FeaturePage />} />
        <Route path='/audit' element={<AuditPage /> } />
        <Route path="/audit/:id" element={<AuditDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
