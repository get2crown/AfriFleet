import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Paper, Alert, CircularProgress,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fuelAPI } from '../services/api';

const CreateFuelLog: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    vehicle_id: 0,
    fuel_date: new Date().toISOString().split('T')[0],
    fuel_type: 'diesel',
    quantity_liters: 0,
    price_per_liter: 0,
    odometer_reading: 0,
    fuel_station: '',
    notes: '',
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await fuelAPI.create(form);
      navigate('/fuel');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create fuel log');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Add Fuel Log
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vehicle ID"
              type="number"
              value={form.vehicle_id}
              onChange={(e) => setForm({ ...form, vehicle_id: +e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fuel Date"
              type="date"
              value={form.fuel_date}
              onChange={(e) => setForm({ ...form, fuel_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Fuel Type</InputLabel>
              <Select
                value={form.fuel_type}
                label="Fuel Type"
                onChange={(e) => setForm({ ...form, fuel_type: e.target.value })}
              >
                <MenuItem value="petrol">Petrol</MenuItem>
                <MenuItem value="diesel">Diesel</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Quantity (Liters)"
              type="number"
              value={form.quantity_liters}
              onChange={(e) => setForm({ ...form, quantity_liters: +e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Price per Liter (₦)"
              type="number"
              value={form.price_per_liter}
              onChange={(e) => setForm({ ...form, price_per_liter: +e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Odometer Reading"
              type="number"
              value={form.odometer_reading}
              onChange={(e) => setForm({ ...form, odometer_reading: +e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fuel Station"
              value={form.fuel_station}
              onChange={(e) => setForm({ ...form, fuel_station: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/fuel')}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateFuelLog;