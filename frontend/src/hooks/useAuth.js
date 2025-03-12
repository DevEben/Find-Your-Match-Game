// useAuth.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    const fetchUser = async () => {
      try {
        const response = await axios.get('https://spiraltech-api.onrender.com/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
        }
      }
    };

    if (token) {
      fetchUser();
    }
  }, []);

  return user;
};

export default useAuth;
