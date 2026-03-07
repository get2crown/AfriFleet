import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import { vehicleAPI, maintenanceAPI, fuelAPI } from '../services/api';

const Reports: React.FC = () => {
  const [stats, setStats] = useState({
    vehicles: 0,
    maintenance: 0,
    fuel: 0,
    totalFuelCost: 0,
    totalMaintenanceCost: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [vehiclesRes, maintenanceRes, fuelRes] = await Promise.all([
        vehicleAPI.getAll(),
        maintenanceAPI.getAll(),
        fuelAPI.getAll(),
      ]);

      const totalFuelCost = fuelRes.data.reduce((sum: number, f: any) => sum + f.total_cost, 0);
      const totalMaintenanceCost = maintenanceRes.data.reduce((sum: number, m: any) => {
        // Sum task costs if needed; for simplicity, we'll just count issues
        return sum + (m.tasks?.reduce((tsum: number, t: any) => tsum + t.cost_estimate, 0) || 0);
      }, 0);

      setStats({
        vehicles: vehiclesRes.data.length,
        maintenance: maintenanceRes.data.length,
        fuel: fuelRes.data.length,
        totalFuelCost,
        totalMaintenanceCost,
      });
      setError(null);
    } catch (err) {
      setError('Failed to load report data.');
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
        Reports Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Vehicles
              </Typography>
              <Typography variant="h3">{stats.vehicles}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Maintenance Issues
              </Typography>
              <Typography variant="h3">{stats.maintenance}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Fuel Logs
              </Typography>
              <Typography variant="h3">{stats.fuel}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Fuel Cost
              </Typography>
              <Typography variant="h6">₦{stats.totalFuelCost.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Maint. Cost
              </Typography>
              <Typography variant="h6">₦{stats.totalMaintenanceCost.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;