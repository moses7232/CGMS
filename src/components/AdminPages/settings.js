import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, FormControl, Modal, Alert } from 'react-bootstrap';

function AdminSettings() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({ name: '', email: '', username: '', password: '' });
  const [activityLog, setActivityLog] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch existing departments from backend
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setNotification('Failed to fetch departments.');
    }
  };

  // Generate random password for security
  const generatePassword = () => Math.random().toString(36).slice(-8);

  const handleInputChange = (e) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };

  const handleCreateDepartment = async () => {
    if (!newDepartment.name || !newDepartment.email) {
      setNotification("Please provide both name and email for the department.");
      return;
    }

    const username = newDepartment.name.toLowerCase().replace(/\s+/g, '') + Date.now().toString().slice(-3);
    const password = generatePassword();
    const departmentData = { ...newDepartment, username, password };

    try {
      await axios.post('http://localhost:5000/api/admin/createDepartment', departmentData);
      setDepartments([...departments, departmentData]); // Add new department to list
      setActivityLog([...activityLog, `Created department: ${newDepartment.name}`]);
      setNewDepartment({ name: '', email: '', username: '', password: '' });
      setShowModal(false);

      await handleSendEmail(departmentData); // Email credentials
    } catch (error) {
      console.error('Error creating department:', error);
      setNotification('Failed to create department.');
    }
  };

  const handleSendEmail = async ({ name, email, username, password }) => {
    try {
      await axios.post('http://localhost:5000/api/admin/sendEmail', {
        to: email,
        subject: 'Your Department Credentials',
        text: `Hello ${name},\n\nHere are your login credentials:\nUsername: ${username}\nPassword: ${password}\n\nBest regards,\nAdmin Team`
      });
      setNotification(`Credentials sent to ${email}`);
      setActivityLog([...activityLog, `Sent credentials to ${name} at ${email}`]);
    } catch (error) {
      console.error('Error sending email:', error);
      setNotification('Failed to send email.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Settings</h2>

      {notification && <Alert variant="info" onClose={() => setNotification('')} dismissible>{notification}</Alert>}

      <Button variant="primary" onClick={() => setShowModal(true)}>Create Department</Button>

      {/* Table of Departments */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Department</th>
            <th>Email</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, index) => (
            <tr key={index}>
              <td>{dept.name}</td>
              <td>{dept.email}</td>
              <td>{dept.username}</td>
              <td>
                <Button variant="info" onClick={() => handleSendEmail(dept)}>Resend Credentials</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Activity Log */}
      <h5>Activity Log</h5>
      <ul className="list-group">
        {activityLog.map((log, index) => (
          <li key={index} className="list-group-item">{log}</li>
        ))}
      </ul>

      {/* Modal for Creating a New Department */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Department Name</Form.Label>
              <FormControl
                name="name"
                value={newDepartment.name}
                onChange={handleInputChange}
                placeholder="Enter department name"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <FormControl
                name="email"
                value={newDepartment.email}
                onChange={handleInputChange}
                placeholder="Enter department email"
                type="email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleCreateDepartment}>Create</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminSettings;
