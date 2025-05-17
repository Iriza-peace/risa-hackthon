// import expressAsyncHandler from "express-async-handler";
// import jwt from "jsonwebtoken";

// import { Agent } from "../models/_index.js";
// import client from "../utils/http.client.js";
// import getToken from "../services/token.service.js";

// export const loginAgent = expressAsyncHandler(async (req, res) => {
// 	const { email, password } = req.body;
// 	// const tokenData = await getToken();
// 	try {
// 		const authResponse = await fetch(
// 			`${process.env.AGENT_API_URL}/users`,
// 			{
// 				method: "POST",
// 				body: JSON.stringify({ email, password }),
// 				headers: {
// 					"Content-Type": "application/json",
					
// 				},
// 			}
	
// 		);
// 		console.log(authResponse)

// 		if (authResponse.status !== 200) {
			
// 			return res.status(401).json({ message: "Invalid credentials" });
// 		}

// 		const agentData = await authResponse.json();

// 		const jwtToken = jwt.sign(
// 			{
// 				agentId: agentData.id,
// 				canSupport: agentData.canSupport,
// 			},
// 			process.env.TOKEN_SECRET,
// 			{ expiresIn: "3hr" }
// 		);

// 		return res.status(200).json({
// 			token: jwtToken,
// 			user: {
// 				agentNames: `${agentData.firstName} ${agentData.lastName}`,
// 			},
// 		});
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).json({ message: "Internal server error" });
// 	}
// });

import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const loginAgent = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body;

	try {
		// Step 1: Fetch all users
		const response = await fetch(`${process.env.AGENT_API_URL}/users`);
		if (!response.ok) {
			return res.status(500).json({ message: "Failed to fetch agents" });
		}

		// Step 2: Parse response
		const agents = await response.json();

		// Step 3: Find matching agent manually
		const agent = agents.find(
			(a) => a.email === email && a.password === password
		);

		// Step 4: If not found
		if (!agent) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Step 5: Create token
		const jwtToken = jwt.sign(
			{
				agentId: agent.id,
				canSupport: agent.canSupport ?? true,
			},
			process.env.TOKEN_SECRET,
			{ expiresIn: "3hr" }
		);

		// Step 6: Return success
		return res.status(200).json({
			token: jwtToken,
			user: {
				agentNames: `${agent.name}`,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

