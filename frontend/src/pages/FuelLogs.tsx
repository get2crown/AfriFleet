import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { fuelAPI } from '../services/api';

interface FuelLog {
  id: number;
  vehicle_id: number;
  fuel_date: string;
  fuel_type: string;
  quantity_liters: number;
  price_per_liter: number;
  total_cost: number;
  odometer_reading: number;
  fuel_station: string;
}

const FuelLogs: React.FC = () => {
  const [logs, setLogs] = useState<FuelLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFuelLogs();
  }, []);

  const fetchFuelLogs = async () => {
    try {
      const response = await fuelAPI.getAll();
      setLogs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching fuel logs:', err);
      setError('Failed to load fuel logs. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Fuel Logs
      </Typography>

      {logs.length === 0 ? (
        <Alert severity="info">No fuel logs found. Seed the database or add one via the API.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Vehicle ID</TableCell>
                <TableCell>Fuel Type</TableCell>
                <TableCell align="right">Liters</TableCell>
                <TableCell align="right">Price/L</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Station</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>{log.fuel_date}</TableCell>
                  <TableCell>{log.vehicle_id}</TableCell>
                  <TableCell>
                    <Chip label={log.fuel_type} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">{log.quantity_liters.toFixed(1)}</TableCell>
                  <TableCell align="right">₦{log.price_per_liter.toFixed(2)}</TableCell>
                  <TableCell align="right">₦{log.total_cost.toLocaleString()}</TableCell>
                  <TableCell>{log.fuel_station}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FuelLogs;