import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Chip,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as ReportsIcon,
  AddShoppingCart as AddSaleIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useSocket } from '../../contexts/SocketContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Add Sale', icon: <AddSaleIcon />, path: '/add-sale' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();
  const [recentSalesCount, setRecentSalesCount] = useState(0);

  useEffect(() => {
    if (socket) {
      socket.on('newSale', (newSale) => {
        setRecentSalesCount(prev => prev + 1);
        
        setTimeout(() => {
          setRecentSalesCount(0);
        }, 60000);
      });

      return () => {
        socket.off('newSale');
      };
    }
  }, [socket]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: '64px',
          height: 'calc(100vh - 64px)',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
          Analytics
        </Typography>
        
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  {item.text === 'Dashboard' && recentSalesCount > 0 ? (
                    <Badge badgeContent={recentSalesCount} color="success">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.text === 'Dashboard' && recentSalesCount > 0 && (
                  <Chip
                    label={`${recentSalesCount} new`}
                    size="small"
                    color="success"
                    variant="filled"
                    sx={{ ml: 1, fontSize: '0.7rem' }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Quick Stats
        </Typography>
        
        <List dense>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <TrendingUpIcon color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Sales Trend" 
                secondary="+12% this month"
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PeopleIcon color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="New Customers" 
                secondary="+8% this week"
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InventoryIcon color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="Top Products" 
                secondary="Electronics leading"
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PaymentIcon color="secondary" />
              </ListItemIcon>
              <ListItemText 
                primary="Payment Methods" 
                secondary="Credit Card 45%"
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
