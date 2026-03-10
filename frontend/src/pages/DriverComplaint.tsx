import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Send as SendIcon, History as HistoryIcon } from '@mui/icons-material';
import { vehicleAPI, maintenanceAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface Vehicle {
  id: number;
  vehicle_name: string;
  registration_number: string;
  current_mileage: number;
}

const DriverComplaint: React.FC = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [myComplaints, setMyComplaints] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    vehicle_id: 0,
    observation: '',
    issues_identified: '',
    mileage: 0,
    priority: 'medium',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const vehiclesRes = await vehicleAPI.getAll();
      // Filter vehicles assigned to this driver (simplified - you'd need driver ID in backend)
      setVehicles(vehiclesRes.data);
      
      // Fetch driver's previous complaints
      const complaintsRes = await maintenanceAPI.getAll();
      // Filter by this driver (you'd need driver ID in backend)
      setMyComplaints(complaintsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.vehicle_id) {
      toast.error('Please select a vehicle');
      return;
    }
    if (!formData.observation) {
      toast.error('Please describe the issue');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        issues_identified: formData.issues_identified.split(',').map(s => s.trim()),
        reported_date: new Date().toISOString().split('T')[0],
        status: 'pending',
        approval_status: 'pending',
      };
      await maintenanceAPI.create(payload);
      toast.success('Complaint submitted successfully');
      setFormData({
        vehicle_id: 0,
        observation: '',
        issues_identified: '',
        mileage: 0,
        priority: 'medium',
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Driver Complaint Portal
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Report vehicle issues and track your maintenance requests
      </Typography>

      <Grid container spacing={3}>
        {/* Complaint Form */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Report New Issue
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select Vehicle</InputLabel>
                  <Select
                    value={formData.vehicle_id}
                    label="Select Vehicle"
                    onChange={(e) => setFormData({ ...formData, vehicle_id: +e.target.value })}
                  >
                    {vehicles.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.vehicle_name} - {v.registration_number}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Current Mileage"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: +e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    label="Priority"
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Issue Description"
                  value={formData.observation}
                  onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                  required
                  placeholder="Describe the problem you're experiencing..."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specific Issues (comma separated)"
                  value={formData.issues_identified}
                  onChange={(e) => setFormData({ ...formData, issues_identified: e.target.value })}
                  placeholder="e.g., Engine noise, Brake issue, Electrical problem"
                  helperText="Separate multiple issues with commas"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SendIcon />}
                  onClick={handleSubmit}
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? <CircularProgress size={24} /> : 'Submit Complaint'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Complaint History */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <HistoryIcon />
              <Typography variant="h6">My Recent Complaints</Typography>
            </Box>

            {myComplaints.length === 0 ? (
              <Alert severity="info">No previous complaints found</Alert>
            ) : (
              myComplaints.map((complaint) => (
                <Card key={complaint.id} sx={{ mb: 2, bgcolor: '#f9f9f9' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle2">
                        {complaint.vehicle_name || `Vehicle #${complaint.vehicle_id}`}
                      </Typography>
                      <Chip
                        label={complaint.status}
                        size="small"
                        color={
                          complaint.status === 'completed'
                            ? 'success'
                            : complaint.status === 'in_progress'
                            ? 'warning'
                            : 'default'
                        }
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {complaint.observation}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Reported: {complaint.reported_date}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DriverComplaint;