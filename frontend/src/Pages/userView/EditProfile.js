import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../utils/api";
import { Form, Button, Card, Container, Spinner, Row, Col } from "react-bootstrap";
import { FiUser, FiMail, FiPhone, FiCreditCard, FiMapPin } from "react-icons/fi";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        nic: "",
        address: ""
    });
    const [errors, setErrors] = useState({});

    const colors = {
        primary: "#2c3e50",
        secondary: "#f9a825",
        danger: "#dc3545",
        light: "#f8f9fa",
        success: "#28a745"
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("userData"));
                
                if (!userData || !userData.id) {
                    throw new Error("No user data found");
                }

                const response = await userApi.get(`/api/users/${userData.id}`);
                const user = response.data.user;
                
                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    contactNumber: user.contactNumber || "",
                    nic: user.nic || "",
                    address: user.address || ""
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user:", error);
                if (error.response?.status === 401) {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("userData");
                    Swal.fire({
                        title: "Session Expired",
                        text: "Please login again",
                        icon: "warning",
                        confirmButtonColor: colors.primary,
                    }).then(() => {
                        navigate("/login");
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to fetch user data",
                        icon: "error",
                        confirmButtonColor: colors.primary,
                    });
                    navigate("/userprofile");
                }
            }
        };
        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(?:0|94|\+94)?(?:7(?:0|1|2|4|5|6|7|8)\d)\d{6}$/;
        const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = "Contact number is required";
        } else if (!phoneRegex.test(formData.contactNumber)) {
            newErrors.contactNumber = "Invalid Sri Lankan phone number";
        }

        if (!formData.nic.trim()) {
            newErrors.nic = "NIC is required";
        } else if (!nicRegex.test(formData.nic)) {
            newErrors.nic = "Invalid NIC format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const userData = JSON.parse(localStorage.getItem("userData"));
            
            if (!userData || !userData.id) {
                throw new Error("No user data found");
            }

            const response = await userApi.put(`/api/users/${userData.id}`, formData);
            
            // Update the user data in localStorage
            const updatedUserData = { ...userData, ...response.data.user };
            localStorage.setItem("userData", JSON.stringify(updatedUserData));

            Swal.fire({
                title: "Success!",
                text: "Profile updated successfully",
                icon: "success",
                confirmButtonColor: colors.primary,
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/userprofile");
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");
                Swal.fire({
                    title: "Session Expired",
                    text: "Please login again",
                    icon: "warning",
                    confirmButtonColor: colors.primary,
                }).then(() => {
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || "Failed to update profile",
                    icon: "error",
                    confirmButtonColor: colors.primary,
                });
            }
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Card className="shadow-lg mx-auto" style={{ maxWidth: "800px" }}>
                <Card.Header className="text-center py-3" style={{ backgroundColor: colors.primary, color: "white" }}>
                    <h3 className="mb-0">Edit My Profile</h3>
                </Card.Header>

                <Card.Body className="p-4">
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <FiUser className="me-2" style={{ color: colors.primary }} />
                                        Name
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        isInvalid={!!errors.name}
                                        placeholder="Enter your name"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <FiMail className="me-2" style={{ color: colors.primary }} />
                                        Email
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!errors.email}
                                        placeholder="Enter your email"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <FiPhone className="me-2" style={{ color: colors.primary }} />
                                        Contact Number
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        isInvalid={!!errors.contactNumber}
                                        placeholder="Enter your contact number"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.contactNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <FiCreditCard className="me-2" style={{ color: colors.primary }} />
                                        NIC
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nic"
                                        value={formData.nic}
                                        onChange={handleChange}
                                        isInvalid={!!errors.nic}
                                        placeholder="Enter your NIC"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.nic}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-4">
                            <Form.Label>
                                <FiMapPin className="me-2" style={{ color: colors.primary }} />
                                Address
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => navigate("/userprofile")}
                                style={{ minWidth: "150px" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                style={{
                                    backgroundColor: colors.primary,
                                    borderColor: colors.primary,
                                    minWidth: "150px"
                                }}
                            >
                                Update Profile
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditProfile; 