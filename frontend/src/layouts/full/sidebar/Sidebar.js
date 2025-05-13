import { useMediaQuery } from '@mui/material';
import { Box, Drawer, Divider, Typography } from '@mui/material';
import SidebarItems from './SidebarItems';
import { useNavigate } from 'react-router-dom';

const Sidebar = (props) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/auth/login');
  };

  const sidebarWidth = '303px';

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        {/* Sidebar for desktop */}
        <Drawer
          anchor="left"
          open={props.isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxSizing: 'border-box',
              mt: '90px',
              bgcolor: '#F0F0F0',
            },
          }}
        >
          {/* Sidebar Box */}
          <Box
            sx={{
              height: '100%',
              bgcolor: '#ffffff',
              marginLeft: 2,
              borderRadius: 5,
              marginBottom: 15,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              {/* Logo */}
              <Divider variant="fullWidth" sx={{ mb: 1 }} />
              <Box sx={{ width: '100%', px: '15px' }}>
                {/* Sidebar Items */}
                <SidebarItems />
              </Box>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Divider variant="fullWidth" />
              <Box display="flex" alignItems="center" mb={1} px={4} py={2} onClick={handleLogout}>
                <Box
                  component="img"
                  src="/signout.png"
                  alt="logout"
                  height={15.6}
                  width={15.6}
                  style={{
                    marginTop: '2px',
                  }}
                />
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{
                    color: '#5a6a85',
                    mt: '2px',
                    ml: '20px',
                    cursor: 'pointer',
                    fontWeight: '400',
                  }}
                >
                  Sign Out
                </Typography>
              </Box>
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* Logo */}
      <Box p={4}>
        <Typography variant="h5" component="div">
          Portal
        </Typography>
      </Box>
      {/* Sidebar For Mobile */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Divider variant="fullWidth" sx={{ mb: 1 }} />

        <Box sx={{ flex: 1, overflow: 'hidden', px: 1 }}>
          <SidebarItems />
        </Box>
        <Divider variant="fullWidth" />
        <Box
          px={2}
          py={3}
          onClick={handleLogout}
          sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
        >
          <Box
            component="img"
            src="/signout.png"
            alt="logout"
            height={15.6}
            width={15.6}
            style={{ marginTop: '2px' }}
          />
          <Typography
            variant="h6"
            component="h6"
            sx={{
              color: '#5a6a85',
              mt: '2px',
              ml: '20px',
              cursor: 'pointer',
              fontWeight: '400',
            }}
          >
            Sign Out
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
