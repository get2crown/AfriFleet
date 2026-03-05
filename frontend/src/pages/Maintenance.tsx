import { Box, Typography } from '@mui/material';

const Maintenance: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Maintenance Management
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Track and manage maintenance requests
      </Typography>
    </Box>
  );
};

export default Maintenance;