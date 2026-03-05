import { Box, Typography } from '@mui/material';

const FuelLogs: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Fuel & Lubricants
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Track fuel consumption and costs
      </Typography>
    </Box>
  );
};

export default FuelLogs;