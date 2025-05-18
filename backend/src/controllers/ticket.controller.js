import expressAsyncHandler from "express-async-handler";
import path from "path";
import fs from "fs";
import { Agent, Ticket, Comment } from "../models/_index.js";

// Remove multer configuration from controller - it should only be in router

const createNewTicket = expressAsyncHandler(async (req, res) => {
	const {
		issuer_id_number,
		issuer_full_name,
		issuer_avatar,
		issuer_phone_number,
		issuer_location,
		ticket_module,
		ticket_title,
		ticket_category,
		upvotes,
		downvotes,
		ticket_description,
		ticket_status,
		agent_id
	} = req.body;

	// Handle image uploads if files exist
	const images = [];
	if (req.files && req.files.length > 0) {
		console.log('Files received:', req.files); // Debug log
		// Create URLs for each uploaded file
		req.files.forEach((file) => {
			console.log('Processing file:', file); // Debug log
			if (file.filename) {
				// Store relative path to be served by your static middleware
				images.push(`/uploads/${file.filename}`);
			} else {
				console.error('File has no filename:', file);
			}
		});
		console.log('Processed images:', images); // Debug log
	}

	try {
		// FIX: Include images in the ticket creation
		const newTicket = await Ticket.create({
			issuer_id_number,
			issuer_full_name,
			issuer_avatar,
			issuer_phone_number,
			issuer_location,
			ticket_module,
			ticket_title,
			ticket_category,
			upvotes: upvotes || 0,
			downvotes: downvotes || 0,
			ticket_description,
			ticket_status: ticket_status || "Received",
			agent_id,
			images: images // FIX: Add this line to save images
		});
		
		res.status(200).json(newTicket);
	} catch (err) {
		console.error("Error creating ticket:", err);
		res.status(500).json({ message: "Internal server error", error: err.message });
	}
});

// Add images to an existing ticket
const addImagesToTicket = expressAsyncHandler(async (req, res) => {
	const { ticketId } = req.params;

	try {
		const ticket = await Ticket.findByPk(ticketId);

		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}

		// Handle image uploads if files exist
		const newImages = [];
		if (req.files && req.files.length > 0) {
			// Create URLs for each uploaded file
			req.files.forEach((file) => {
				newImages.push(`/uploads/${file.filename}`);
			});
		}

		// Get existing images from the ticket and add new ones
		const existingImages = ticket.images || [];
		const updatedImages = [...existingImages, ...newImages];

		// Update the ticket with the new images
		await Ticket.update(
			{ images: updatedImages },
			{ where: { ticket_id: ticketId } }
		);

		res.status(200).json({
			message: "Images added successfully",
			images: updatedImages
		});
	} catch (err) {
		console.error("Error adding images:", err);
		res.status(500).json({ message: "Internal server error", error: err.message });
	}
});

const assignTicketToAgent = expressAsyncHandler(async (req, res) => {
	const { ticketId } = req.params;
	const { assigneeId } = req.body;
	try {
		const ticket = await Ticket.findByPk(ticketId);

		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}

		const agent = await Agent.findByPk(assigneeId);

		if (!agent) {
			return res.status(404).json({ message: "Agent not found" });
		}

		await Ticket.update(
			{ agent_id: assigneeId, ticket_status: "In Progress" },
			{
				where: { ticket_id: ticketId },
			}
		);
		res.status(200).json({ message: "Ticket assigned successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

const markTicketAsCompleted = expressAsyncHandler(async (req, res) => {
	const { ticketId } = req.params;
	try {
		const ticket = await Ticket.findByPk(ticketId);

		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}

		await Ticket.update(
			{ ticket_status: "Completed" },
			{
				where: { ticket_id: ticketId },
			}
		);

		res.status(200).json({ message: "Ticket marked as completed" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

const getAllTickets = expressAsyncHandler(async (req, res) => {
	try {
		const allTickets = await Ticket.findAll();
		res.status(200).json(allTickets);
		console.log(allTickets);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

const getSingleTicket = expressAsyncHandler(async (req, res) => {
	const { ticketId } = req.params;
	try {
		const ticket = await Ticket.findByPk(ticketId, {
			include: [
				{
					model: Comment,
					as: "comment",
				}
			]
		});
		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}
		res.status(200).json(ticket);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

const getTicketsByIdNumber = expressAsyncHandler(async (req, res) => {
	const { userId } = req.params;

	try {
		const tickets = await Ticket.findAll({
			where: { issuer_id_number: userId },
		});

		if (!tickets || tickets.length === 0) {
			return res.status(404).json({ message: "No tickets found for this ID number" });
		}

		res.status(200).json(tickets);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

const updateTicketStatus = expressAsyncHandler(async (req, res) => {
	const { ticketId } = req.params;
	const { status } = req.body;

	const validStatuses = ["Received", "Resolved"];
	if (!validStatuses.includes(status)) {
		return res.status(400).json({ message: "Invalid status" });
	}

	try {
		const ticket = await Ticket.findByPk(ticketId);

		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}

		await Ticket.update(
			{ ticket_status: status },
			{ where: { ticket_id: ticketId } }
		);

		res.status(200).json({ message: `Ticket updated to "${status}" ` });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Delete an image from a ticket
const deleteTicketImage = expressAsyncHandler(async (req, res) => {
	const { ticketId } = req.params;
	const { imageUrl } = req.body;

	try {
		const ticket = await Ticket.findByPk(ticketId);

		if (!ticket) {
			return res.status(404).json({ message: "Ticket not found" });
		}

		// Get existing images and filter out the one to delete
		const existingImages = ticket.images || [];
		const updatedImages = existingImages.filter(img => img !== imageUrl);

		// Update the ticket with the filtered images
		await Ticket.update(
			{ images: updatedImages },
			{ where: { ticket_id: ticketId } }
		);

		// Try to delete the file from the filesystem
		try {
			const filePath = path.join(process.cwd(), imageUrl.substring(1)); // Remove leading '/'
			if (fs.existsSync(filePath)) {
				fs.unlinkSync(filePath);
			}
		} catch (deleteErr) {
			console.error("Error deleting file:", deleteErr);
			// Continue even if file deletion fails
		}

		res.status(200).json({
			message: "Image deleted successfully",
			images: updatedImages
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

export {
	createNewTicket,
	assignTicketToAgent,
	markTicketAsCompleted,
	getAllTickets,
	getSingleTicket,
	getTicketsByIdNumber,
	updateTicketStatus,
	addImagesToTicket,
	deleteTicketImage,
};