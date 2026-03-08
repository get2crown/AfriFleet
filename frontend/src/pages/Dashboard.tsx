import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  LocalGasStation as FuelIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import { vehicleAPI, maintenanceAPI, fuelAPI, approvalsAPI } from '../services/api';

interface DashboardStats {
  vehicles: {
    total: number;
    active: number;
    maintenance: number;
  };
  maintenance: {
    total: number;
    open: number;
    critical: number;
    pendingApproval: number;
  };
  fuel: {
    totalLiters: number;
    totalCost: number;
    avgPrice: number;
  };
  recentIssues: any[];
  recentFuel: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    vehicles: { total: 0, active: 0, maintenance: 0 },
    maintenance: { total: 0, open: 0, critical: 0, pendingApproval: 0 },
    fuel: { totalLiters: 0, totalCost: 0, avgPrice: 0 },
    recentIssues: [],
    recentFuel: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all required data in parallel
      const [vehiclesRes, maintenanceRes, fuelRes, approvalsRes] = await Promise.all([
        vehicleAPI.getAll(),
        maintenanceAPI.getAll(),
        fuelAPI.getAll(),
        approvalsAPI.getPending(),
      ]);

      const vehicles = vehiclesRes.data;
      const maintenance = maintenanceRes.data;
      const fuel = fuelRes.data;
      const pendingApprovals = approvalsRes.data;

      // Calculate vehicle stats
      const activeVehicles = vehicles.filter((v: any) => v.status === 'active').length;
      const maintenanceVehicles = vehicles.filter((v: any) => v.status === 'maintenance').length;

      // Calculate maintenance stats
      const openIssues = maintenance.filter((m: any) => m.status !== 'completed').length;
      const criticalIssues = maintenance.filter((m: any) => m.priority === 'critical' && m.status !== 'completed').length;
      const pendingApprovalCount = pendingApprovals.length;

      // Calculate fuel stats
      const totalLiters = fuel.reduce((sum: number, f: any) => sum + f.quantity_liters, 0);
      const totalCost = fuel.reduce((sum: number, f: any) => sum + f.total_cost, 0);
      const avgPrice = fuel.length > 0 ? totalCost / totalLiters : 0;

      // Get recent items (last 5)
      const recentIssues = [...maintenance]
        .sort((a, b) => new Date(b.reported_date).getTime() - new Date(a.reported_date).getTime())
        .slice(0, 5);
      const recentFuel = [...fuel]
        .sort((a, b) => new Date(b.fuel_date).getTime() - new Date(a.fuel_date).getTime())
        .slice(0, 5);

      setStats({
        vehicles: {
          total: vehicles.length,
          active: activeVehicles,
          maintenance: maintenanceVehicles,
        },
        maintenance: {
          total: maintenance.length,
          open: openIssues,
          critical: criticalIssues,
          pendingApproval: pendingApprovalCount,
        },
        fuel: {
          totalLiters,
          totalCost,
          avgPrice,
        },
        recentIssues,
        recentFuel,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please check backend connection.');
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
      <Typography variant="h4" fontWeight={600} mb={3}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Vehicles
                  </Typography>
                  <Typography variant="h4">{stats.vehicles.total}</Typography>
                </Box>
                <CarIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </Box>
              <Box mt={1}>
                <Chip size="small" label={`${stats.vehicles.active} active`} color="success" sx={{ mr: 1 }} />
                <Chip size="small" label={`${stats.vehicles.maintenance} in maint.`} color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Open Issues
                  </Typography>
                  <Typography variant="h4">{stats.maintenance.open}</Typography>
                </Box>
                <BuildIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
              </Box>
              <Box mt={1}>
                <Chip size="small" label={`${stats.maintenance.critical} critical`} color="error" sx={{ mr: 1 }} />
                <Chip size="small" label={`${stats.maintenance.pendingApproval} pending`} color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Fuel Consumption
                  </Typography>
                  <Typography variant="h4">{stats.fuel.totalLiters.toFixed(1)} L</Typography>
                </Box>
                <FuelIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
              </Box>
              <Typography variant="body2" color="textSecondary">
                Total cost: ₦{stats.fuel.totalCost.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Avg. ₦{stats.fuel.avgPrice.toFixed(2)}/L
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pending Approvals
                  </Typography>
                  <Typography variant="h4">{stats.maintenance.pendingApproval}</Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Maintenance Issues
            </Typography>
            <List>
              {stats.recentIssues.length === 0 ? (
                <Typography color="textSecondary">No recent issues</Typography>
              ) : (
                stats.recentIssues.map((issue, idx) => (
                  <React.Fragment key={issue.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={issue.observation}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="textPrimary">
                              Vehicle {issue.vehicle_id} • {issue.reported_date}
                            </Typography>
                            <br />
                            <Chip
                              label={issue.priority}
                              size="small"
                              color={
                                issue.priority === 'critical'
                                  ? 'error'
                                  : issue.priority === 'high'
                                  ? 'warning'
                                  : 'default'
                              }
                              sx={{ mr: 1, mt: 1 }}
                            />
                            <Chip label={issue.status} size="small" variant="outlined" sx={{ mt: 1 }} />
                          </>
                        }
                      />
                    </ListItem>
                    {idx < stats.recentIssues.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Fuel Logs
            </Typography>
            <List>
              {stats.recentFuel.length === 0 ? (
                <Typography color="textSecondary">No recent fuel logs</Typography>
              ) : (
                stats.recentFuel.map((log, idx) => (
                  <React.Fragment key={log.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={`${log.quantity_liters} L of ${log.fuel_type} – ₦${log.total_cost.toLocaleString()}`}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="textPrimary">
                              Vehicle {log.vehicle_id} • {log.fuel_date}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="textSecondary">
                              {log.fuel_station}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {idx < stats.recentFuel.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;