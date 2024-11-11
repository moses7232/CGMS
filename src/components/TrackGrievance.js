import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaSearch, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import '../TrackGrievance.css';

function TrackGrievance() {
  const [grievances, setGrievances] = useState([]);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackedGrievance, setTrackedGrievance] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState({});
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const fetchGrievances = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/fetch-grievances', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGrievances(response.data);
    } catch (error) {
      console.error('Error fetching grievances:', error);
      setErrorMessage('Failed to load grievances. Please try again.');
    }
  };

  const handleTrackByCode = async () => {
    setLoading(true);
    setErrorMessage('');
    setTrackedGrievance(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/auth/fetch-anonymous-grievances/${trackingCode}`);
      setTrackedGrievance(response.data);
    } catch (error) {
      console.error('Error tracking grievance:', error);
      setErrorMessage('No grievance found with that tracking code.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackChange = (grievanceId, key, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [grievanceId]: {
        ...prev[grievanceId],
        [key]: value,
      },
    }));
  };

  const handleFeedbackSubmit = async (grievanceId, category) => {
    const feedbackData = feedbacks[grievanceId] || {};
    if (!feedbackData.text || !feedbackData.rating) return;

    try {
      await axios.post('http://localhost:5000/api/auth/submit-feedback', {
        grievanceId,
        rating: feedbackData.rating,
        comment: feedbackData.text,
        department: category,
      });
      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackSuccess(false), 3000);
      setFeedbacks((prev) => ({
        ...prev,
        [grievanceId]: { text: '', rating: 1 },
      }));
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrorMessage('Failed to submit feedback. Please try again.');
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Track Your Grievances</h1>
      <p className="text-center">View all previously submitted grievances and track their status.</p>

      {errorMessage && (
        <Alert variant="danger" className="d-flex align-items-center justify-content-center">
          <FaExclamationTriangle className="me-2" />
          {errorMessage}
        </Alert>
      )}

      {feedbackSuccess && (
        <Alert variant="success" className="d-flex align-items-center justify-content-center">
          <FaCheckCircle className="me-2" />
          Feedback submitted successfully!
        </Alert>
      )}

      <h2 className="text-center mt-4">Track Anonymous Grievance</h2>
      <Form className="d-flex justify-content-center align-items-center mb-4">
        <Form.Group controlId="trackingCode" className="me-2">
          <Form.Control
            type="text"
            value={trackingCode}
            onChange={(e) => setTrackingCode(e.target.value)}
            placeholder="Enter your tracking code"
            className="shadow-sm"
          />
        </Form.Group>
        <Button variant="primary" onClick={handleTrackByCode} disabled={loading}>
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              {' Tracking...'}
            </>
          ) : (
            <>
              Track Grievance <FaSearch className="ms-1" />
            </>
          )}
        </Button>
      </Form>

      {trackedGrievance && (
        <div className="mt-4">
          <h3 className="text-center">Tracked Grievance Details</h3>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Description: {trackedGrievance.description}</Card.Title>
              <Card.Text><strong>Category:</strong> {trackedGrievance.category}</Card.Text>
              <Card.Text><strong>Status:</strong> {trackedGrievance.status}</Card.Text>
              {trackedGrievance.resolutionNote && <Card.Text><strong>Resolution Note:</strong> {trackedGrievance.resolutionNote}</Card.Text>}
            </Card.Body>
          </Card>
        </div>
      )}

      <h2 className="text-center mt-4">Your Submitted Grievances</h2>
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="text-center bg-warning text-white" as="h5">Pending Grievances</Card.Header>
            <Card.Body>
              {grievances.filter(g => g.status === 'Pending' || g.status === 'In Progress').length === 0 ? (
                <p className="text-center">No pending grievances.</p>
              ) : (
                grievances.filter(g => g.status === 'Pending').map(grievance => (
                  <Card key={grievance.grievanceId} className="mb-3 border-warning">
                    <Card.Body>
                      <Card.Title>Description: {grievance.description}</Card.Title>
                      <Card.Text><strong>Category:</strong> {grievance.category}</Card.Text>
                      <Card.Text><strong>Status:</strong> {grievance.status}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="text-center bg-success text-white" as="h5">Resolved Grievances</Card.Header>
            <Card.Body>
              {grievances.filter(g => g.status === 'Resolved').length === 0 ? (
                <p className="text-center">No resolved grievances.</p>
              ) : (
                grievances.filter(g => g.status === 'Resolved').map(grievance => (
                  <Card key={grievance.grievanceId} className="mb-3 border-success">
                    <Card.Body>
                      <Card.Title>Description: {grievance.description}</Card.Title>
                      <Card.Text><strong>Category:</strong> {grievance.category}</Card.Text>
                      <Card.Text><strong>Status:</strong> {grievance.status}</Card.Text>
                      <Card.Text><strong>Resolution Note:</strong> {grievance.resolutionNote}</Card.Text>

                      <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleFeedbackSubmit(grievance._id, grievance.category);
                      }}>
                        <Form.Group controlId={`feedback-rating-${grievance._id}`}>
                          <Form.Label>Rating:</Form.Label>
                          <Form.Control
                            as="select"
                            value={feedbacks[grievance._id]?.rating || 1}
                            onChange={(e) => handleFeedbackChange(grievance._id, 'rating', e.target.value)}
                          >
                            {[1, 2, 3, 4, 5].map((n) => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </Form.Control>
                        </Form.Group>

                        <Form.Group controlId={`feedback-text-${grievance._id}`}>
                          <Form.Label>Provide Feedback:</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={feedbacks[grievance._id]?.text || ''}
                            onChange={(e) => handleFeedbackChange(grievance._id, 'text', e.target.value)}
                            placeholder="Enter your feedback"
                          />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-2">
                          Submit Feedback
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TrackGrievance;
