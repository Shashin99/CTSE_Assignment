import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../utils/api";
import {
    Form,
    Button,
    Card,
    Container,
    InputGroup,
    Spinner,
} from "react-bootstrap";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const UserLogin = ({ onLogin }) => {
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

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert(
                "Validation Error",
                "Please correct the highlighted fields",
                "warning"
            );
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await authApi.post("/api/auth/login", formData);

            if (response.data && response.data.token) {
                const { token, user } = response.data;
                
                // Store in localStorage first
                localStorage.setItem('authToken', token);
                localStorage.setItem('userData', JSON.stringify(user));
                
                // Call the parent's onLogin
                onLogin(token, user);

                await Swal.fire({
                    title: "Success!",
                    text: "Login successful",
                    icon: "success",
                    background: colors.light,
                    confirmButtonColor: colors.primary,
                    timer: 1500,
                    showConfirmButton: false,
                });

                // Navigate to home
                navigate(`/`);
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            let errorMsg = "Login failed. Please check your credentials.";
            console.error("Login error:", error);

            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.message === "Network Error") {
                errorMsg = "Cannot connect to the server. Check your internet connection.";
            }

            Swal.fire({
                title: "Login Failed",
                text: errorMsg,
                icon: "error",
                confirmButtonColor: colors.primary,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const showAlert = (title, text, icon) => {
        Swal.fire({
            title,
            text,
            icon,
            background: colors.light,
            confirmButtonColor: colors.primary,
            iconColor: icon === "success" ? colors.success : colors.danger,
        });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card className="shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
                <Card.Body className="p-4">
                    <h2 className="text-center mb-4" style={{ color: colors.primary }}>
                        Login
                    </h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <InputGroup>
                                <InputGroup.Text>
                                    <FiMail />
                                </InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <InputGroup>
                                <InputGroup.Text>
                                    <FiLock />
                                </InputGroup.Text>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3"
                            disabled={isSubmitting}
                            style={{ backgroundColor: colors.primary }}
                        >
                            {isSubmitting ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                <>
                                    <FiLogIn className="me-2" />
                                    Login
                                </>
                            )}
                        </Button>

                        <div className="text-center">
                            <a
                                href="/forgot-password"
                                className="text-decoration-none"
                                style={{ color: colors.primary }}
                            >
                                Forgot Password?
                            </a>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserLogin;
