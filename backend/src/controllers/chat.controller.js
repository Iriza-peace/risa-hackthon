import expressAsyncHandler from "express-async-handler";
import { Chat, Ticket, Agent, Comment } from '../models/_index.js';

export const getChatByTicketId = expressAsyncHandler(async (req, res) => {
    const { ticketId } = req.params;

    try {
        const chat = await Chat.findOne({
            where: { ticket_id:ticketId },
            include: [
        {
          model: Comment,
          as: 'comments'
        }
      ]
        });

        if (!chat) {
            return res.status(404).json({ message: 'No chat found for this ticket' });
        }

        res.json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export const getAllChats = expressAsyncHandler(async (req, res) => {
    try {
        const chats = await Chat.findAll({
            include: {
                model: Ticket,
                include: {
                    model: Agent,
                }
            }
        });
        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching all chats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export const createChat = expressAsyncHandler(async (req, res) => {
    const { national_id } = req.body;

    try {
        const [chat, created] = await Chat.findOrCreate({
            where: { national_id },
            defaults: { national_id}
        });

        if (created) {
            res.status(201).json(chat);
        } else {
            res.status(200).json(chat);
        }
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
