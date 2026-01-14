import express from "express";
import { 
    getUserProjectAssignments, 
    assignUserToProject,
    removeUserProjectAssignment
 } from "../controllers/userProjectController.js";

const router = express.Router();

router.get("/user-projects", getUserProjectAssignments);
router.post("/assign-project", assignUserToProject); 
router.delete("/remove-assignment/:id", removeUserProjectAssignment); 

export default router;