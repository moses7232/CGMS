// src/pages/Home.js

import React from 'react';
import { Container, Row, Col, Accordion, Card } from 'react-bootstrap';
import { FaHotel, FaInfoCircle, FaQuestionCircle, FaListUl, FaMicrophone } from 'react-icons/fa';
import '../home.css'; // Updated CSS for enhancements

function Home() {
  return (
    <Container className="home-container mt-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4 display-4 font-weight-bold text-primary">
            Welcome to CGMS Guest Connect – Centralized Solutions for Every Guest Need
          </h1>
          <p className="lead text-center text-muted">
            We're here to ensure your stay is nothing short of exceptional. Share your concerns, and let us resolve them for a better experience!
          </p>
        </Col>
      </Row>

      {/* Introduction to Hospitality and CGMS */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="mb-4 shadow-sm rounded">
            <Card.Body>
              <Card.Title><FaHotel className="me-2 text-secondary" />About the Hospitality Industry</Card.Title>
              <Card.Text className="text-muted">
                The hospitality industry is dedicated to creating memorable and comfortable experiences for guests. From top-notch service to seamless guest support, every detail matters. Your satisfaction drives our efforts!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm rounded">
            <Card.Body>
              <Card.Title><FaInfoCircle className="me-2 text-secondary" />What is CGMS?</Card.Title>
              <Card.Text className="text-muted">
                The Centralized Grievance Management System (CGMS) is designed to handle and streamline guest concerns efficiently. Submit your grievances, track their progress, and experience quick, thoughtful responses.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Purpose of CGMS */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm rounded">
            <Card.Body>
              <Card.Title><FaListUl className="me-2 text-secondary" />Our Purpose</Card.Title>
              <Card.Text className="text-muted">
                CGMS is here to simplify the way you communicate your needs and concerns during your stay. Our goal is to resolve issues promptly and keep you informed, so you can focus on enjoying your time.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* How to Use the Website */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm rounded">
            <Card.Body>
              <Card.Title><FaMicrophone className="me-2 text-secondary" />How to Use CGMS</Card.Title>
              <Card.Text className="text-muted">Our platform makes it easy to report and track any concerns you may have. Here’s how:</Card.Text>
              <ul className="list-unstyled ms-3">
                <li>
                  <strong>Submit Normally:</strong> Share details like your name and email, so our team can reach out for personalized assistance.
                </li>
                <li>
                  <strong>Submit Anonymously:</strong> Prefer privacy? Submit anonymously, and we’ll give you a unique tracking code to follow up without sharing personal information.
                </li>
                <li>
                  <strong>Voice-Activated Submission:</strong> Hands-free convenience! Use our voice option to submit issues quickly and effortlessly.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FAQ Section */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-4"><FaQuestionCircle className="me-2 text-secondary" />Frequently Asked Questions</h2>
          <Accordion defaultActiveKey="0" className="shadow-sm rounded">
            {[
              {
                question: "What types of issues can I report?",
                answer: "Feel free to report any issues impacting your stay, like room maintenance, housekeeping requests, or other service concerns.",
              },
              {
                question: "How can I track a grievance submitted anonymously?",
                answer: "After submitting anonymously, you'll receive a tracking code. Use it on the 'Track Grievance' page to follow up on your concern.",
              },
              {
                question: "Will my information be kept private?",
                answer: "Yes, especially with anonymous submissions. For normal submissions, your contact details enable us to assist you directly.",
              },
              {
                question: "What is the purpose of the voice-activated option?",
                answer: "Our voice-activated submission lets you register grievances hands-free, making the process more accessible and convenient.",
              },
              {
                question: "How long will it take to resolve my concern?",
                answer: "We aim to resolve all grievances swiftly. Response times vary, but rest assured, our team is committed to addressing each issue promptly.",
              },
            ].map((item, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{item.question}</Accordion.Header>
                <Accordion.Body className="text-muted">{item.answer}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
