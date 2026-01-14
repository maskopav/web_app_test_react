import express from "express";
import { 
    getProjectList,
    updateProject
 } from "../controllers/projectController.js";

const router = express.Router();

router.get("/projects-list", getProjectList); 
router.put("/update", updateProject);

export default router;