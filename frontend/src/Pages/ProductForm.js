import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import {
    FiSave,
    FiX,
    FiPackage,
    FiDollarSign,
    FiGrid,
    FiLayers,
    FiImage,
} from "react-icons/fi";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductForm = () => {
    const colors = {
        primary: "#2c3e50",
        secondary: "#f9a825",
        light: "#f8f9fa",
        dark: "#343a40",
        border: "#dee2e6",
        success: "#28a745",
        danger: "#dc3545",
    };

    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/products/${id}`
                    );
                    setProduct(response.data);
                } catch (err) {
                    setError("Error fetching product");
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await axios.put(
                    `http://localhost:5000/api/products/${id}`,
                    product
                );
                await Swal.fire({
                    title: "Success!",
                    text: "Product updated successfully",
                    icon: "success",
                    background: colors.light,
                    confirmButtonColor: colors.primary,
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await axios.post("http://localhost:5000/api/products", product);
                await Swal.fire({
                    title: "Success!",
                    text: "Product created successfully",
                    icon: "success",
                    background: colors.light,
                    confirmButtonColor: colors.primary,
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
            navigate("/products");
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: "Failed to save product",
                icon: "error",
                background: colors.light,
                confirmButtonColor: colors.primary,
            });
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Card
                className="shadow-sm"
                style={{ maxWidth: "800px", margin: "0 auto" }}
            >
                <Card.Body>
                    <h2
                        className="text-center mb-4"
                        style={{ color: colors.primary }}
                    >
                        {id ? "Edit Product" : "Create New Product"}
                    </h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FiPackage className="me-2" />
                                Product Name
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter product name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FiPackage className="me-2" />
                                Description
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                required
                                placeholder="Enter product description"
                                rows={3}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FiDollarSign className="me-2" />
                                Price
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="Enter price"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FiGrid className="me-2" />
                                Category
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                required
                                placeholder="Enter category"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                <FiLayers className="me-2" />
                                Stock
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="stock"
                                value={product.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="Enter stock quantity"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>
                                <FiImage className="me-2" />
                                Image URL
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                value={product.image}
                                onChange={handleChange}
                                placeholder="Enter image URL"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                style={{
                                    backgroundColor: colors.primary,
                                    borderColor: colors.primary,
                                }}
                            >
                                {loading ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    <>
                                        <FiSave className="me-2" />
                                        {id
                                            ? "Update Product"
                                            : "Create Product"}
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate("/products")}
                            >
                                <FiX className="me-2" />
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ProductForm;
