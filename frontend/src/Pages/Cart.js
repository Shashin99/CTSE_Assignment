import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, Button, Table, Form, Spinner, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FiTrash2, FiShoppingCart, FiArrowLeft, FiPlus, FiMinus, FiInfo } from 'react-icons/fi';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
    const colors = {
        primary: "#2c3e50",
        secondary: "#f9a825",
        light: "#f8f9fa",
        dark: "#343a40",
        success: "#28a745",
        danger: "#dc3545",
        warning: "#ffc107",
    };

    const navigate = useNavigate();
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    // Initialize axios defaults
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (!token || !userData) {
            navigate('/login');
            return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        
        fetchCart();
    }, [navigate]);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const userData = JSON.parse(localStorage.getItem('userData'));

            if (!token || !userData) {
                throw new Error('Authentication required');
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-User-ID': userData._id
                }
            };

            const response = await axios.get('http://localhost:5002/api/cart', config);
            setCart(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching cart:', err);
            
            if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                delete axios.defaults.headers.common['Authorization'];
                
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Please login again',
                    icon: 'warning',
                    confirmButtonColor: colors.primary,
                }).then(() => {
                    navigate('/login');
                });
            } else {
                setError('Error fetching cart');
                setLoading(false);
            }
        }
    };

    const handleQuantityChange = async (productId, quantity) => {
        if (isUpdating) return;
        
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('authToken');
            const userData = JSON.parse(localStorage.getItem('userData'));

            if (!token || !userData) {
                throw new Error('Authentication required');
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-User-ID': userData._id
                }
            };

            await axios.put(
                `http://localhost:5002/api/cart/${productId}`,
                { 
                    quantity: parseInt(quantity),
                    userId: userData._id 
                },
                config
            );
            fetchCart();
        } catch (err) {
            console.error('Error updating quantity:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                delete axios.defaults.headers.common['Authorization'];
                
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Please login again',
                    icon: 'warning',
                    confirmButtonColor: colors.primary,
                }).then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to update quantity',
                    icon: 'error',
                    background: colors.light,
                    confirmButtonColor: colors.primary,
                });
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            const result = await Swal.fire({
                title: 'Remove Item',
                text: "Are you sure you want to remove this item from your cart?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: colors.danger,
                cancelButtonColor: colors.secondary,
                confirmButtonText: 'Yes, remove it!',
                background: colors.light,
            });

            if (result.isConfirmed) {
                const token = localStorage.getItem('authToken');
                const userData = JSON.parse(localStorage.getItem('userData'));

                if (!token || !userData) {
                    throw new Error('Authentication required');
                }

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-User-ID': userData._id
                    }
                };

                await axios.delete(`http://localhost:5002/api/cart/${productId}`, config);
                fetchCart();
                Swal.fire({
                    title: 'Removed!',
                    text: 'Item has been removed from cart.',
                    icon: 'success',
                    background: colors.light,
                    confirmButtonColor: colors.primary,
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (err) {
            console.error('Error removing item:', err);
            if (err.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                delete axios.defaults.headers.common['Authorization'];
                
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Please login again',
                    icon: 'warning',
                    confirmButtonColor: colors.primary,
                }).then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to remove item',
                    icon: 'error',
                    background: colors.light,
                    confirmButtonColor: colors.primary,
                });
            }
        }
    };

    const calculateTotal = () => {
        return cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };

    const calculateSelectedTotal = () => {
        return cart.items
            .filter(item => selectedItems.includes(item.product._id))
            .reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);
    };

    const handleSelectItem = (productId) => {
        setSelectedItems(prev => 
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cart.items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart.items.map(item => item.product._id));
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
            <Card className="shadow-lg">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 style={{ color: colors.primary }}>
                                <FiShoppingCart className="me-2" />
                                Shopping Cart
                            </h2>
                            <Badge bg="secondary" className="mt-2">
                                {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
                            </Badge>
                        </div>
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/products')}
                            className="d-flex align-items-center"
                            style={{ borderColor: colors.primary, color: colors.primary }}
                        >
                            <FiArrowLeft className="me-1" />
                            Continue Shopping
                        </Button>
                    </div>

                    {cart.items.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <FiShoppingCart size={64} color={colors.secondary} />
                            </div>
                            <h4>Your cart is empty</h4>
                            <p className="text-muted">Looks like you haven't added any items to your cart yet.</p>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/products')}
                                className="mt-3"
                                style={{ backgroundColor: colors.primary }}
                            >
                                Start Shopping
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Select All"
                                    checked={selectedItems.length === cart.items.length}
                                    onChange={handleSelectAll}
                                />
                            </div>
                            <Table responsive hover className="align-middle">
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }}></th>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.items.map((item) => (
                                        <tr key={item.product._id} className={selectedItems.includes(item.product._id) ? 'table-active' : ''}>
                                            <td>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.product._id)}
                                                    onChange={() => handleSelectItem(item.product._id)}
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={item.product.image || 'https://via.placeholder.com/50'}
                                                        alt={item.product.name}
                                                        style={{ 
                                                            width: '60px', 
                                                            height: '60px', 
                                                            objectFit: 'cover', 
                                                            marginRight: '15px',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }}
                                                    />
                                                    <div>
                                                        <h6 className="mb-0">{item.product.name}</h6>
                                                        <small className="text-muted">SKU: {item.product._id.slice(-6)}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="fw-bold">${item.product.price.toFixed(2)}</span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => handleQuantityChange(item.product._id, Math.max(1, item.quantity - 1))}
                                                        disabled={isUpdating}
                                                        style={{ borderColor: colors.secondary, color: colors.secondary }}
                                                    >
                                                        <FiMinus />
                                                    </Button>
                                                    <Form.Control
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item.product._id, e.target.value)}
                                                        style={{ 
                                                            width: '60px', 
                                                            margin: '0 8px',
                                                            textAlign: 'center'
                                                        }}
                                                        disabled={isUpdating}
                                                    />
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                                        disabled={isUpdating}
                                                        style={{ borderColor: colors.secondary, color: colors.secondary }}
                                                    >
                                                        <FiPlus />
                                                    </Button>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="fw-bold" style={{ color: colors.primary }}>
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </span>
                                            </td>
                                            <td>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>Remove Item</Tooltip>}
                                                >
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveItem(item.product._id)}
                                                        style={{ borderColor: colors.danger, color: colors.danger }}
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <div className="d-flex justify-content-between align-items-center mt-4 p-3" style={{ backgroundColor: colors.light, borderRadius: '8px' }}>
                                <div>
                                    <h5 className="mb-0">
                                        Selected Items: <Badge bg="primary">{selectedItems.length}</Badge>
                                    </h5>
                                    <small className="text-muted">Select items to proceed with checkout</small>
                                </div>
                                <div className="text-end">
                                    <h4 className="mb-0">
                                        Total: <span style={{ color: colors.secondary }}>${calculateSelectedTotal().toFixed(2)}</span>
                                    </h4>
                                    <small className="text-muted">Including all selected items</small>
                                </div>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    disabled={selectedItems.length === 0}
                                    style={{ 
                                        backgroundColor: colors.primary,
                                        minWidth: '200px'
                                    }}
                                >
                                    {selectedItems.length === 0 ? 'Select Items' : 'Proceed to Checkout'}
                                </Button>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Cart; 