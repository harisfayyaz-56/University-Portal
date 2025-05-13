import React from 'react';
import { Typography, Box, Grid, Card, CardContent, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PageContainer from 'src/components/container/PageContainer';

const data = [
  {
    title: 'Total Students',
    value: 1240,
    icon: <SchoolIcon />,
    color: 'primary.main',
  },
  {
    title: 'Courses Offered',

    value: 86,
    icon: <MenuBookIcon />,
    color: 'success.main',
  },
  {
    title: 'Faculty Members',
    value: 75,
    icon: <GroupIcon />,
    color: 'secondary.main',
  },
];

const Dashboard = () => {
  return (
    <PageContainer title="University Student Dashboard" description="University Student Overview">
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to the University Student Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Get insights into university operations at a glance
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={4}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: item.color,
                      width: 48,
                      height: 48,
                      mr: 2,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
};

export default Dashboard;
