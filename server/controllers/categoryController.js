// backend/controllers/categoryController.js
const categoryRepository = require('../repositories/categoryRepository');

// Get categories with children
const getCategories = async (req, res) => {
  try {
    const categories = await categoryRepository.getCategoriesWithChildren();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryRepository.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await categoryRepository.getSingleCategory(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch category' });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  const { name, parentId } = req.body;

  try {
    const category = await categoryRepository.createCategory(name, parentId);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, isDisabled } = req.body;
  try {
    const updatedCategory = await categoryRepository.updateCategory(categoryId, name, isDisabled);
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    await categoryRepository.deleteCategory(categoryId);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Disable a category and its children
const disableCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    await categoryRepository.disableCategoryAndChildren(categoryId);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'Invalid category ID' || error.message === 'Category not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  disableCategory,
  getSingleCategory
};
