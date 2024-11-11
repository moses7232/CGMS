// src/pages/RegisterGrievance.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMicrophone, FaPaperPlane, FaExclamationTriangle, FaCheckCircle, FaSpinner } from 'react-icons/fa';

function RegisterGrievance() {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setIsVerified(response.data.verified);
      } catch (error) {
        console.error('Error checking verification status:', error);
        setErrorMessage('Failed to load verification status. Please try again.');
      }
    };
    checkVerificationStatus();
  }, []);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join('');
      setDescription((prevDescription) => prevDescription + ' ' + transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
  }

  const handleVoiceInput = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setTrackingCode(null);

    const grievanceData = { description, category: category || undefined, isAnonymous };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/grievances', grievanceData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setSuccessMessage('Grievance submitted successfully!');
      if (response.data.trackingCode) setTrackingCode(response.data.trackingCode);
      setDescription('');
      setCategory('');
      setIsAnonymous(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to submit grievance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">Register a Grievance</h1>

      {!isVerified && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <FaExclamationTriangle className="me-2" />
          Please verify your account in the <a href="/dashboard/profile" className="alert-link">User Profile</a> page before submitting a grievance.
        </div>
      )}

      {isVerified && (
        <div className="card p-4 shadow-lg rounded">
          <div className="card-body">
            {errorMessage && <div className="alert alert-danger fade show">{errorMessage}</div>}
            {successMessage && (
              <div className="alert alert-success d-flex align-items-center fade show">
                <FaCheckCircle className="me-2" />
                {successMessage}
              </div>
            )}
            {trackingCode && (
              <div className="alert alert-info mt-2">
                <p>Your grievance was submitted anonymously.</p>
                <p><strong>Tracking Code:</strong> {trackingCode}</p>
                <p>Save this code to check your grievance status in the future.</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label htmlFor="description" className="fw-bold">Description:</label>
                <textarea
                  id="description"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <button
                type="button"
                className={`btn mt-2 ${isListening ? 'btn-danger' : 'btn-secondary'}`}
                onClick={handleVoiceInput}
                disabled={loading}
                title="Use Voice Input"
              >
                <FaMicrophone className="me-1" />
                {isListening ? 'Stop Listening' : 'Use Voice Input'}
              </button>

              <div className="form-group mb-3">
                <label htmlFor="category" className="fw-bold">Category:</label>
                <select
                  id="category"
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="service">Service</option>
                </select>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  className="form-check-input"
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(!isAnonymous)}
                />
                <label htmlFor="isAnonymous" className="form-check-label fw-bold">Submit Anonymously</label>
              </div>

              <button type="submit" className="btn btn-primary d-flex align-items-center" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner-border-sm me-2" /> Submitting...
                  </>
                ) : (
                  <>
                    Submit Grievance <FaPaperPlane className="ms-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterGrievance;
