import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for disk storage instead of memory storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Files will be stored in 'uploads' folder
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

const router = express.Router();
import {
    createNewTicket,
    assignTicketToAgent,
    markTicketAsCompleted,
    getAllTickets,
    getSingleTicket,
    getTicketsByIdNumber,
    updateTicketStatus,
    addImagesToTicket,
    deleteTicketImage
} from "../controllers/ticket.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const ticketRouter = express.Router();

ticketRouter.route("/").post(upload.array("media"), createNewTicket)
ticketRouter.route("/").get(getAllTickets);
ticketRouter.route("/:ticketId").get(getSingleTicket);
ticketRouter.route("/:ticketId/assign").put(assignTicketToAgent);
ticketRouter.route("/:ticketId/complete").put(markTicketAsCompleted);
ticketRouter.route("/user/:userId").get(getTicketsByIdNumber);
ticketRouter.route("/:ticketId/status").put(updateTicketStatus);

ticketRouter.route("/:ticketId/images").post(upload.array("images", 5), addImagesToTicket);
ticketRouter.route("/:ticketId/images").delete(deleteTicketImage)

export { ticketRouter as default };