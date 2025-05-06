import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Carousel,
    Badge,
    Spinner,
} from "react-bootstrap";
import { FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [featuredProducts, setFeaturedProducts] = useState([]);

    const colors = {
        primary: "#2c3e50",
        secondary: "#f9a825",
        light: "#f8f9fa",
        dark: "#343a40",
        success: "#28a745",
        danger: "#dc3545",
        warning: "#ffc107",
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/products"
            );
            setProducts(response.data);
            // Set featured products (first 4 products)
            setFeaturedProducts(response.data.slice(0, 4));
            setLoading(false);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Failed to load products");
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                Swal.fire({
                    title: "Login Required",
                    text: "Please login to add items to cart",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: colors.primary,
                    cancelButtonColor: colors.secondary,
                    confirmButtonText: "Login",
                    cancelButtonText: "Cancel",
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/login");
                    }
                });
                return;
            }

            const userData = JSON.parse(localStorage.getItem("userData"));
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "X-User-ID": userData._id,
                },
            };

            await axios.post(
                "http://localhost:5000/api/cart",
                {
                    productId,
                    quantity: 1,
                    userId: userData._id,
                },
                config
            );

            Swal.fire({
                title: "Success!",
                text: "Product added to cart",
                icon: "success",
                background: colors.light,
                confirmButtonColor: colors.primary,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Error adding to cart:", err);
            Swal.fire({
                title: "Error!",
                text: "Failed to add product to cart",
                icon: "error",
                background: colors.light,
                confirmButtonColor: colors.primary,
            });
        }
    };

    const ProductCard = ({ product }) => (
        <Card className="h-100 shadow-sm product-card">
            <div className="position-relative">
                <Card.Img
                    variant="top"
                    src={product.image || "https://via.placeholder.com/300"}
                    style={{ height: "300px", objectFit: "cover" }}
                />
                {product.discount && (
                    <Badge
                        bg="danger"
                        className="position-absolute top-0 end-0 m-2"
                    >
                        {product.discount}% OFF
                    </Badge>
                )}
                <Button
                    variant="outline-light"
                    className="position-absolute bottom-0 end-0 m-2"
                    onClick={() => handleAddToCart(product._id)}
                >
                    <FiShoppingCart />
                </Button>
            </div>
            <Card.Body>
                <Card.Title className="text-truncate">
                    {product.name}
                </Card.Title>
                <Card.Text className="text-muted">
                    {product.description}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        {product.discount ? (
                            <>
                                <span className="text-decoration-line-through text-muted me-2">
                                    ${product.price}
                                </span>
                                <span className="text-danger fw-bold">
                                    $
                                    {(
                                        product.price *
                                        (1 - product.discount / 100)
                                    ).toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="fw-bold">${product.price}</span>
                        )}
                    </div>
                    <div className="d-flex align-items-center">
                        <FiStar className="text-warning me-1" />
                        <span>{product.rating || "4.5"}</span>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );

    if (loading) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "80vh" }}
            >
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "80vh" }}
            >
                <Card
                    className="p-4"
                    style={{ maxWidth: "500px", width: "100%" }}
                >
                    <Card.Body className="text-center">
                        <h4 className="text-danger">{error}</h4>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-light py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <h1
                                className="display-4 fw-bold"
                                style={{ color: colors.primary }}
                            >
                                Discover Our Collection
                            </h1>
                            <p className="lead text-muted">
                                Explore our curated selection of premium
                                products
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => navigate("/products")}
                                style={{ backgroundColor: colors.primary }}
                            >
                                Shop Now
                            </Button>
                        </Col>
                        <Col md={6}>
                            <Carousel>
                                {featuredProducts.map((product) => (
                                    <Carousel.Item key={product._id}>
                                        <img
                                            className="d-block w-100"
                                            src={
                                                product.image ||
                                                "https://via.placeholder.com/800x400"
                                            }
                                            alt={product.name}
                                            style={{
                                                height: "400px",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Carousel.Caption>
                                            <h3>{product.name}</h3>
                                            <p>{product.description}</p>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Featured Products Section */}
            <Container className="py-5">
                <h2
                    className="text-center mb-4"
                    style={{ color: colors.primary }}
                >
                    Featured Products
                </h2>
                <Row xs={1} md={2} lg={4} className="g-4">
                    {featuredProducts.map((product) => (
                        <Col key={product._id}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* Categories Section */}
            <div className="bg-light py-5">
                <Container>
                    <h2
                        className="text-center mb-4"
                        style={{ color: colors.primary }}
                    >
                        Shop by Category
                    </h2>
                    <Row className="g-4">
                        {[
                            "Electronics",
                            "Clothing",
                            "Home & Living",
                            "Beauty",
                        ].map((category) => (
                            <Col key={category} md={3}>
                                <Card className="h-100 shadow-sm">
                                    <Card.Body className="text-center">
                                        <h5>{category}</h5>
                                        <Button
                                            variant="outline-primary"
                                            onClick={() =>
                                                navigate(
                                                    `/products?category=${category}`
                                                )
                                            }
                                            style={{
                                                borderColor: colors.primary,
                                                color: colors.primary,
                                            }}
                                        >
                                            View Products
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* Special Offers Section */}
            <Container className="py-5">
                <h2
                    className="text-center mb-4"
                    style={{ color: colors.primary }}
                >
                    Special Offers
                </h2>
                <Row className="g-4">
                    {products
                        .filter((p) => p.discount)
                        .slice(0, 3)
                        .map((product) => (
                            <Col key={product._id} md={4}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                </Row>
            </Container>
        </div>
    );
};

export default Home;
