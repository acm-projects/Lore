import express from "express";
import storiesRoutes from './stories.js';
import profilesRoutes from './profiles.js';

const router = express.Router();

// Consolidate all routes here
router.use("/stories", storiesRoutes);  // Handle requests starting with /stories

router.use("/profiles", profilesRoutes);  // Handle requests starting with /stories

export default router;
