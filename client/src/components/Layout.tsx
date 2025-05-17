import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Fab,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Home as HomeIcon,
  Menu as MenuIcon,
  PlusCircle as PlusCircleIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
  Search as SearchIcon,
  Bell as BellIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const showFab = !location.pathname.includes('/new-complaint');

  const navItems = [
    { text: 'My Submissions', icon: <UserIcon size={20} />, path: '/my-submissions' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
        <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', mb: 1 }}>
          {user?.name?.charAt(0) || 'U'}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold">
          {user?.name || 'Guest User'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email || 'guest@example.com'}
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            selected={location.pathname === item.path}
            sx={{ 
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 122, 0, 0.1)',
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
                '& .MuiListItemText-primary': {
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon sx={{ minWidth: 40 }}><LogOutIcon size={20} /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ bgcolor: 'white' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h4"
            component={RouterLink}
            to="/"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                // borderRadius: '4px', 
                px: 1, 
                m:1,
                
              }}
            >
              NSOBANURIRA
            </Box>
            
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <SearchIcon size={20} />
            </IconButton>
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <BellIcon size={20} />
            </IconButton>
            
            {!isMobile && (
              <>
                {navItems.map((item) => (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    sx={{ 
                      mx: 0.5,
                      ...(location.pathname === item.path && {
                        fontWeight: 'bold',
                        color: 'primary.main',
                      })
                    }}
                    startIcon={item.icon}
                  >
                    {item.text}
                  </Button>
                ))}
                
                <Button
                  component={RouterLink}
                  to="/new-complaint"
                  variant="contained"
                  color="primary"
                  startIcon={<PlusCircleIcon size={20} />}
                  sx={{ ml: 1 }}
                >
                  New Post
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {drawer}
      </Drawer>

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>

      {showFab && isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          component={RouterLink}
          to="/new-complaint"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <PlusCircleIcon />
        </Fab>
      )}
    </Box>
  );
};

export default Layout;