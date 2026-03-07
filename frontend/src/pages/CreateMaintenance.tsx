import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Paper, IconButton,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { maintenanceAPI } from '../services/api';

interface Task {
  description: string;
  quantity: number;
  part_name: string;
  cost_estimate: number;
  technician: string;
  workshop: string;
}

const CreateMaintenance: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    vehicle_id: 0,
    observation: '',
    issues_identified: '',
    mileage: 0,
    priority: 'medium',
    reported_date: new Date().toISOString().split('T')[0],
    follow_up_date: '',
    remarks: '',
    tasks: [] as Task[], // explicit type
  });

  const addTask = () => {
    setForm({
      ...form,
      tasks: [
        ...form.tasks,
        {
          description: '',
          quantity: 1,
          part_name: '',
          cost_estimate: 0,
          technician: '',
          workshop: '',
        },
      ],
    });
  };

  const removeTask = (index: number) => {
    const newTasks = [...form.tasks];
    newTasks.splice(index, 1);
    setForm({ ...form, tasks: newTasks });
  };

  const handleTaskChange = (index: number, field: keyof Task, value: any) => {
    const newTasks = [...form.tasks];
    newTasks[index][field] = value;
    setForm({ ...form, tasks: newTasks });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        issues_identified: form.issues_identified.split(',').map(s => s.trim()),
        reported_date: new Date(form.reported_date).toISOString().split('T')[0],
      };
      await maintenanceAPI.create(payload);
      navigate('/maintenance');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create maintenance issue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Create Maintenance Issue
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
              label="Mileage"
              type="number"
              value={form.mileage}
              onChange={(e) => setForm({ ...form, mileage: +e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observation"
              multiline
              rows={2}
              value={form.observation}
              onChange={(e) => setForm({ ...form, observation: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Issues Identified (comma separated)"
              value={form.issues_identified}
              onChange={(e) => setForm({ ...form, issues_identified: e.target.value })}
              helperText="e.g., Oil leak, Brake noise"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={form.priority}
                label="Priority"
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Reported Date"
              type="date"
              value={form.reported_date}
              onChange={(e) => setForm({ ...form, reported_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Follow-up Date"
              type="date"
              value={form.follow_up_date}
              onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarks"
              multiline
              rows={2}
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Tasks
        </Typography>

        {form.tasks.map((task, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  value={task.description}
                  onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Qty"
                  type="number"
                  value={task.quantity}
                  onChange={(e) => handleTaskChange(index, 'quantity', +e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cost Est."
                  type="number"
                  value={task.cost_estimate}
                  onChange={(e) => handleTaskChange(index, 'cost_estimate', +e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Technician"
                  value={task.technician}
                  onChange={(e) => handleTaskChange(index, 'technician', e.target.value)}
                />
              </Grid>
              <Grid item xs={4} md={1}>
                <IconButton color="error" onClick={() => removeTask(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Button startIcon={<AddIcon />} onClick={addTask} sx={{ mt: 1 }}>
          Add Task
        </Button>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/maintenance')}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Create Issue'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateMaintenance;