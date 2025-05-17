import expressAsyncHandler from "express-async-handler";

import { Agent, Ticket } from "../models/_index.js";

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
		comments,
		ticket_description,
		ticket_status,
		agent_id
	} = req.body;

	try {
		const newTicket = await Ticket.create({
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
			comments,
			ticket_description,
			ticket_status,
			agent_id
		});
		res.status(200).json(newTicket);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
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
		const ticket = await Ticket.findByPk(ticketId);
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

export {
	createNewTicket,
	assignTicketToAgent,
	markTicketAsCompleted,
	getAllTickets,
	getSingleTicket,
	getTicketsByIdNumber,
};
