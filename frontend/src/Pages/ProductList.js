import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi, cartApi } from '../utils/api';
import { Card, Container, Button, Spinner, Row, Col } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = () => {
    const colors = {
        primary: "#2c3e50",
        secondary: "#f9a825",
        light: "#f8f9fa",
        dark: "#343a40",
        border: "#dee2e6",
        success: "#28a745",
        danger: "#dc3545",
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productApi.get('/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching products');
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!isAuthenticated) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login to add items to your cart',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: colors.primary,
                cancelButtonColor: colors.secondary,
                confirmButtonText: 'Go to Login',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/login';
                }
            });
            return;
        }

        try {
            await cartApi.post('/api/cart', { productId, quantity: 1 });

            Swal.fire({
                title: 'Success!',
                text: 'Product added to cart',
                icon: 'success',
                background: colors.light,
                confirmButtonColor: colors.primary,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Please login again',
                    icon: 'warning',
                    confirmButtonColor: colors.primary,
                }).then(() => {
                    window.location.href = '/login';
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: err.response?.data?.message || 'Failed to add product to cart',
                    icon: 'error',
                    background: colors.light,
                    confirmButtonColor: colors.primary,
                });
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: colors.danger,
                cancelButtonColor: colors.secondary,
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await productApi.delete(`/api/products/${id}`);
                setProducts(products.filter(product => product._id !== id));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your product has been deleted.',
                    icon: 'success',
                    background: colors.light,
                    confirmButtonColor: colors.primary,
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Please login again',
                    icon: 'warning',
                    confirmButtonColor: colors.primary,
                }).then(() => {
                    window.location.href = '/login';
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete product',
                    icon: 'error',
                    background: colors.light,
                    confirmButtonColor: colors.primary,
                });
            }
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Card className="p-4" style={{ maxWidth: '500px', width: '100%' }}>
                    <Card.Body className="text-center">
                        <h4 className="text-danger">{error}</h4>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Card className="mb-4">
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <h2 className="mb-0" style={{ color: colors.primary }}>Products</h2>
                    <Link to="/products/create">
                        <Button variant="primary" style={{ backgroundColor: colors.primary }}>
                            <FiPlus className="me-2" />
                            Add New Product
                        </Button>
                    </Link>
                </Card.Body>
            </Card>

            <Row className="g-4">
                {products.map(product => (
                    <Col key={product._id} xs={12} md={6} lg={4}>
                        <Card className="h-100 shadow-sm">
                            <Card.Img 
                                variant="top" 
                                src={product.image || 'https://via.placeholder.com/150'} 
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title style={{ color: colors.primary }}>{product.name}</Card.Title>
                                <Card.Text className="text-muted">{product.description}</Card.Text>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0" style={{ color: colors.secondary }}>${product.price}</h5>
                                    <span className="badge bg-primary">Stock: {product.stock}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleAddToCart(product._id)}
                                    >
                                        <FiShoppingCart className="me-1" />
                                        Add to Cart
                                    </Button>
                                    <Link to={`/products/edit/${product._id}`}>
                                        <Button variant="outline-primary" size="sm">
                                            <FiEdit2 className="me-1" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        <FiTrash2 className="me-1" />
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ProductList; 