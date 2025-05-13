import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { ListItemIcon, ListItem, List, styled, ListItemText, useTheme } from '@mui/material';

const NavItem = ({ item, level, onClick }) => {

  const theme = useTheme();

  const ListItemStyled = styled(ListItem)(() => ({
    whiteSpace: 'nowrap',
    margin: '2px ',
    padding: '8px 36px',
    borderRadius: '8px',
    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
    color: theme.palette.text.primary,
    '&.Mui-selected': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
    },
  }));
  const location = useLocation();

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled
        button
        component={item.external ? 'a' : NavLink}
        to={item.href}
        href={item.external ? item.href : ''}
        disabled={item.disabled}
        selected={location.pathname.includes(item.href)}
        target={item.external ? '_blank' : ''}
        onClick={onClick}
      >
        <ListItemIcon
          sx={{
            minWidth: '36px',
            p: '3px 0',
            color: 'inherit',
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          sx={{
            fontWeight: 'inherit',
          }}
        >
          <>{item.title}</>
        </ListItemText>
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
};

export default NavItem;
