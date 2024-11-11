import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function UserProfile() {
  const [userData, setUserData] = useState({ username: '', email: '', verified: false });
  const [editMode, setEditMode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserData(response.data);
        setNewEmail(response.data.email);
        setNewUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Failed to load user data.');
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      await axios.put(
        'http://localhost:5000/api/auth/user/profile',
        { email: newEmail, username: newUsername },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUserData({ ...userData, email: newEmail, username: newUsername });
      setSuccessMessage('Profile updated successfully.');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile.');
    }
  };

  const requestVerificationCode = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/request-verification', { email: userData.email });
      setVerificationStatus('Verification code sent to your email.');
    } catch (error) {
      console.error('Error requesting verification code:', error);
      setVerificationStatus('Failed to send verification code.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-code', {
        email: userData.email,
        enteredCode: verificationCode,
      });
      setUserData({ ...userData, verified: true });
      setVerificationStatus(response.data.message);
    } catch (error) {
      console.error('Error verifying code:', error);
      setVerificationStatus('Invalid or expired verification code.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="p-4 shadow">
            <Card.Body>
              <Card.Title className="text-center mb-4">Your Profile</Card.Title>

              {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
              {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly={!editMode}
                    value={editMode ? newUsername : userData.username}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    readOnly={!editMode}
                    value={editMode ? newEmail : userData.email}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Verified Status</Form.Label>
                  <Form.Control
                    type="text"
                    readOnly
                    value={userData.verified ? 'Verified' : 'Not Verified'}
                  />
                </Form.Group>

                {editMode ? (
                  <div className="d-flex justify-content-between">
                    <Button variant="primary" onClick={handleUpdate}>Save Changes</Button>
                    <Button variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant="primary" className="w-100" onClick={() => setEditMode(true)}>Edit Profile</Button>
                )}
              </Form>

              {/* Verification Section */}
              {!userData.verified && (
                <div className="mt-4">
                  <Card.Title className="text-center mb-2">Email Verification</Card.Title>
                  <p className="text-center">{verificationStatus}</p>
                  <div className="d-flex justify-content-center mb-3">
                    <Button variant="info" onClick={requestVerificationCode}>
                      Request Verification Code
                    </Button>
                  </div>
                  <Form.Group className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Enter Verification Code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <Button variant="success" onClick={handleVerifyCode} className="ms-2">
                      Verify
                    </Button>
                  </Form.Group>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;
