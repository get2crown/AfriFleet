// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { theme } from './styles/theme';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingProvider } from './contexts/LoadingContext';

import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Maintenance from './pages/Maintenance';
import FuelLogs from './pages/FuelLogs';
import Reports from './pages/Reports';
import Approvals from './pages/Approvals';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingProvider>
        <ErrorBoundary>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/fuel" element={<FuelLogs />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/approvals" element={<Approvals />} />
              </Routes>
            </Layout>
          </Router>
          <ToastContainer position="top-right" />
        </ErrorBoundary>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
