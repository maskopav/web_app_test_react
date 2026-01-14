  // backend/src/controllers/projectController.js
  import { executeQuery } from "../db/queryHelper.js";

  export const getProjectList = async (req, res) => {
    // Extract userId and role from query parameters
    const { userId, role } = req.query;

    try {
        let query;
        let params = [];

        // Logic: Masters see all active projects. 
        // Regular admins see only assigned active projects.
        if (role === 'master') {
            query = "SELECT * FROM v_project_summary_stats";
        } else {
            query = `
                SELECT v.* FROM v_project_summary_stats v
                JOIN user_projects up ON v.project_id = up.project_id
                WHERE up.user_id = ?
            `;
            params = [userId];
        }

        const rows = await executeQuery(query, params);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching project list:", err);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
  };