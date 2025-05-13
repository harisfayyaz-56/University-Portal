import React, { Fragment } from 'react';
import { useLocation } from 'react-router';
import { Box, Divider, List } from '@mui/material';
import NavItem from './NavItem';
import {
  AdminMenuItems,
  StudentMenuItems,
  FacultyMenuItems,
} from './MenuItems';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;

  let Menuitems = [];

  if (pathname.startsWith('/admin')) {
    Menuitems = AdminMenuItems;
  } else if (pathname.startsWith('/student')) {
    Menuitems = StudentMenuItems;
  } else if (pathname.startsWith('/faculty')) {
    Menuitems = FacultyMenuItems;
  }

  return (
    <Box sx={{ px: 0 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => (
          <Fragment key={item.id}>
            <NavItem item={item} pathDirect={pathDirect} />
            {item.hasBorder ? <Divider variant="fullWidth" sx={{ my: 1 }} /> : null}
          </Fragment>
        ))}
      </List>
    </Box>
  );
};

export default SidebarItems;
