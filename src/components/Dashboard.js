import React from 'react';
import { jwtDecode } from 'jwt-decode';
import AdminDashboard from './AdminPages/adminDashboard';
import UserDashboard from './UserDashboard';
import DepartmentDashboard from './departmentDashboard';

const Dashboard = () => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage or other storage
  let role = null;

  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  if (role === 'admin') {
    return <AdminDashboard />;
  } 
  else if (role === 'user') {
    return <UserDashboard />;
  } 
  else if (role === 'Department') { // Add condition for department personnel
    return <DepartmentDashboard />;
  }
  else {
    return <p>Please log in to access the dashboard.</p>;
  }
};

export default Dashboard;