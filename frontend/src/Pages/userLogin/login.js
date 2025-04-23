import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

const UserLogin = () => {
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
            const { data } = await axios.post(
                "http://localhost:5001/api/auth/login",
                formData
            );
            if (!data.token) {
                throw new Error("No token received");
            }
            localStorage.setItem("authToken", data.token);

            const userId = data.user?.id || data.id; // Fallback to `data.id` if needed
            if (!userId) {
                throw new Error("User ID not found in response");
            }

            await Swal.fire({
                title: "Success!",
                text: "Login successful",
                icon: "success",
                background: colors.light,
                confirmButtonColor: colors.primary,
                timer: 1500,
                showConfirmButton: false,
            });

            navigate(`/userprofile/${userId}`);
        } catch (error) {
            let errorMsg = "Login failed. Please check your credentials.";
            console.log(error);

            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            // Handle network errors
            else if (error.message === "Network Error") {
                errorMsg =
                    "Cannot connect to the server. Check your internet connection.";
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
                    <h4 className="mb-0 text-white text-center">USER LOGIN</h4>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
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
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                    placeholder="Enter registered email"
                                    style={{
                                        borderColor: errors.email
                                            ? colors.danger
                                            : colors.border,
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">
                                Password
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                    placeholder="Enter password"
                                    style={{
                                        borderColor: errors.password
                                            ? colors.danger
                                            : colors.border,
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Button
                                variant="link"
                                onClick={() => navigate("/register")}
                                style={{ color: colors.primary }}
                            >
                                Don't have an account? Register here
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
                                        Logging in...
                                    </>
                                ) : (
                                    <>
                                        <FiLogIn className="me-2" />
                                        Login
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserLogin;
