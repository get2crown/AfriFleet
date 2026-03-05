import React from 'react';
import { Box, Typography } from '@mui/material';

const Reports: React.FC = () => 
  {
    return (
     <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        // Reports & Analytics
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Generate and export reports and analytics
      </Typography>
     </Box>
   );
 };

export default Reports;
