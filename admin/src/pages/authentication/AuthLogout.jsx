import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import useAuthStore from 'store/useAuthStore.js';

const AuthLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    logout();
    navigate('/');
  });

  return <></>;
};

export default AuthLogout;
