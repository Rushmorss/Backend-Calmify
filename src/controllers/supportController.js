import supportService from '../services/supportService.js'; 

const getLocations = async (req, res) => {
  try {
    const { q } = req.query; 
    const locations = await supportService.getAllLocations(q);
    const types = await supportService.getSupportTypes(); 
    res.status(200).json({ success: true, data: locations, types: types });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getLocationById = async (req, res) => {
  try {
    const location = await supportService.getLocationById(req.params.id);
    if (!location) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }
    res.status(200).json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createLocation = async (req, res) => {
  try {
    const newLocation = await supportService.createLocation(req.body);
    res.status(201).json({ success: true, data: newLocation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const updatedLocation = await supportService.updateLocation(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedLocation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteLocation = async (req, res) => {
  try {
    await supportService.deleteLocation(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default {
    getLocations,
    getLocationById, 
    createLocation,
    updateLocation,
    deleteLocation,
}