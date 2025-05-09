import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../utils/api";
import {
    Form,
    Button,
    Card,
    Row,
    Col,
    Container,
    InputGroup,
    Spinner,
} from "react-bootstrap";
import {
    FiUser,
    FiPhone,
    FiCreditCard,
    FiArrowLeft,
    FiSave,
    FiLock,
    FiMail,
} from "react-icons/fi";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const UserRegister = () => {
    const navigate = useNavigate();

    // Color scheme
    const colors = {
        primary: "#2c3e50",
        secondary: "#f9a825",
        light: "#f8f9fa",
        dark: "#343a40",
        border: "#dee2e6",
        success: "#28a745",
        danger: "#dc3545",
    };

    const [formData, setFormData] = useState({
        name: "",
        nic: "",
        contactNumber: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.nic.trim()) {
            newErrors.nic = "NIC is required";
        } else if (!nicRegex.test(formData.nic)) {
            newErrors.nic = "Invalid NIC format";
        }
        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = "Contact number is required";
        } else if (!phoneRegex.test(formData.contactNumber)) {
            newErrors.contactNumber = "Invalid phone number (10 digits)";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showAlert(
                "Validation Error",
                "Please correct the fields",
                "warning"
            );
            return;
        }

        setIsSubmitting(true);
        try {
            await authApi.post("/api/auth/register", formData);
            showAlert("Success!", "Registration successful", "success");
            resetForm();
            navigate("/login");
        } catch (error) {
            const errorMsg =
                error.response?.data?.message || "Registration failed";
            showAlert("Error!", errorMsg, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            nic: "",
            contactNumber: "",
            email: "",
            password: "",
        });
        setErrors({});
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
                style={{ width: "850px", borderColor: colors.border }}
            >
                <Card.Header
                    className="py-3"
                    style={{
                        backgroundColor: colors.primary,
                        borderBottom: `3px solid ${colors.secondary}`,
                    }}
                >
                    <div className="d-flex align-items-center">
                        <Button
                            variant="link"
                            onClick={() => window.history.back()}
                            className="p-0 me-2 text-white"
                        >
                            <FiArrowLeft size={24} />
                        </Button>
                        <h4 className="mb-0 text-white">USER REGISTRATION</h4>
                    </div>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        Full Name
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text
                                            style={{
                                                backgroundColor:
                                                    colors.secondary,
                                                color: colors.primary,
                                            }}
                                        >
                                            <FiUser />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            isInvalid={!!errors.name}
                                            placeholder="Enter full name"
                                            style={{
                                                borderColor: errors.name
                                                    ? colors.danger
                                                    : colors.border,
                                            }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        NIC Number
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text
                                            style={{
                                                backgroundColor:
                                                    colors.secondary,
                                                color: colors.primary,
                                            }}
                                        >
                                            <FiCreditCard />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="nic"
                                            value={formData.nic}
                                            onChange={handleChange}
                                            isInvalid={!!errors.nic}
                                            placeholder="Enter NIC"
                                            style={{
                                                borderColor: errors.nic
                                                    ? colors.danger
                                                    : colors.border,
                                            }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.nic}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        Contact Number
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text
                                            style={{
                                                backgroundColor:
                                                    colors.secondary,
                                                color: colors.primary,
                                            }}
                                        >
                                            <FiPhone />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="tel"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleChange}
                                            isInvalid={!!errors.contactNumber}
                                            placeholder="Enter contact number"
                                            style={{
                                                borderColor:
                                                    errors.contactNumber
                                                        ? colors.danger
                                                        : colors.border,
                                            }}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.contactNumber}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        Email
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text
                                            style={{
                                                backgroundColor:
                                                    colors.secondary,
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
                                            placeholder="Enter email address"
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
                            </Col>

                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        Password
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text
                                            style={{
                                                backgroundColor:
                                                    colors.secondary,
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
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                            <Button
                                variant="outline-danger"
                                onClick={resetForm}
                                className="me-3"
                                disabled={isSubmitting}
                                style={{
                                    borderColor: colors.danger,
                                }}
                            >
                                Clear Form
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                style={{
                                    backgroundColor: colors.primary,
                                    borderColor: colors.primary,
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
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="me-2" />
                                        Register User
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Added Sign In Link */}
                        <div className="d-flex justify-content-center mt-4">
                            <Button
                                variant="link"
                                onClick={() => navigate("/login")}
                                style={{
                                    color: colors.primary,
                                    textDecoration: "none",
                                    fontWeight: "500",
                                }}
                            >
                                Already registered? Sign in here
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserRegister;
