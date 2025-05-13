import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthGuard({ children }) {
  // const navigate = useNavigate();
  // const accessToken = localStorage.getItem('authToken');

  // useEffect(() => {
  //   if (!accessToken) {
  //     localStorage.clear();
  //     navigate('/auth/login');
  //   }
  // }, [navigate, accessToken]);

  // return accessToken ? children : null;
  return children;
}

export default AuthGuard;
