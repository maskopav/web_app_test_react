import express from "express";
import { 
    getUserProjectAssignments, 
    assignUserToProject
 } from "../controllers/userProjectController.js";

const router = express.Router();

router.get("/user-projects", getUserProjectAssignments);
router.post("/assign-project", assignUserToProject); 

export default router;