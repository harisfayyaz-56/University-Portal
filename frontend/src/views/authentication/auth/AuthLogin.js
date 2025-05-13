import React, { useState } from 'react';
import axios from 'src/utils/axios';
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import { Email, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { errorToast, successToast } from 'src/shared/Toast';

const RoleEnum = {
  ADMIN: 'Admin',
  STUDENT: 'Student',
  FACULTY: 'Faculty',
};

const LoginForm = () => {
  const [values, setValues] = useState({
    email: 'admin@example.com',
    password: 'admin123',
    showPassword: false,
  });
  const navigate = useNavigate();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (e) => {
    const body = {
      Email: values.email,
      Password: values.password,
    };
    
  
    try {
      const { data } = await axios.post('/login', body);

      console.log('Login response:', data);

      if (data?.status) {
        const token = data.data?.token;
        const role = data.data?.role;

        localStorage.setItem('authToken', token);
       
        switch (role) {
          case RoleEnum.ADMIN:
            navigate('/admin');
            break;
          case RoleEnum.STUDENT:
            navigate('/student');
            break;
          case RoleEnum.FACULTY:
            navigate('/faculty');
            break;
          default:
            navigate('/login');
            break;
        }

        successToast(data.message);
      } else {
        errorToast('Invalid Credentials');
      }
    } catch (error) {
      errorToast('Login failed');

      console.error('Login failed', error);
    }
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: 1 }} component="form">
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Email Address
        </Typography>
        <TextField
          id="email"
          type="email"
          fullWidth
          value={values.email}
          onChange={handleChange('email')}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            Password
          </Typography>
          <Typography variant="h7" sx={{ marginBottom: 1 }}>
            Forget Password?
          </Typography>
        </Box>
        <TextField
          id="password"
          type={values.showPassword ? 'text' : 'password'}
          fullWidth
          value={values.password}
          onChange={handleChange('password')}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{
            borderRadius: '20px',
            width: '50%',
            margin: 'auto',
            '&:hover': {
              backgroundColor: '#5C6F91',
            },
          }}
        >
          Login
        </Button>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
