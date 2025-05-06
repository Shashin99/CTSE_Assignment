import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserRegister from "./Pages/userRegister/register";
import UserLogin from "./Pages/userLogin/login";
import UserProfile from "./Pages/userView/userProfile";
import EditProfile from "./Pages/userView/EditProfile";
import ProductList from "./Pages/ProductList";
import ProductForm from "./Pages/ProductForm";
import Cart from "./Pages/Cart";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Navbar from "./components/Navbar";
import Home from './Pages/Home';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (token, user) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUserData(user);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        delete axios.defaults.headers.common['Authorization'];
        setUserData(null);
        setIsAuthenticated(false);
    };

    // Protected Route component
    const ProtectedRoute = ({ children }) => {
        if (isLoading) {
            return <div>Loading...</div>;
        }
        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }
        return children;
    };

    return (
        <Router>
            <Navbar 
                isAuthenticated={isAuthenticated} 
                onLogout={handleLogout}
                userData={userData}
            />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={!isAuthenticated ? <UserLogin onLogin={handleLogin} /> : <Navigate to="/products" />} />
                <Route path="/register" element={!isAuthenticated ? <UserRegister /> : <Navigate to="/products" />} />

                {/* Protected Routes */}
                <Route path="/products" element={
                    <ProtectedRoute>
                        <ProductList />
                    </ProtectedRoute>
                } />
                <Route path="/products/create" element={
                    <ProtectedRoute>
                        <ProductForm />
                    </ProtectedRoute>
                } />
                <Route path="/products/edit/:id" element={
                    <ProtectedRoute>
                        <ProductForm />
                    </ProtectedRoute>
                } />
                <Route path="/userprofile" element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                } />
                <Route path="/editprofile" element={
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                } />
                <Route path="/cart" element={
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                } />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Redirect to login for any other route */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
