import * as exerciseService from '../services/exerciseService.js';

// --- USER API ---
export const getCategories = async (req, res) => {
  try {
    const categories = await exerciseService.getAllCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryDetail = async (req, res) => {
  try {
    const result = await exerciseService.getCategoryWithExercises(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExercise = async (req, res) => {
  try {
    const { data, suggestions } = await exerciseService.getExerciseDetail(req.params.id);
    res.status(200).json({ success: true, data, suggestions });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// --- ADMIN API ---
export const createCategory = async (req, res) => {
  try {
    const newCat = await exerciseService.createCategory(req.body);
    res.status(201).json({ success: true, data: newCat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updated = await exerciseService.updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await exerciseService.deleteCategory(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createExercise = async (req, res) => {
  try {
    const newEx = await exerciseService.createExercise(req.body);
    res.status(201).json({ success: true, data: newEx });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const updated = await exerciseService.updateExercise(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    await exerciseService.deleteExercise(req.params.id);
    res.status(200).json({ success: true, message: "Exercise deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};