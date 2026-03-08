import React, { useState, ChangeEvent } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Paper, IconButton,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress,
  SelectChangeEvent,
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

interface FormState {
  vehicle_id: number;
  observation: string;
  issues_identified: string;
  mileage: number;
  priority: string;
  reported_date: string;
  follow_up_date: string;
  remarks: string;
  tasks: Task[];
}

const CreateMaintenance: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    vehicle_id: 0,
    observation: '',
    issues_identified: '',
    mileage: 0,
    priority: 'medium',
    reported_date: new Date().toISOString().split('T')[0],
    follow_up_date: '',
    remarks: '',
    tasks: [],
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
  };

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

  const handleTaskChange = (
    index: number,
    field: keyof Task,
    value: string | number
  ) => {
    const newTasks = [...form.tasks];
    // Type-safe assignment
    if (field === 'quantity' || field === 'cost_estimate') {
      newTasks[index][field] = Number(value);
    } else {
      newTasks[index][field] = value as string;
    }
    setForm({ ...form, tasks: newTasks });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Build payload matching backend MaintenanceIssueCreate schema
      const payload = {
        vehicle_id: form.vehicle_id,
        observation: form.observation,
        issues_identified: form.issues_identified
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s !== ''),
        mileage: form.mileage || undefined,
        priority: form.priority,
        color_code: undefined,
        status: 'pending',
        approval_status: 'pending',
        reported_date: form.reported_date,
        completed_date: undefined,
        follow_up_date: form.follow_up_date || undefined,
        remarks: form.remarks || undefined,
        is_longstanding: false,
        tasks: form.tasks.map((task) => ({
          description: task.description,
          quantity: task.quantity,
          part_name: task.part_name || undefined,
          cost_estimate: task.cost_estimate,
          technician: task.technician || undefined,
          workshop: task.workshop || undefined,
        })),
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
              name="vehicle_id"
              type="number"
              value={form.vehicle_id}
              onChange={handleNumberChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mileage"
              name="mileage"
              type="number"
              value={form.mileage}
              onChange={handleNumberChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observation"
              name="observation"
              multiline
              rows={2}
              value={form.observation}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Issues Identified (comma separated)"
              name="issues_identified"
              value={form.issues_identified}
              onChange={handleInputChange}
              helperText="e.g., Oil leak, Brake noise"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={form.priority}
                label="Priority"
                onChange={handleInputChange}
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
              name="reported_date"
              type="date"
              value={form.reported_date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Follow-up Date"
              name="follow_up_date"
              type="date"
              value={form.follow_up_date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Remarks"
              name="remarks"
              multiline
              rows={2}
              value={form.remarks}
              onChange={handleInputChange}
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
                  onChange={(e) => handleTaskChange(index, 'quantity', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Part Name"
                  value={task.part_name}
                  onChange={(e) => handleTaskChange(index, 'part_name', e.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cost Est."
                  type="number"
                  value={task.cost_estimate}
                  onChange={(e) => handleTaskChange(index, 'cost_estimate', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6} md={1}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tech"
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