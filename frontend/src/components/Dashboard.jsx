// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/'); // Redirect to login if no token
        return;
      }

      try {
        const response = await axios.get('https://spiraltech-api.onrender.com/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched user data:', response.data.data);

        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error or redirect to login if unauthorized
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/'); // Redirect to login
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    // Remove token and redirect to login
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {userData ? (
        <div>
          <h1>Welcome, {userData.username}!</h1>
          <p>Email: {userData.email}</p>
          <img src={userData.photo} alt="User Profile" className="profile-image" />
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;
