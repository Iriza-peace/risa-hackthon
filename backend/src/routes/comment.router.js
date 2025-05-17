import express from "express";
import { addComment, getTicketComments } from "../controllers/comment.controller.js";

const router = express.Router();

// Add new comment
router.post("/", addComment);

// Get comments for a ticket
router.get("/tickets/:id", getTicketComments);

export default router;
