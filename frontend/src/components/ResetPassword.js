import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../utils/api';
import {
    Form,
    Button,
    Card,
    Container,
    InputGroup,
    Spinner,
    ProgressBar,
} from "react-bootstrap";
import { FiLock, FiArrowLeft, FiCheck, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();
    const { token } = useParams();

    const colors = {
        primary: "#2c3e50",
        secondary: "#f9a825",
        light: "#f8f9fa",
        dark: "#343a40",
        border: "#dee2e6",
        success: "#28a745",
        danger: "#dc3545",
        warning: "#ffc107",
    };

    useEffect(() => {
        // Check password strength
        const strength = calculatePasswordStrength(formData.newPassword);
        setPasswordStrength(strength);
    }, [formData.newPassword]);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        return strength;
    };

    const getPasswordStrengthColor = (strength) => {
        if (strength <= 25) return colors.danger;
        if (strength <= 50) return colors.warning;
        if (strength <= 75) return colors.secondary;
        return colors.success;
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters long";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await authApi.post('/api/auth/reset-password', {
                token,
                newPassword: formData.newPassword
            });
            
            setMessage(response.data.message);
            
            await Swal.fire({
                title: "Success!",
                text: "Your password has been reset successfully",
                icon: "success",
                background: colors.light,
                confirmButtonColor: colors.primary,
                timer: 2000,
                showConfirmButton: false,
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setErrors({
                submit: err.response?.data?.message || 'An error occurred'
            });
            
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

    const PasswordRequirement = ({ met, text }) => (
        <div className="d-flex align-items-center mb-1">
            {met ? (
                <FiCheck className="text-success me-2" />
            ) : (
                <FiX className="text-danger me-2" />
            )}
            <small className={met ? "text-success" : "text-danger"}>{text}</small>
        </div>
    );

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
                    <h4 className="mb-0 text-white text-center">RESET PASSWORD</h4>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit} noValidate>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">
                                New Password
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Text
                                    style={{
                                        backgroundColor: colors.secondary,
                                        color: colors.primary,
                                    }}
                                >
                                    <FiLock />
                                </InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    isInvalid={!!errors.newPassword}
                                    placeholder="Enter new password"
                                    style={{
                                        borderColor: errors.newPassword ? colors.danger : colors.border,
                                    }}
                                    disabled={isSubmitting}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.newPassword}
                                </Form.Control.Feedback>
                            </InputGroup>
                            
                            {/* Password Strength Indicator */}
                            <div className="mt-2">
                                <ProgressBar 
                                    now={passwordStrength} 
                                    style={{ height: '5px' }}
                                    variant={passwordStrength <= 25 ? 'danger' : 
                                            passwordStrength <= 50 ? 'warning' : 
                                            passwordStrength <= 75 ? 'info' : 'success'}
                                />
                                <div className="mt-2">
                                    <PasswordRequirement 
                                        met={formData.newPassword.length >= 8}
                                        text="At least 8 characters long"
                                    />
                                    <PasswordRequirement 
                                        met={/[A-Z]/.test(formData.newPassword)}
                                        text="Contains uppercase letter"
                                    />
                                    <PasswordRequirement 
                                        met={/[a-z]/.test(formData.newPassword)}
                                        text="Contains lowercase letter"
                                    />
                                    <PasswordRequirement 
                                        met={/[0-9]/.test(formData.newPassword)}
                                        text="Contains number"
                                    />
                                </div>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">
                                Confirm Password
                            </Form.Label>
                            <InputGroup>
                                <InputGroup.Text
                                    style={{
                                        backgroundColor: colors.secondary,
                                        color: colors.primary,
                                    }}
                                >
                                    <FiLock />
                                </InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    isInvalid={!!errors.confirmPassword}
                                    placeholder="Confirm new password"
                                    style={{
                                        borderColor: errors.confirmPassword ? colors.danger : colors.border,
                                    }}
                                    disabled={isSubmitting}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmPassword}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        {errors.submit && (
                            <div className="alert alert-danger" role="alert">
                                {errors.submit}
                            </div>
                        )}

                        {message && (
                            <div className="alert alert-success" role="alert">
                                {message}
                            </div>
                        )}

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
                                        Resetting...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ResetPassword; 