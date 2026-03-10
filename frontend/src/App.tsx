// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Maintenance from './pages/Maintenance';
import FuelLogs from './pages/FuelLogs';
import Reports from './pages/Reports';
import Approvals from './pages/Approvals';
import CreateMaintenance from './pages/CreateMaintenance';
import CreateFuelLog from './pages/CreateFuelLog';
import DriverComplaint from './pages/DriverComplaint';
import { theme } from './styles/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/vehicles" element={
              <ProtectedRoute requiredRole={['admin', 'ceo', 'fleet_manager', 'logistics_officer']}>
                <Layout>
                  <Vehicles />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/maintenance" element={
              <ProtectedRoute requiredRole={['admin', 'ceo', 'fleet_manager', 'logistics_officer', 'technician']}>
                <Layout>
                  <Maintenance />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/maintenance/new" element={
              <ProtectedRoute requiredRole={['admin', 'fleet_manager', 'logistics_officer']}>
                <Layout>
                  <CreateMaintenance />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/driver/complaint" element={
              <ProtectedRoute requiredRole={['driver']}>
                <Layout>
                  <DriverComplaint />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/fuel" element={
              <ProtectedRoute requiredRole={['admin', 'ceo', 'fleet_manager', 'logistics_officer']}>
                <Layout>
                  <FuelLogs />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/fuel/new" element={
              <ProtectedRoute requiredRole={['admin', 'fleet_manager', 'logistics_officer']}>
                <Layout>
                  <CreateFuelLog />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/reports" element={
              <ProtectedRoute requiredRole={['admin', 'ceo', 'fleet_manager']}>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            } />

            <Route path="/approvals" element={
              <ProtectedRoute requiredRole={['admin', 'ceo']}>
                <Layout>
                  <Approvals />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
      <ToastContainer position="top-right" />
    </ThemeProvider>
  );
}

export default App;