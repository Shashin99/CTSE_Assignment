import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Button, Badge } from "react-bootstrap";
import { FiShoppingCart, FiUser, FiLogOut } from "react-icons/fi";
import axios from "axios";

const Navbar = ({ isAuthenticated: propIsAuthenticated, onLogout }) => {
    const [cartItemCount, setCartItemCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (propIsAuthenticated) {
            fetchCartItemCount();
        } else {
            setCartItemCount(0);
        }
    }, [propIsAuthenticated]);

    const fetchCartItemCount = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setCartItemCount(0);
                return;
            }

            const response = await axios.get("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const totalItems = response.data.items.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            setCartItemCount(totalItems);
        } catch (error) {
            console.error("Error fetching cart count:", error);
            setCartItemCount(0);
        }
    };

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="px-4">
            <BootstrapNavbar.Brand as={Link} to="/">
                E-Commerce
            </BootstrapNavbar.Brand>
            <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
            <BootstrapNavbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/products">
                        Products
                    </Nav.Link>
                </Nav>
                <Nav>
                    {propIsAuthenticated ? (
                        <>
                            <Nav.Link
                                as={Link}
                                to="/cart"
                                className="position-relative"
                            >
                                <FiShoppingCart size={20} />
                                {cartItemCount > 0 && (
                                    <Badge
                                        bg="danger"
                                        className="position-absolute top-0 start-100 translate-middle rounded-pill"
                                        style={{ fontSize: "0.7rem" }}
                                    >
                                        {cartItemCount}
                                    </Badge>
                                )}
                            </Nav.Link>
                            <Nav.Link as={Link} to="/userprofile">
                                <FiUser size={20} />
                            </Nav.Link>
                            <Button
                                variant="outline-light"
                                className="ms-2"
                                onClick={handleLogout}
                            >
                                <FiLogOut size={20} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login">
                                Login
                            </Nav.Link>
                            <Nav.Link as={Link} to="/register">
                                Register
                            </Nav.Link>
                        </>
                    )}
                </Nav>
            </BootstrapNavbar.Collapse>
        </BootstrapNavbar>
    );
};

export default Navbar;
