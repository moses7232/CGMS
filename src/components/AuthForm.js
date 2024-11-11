import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaUser, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'danger'
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin
            ? 'http://localhost:5000/api/auth/login'
            : 'http://localhost:5000/api/auth/register';

        const payload = isLogin ? { email, password } : { username, email, password };

        try {
            const response = await axios.post(url, payload);
            setMessage(isLogin ? 'Welcome back! You’ve successfully logged in.' : 'Registration successful! You can now log in to continue.');
            setMessageType('success');
            if (isLogin) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error during submission:', error);
            setMessage(error.response?.data?.message || 'Oops! Something went wrong. Please try again.');
            setMessageType('danger');
        }
    };

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="text-center mb-4">
                <h1 className="display-4 text-primary">Welcome to CGMS Guest Connect – Centralized Solutions for Every Guest Need
</h1>
                <p className="text-muted lead">Login or sign up to access seamless, secure, and efficient grievance resolution.</p>
            </div>
            
            <Card className="p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">{isLogin ? 'Welcome Back!' : 'Join Us Today!'}</h2>

                {/* Display success/error message */}
                {message && (
                    <Alert variant={messageType} className="d-flex align-items-center text-center">
                        {messageType === 'success' ? <FaCheckCircle className="me-2" /> : <FaExclamationCircle className="me-2" />}
                        {message}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <Form.Group className="mb-3" controlId="username">
                            <div className="input-group">
                                <span className="input-group-text"><FaUser /></span>
                                <Form.Control
                                    type="text"
                                    placeholder="Choose a Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </Form.Group>
                    )}
                    <Form.Group className="mb-3" controlId="email">
                        <div className="input-group">
                            <span className="input-group-text"><FaEnvelope /></span>
                            <Form.Control
                                type="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <div className="input-group">
                            <span className="input-group-text"><FaLock /></span>
                            <Form.Control
                                type="password"
                                placeholder="Enter Your Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="w-100 fw-bold py-2">
                        {isLogin ? 'Log In' : 'Create Account'}
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <Button
                        variant="link"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-decoration-none"
                    >
                        {isLogin ? "New here? Sign Up to Get Started" : "Already have an account? Log In"}
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default AuthForm;
