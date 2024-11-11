import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, InputGroup, FormControl, Modal, Form, Spinner, Card, Row, Col, Badge, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';

function ManageGrievance() {
  const [grievances, setGrievances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [department, setDepartment] = useState('');
  const [resolvedNote, setResolvedNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Most Recent');

  // Fetch grievances
  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/grievances');
      setGrievances(response.data);
    } catch (error) {
      setErrorMessage('Failed to load grievances.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  useEffect(() => {
    fetchGrievances();
    fetchDepartments();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleShowDetails = (grievance) => {
    setSelectedGrievance(grievance);
    setShowDetails(true);
    setStatusUpdate(grievance.status);
    setDepartment(grievance.department || '');
    setResolvedNote(grievance.resolutionNote || '');
  };

  const handleUpdateStatus = async (grievanceId) => {
    if (!statusUpdate || (statusUpdate === 'In Progress' && !department) || (statusUpdate === 'Resolved' && !resolvedNote)) {
      alert('Please complete all required fields.');
      return;
    }
    try {
      const payload = { status: statusUpdate };
      if (statusUpdate === 'In Progress') payload.department = department;
      if (statusUpdate === 'Resolved') payload.resolvedNote = resolvedNote;

      await axios.put(`http://localhost:5000/api/admin/grievances/${grievanceId}`, payload);
      alert('Status updated successfully.');
      fetchGrievances();
      setShowDetails(false);
    } catch (error) {
      setErrorMessage('Failed to update grievance status.');
    }
  };

  // Apply search, status filter, and sorting
  const filteredGrievances = grievances
    .filter(grievance =>
      grievance.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'All' || grievance.status === statusFilter)
    )
    .sort((a, b) => {
      if (sortOrder === 'Most Recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === 'Oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  const renderStatusBadge = (status) => {
    const statusVariant = {
      Pending: 'warning',
      'In Progress': 'info',
      Resolved: 'success'
    }[status] || 'secondary';
    return <Badge bg={statusVariant}>{status}</Badge>;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Manage Grievances</h2>
      
      {/* Search and Filter Section */}
      <InputGroup className="mb-3 w-50 mx-auto">
        <FormControl
          placeholder="Search grievances"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      <div className="d-flex justify-content-center mb-4">
        {/* Status Filter */}
        <Dropdown onSelect={(e) => setStatusFilter(e)}>
          <Dropdown.Toggle variant="secondary" id="dropdown-status">
            Status: {statusFilter}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
            <Dropdown.Item eventKey="In Progress">In Progress</Dropdown.Item>
            <Dropdown.Item eventKey="Resolved">Resolved</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Sort Order */}
        <Dropdown className="ms-3" onSelect={(e) => setSortOrder(e)}>
          <Dropdown.Toggle variant="secondary" id="dropdown-sort">
            Sort By: {sortOrder}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="Most Recent">Most Recent</Dropdown.Item>
            <Dropdown.Item eventKey="Oldest">Oldest</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
      
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {filteredGrievances.map(grievance => (
            <Col key={grievance.grievanceId} md={6} lg={4} className="mb-4">
              <Card className="shadow-sm border-0" style={{ backgroundColor: '#f9f9f9' }}>
                <Card.Body>
                  <Card.Title>
                    {renderStatusBadge(grievance.status)}
                  </Card.Title>
                  <Card.Text>
                    <strong>Description:</strong> {grievance.description}
                  </Card.Text>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>View and manage grievance details</Tooltip>}
                  >
                    <Button variant="primary" onClick={() => handleShowDetails(grievance)}>Details</Button>
                  </OverlayTrigger>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for Grievance Details */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Grievance Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGrievance && (
            <>
              <p><strong>Description:</strong> {selectedGrievance.description}</p>
              <p><strong>Status:</strong> {selectedGrievance.status}</p>
              <p><strong>Department:</strong> {selectedGrievance.department || 'Not assigned'}</p>
              <p><strong>Resolution Note:</strong> {selectedGrievance.resolutionNote || 'Not available'}</p>
              
              {/* Status Update Dropdown */}
              <Form.Group className="mb-3">
                <Form.Label>Update Status</Form.Label>
                <Form.Control as="select" value={statusUpdate} onChange={(e) => setStatusUpdate(e.target.value)}>
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </Form.Control>
              </Form.Group>

              {/* Department Dropdown when status is In Progress */}
              {statusUpdate === "In Progress" && (
                <Form.Group className="mb-3">
                  <Form.Label>Select Department</Form.Label>
                  <Form.Control as="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept.name}>{dept.name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}

              {/* Resolution Note Input when status is Resolved */}
              {statusUpdate === "Resolved" && (
                <Form.Group className="mb-3">
                  <Form.Label>Resolution Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Enter resolution notes"
                    value={resolvedNote}
                    onChange={(e) => setResolvedNote(e.target.value)}
                  />
                </Form.Group>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>Close</Button>
          <Button variant="success" onClick={() => handleUpdateStatus(selectedGrievance._id)}>Update Status</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageGrievance;
