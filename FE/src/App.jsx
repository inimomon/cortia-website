import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuditPage from './pages/AuditPage';
import AuditDetailPage from './pages/AuditDetailPage';
import FeaturePage from './pages/FeaturePage';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import DetailProv from './pages/DetailProv';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/feature' element={<FeaturePage />} />
        <Route path='/analisa' element={<AuditPage /> } />
        <Route path="/analisa/:id" element={<AuditDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path='/explore' element={<ExplorePage />} />
        <Route path='/detail-prov/:id' element={<DetailProv />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
