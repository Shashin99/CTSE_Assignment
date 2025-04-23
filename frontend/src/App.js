import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegister from "./Pages/userRegister/register";
import UserLogin from "./Pages/userLogin/login";
import UserProfile from "./Pages/userView/userProfile";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<UserLogin />} /> */}
                <Route path="/register" element={<UserRegister />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/userprofile/:id" element={<UserProfile />} />
            </Routes>
        </Router>
    );
}

export default App;
