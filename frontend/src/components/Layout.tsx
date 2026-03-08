// frontend/src/components/Layout.tsx
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
  Breadcrumbs,
  Link as MuiLink,
  Backdrop,
  CircularProgress,
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
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import QuickSearch from './QuickSearch';
import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useLoading();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useAuth();


  // keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.shiftKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case '1':
            navigate('/dashboard');
            break;
          case '2':
            navigate('/vehicles');
            break;
          case '3':
            navigate('/maintenance');
            break;
          case '4':
            navigate('/fuel');
            break;
          case '5':
            navigate('/reports');
            break;
          case '6':
            navigate('/approvals');
            break;
          case 'k':
            e.preventDefault();
            setSearchOpen(true);
            break;
          default:
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Vehicles', icon: <CarIcon />, path: '/vehicles' },
    { text: 'Maintenance', icon: <BuildIcon />, path: '/maintenance' },
    { text: 'Fuel Logs', icon: <FuelIcon />, path: '/fuel' },
    { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
    { text: 'Approvals', icon: <ApprovalIcon />, path: '/approvals' },
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          AFRI TECH
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
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton sx={{ mr: 2 }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton onClick={handleProfileMenuOpen}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
              <PersonIcon fontSize="small" />
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
        {/* breadcrumbs */}
        <Toolbar variant="dense" sx={{ bgcolor: '#f5f5f5', pl: { sm: 3 }, py: 0.5 }}>
          <Breadcrumbs aria-label="breadcrumb">
            {location.pathname
              .split('/')
              .filter(Boolean)
              .map((segment, idx, arr) => {
                const path = '/' + arr.slice(0, idx + 1).join('/');
                const label = segment.charAt(0).toUpperCase() + segment.slice(1);
                return idx === arr.length - 1 ? (
                  <Typography key={path} color="text.primary">
                    {label}
                  </Typography>
                ) : (
                  <MuiLink
                    key={path}
                    color="inherit"
                    underline="hover"
                    onClick={() => navigate(path)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {label}
                  </MuiLink>
                );
              })}
          </Breadcrumbs>
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: '#F9FAFB',
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* global loading spinner */}
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      // In the profile menu items, add logout option:
      <MenuItem onClick={() => { logout(); navigate('/login'); }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
         </ListItemIcon>
        Logout
      </MenuItem>
    // Optionally show user name in AppBar:
      <Typography variant="body2" sx={{ mr: 1 }}>
    {user?.full_name}
  </Typography>
  < Chip 
    label={user?.role} 
    size="small" 
    color="primary" 
    variant="outlined" 
  />

      {/* quick search dialog */}
      <QuickSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Box>
    
  );
};

export default Layout;
