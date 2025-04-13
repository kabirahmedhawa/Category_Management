import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  Stack,
  IconButton,
  Switch,
  Box,
  Snackbar,
  Alert,
  Backdrop,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Category {
  _id: string;
  name: string;
  isDisabled: boolean;
  children?: Category[];
}

const CategoryLoader = ({ open }: { open: boolean }) => {
  return (
    <Backdrop
      sx={{ color: "#888", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

const Categories: React.FC = () => {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("category");
      setCategories(response.data);
    } catch (error) {
      setSnackbar({ message: "Failed to load categories", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await api.delete(`category/${categoryId}`);
      fetchCategories();
      setLoader(false);
      setSnackbar({
        message: "Category deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      setLoader(false);
      setSnackbar({ message: "Failed to delete category", severity: "error" });
    }
  };

  const handleSwitchChange = async (
    categoryId: string,
    isDisabled: boolean
  ) => {
    try {
      await api.put(`category/disable/${categoryId}`, { isDisabled });
      setLoader(false);
      fetchCategories();
      setSnackbar({ message: "Category status updated", severity: "success" });
    } catch (error) {
      setLoader(false);
      setSnackbar({
        message: "Failed to update category status",
        severity: "error",
      });
    }
  };

  const handleAddCategory = () => {
    navigate("/categories/new");
  };

  const handleEdit = (category: Category) => {
    navigate(`/categories/edit/${category._id}`);
  };

  if (loading) {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Stack>
    );
  }

  const CategoryRow: React.FC<{ category: Category; level: number }> = ({
    category,
    level,
  }) => (
    <>
      <TableRow
        sx={{ backgroundColor: level % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
      >
        <TableCell sx={{ pl: level * 4, fontWeight: "bold" }}>
          {category.name}
        </TableCell>
        <TableCell align="right">
          <IconButton
            onClick={() => handleEdit(category)}
            sx={{ marginRight: 1 }}
          >
            <Edit color="primary" />
          </IconButton>
          <IconButton
            onClick={() => {
              setLoader(true);
              handleDelete(category._id);
            }}
          >
            <Delete color="error" />
          </IconButton>
        </TableCell>
        <TableCell align="center">
          <Switch
            checked={!category.isDisabled}
            onChange={() => {
              setLoader(true);
              handleSwitchChange(category._id, !category.isDisabled);
            }}
            color="secondary"
          />
        </TableCell>
      </TableRow>
      {category.children?.map((child) => (
        <CategoryRow key={child._id} category={child} level={level + 1} />
      ))}
    </>
  );

  return (
    <Paper
      elevation={3}
      sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 5, borderRadius: 2 }}
    >
      {loader && <CategoryLoader open={loader} />}
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        Categories
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCategory}
          sx={{ width: "100%" }}
        >
          Add Category
        </Button>
      </Box>

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {categories.map((category) => (
            <CategoryRow key={category._id} category={category} level={0} />
          ))}
        </TableBody>
      </Table>

      {/* Snackbar for API feedback */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {snackbar ? (
          <Alert
            onClose={() => setSnackbar(null)}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Paper>
  );
};

export default Categories;
