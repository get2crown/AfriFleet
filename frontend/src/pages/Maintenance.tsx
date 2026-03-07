import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { maintenanceAPI } from '../services/api';

interface MaintenanceIssue {
  id: number;
  vehicle_id: number;
  observation: string;
  issues_identified: string;
  priority: string;
  status: string;
  reported_date: string;
  completed_date?: string;
  vehicle_name?: string; // we might fetch vehicle details separately
}

const Maintenance: React.FC = () => {
  const [issues, setIssues] = useState<MaintenanceIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const response = await maintenanceAPI.getAll();
      setIssues(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching maintenance:', err);
      setError('Failed to load maintenance issues. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'success';
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
        Maintenance Issues
      </Typography>

      {issues.length === 0 ? (
        <Alert severity="info">No maintenance issues found. Seed the database or add one via the API.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Vehicle ID</TableCell>
                <TableCell>Observation</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reported Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id} hover>
                  <TableCell>{issue.id}</TableCell>
                  <TableCell>{issue.vehicle_id}</TableCell>
                  <TableCell>{issue.observation}</TableCell>
                  <TableCell>
                    <Chip
                      label={issue.priority}
                      color={getPriorityColor(issue.priority) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={issue.status} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{issue.reported_date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Maintenance;