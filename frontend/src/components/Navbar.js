// src/components/Navbar.js
import React from 'react';
// Import necessary components
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
// Import icons for visual enhancement
import InsightsIcon from '@mui/icons-material/Insights'; // A great icon for "analysis" or "lens"
import LogoutIcon from '@mui/icons-material/Logout';   // A standard icon for logout

const Navbar = ({ token, handleLogout }) => {
  return (
    // AppBar is the main navigation bar container. 
    // Setting elevation to 1 gives a subtler shadow, which can look more modern.
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* Use a Box to group the logo and title together for better alignment */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <InsightsIcon sx={{ mr: 1.5, fontSize: '2rem', color: 'common.white' }} /> {/* Added Icon */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{
              fontWeight: 'bold', // Make the title stand out more
              letterSpacing: '.5px', // Add some character spacing for a premium feel
              // Hide title on very small screens if it becomes too crowded
              display: { xs: 'none', sm: 'block' } 
            }}
          >
            InvestLens Pitch Deck Analyzer
          </Typography>
        </Box>
        
        {/* Only show the logout button if a token exists */}
        {token && (
          // Enhance the button with an icon and more defined styling
          <Button 
            color="inherit" 
            variant="outlined" // Outlined buttons often look cleaner in AppBars
            onClick={handleLogout}
            startIcon={<LogoutIcon />} // Add an icon to the button for clarity
            sx={{
              // Add a subtle transition for a smooth hover effect
              transition: 'background-color 0.3s ease, color 0.3s ease',
              borderColor: 'rgba(208, 193, 232, 0.23)', // Make border slightly less prominent
              '&:hover': {
                backgroundColor: 'rgba(64, 28, 66, 0.08)', // Slight highlight on hover
                borderColor: 'common.white'
              }
            }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;