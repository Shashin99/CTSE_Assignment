import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Form,
    Button,
    Card,
    Container,
    InputGroup,
    Spinner,
} from "react-bootstrap";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const colors = {
        primary: "#2c3e50",
        secondary: "#f9a825",
        light: "#f8f9fa",
        dark: "#343a40",
        border: "#dee2e6",
        success: "#28a745",
        danger: "#dc3545",
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        setMessage('');
        setError('');

        // Validate email
        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Prevent multiple submissions
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
            setMessage(response.data.message);
            
            await Swal.fire({
                title: "Success!",
                text: "Password reset link has been sent to your email",
                icon: "success",
                background: colors.light,
                confirmButtonColor: colors.primary,
                timer: 2000,
                showConfirmButton: false,
            });

            // Redirect to login page after success
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            
            Swal.fire({
                title: "Error",
                text: err.response?.data?.message || 'An error occurred',
                icon: "error",
                background: colors.light,
                confirmButtonColor: colors.primary,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh", backgroundColor: colors.light }}
        >
            <Card
                className="shadow-lg"
                style={{ width: "600px", borderColor: colors.border }}
            >
                <Card.Header
                    className="py-3"
                    style={{
                        backgroundColor: colors.primary,
                        borderBottom: `3px solid ${colors.secondary}`,
                    }}
                >
                    <h4 className="mb-0 text-white text-center">FORGOT PASSWORD</h4>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">
                                Email Address
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Text
                                    style={{
                                        backgroundColor: colors.secondary,
                                        color: colors.primary,
                                    }}
                                >
                                    <FiMail />
                                </InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    style={{
                                        borderColor: error ? colors.danger : colors.border,
                                    }}
                                    disabled={isSubmitting}
                                />
                            </InputGroup>
                            {error && (
                                <Form.Text className="text-danger">
                                    {error}
                                </Form.Text>
                            )}
                            {message && (
                                <Form.Text className="text-success">
                                    {message}
                                </Form.Text>
                            )}
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Button
                                variant="link"
                                onClick={() => navigate("/login")}
                                style={{ color: colors.primary }}
                                disabled={isSubmitting}
                            >
                                <FiArrowLeft className="me-1" />
                                Back to Login
                            </Button>

                            <Button
                                variant="primary"
                                type="submit"
                                style={{
                                    backgroundColor: colors.primary,
                                    borderColor: colors.primary,
                                    width: "150px",
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            className="me-2"
                                        />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ForgotPassword; 