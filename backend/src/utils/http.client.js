import axios from "axios";

const client = axios.create({
	baseURL: process.env.AGENT_API_URL,
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});

export { client as default };
