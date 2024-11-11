import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Spinner, Toast, Card } from 'react-bootstrap';
import { FaPen, FaCheckCircle, FaTimesCircle, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../DepartmentDashboard.css'; 
import moment from 'moment';

function DepartmentDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedGrievances();
  }, []);

  const fetchAssignedGrievances = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/department/grievances', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setGrievances(response.data);
    } catch (error) {
      console.error('Failed to load grievances', error);
      showToastMessage('Failed to load grievances. Please try again later.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message, variant) => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShowModal = (grievance) => {
    setSelectedGrievance(grievance);
    setStatusUpdate(grievance.status);
    setResolutionNote(grievance.resolutionNote || '');
    setShowModal(true);
  };

  const handleUpdateGrievance = async () => {
    if (!statusUpdate) {
      alert('Please select a status.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/department/grievances/${selectedGrievance._id}`, {
        status: statusUpdate,
        resolutionNote
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showToastMessage('Grievance updated successfully', 'success');
      fetchAssignedGrievances();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to update grievance', error);
      showToastMessage('Failed to update grievance. Please try again later.', 'danger');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const calculateDaysSinceCreation = (createdAt) => {
    const createdDate = moment(createdAt);
    return moment().diff(createdDate, 'days');
  };

  return (
    <div className="container mt-4">
      <Button variant="outline-danger" onClick={handleLogout} className="mb-3 d-flex align-items-center">
        <FaSignOutAlt className="me-2" /> Logout
      </Button>
      <Card className="p-4 shadow-sm">
        <h2 className="mb-4 text-center text-primary">Assigned Grievances</h2>

        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastVariant} className="position-absolute top-0 start-50 translate-middle-x mt-4 shadow">
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table hover responsive className="shadow-sm rounded">
            <thead className="bg-primary text-white rounded-top">
              <tr>
                <th>Description</th>
                <th>Status</th>
                <th>Resolution Note</th>
                <th>Days Since Created</th>
                <th>User Name</th>
                <th>User Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {grievances.map((grievance) => (
                <tr key={grievance._id} className="align-middle">
                  <td>{grievance.description}</td>
                  <td>
                    <span className={`badge ${grievance.status === 'Resolved' ? 'bg-success' : 'bg-warning'}`}>
                      {grievance.status}
                    </span>
                  </td>
                  <td>{grievance.resolutionNote || 'Not available'}</td>
                  <td>{calculateDaysSinceCreation(grievance.createdAt)} days</td>
                  <td>{grievance.isAnonymous ? 'Anonymous' : grievance.username}</td>
                  <td>{grievance.isAnonymous ? 'Anonymous' : grievance.email}</td>
                  <td>
                    <Button variant="info" onClick={() => handleShowModal(grievance)} className="mx-1 d-flex align-items-center">
                      <FaPen className="me-1" /> Update
                    </Button>
                    {grievance.status === 'Resolved' ? (
                      <Button variant="success" className="mx-1 d-flex align-items-center" disabled>
                        <FaCheckCircle className="me-1" /> Resolved
                      </Button>
                    ) : (
                      <Button variant="warning" className="mx-1 d-flex align-items-center">
                        <FaTimesCircle className="me-1" /> Not Resolved
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Grievance</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedGrievance && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select value={statusUpdate} onChange={(e) => setStatusUpdate(e.target.value)}>
                    <option value="">Select Status</option>
                    <option value="Resolved">Resolved</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Resolution Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdateGrievance}>Update</Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </div>
  );
}

export default DepartmentDashboard;
