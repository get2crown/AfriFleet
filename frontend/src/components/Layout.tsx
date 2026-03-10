import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  Button,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  LocalGasStation as FuelIcon,
  Assessment as ReportIcon,
  Approval as ApprovalIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import QuickSearch from './QuickSearch';
import NotificationBadge from './NotificationBadge';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Function to get menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', badge: null },
    ];

    const roleSpecificItems = [];

    // Admin and CEO see everything
    if (hasRole(['admin', 'ceo'])) {
      roleSpecificItems.push(
        { text: 'Vehicles', icon: <CarIcon />, path: '/vehicles', badge: null },
        { text: 'Maintenance', icon: <BuildIcon />, path: '/maintenance', badge: 3 },
        { text: 'Fuel Logs', icon: <FuelIcon />, path: '/fuel', badge: null },
        { text: 'Reports', icon: <ReportIcon />, path: '/reports', badge: null },
        { text: 'Approvals', icon: <ApprovalIcon />, path: '/approvals', badge: 2 }
      );
    }
    // Fleet Managers and Logistics Officers
    else if (hasRole(['fleet_manager', 'logistics_officer'])) {
      roleSpecificItems.push(
        { text: 'Vehicles', icon: <CarIcon />, path: '/vehicles', badge: null },
        { text: 'Maintenance', icon: <BuildIcon />, path: '/maintenance', badge: 3 },
        { text: 'Fuel Logs', icon: <FuelIcon />, path: '/fuel', badge: null },
        { text: 'Reports', icon: <ReportIcon />, path: '/reports', badge: null }
      );
    }
    // Technicians
    else if (hasRole(['technician'])) {
      roleSpecificItems.push(
        { text: 'Maintenance', icon: <BuildIcon />, path: '/maintenance', badge: 3 }
      );
    }
    // Drivers
    else if (hasRole(['driver'])) {
      roleSpecificItems.push(
        { text: 'Report Issue', icon: <BuildIcon />, path: '/driver/complaint', badge: null }
      );
    }

    return [...baseItems, ...roleSpecificItems];
  };

  const menuItems = getMenuItems();

  const drawer = (
    <Box>
      <Toolbar sx={{ justifyContent: 'center', py: 2, flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          AFRI TECH
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Fleet Manager v2.0
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light + '20',
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main, minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
              />
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  color="error"
                  sx={{ height: 20, minWidth: 20 }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="body2" color="textSecondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Welcome back, {user?.full_name || 'User'}
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Global Search */}
          <Button
            onClick={handleSearchOpen}
            startIcon={<SearchIcon />}
            sx={{ 
              mr: 2, 
              color: 'text.secondary',
              bgcolor: '#f5f5f5',
              '&:hover': { bgcolor: '#eeeeee' }
            }}
          >
            Search... <Typography variant="caption" sx={{ ml: 1, color: '#999' }}>Ctrl+K</Typography>
          </Button>
          
          {/* Notifications - Using the new component */}
          <NotificationBadge />
          
          {/* User Menu with Visible Logout Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <Chip
              avatar={<Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <PersonIcon fontSize="small" />
              </Avatar>}
              label={user?.username || 'User'}
              variant="outlined"
              onClick={handleProfileMenuOpen}
              sx={{ cursor: 'pointer' }}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                borderColor: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: theme.palette.error.main,
                  color: 'white',
                }
              }}
            >
              Logout
            </Button>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#F9FAFB',
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* Quick Search Dialog */}
      <QuickSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
  );
};

export default Layout;