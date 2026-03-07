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
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { approvalsAPI } from '../services/api';

interface ApprovalRequest {
  id: number;
  issue_number: string;
  vehicle: {
    name: string;
    registration: string;
  };
  submitted_by: {
    name: string;
  };
  submitted_date: string;
  days_pending: number;
  priority: string;
  total_cost: number;
}

const Approvals: React.FC = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const response = await approvalsAPI.getPending();
      setRequests(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching approvals:', err);
      setError('Failed to load approval requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id: number, decision: 'approve' | 'reject') => {
    try {
      await approvalsAPI.decide(id, decision, '');
      // Refresh the list
      fetchPendingApprovals();
    } catch (err) {
      console.error(`Error ${decision}ing request:`, err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      default: return 'default';
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
        Pending Approvals
      </Typography>

      {requests.length === 0 ? (
        <Alert severity="success">No pending approvals. All caught up!</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Issue #</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Submitted By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell align="right">Cost (₦)</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} hover>
                  <TableCell>{req.issue_number}</TableCell>
                  <TableCell>
                    {req.vehicle.name}<br />
                    <Typography variant="caption">{req.vehicle.registration}</Typography>
                  </TableCell>
                  <TableCell>{req.submitted_by.name}</TableCell>
                  <TableCell>{req.submitted_date}</TableCell>
                  <TableCell>{req.days_pending}</TableCell>
                  <TableCell>
                    <Chip
                      label={req.priority}
                      color={getPriorityColor(req.priority) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{req.total_cost.toLocaleString()}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleDecision(req.id, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDecision(req.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Approvals;