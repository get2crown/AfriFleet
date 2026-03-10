import React, { useEffect, useState } from 'react';
import { 
  Badge, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Divider, 
  Button,
  CircularProgress 
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { approvalsAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: number;
  issue_number: string;
  vehicle: {
    name: string;
    registration: string;
  };
  observation: string;
  submitted_date: string;
}

const NotificationBadge: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await approvalsAPI.getPending();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    fetchNotifications();
    handleClick as any;
  };

  const handleNotificationClick = (issueId: number) => {
    handleClose();
    navigate(`/approvals/${issueId}`);
  };

  const handleViewAll = () => {
    handleClose();
    navigate('/approvals');
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 }
        }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              No new notifications
            </Typography>
          </Box>
        ) : (
          <>
            {notifications.slice(0, 5).map((notif) => (
              <MenuItem
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id)}
                sx={{ whiteSpace: 'normal', py: 1.5 }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {notif.vehicle?.name} - {notif.issue_number}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    {notif.observation?.substring(0, 60)}...
                  </Typography>
                  <Typography variant="caption" color="primary" display="block" sx={{ mt: 0.5 }}>
                    {formatDistanceToNow(new Date(notif.submitted_date), { addSuffix: true })}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            {notifications.length > 5 && (
              <>
                <Divider />
                <MenuItem onClick={handleViewAll} sx={{ justifyContent: 'center' }}>
                  <Typography variant="body2" color="primary">
                    View all {notifications.length} notifications
                  </Typography>
                </MenuItem>
              </>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBadge;