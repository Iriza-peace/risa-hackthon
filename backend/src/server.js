import http from "node:http";

import express from "express";
import cors from "cors";
import { Server } from 'socket.io'
import path from "path";
import { fileURLToPath } from "url";

import startDB from "./config/db.config.js";
import ticketRouter from "./routes/ticket.router.js";
import agentRouter from "./routes/agent.router.js";
import moduleRouter from "./routes/module.router.js";
import categoryRouter from "./routes/category.router.js";
import commentRouter from "./routes/comment.router.js"
import chatRouter from "./routes/chat.router.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/test", (req, res) => {
	res.send("Server Up and Running...");
});

app.use("/api/tickets", ticketRouter);
app.use("/api/agents", agentRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments",commentRouter)
app.use("/api/chats",chatRouter)
// Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		transports: ['websocket', 'polling']
	},
	pingTimeout: 60000,
	pingInterval: 25000
});



startDB().then(() => {
	server.listen(PORT, () => console.log(`Listening on *:${PORT}`)
	)
})

