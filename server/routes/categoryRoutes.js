// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, categoryController.getCategories);
router.get('/all', authMiddleware, categoryController.getAllCategories);
router.get('/:categoryId', authMiddleware, categoryController.getSingleCategory);
router.post('/', authMiddleware, categoryController.createCategory);
router.put('/:categoryId', authMiddleware, categoryController.updateCategory);
router.delete('/:categoryId', authMiddleware, categoryController.deleteCategory);
router.put('/disable/:categoryId', authMiddleware, categoryController.disableCategory);

module.exports = router;
