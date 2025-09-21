import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  Wifi,
  WifiOff,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useSocket } from '../../contexts/SocketContext';

const Navbar = () => {
  const { isConnected, socket } = useSocket();
  const [newSaleCount, setNewSaleCount] = useState(0);
  const [lastSaleTime, setLastSaleTime] = useState(null);

  useEffect(() => {
    if (socket) {
      socket.on('newSale', (newSale) => {
        setNewSaleCount(prev => prev + 1);
        setLastSaleTime(new Date());
        
        setTimeout(() => {
          setNewSaleCount(0);
        }, 30000);
      });

      return () => {
        socket.off('newSale');
      };
    }
  }, [socket]);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 240px)` },
        ml: { sm: '240px' },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Shanture Analytics Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={isConnected ? <Wifi /> : <WifiOff />}
            label={isConnected ? 'Connected' : 'Disconnected'}
            color={isConnected ? 'success' : 'error'}
            size="small"
            variant="outlined"
            sx={{ 
              color: 'white',
              borderColor: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
          
          {newSaleCount > 0 && (
            <Tooltip title={`${newSaleCount} new sale${newSaleCount > 1 ? 's' : ''} detected!`}>
              <Chip
                icon={<ShoppingCartIcon />}
                label={`${newSaleCount} New Sale${newSaleCount > 1 ? 's' : ''}`}
                color="success"
                size="small"
                variant="filled"
                sx={{ 
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                    '100%': { opacity: 1 },
                  }
                }}
              />
            </Tooltip>
          )}
          
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
