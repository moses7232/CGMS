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
          <h1 className="text-center mb-4 display-4 font-weight-bold text-primary">Welcome to the Centralized Grievance Management System (CGMS)</h1>
          <p className="lead text-center text-muted">
          We are here to help you with any concerns. Let’s resolve issues together! </p>
        </Col>
      </Row>

      {/* Introduction to Hospitality and CGMS */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="mb-4 shadow-sm rounded">
            <Card.Body>
              <Card.Title><FaHotel className="me-2 text-secondary" />About Hospitality</Card.Title>
              <Card.Text className="text-muted">
                The hospitality industry is dedicated to providing high-quality services, comfort, and satisfaction to guests. Whether it’s hotels, resorts, or restaurants, the goal is to create a seamless, enjoyable experience for visitors. Promptly addressing guests' needs is crucial to achieving high levels of satisfaction and loyalty in this industry.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm rounded">
            <Card.Body>
              <Card.Title><FaInfoCircle className="me-2 text-secondary" />What is CGMS?</Card.Title>
              <Card.Text className="text-muted">
                The Central Grievance Management System (CGMS) is a comprehensive solution designed to address and monitor grievances within the hospitality domain. CGMS enables guests to submit issues they face during their stay, helping service providers respond effectively to ensure a positive guest experience.
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
              <Card.Title><FaListUl className="me-2 text-secondary" />Main Purpose of This Website</Card.Title>
              <Card.Text className="text-muted">
                The goal of CGMS is to provide a streamlined way for guests to communicate any concerns or issues they encounter, facilitating quick responses and resolutions. Whether it’s a maintenance issue, service complaint, or other grievance, CGMS bridges the communication between guests and service teams, ensuring all concerns are managed in a timely and organized manner.
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
              <Card.Title><FaMicrophone className="me-2 text-secondary" />How to Use This Website</Card.Title>
              <Card.Text className="text-muted">CGMS offers several options for guests to register their grievances. Here’s how each feature works:</Card.Text>
              <ul className="list-unstyled ms-3">
                <li>
                  <strong>Submit Normally:</strong> Register your grievance with details such as your name and email. This helps the service team communicate with you directly to resolve the issue.
                </li>
                <li>
                  <strong>Submit Anonymously:</strong> If you prefer to keep your identity private, submit anonymously. A unique tracking code is generated, which you can use on the "Track Grievance" page to check the status.
                </li>
                <li>
                  <strong>Voice-Activated Submission:</strong> For convenience, CGMS offers a voice-activated option, allowing you to register grievances hands-free.
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FAQ Section */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-4"><FaQuestionCircle className="me-2 text-secondary" />FAQs</h2>
          <Accordion defaultActiveKey="0" className="shadow-sm rounded">
            {[
              {
                question: "What types of issues can I report?",
                answer: "You can report issues related to your stay, such as room maintenance, housekeeping requests, or service complaints.",
              },
              {
                question: "How do I track a grievance if submitted anonymously?",
                answer: "You will receive a unique tracking code after submitting a grievance anonymously. Use this code on the 'Track Grievance' page to check the status.",
              },
              {
                question: "Will my information be shared?",
                answer: "If you choose anonymous submission, your details are not shared with the service team. Normal submissions allow them to connect with you for faster resolution.",
              },
              {
                question: "What is the purpose of the voice-activated submission option?",
                answer: "The voice-activated option provides hands-free reporting of issues, making it convenient and accessible.",
              },
              {
                question: "How long does it take for grievances to be resolved?",
                answer: "Response times depend on the nature of the grievance, but the service team aims to address all issues as promptly as possible.",
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
