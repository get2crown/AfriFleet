import { Box, Typography } from '@mui/material';

const Vehicles: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Vehicles Management
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Manage your fleet vehicles
      </Typography>
    </Box>
  );
};

export default Vehicles;