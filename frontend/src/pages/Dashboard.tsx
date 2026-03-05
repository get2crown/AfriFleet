import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Welcome to Afritech Fleet Manager
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">4</Typography>
              <Typography variant="body2" color="textSecondary">Total Vehicles</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">2</Typography>
              <Typography variant="body2" color="textSecondary">Active Vehicles</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error">3</Typography>
              <Typography variant="body2" color="textSecondary">Critical Issues</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">4</Typography>
              <Typography variant="body2" color="textSecondary">Pending Approvals</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;