import React from 'react';
import { AppBar, Toolbar, styled, Stack, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';

const Header = (props) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    width: '100%',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '50px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
    justifyContent: 'space-between',
  }));

  return (
    <AppBarStyled
      position="sticky"
      color="default"
      sx={{ borderBottom: 1, borderColor: '#EEEEEE', bgcolor: '#FFFFFF' }}
    >
      <ToolbarStyled>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            display: {
              lg: 'inline',
              xs: 'none',
            },
          }}
        >
          <Typography variant="h5" component="div">
            Portal
          </Typography>
        </Stack>
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            display: {
              lg: 'none',
              xs: 'inline',
            },
          }}
        >
          <IconButton color="inherit" aria-label="menu" onClick={props.toggleMobileSidebar}>
            <MenuIcon width="20" height="20" />
          </IconButton>
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
