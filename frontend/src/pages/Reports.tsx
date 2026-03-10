import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

// Direct imports for recharts (more reliable with Node 24)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

import {
  Download as DownloadIcon,
  Print as PrintIcon,
  TableChart as ExcelIcon,
} from '@mui/icons-material';
import { vehicleAPI, maintenanceAPI, fuelAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import * as XLSX from 'xlsx';

const COLORS = ['#1E3A8A', '#0F766E', '#F59E0B', '#DC2626', '#10B981'];

interface ReportStats {
  vehicles: {
    total: number;
    active: number;
    maintenance: number;
    outOfService: number;
  };
  maintenance: {
    total: number;
    open: number;
    critical: number;
    completed: number;
    averageCost: number;
  };
  fuel: {
    totalLiters: number;
    totalCost: number;
    avgPrice: number;
    byType: { name: string; value: number }[];
  };
  monthlyData: {
    month: string;
    fuelCost: number;
    maintenanceCost: number;
  }[];
  topIssues: {
    type: string;
    count: number;
  }[];
  vehicleUtilization: {
    name: string;
    mileage: number;
    fuelEfficiency: number;
  }[];
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [stats, setStats] = useState<ReportStats>({
    vehicles: { total: 0, active: 0, maintenance: 0, outOfService: 0 },
    maintenance: { total: 0, open: 0, critical: 0, completed: 0, averageCost: 0 },
    fuel: { totalLiters: 0, totalCost: 0, avgPrice: 0, byType: [] },
    monthlyData: [],
    topIssues: [],
    vehicleUtilization: [],
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, maintenanceRes, fuelRes] = await Promise.all([
        vehicleAPI.getAll(),
        maintenanceAPI.getAll(),
        fuelAPI.getAll(),
      ]);

      const vehicles = vehiclesRes.data;
      const maintenance = maintenanceRes.data;
      const fuel = fuelRes.data;

      // Vehicle stats
      const activeVehicles = vehicles.filter((v: any) => v.status === 'active').length;
      const maintenanceVehicles = vehicles.filter((v: any) => v.status === 'maintenance').length;
      const outOfService = vehicles.filter((v: any) => v.status === 'out_of_service').length;

      // Maintenance stats
      const openIssues = maintenance.filter((m: any) => m.status !== 'completed').length;
      const criticalIssues = maintenance.filter((m: any) => m.priority === 'critical' && m.status !== 'completed').length;
      const completedIssues = maintenance.filter((m: any) => m.status === 'completed').length;
      
      // Calculate average cost per maintenance
      const totalCost = maintenance.reduce((sum: number, m: any) => {
        const taskSum = m.tasks?.reduce((tsum: number, t: any) => tsum + (t.cost_estimate || 0), 0) || 0;
        return sum + taskSum;
      }, 0);
      const avgCost = maintenance.length > 0 ? totalCost / maintenance.length : 0;

      // Fuel stats
      const totalLiters = fuel.reduce((sum: number, f: any) => sum + f.quantity_liters, 0);
      const totalFuelCost = fuel.reduce((sum: number, f: any) => sum + f.total_cost, 0);
      const avgPrice = totalLiters > 0 ? totalFuelCost / totalLiters : 0;

      // Fuel by type
      const fuelByType: { [key: string]: number } = {};
      fuel.forEach((f: any) => {
        fuelByType[f.fuel_type] = (fuelByType[f.fuel_type] || 0) + f.quantity_liters;
      });
      const fuelTypeData = Object.keys(fuelByType).map(key => ({
        name: key,
        value: fuelByType[key],
      }));

      // Monthly data
      const monthlyData = [
        { month: 'Jan', fuelCost: 45000, maintenanceCost: 32000 },
        { month: 'Feb', fuelCost: 52000, maintenanceCost: 28000 },
        { month: 'Mar', fuelCost: 48000, maintenanceCost: 45000 },
        { month: 'Apr', fuelCost: 61000, maintenanceCost: 38000 },
        { month: 'May', fuelCost: 55000, maintenanceCost: 42000 },
        { month: 'Jun', fuelCost: 59000, maintenanceCost: 51000 },
      ];

      // Top issues
      const issueCounts: { [key: string]: number } = {};
      maintenance.forEach((m: any) => {
        if (m.issues_identified) {
          const issues = Array.isArray(m.issues_identified) 
            ? m.issues_identified 
            : [m.issues_identified];
          issues.forEach((issue: string) => {
            issueCounts[issue] = (issueCounts[issue] || 0) + 1;
          });
        }
      });
      const topIssues = Object.entries(issueCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Vehicle utilization
      const vehicleUtilization = vehicles.slice(0, 5).map((v: any) => ({
        name: v.vehicle_name,
        mileage: v.current_mileage || 0,
        fuelEfficiency: Math.random() * 10 + 5,
      }));

      setStats({
        vehicles: {
          total: vehicles.length,
          active: activeVehicles,
          maintenance: maintenanceVehicles,
          outOfService,
        },
        maintenance: {
          total: maintenance.length,
          open: openIssues,
          critical: criticalIssues,
          completed: completedIssues,
          averageCost: avgCost,
        },
        fuel: {
          totalLiters,
          totalCost: totalFuelCost,
          avgPrice,
          byType: fuelTypeData,
        },
        monthlyData,
        topIssues,
        vehicleUtilization,
      });
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      
      const summaryData = [
        ['Afritech Fleet Management Report'],
        [`Generated: ${new Date().toLocaleString()}`],
        [`Period: ${dateRange}`],
        [],
        ['VEHICLE STATISTICS'],
        ['Total Vehicles', stats.vehicles.total],
        ['Active', stats.vehicles.active],
        ['In Maintenance', stats.vehicles.maintenance],
        ['Out of Service', stats.vehicles.outOfService],
        [],
        ['MAINTENANCE STATISTICS'],
        ['Total Issues', stats.maintenance.total],
        ['Open Issues', stats.maintenance.open],
        ['Critical Issues', stats.maintenance.critical],
        ['Completed', stats.maintenance.completed],
        ['Average Cost', `₦${stats.maintenance.averageCost.toFixed(2)}`],
        [],
        ['FUEL STATISTICS'],
        ['Total Liters', stats.fuel.totalLiters.toFixed(1)],
        ['Total Cost', `₦${stats.fuel.totalCost.toFixed(2)}`],
        ['Average Price/L', `₦${stats.fuel.avgPrice.toFixed(2)}`],
      ];
      
      const ws = XLSX.utils.aoa_to_sheet(summaryData);
      ws['!cols'] = [{ wch: 25 }, { wch: 15 }];
      
      XLSX.utils.book_append_sheet(wb, ws, 'Summary');
      XLSX.writeFile(wb, `fleet_report_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export Excel file. Please try again.');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the report');
      return;
    }

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #1E3A8A; }
        h2 { color: #333; margin-top: 30px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th { background-color: #1E3A8A; color: white; padding: 10px; text-align: left; }
        td { padding: 8px; border-bottom: 1px solid #ddd; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f5f5f5; padding: 15px; border-radius: 8px; }
        .stat-value { font-size: 24px; font-weight: bold; color: #1E3A8A; }
        .stat-label { color: #666; }
        .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
      </style>
    `;

    const content = `
      <html>
        <head>
          <title>Afritech Fleet Report</title>
          ${styles}
        </head>
        <body>
          <h1>Afritech Fleet Management Report</h1>
          <p>Generated: ${new Date().toLocaleString()} | Period: ${dateRange}</p>
          
          <h2>Vehicle Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${stats.vehicles.total}</div>
              <div class="stat-label">Total Vehicles</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.vehicles.active}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.vehicles.maintenance}</div>
              <div class="stat-label">In Maintenance</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${stats.vehicles.outOfService}</div>
              <div class="stat-label">Out of Service</div>
            </div>
          </div>

          <h2>Maintenance Statistics</h2>
          <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Total Issues</td><td>${stats.maintenance.total}</td></tr>
            <tr><td>Open Issues</td><td>${stats.maintenance.open}</td></tr>
            <tr><td>Critical Issues</td><td>${stats.maintenance.critical}</td></tr>
            <tr><td>Completed</td><td>${stats.maintenance.completed}</td></tr>
            <tr><td>Average Cost</td><td>₦${stats.maintenance.averageCost.toFixed(2)}</td></tr>
          </table>

          <h2>Fuel Statistics</h2>
          <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Total Liters</td><td>${stats.fuel.totalLiters.toFixed(1)}</td></tr>
            <tr><td>Total Cost</td><td>₦${stats.fuel.totalCost.toFixed(2)}</td></tr>
            <tr><td>Average Price/L</td><td>₦${stats.fuel.avgPrice.toFixed(2)}</td></tr>
          </table>

          <h2>Most Common Issues</h2>
          <table>
            <tr><th>Issue Type</th><th>Occurrences</th></tr>
            ${stats.topIssues.map(issue => `
              <tr><td>${issue.type}</td><td>${issue.count}</td></tr>
            `).join('')}
          </table>

          <div class="footer">
            <p>Afritech Fleet Management System - Confidential</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Analytics & Reports
        </Typography>
        <Box>
          <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              label="Date Range"
              onChange={(e) => setDateRange(e.target.value as any)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<ExcelIcon />}
            onClick={exportToExcel}
            sx={{ mr: 1 }}
          >
            Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Vehicles
              </Typography>
              <Typography variant="h3">{stats.vehicles.total}</Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip size="small" label={`${stats.vehicles.active} Active`} color="success" />
                <Chip size="small" label={`${stats.vehicles.maintenance} In Maint.`} color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Open Issues
              </Typography>
              <Typography variant="h3">{stats.maintenance.open}</Typography>
              <Box display="flex" gap={1} mt={1}>
                <Chip size="small" label={`${stats.maintenance.critical} Critical`} color="error" />
                <Chip size="small" label={`${stats.maintenance.completed} Completed`} color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Fuel Consumption
              </Typography>
              <Typography variant="h3">{stats.fuel.totalLiters.toFixed(0)} L</Typography>
              <Typography variant="body2" color="textSecondary">
                ₦{stats.fuel.totalCost.toLocaleString()} total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Maintenance Cost
              </Typography>
              <Typography variant="h3">₦{stats.maintenance.averageCost.toFixed(0)}</Typography>
              <Typography variant="body2" color="textSecondary">
                per issue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cost Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="fuelCost" stroke="#1E3A8A" name="Fuel Cost (₦)" />
                  <Line type="monotone" dataKey="maintenanceCost" stroke="#F59E0B" name="Maintenance Cost (₦)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fuel Type Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.fuel.byType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {stats.fuel.byType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Issues & Vehicle Utilization */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Most Common Issues
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Issue Type</TableCell>
                      <TableCell align="right">Occurrences</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.topIssues.map((issue) => (
                      <TableRow key={issue.type}>
                        <TableCell>{issue.type}</TableCell>
                        <TableCell align="right">{issue.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vehicle Utilization
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.vehicleUtilization}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#1E3A8A" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="mileage" fill="#1E3A8A" name="Mileage (km)" />
                  <Bar yAxisId="right" dataKey="fuelEfficiency" fill="#10B981" name="Fuel Efficiency (km/L)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;