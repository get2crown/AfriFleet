import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, CircularProgress, Alert,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { vehicleAPI } from '../services/api';
import { useLoading } from '../contexts/LoadingContext';
import { VehicleSkeleton } from '../components/SkeletonLoader';
import { VehicleEmptyState } from '../components/EmptyState';

interface Vehicle {
  id: number;
  vehicle_name: string;
  registration_number: string;
  assigned_driver: string | null;
  vehicle_type: string | null;
  current_mileage: number;
  status: string;
}

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    vehicle_name: '',
    registration_number: '',
    assigned_driver: '',
    vehicle_type: '',
    current_mileage: 0,
    status: 'active',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll();
      setVehicles(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData({
        vehicle_name: vehicle.vehicle_name,
        registration_number: vehicle.registration_number,
        assigned_driver: vehicle.assigned_driver || '',
        vehicle_type: vehicle.vehicle_type || '',
        current_mileage: vehicle.current_mileage,
        status: vehicle.status,
      });
    } else {
      setSelectedVehicle(null);
      setFormData({
        vehicle_name: '',
        registration_number: '',
        assigned_driver: '',
        vehicle_type: '',
        current_mileage: 0,
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVehicle(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (selectedVehicle) {
        // Update
        await vehicleAPI.update(selectedVehicle.id, formData);
      } else {
        // Create
        await vehicleAPI.create(formData);
      }
      fetchVehicles();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving vehicle:', err);
      setError('Failed to save vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={3}>Vehicles</Typography>
        <VehicleSkeleton />
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>Vehicles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Vehicle
        </Button>
      </Box>

      {vehicles.length === 0 ? (
        <VehicleEmptyState onAddVehicle={() => handleOpenDialog()} />
      ) : (
        <Grid container spacing={3}>
          {vehicles.map((vehicle) => (
            <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" gutterBottom>
                      {vehicle.vehicle_name}
                    </Typography>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenDialog(vehicle)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Reg: {vehicle.registration_number}
                  </Typography>
                  <Typography variant="body2">
                    Driver: {vehicle.assigned_driver || 'Unassigned'}
                  </Typography>
                  <Typography variant="body2">
                    Type: {vehicle.vehicle_type || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    Mileage: {vehicle.current_mileage?.toLocaleString()} km
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={vehicle.status}
                      size="small"
                      color={
                        vehicle.status === 'active'
                          ? 'success'
                          : vehicle.status === 'maintenance'
                          ? 'warning'
                          : 'default'
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Vehicle Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="dense"
              fullWidth
              label="Vehicle Name"
              name="vehicle_name"
              value={formData.vehicle_name}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              fullWidth
              label="Registration Number"
              name="registration_number"
              value={formData.registration_number}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              fullWidth
              label="Assigned Driver"
              name="assigned_driver"
              value={formData.assigned_driver}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              fullWidth
              label="Vehicle Type"
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              fullWidth
              label="Current Mileage"
              name="current_mileage"
              type="number"
              value={formData.current_mileage}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="out_of_service">Out of Service</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vehicles;