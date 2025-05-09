import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../../utils/api";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { FiUser, FiEdit, FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const colors = {
        primary: "#2c3e50",
        secondary: "#f9a825",
        danger: "#dc3545",
        light: "#f8f9fa",
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("userData"));
                console.log(userData);
                
                const response = await userApi.get(`/api/users/${userData.id}`);
                
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response?.status === 401) {
                    Swal.fire({
                        title: "Session Expired",
                        text: "Please login again",
                        icon: "error",
                        confirmButtonColor: colors.primary,
                    });
                    localStorage.removeItem("authToken");
                    navigate("/login");
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to fetch user data",
                        icon: "error",
                        confirmButtonColor: colors.primary,
                    });
                }
            }
        };
        fetchUser();
    }, [id, navigate]);

    const handleDeleteAccount = async () => {
        Swal.fire({
            title: "Confirm Account Deletion",
            text: "This action cannot be undone. Your data will be permanently removed.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: colors.danger,
            cancelButtonColor: colors.primary,
            confirmButtonText: "Delete Permanently",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await userApi.delete(`/api/users/${id}`);
                    localStorage.removeItem("authToken");
                    await Swal.fire({
                        title: "Account Deleted!",
                        text: "Your account has been permanently removed",
                        icon: "success",
                        confirmButtonColor: colors.primary,
                        timer: 2000,
                    });
                    navigate("/login");
                } catch (error) {
                    if (error.response?.status === 401) {
                        localStorage.removeItem("authToken");
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
                            title: "Deletion Failed!",
                            text: error.response?.data?.message || "Could not delete account",
                            icon: "error",
                            confirmButtonColor: colors.primary,
                        });
                    }
                }
            }
        });
    };

    if (loading) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "100vh" }}
            >
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    console.log("User state before render:", user.user);
    return (
        <Container className="py-5">
            <Card className="shadow-lg mx-auto" style={{ maxWidth: "800px" }}>
                <Card.Header
                    className="text-center py-3"
                    style={{ backgroundColor: colors.primary, color: "white" }}
                >
                    <h3 className="mb-0">Your Profile</h3>
                </Card.Header>

                <Card.Body className="p-4">
                    <div className="text-center mb-4">
                        <FiUser size={80} style={{ color: colors.primary }} />
                        <h2 className="mt-3">{user?.user.name || "N/A"}</h2>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <div className="p-3 bg-light rounded">
                                <h5 className="text-muted mb-3">
                                    Personal Details
                                </h5>
                                <p>
                                    <strong>NIC:</strong> {user?.user.nic || "N/A"}
                                </p>
                                <p>
                                    <strong>Contact:</strong>{" "}
                                    {user?.user.contactNumber || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="p-3 bg-light rounded">
                                <h5 className="text-muted mb-3">
                                    Account Information
                                </h5>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    {user?.user.email || "N/A"}
                                </p>
                                <p>
                                    <strong>Member Since:</strong>{" "}
                                    {user?.user.createdAt
                                        ? new Date(
                                              user.user.createdAt
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <Button
                            variant="primary"
                            onClick={() => navigate("/editprofile")}
                            className="d-flex align-items-center"
                            style={{
                                backgroundColor: colors.primary,
                                borderColor: colors.primary,
                                minWidth: "200px",
                            }}
                        >
                            <FiEdit className="me-2" />
                            Update Profile
                        </Button>

                        <Button
                            variant="danger"
                            onClick={handleDeleteAccount}
                            className="d-flex align-items-center"
                            style={{
                                backgroundColor: colors.danger,
                                borderColor: colors.danger,
                                minWidth: "200px",
                            }}
                        >
                            <FiTrash2 className="me-2" />
                            Delete Account
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfile;
