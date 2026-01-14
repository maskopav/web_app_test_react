import express from "express";
import { 
    getProjectList
 } from "../controllers/projectController.js";

const router = express.Router();

router.get("/projects-list", getProjectList); 

export default router;