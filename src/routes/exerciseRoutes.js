import express from 'express';
import * as exerciseController from '../controllers/exerciseController.js';
const router = express.Router();

// --- USER ROUTES ---
router.get('/categories', exerciseController.getCategories);
router.get('/categories/:id', exerciseController.getCategoryDetail);
router.get('/:id', exerciseController.getExercise);
// --- ADMIN ROUTES ---
router.post('/admin/categories', exerciseController.createCategory);
router.put('/admin/categories/:id', exerciseController.updateCategory);
router.delete('/admin/categories/:id', exerciseController.deleteCategory);
router.post('/admin/content', exerciseController.createExercise);
router.put('/admin/content/:id', exerciseController.updateExercise);
router.delete('/admin/content/:id', exerciseController.deleteExercise);
router.get('/admin/contents', exerciseController.getAllExercisesForAdmin);
export default router;