import express from "express";

import { createChat, getAllChats, getChatByTicketId} from './../controllers/chat.controller.js';


const chatRouter = express.Router();

chatRouter.route("/:ticketId").get(getChatByTicketId);
chatRouter.route("/").get(getAllChats);
chatRouter.route("/").post(createChat);

export { chatRouter as default };