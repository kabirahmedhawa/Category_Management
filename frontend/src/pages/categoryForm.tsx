import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Paper,
  TextField,
  Typography,
  Button,
  MenuItem,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../api";

interface Category {
  _id: string;
  name: string;
  isDisabled: boolean;
  parent?: string;
}

const CategoryFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("category/all");
        setCategories(res.data);

        if (isEditMode && id) {
          const cat = await api.get(`category/${id}`);
          setName(cat.data.name);
          setParent(cat.data.parent || "");
          setIsDisabled(cat.data.isDisabled);
        }
      } catch (err) {
        setSnackbar({
          message: "Error loading category data",
          severity: "error",
        });
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { name, isDisabled, parentId: parent || null };
      if (isEditMode) {
        await api.put(`category/${id}`, payload);
        setSnackbar({
          message: "Category updated successfully!",
          severity: "success",
        });
      } else {
        await api.post("category", payload);
        setSnackbar({
          message: "Category created successfully!",
          severity: "success",
        });
      }
      setTimeout(() => navigate("/category"), 1500);
    } catch (error) {
      setSnackbar({ message: "Failed to save category", severity: "error" });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        {isEditMode ? "Edit Category" : "Add Category"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Category Name"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            select
            label="Parent Category"
            fullWidth
            value={parent}
            onChange={(e) => setParent(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            {categories
              .filter((cat) => !isEditMode || cat._id !== id)
              .map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
          </TextField>
          <Button type="submit" variant="contained" color="primary">
            {isEditMode ? "Update" : "Create"}
          </Button>
          <Button variant="text" onClick={() => navigate("/category")}>
            Cancel
          </Button>
        </Stack>
      </form>

      {snackbar && (
        <Snackbar
          open={Boolean(snackbar)}
          autoHideDuration={3000}
          onClose={() => setSnackbar(null)}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Paper>
  );
};

export default CategoryFormPage;
