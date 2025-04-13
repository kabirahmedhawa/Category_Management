// frontend/src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import axios from "axios";
import MainRoutes from "./routes";

// Define types for user data
interface User {
  _id: string;
  username: string;
  email: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser(response.data))
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
        .then((response) => setUser(response.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  };

  return (
    <Router>
      <MainRoutes />
    </Router>
  );
};

export default App;
