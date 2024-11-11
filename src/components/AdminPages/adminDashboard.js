import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import AdminHome from './adminHome';
import GrievanceManagement from './manageGrievance';
import Settings from './settings';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the JWT token or any session data
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/');
  };

  return (
    <div>
      {/* Navbar for Admin Dashboard */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Navbar.Brand as={Link} to="/dashboard">Admin Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/dashboard/manage-grievances">Manage Grievances</Nav.Link>
          </Nav>
          
          {/* Admin Dropdown for Profile, Settings, and Logout */}
          <Nav>
            <NavDropdown title="Admin" id="navbar-admin-dropdown" align="end">
              <NavDropdown.Item as={Link} to="/dashboard/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Nested Routes for Admin Dashboard Pages */}
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="home" element={<AdminHome />} />
        <Route path="manage-grievances" element={<GrievanceManagement />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default AdminDashboard;
