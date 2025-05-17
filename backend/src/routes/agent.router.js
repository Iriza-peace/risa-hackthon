import express from "express";

import { loginAgent } from "../controllers/agent.controller.js";

const agentRouter = express.Router();

agentRouter.route("/login").post(loginAgent);

export { agentRouter as default };
