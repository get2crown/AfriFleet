import { Box, Typography } from '@mui/material';

const Approvals: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Approval Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Review and approve maintenance requests
      </Typography>
    </Box>
  );
};

export default Approvals;