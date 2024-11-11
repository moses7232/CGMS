import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Button, Card } from 'react-bootstrap';
import './AdminHome.css'; // Ensure you create this CSS file for custom styles.

function AdminHome() {
  const [grievanceStats, setGrievanceStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
  const [userCount, setUserCount] = useState(0);
  const [feedbackStats, setFeedbackStats] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const grievanceResponse = await axios.get('http://localhost:5000/api/admin/grievance-stats');
      const userResponse = await axios.get('http://localhost:5000/api/admin/user-count');
      const feedbackResponse = await axios.get('http://localhost:5000/api/admin/feedback-stats');

      setGrievanceStats(grievanceResponse.data);
      setUserCount(userResponse.data.count);
      setFeedbackStats(feedbackResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setErrorMessage('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard container mt-4 p-4 shadow rounded">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <div className="row mt-4">
          <div className="col-md-6">
            <Card className="mb-4 stat-card">
              <Card.Header className="stat-card-header">Grievance Statistics</Card.Header>
              <Card.Body className="stat-card-body">
                <p><strong>Pending:</strong> {grievanceStats.pending}</p>
                <p><strong>In Progress:</strong> {grievanceStats.inProgress}</p>
                <p><strong>Resolved:</strong> {grievanceStats.resolved}</p>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6">
            <Card className="mb-4 stat-card">
              <Card.Header className="stat-card-header">User Statistics</Card.Header>
              <Card.Body className="stat-card-body">
                <p><strong>Total Users:</strong> {userCount}</p>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-12">
            <Card className="mb-4 feedback-card">
              <Card.Header className="feedback-card-header">Feedback Statistics</Card.Header>
              <Card.Body className="feedback-card-body">
                {feedbackStats.length > 0 ? (
                  feedbackStats.map((stat, index) => (
                    <div key={index} className="feedback-item">
                      <p><strong>Department:</strong> {stat._id || 'Unspecified'}</p>
                      <p><strong>Average Rating:</strong> {stat.averageRating ? stat.averageRating.toFixed(2) : 'N/A'}</p>
                      <p><strong>Total Feedbacks:</strong> {stat.count}</p>
                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No feedback data available for resolved grievances.</p>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      <div className="text-center mt-4">
        <Button onClick={fetchDashboardData} variant="primary" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
    </div>
  );
}

export default AdminHome;
