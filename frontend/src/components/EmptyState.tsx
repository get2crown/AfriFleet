import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { 
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  LocalGasStation as FuelIcon,
  Assessment as ReportIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  message: string;
  icon: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 2,
        bgcolor: '#fafafa',
      }}
    >
      <Box sx={{ mb: 2, color: 'text.secondary' }}>
        {React.cloneElement(icon as React.ReactElement, { sx: { fontSize: 80 } })}
      </Box>
      <Typography variant="h5" gutterBottom fontWeight={500}>
        {title}
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAction}
          size="large"
        >
          {actionLabel}
        </Button>
      )}
    </Paper>
  );
};

export const VehicleEmptyState: React.FC<{ onAddVehicle: () => void }> = ({ onAddVehicle }) => (
  <EmptyState
    title="No Vehicles Yet"
    message="Your fleet is empty. Get started by adding your first vehicle to begin tracking maintenance and fuel."
    icon={<CarIcon />}
    actionLabel="Add Your First Vehicle"
    onAction={onAddVehicle}
  />
);

export const MaintenanceEmptyState: React.FC<{ onAddMaintenance: () => void }> = ({ onAddMaintenance }) => (
  <EmptyState
    title="No Maintenance Issues"
    message="All vehicles are running smoothly! When issues arise, they'll appear here."
    icon={<BuildIcon />}
    actionLabel="Log Maintenance Issue"
    onAction={onAddMaintenance}
  />
);

export const FuelEmptyState: React.FC<{ onAddFuel: () => void }> = ({ onAddFuel }) => (
  <EmptyState
    title="No Fuel Logs"
    message="Track fuel consumption by adding your first fuel entry."
    icon={<FuelIcon />}
    actionLabel="Add Fuel Log"
    onAction={onAddFuel}
  />
);

export const ReportsEmptyState: React.FC = () => (
  <EmptyState
    title="No Reports Available"
    message="Reports will appear here once you have sufficient vehicle data."
    icon={<ReportIcon />}
  />
);

export default EmptyState;