import { Box, Card, Grid, Typography } from '@mui/material';
import logo from 'src/assets/images/logos/logo.png';
import slide1 from 'src/assets/login-slide1.svg';
import PageContainer from 'src/components/container/PageContainer';
import LoginForm from './auth/AuthLogin';

const SliderStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  padding: '20px',
  width: '100%',
  textAlign: 'center',
};

const Login2 = () => (
  <PageContainer title="Login" description="this is login page">
    <Box
      sx={{
        position: 'relative',
        '&:before': {
          content: '""',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          position: 'absolute',
          height: '100%',
          width: '100%',
          opacity: '0.3',
        },
      }}
    >
      <Grid container justifyContent="center" sx={{ height: '100vh' }}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={9}
            sx={{
              px: { xs: 4, md: 10 },
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box component="div">
              <Box display="flex" alignItems="center" justifyContent="center">
                <img src={logo} alt="logo" />
              </Box>

              <Typography
                variant="h2"
                textAlign="center"
                color="#32324D"
                fontSize={32}
                fontWeight={550}
                pt={2}
                mb={1}
              >
                Welcome!
              </Typography>

              <Typography
                variant="subtitle2"
                textAlign="center"
                color="#666687"
                fontSize={18}
                fontWeight={400}
                mb={4}
              >
                Sign in with your university login credentials
              </Typography>
              <LoginForm />
            </Box>
          </Card>
        </Grid>
        <Grid
          item
          md={6}
          sx={{ display: { xs: 'none', md: 'block' } }}
          justifyContent="center"
          alignItems="center"
        >
          <Box component="div" sx={SliderStyles}>
            <Box component="img" src={slide1} alt="login page icon" width={'65%'} />
            <Typography variant="h4" mt={4} px={12}>
              Welcome to the University Management Portal
            </Typography>
            <Typography variant="body1" px={12} mt={1}>
              Please log in to access your personalized dashboard. Manage academic records, view
              schedules, communicate with faculty, and stay updated with the latest campus news and
              announcements.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
);

export default Login2;
