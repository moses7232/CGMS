import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Button, NavDropdown, Container, Row, Col, Alert } from 'react-bootstrap';
import Home from './Home';
import RegisterGrievance from './RegisterGrievance';
import TrackGrievance from './TrackGrievance';
import UserProfile from './UserProfile';
import '../UserDashboard.css';

function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar bg="dark" variant="dark" expand="md" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard" className="fw-bold ">CGMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard/home">Home</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/register-grievance">Register Grievance</Nav.Link>
              <Nav.Link as={Link} to="/dashboard/track-grievance">Track Grievance</Nav.Link>
            </Nav>
            {/* User Dropdown for Profile & Logout */}
            <Nav>
              <NavDropdown title="User" id="navbar-user-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/dashboard/profile">User Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="flex-grow-1 mb-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="register-grievance" element={<RegisterGrievance />} />
          <Route path="track-grievance" element={<TrackGrievance />} />
          <Route path="profile" element={<UserProfile />} />
        </Routes>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white mt-auto py-4">
        <Container>
          <Row>
            <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
              <h5>Contact Us</h5>
              <p className="small">Email: support@cgms.com</p>
              <p className="small">Phone: +1 (234) 567-890</p>
              <p className="small">Address: 123 Main St, Anytown, USA</p>
            </Col>
            <Col md={4} className="text-center mb-3 mb-md-0">
              <h5>Quick Links</h5>
              <Nav className="flex-column">
                <Nav.Link as={Link} to="/dashboard/home" className="text-white-50">Home</Nav.Link>
                <Nav.Link as={Link} to="/dashboard/register-grievance" className="text-white-50">Register Grievance</Nav.Link>
                <Nav.Link as={Link} to="/dashboard/track-grievance" className="text-white-50">Track Grievance</Nav.Link>
              </Nav>
            </Col>
            <Col md={4} className="text-center text-md-end">
              <h5>Legal</h5>
              <Nav className="flex-column">
                <Nav.Link href="#" className="text-white-50">Privacy Policy</Nav.Link>
                <Nav.Link href="#" className="text-white-50">Terms of Service</Nav.Link>
              </Nav>
              <p className="small mt-2">© {new Date().getFullYear()} CGMS. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default UserDashboard;
