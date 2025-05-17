import express from "express";
import multer from "multer";
const storage= multer.memoryStorage()
const upload= multer({ storage });

import {
	createNewTicket,
	assignTicketToAgent,
	markTicketAsCompleted,
	getAllTickets,
	getSingleTicket,
	getTicketsByIdNumber,
} from "../controllers/ticket.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const ticketRouter = express.Router();

ticketRouter.route("/").post(upload.array("media"), createNewTicket)
ticketRouter.route("/").get(getAllTickets);
ticketRouter.route("/:ticketId").get(getSingleTicket);
ticketRouter.route("/:ticketId/assign").put(assignTicketToAgent);
ticketRouter.route("/:ticketId/complete").put(markTicketAsCompleted);
ticketRouter.route("/user/:userId").get(getTicketsByIdNumber);

export { ticketRouter as default };
