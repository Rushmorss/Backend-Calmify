import * as exerciseService from "../services/exerciseServer.js"


export const getCategories = async (req, res) => {
  try {
    const data = await exerciseService.getAllCategories();
    res.status(200).json({ 
      success: true, 
      data: data 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getExercisesByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await exerciseService.getCategoryDetail(id);
    res.status(200).json({ 
      success: true, 
      data: data
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getExerciseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await exerciseService.getExerciseDetail(id);
    res.status(200).json({ 
      success: true, 
      data: data 
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};