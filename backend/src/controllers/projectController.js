  // backend/src/controllers/projectController.js
  import { executeQuery } from "../db/queryHelper.js";
  
  // Fetch all projects for selection
  export const getAllProjects = async (req, res) => {
    try {
      const rows = await executeQuery("SELECT id, name, description FROM projects WHERE is_active = 1", []);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  };
  