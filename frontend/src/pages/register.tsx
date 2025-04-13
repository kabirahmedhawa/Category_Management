// src/components/Auth/Register.tsx
import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api";

interface Props {
  onRegister: () => void;
}

const Register: React.FC<Props> = ({ onRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Must be at least 8 characters")
        .matches(/[A-Z]/, "Must contain one uppercase letter")
        .matches(/[0-9]/, "Must contain one number")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Must contain one special character"
        ),
    }),
    onSubmit: async (values) => {
      try {
        const res = await api.post("auth/register", {
          firstName: values?.firstName,
          lastName: values?.lastName,
          email: values.email,
          password: values.password,
        });
        localStorage.setItem("token", res.data.token);
        onRegister();
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || "Registration failed";
        setSnackbar({ open: true, message: errorMsg, severity: "error" });
      }
    },
  });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            margin="normal"
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Register;
