import { Link } from 'react-router-dom';
import LogoMedia from '../../../../assets/images/logos/logo.png';
import { Box, styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  display: 'block',
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <Box component="img" src={LogoMedia} alt="logo" />
    </LinkStyled>
  );
};

export default Logo;
