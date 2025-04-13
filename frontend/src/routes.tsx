// frontend/src/App.tsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { Container } from "@mui/material";

import Register from "./pages/register";
import Login from "./pages/login";
import Categories from "./pages/categories";
import CategoryForm from "./pages/categoryForm";

interface User {
  _id: string;
  username: string;
  email: string;
}

const MainRoutes = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          navigate("/category");
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  const handleLoginOrRegister = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          navigate("/category");
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/profile" : "/login"} />}
        />
        <Route
          path="/register"
          element={<Register onRegister={handleLoginOrRegister} />}
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLoginOrRegister} />}
        />
        <Route
          path="/category"
          element={user ? <Categories /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/categories/new"
          element={
            user ? <CategoryForm /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/categories/edit/:id"
          element={
            user ? <CategoryForm /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Container>
  );
};

export default MainRoutes;
