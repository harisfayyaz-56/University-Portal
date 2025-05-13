import React from 'react';
import { Box, Typography } from '@mui/material';

const PageHeader = ({ title }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        {title}
      </Typography>
    </Box>
  );
};

export default PageHeader;
