import expressAsyncHandler from "express-async-handler";

import { Module } from "../models/_index.js";

export const addNewModule = expressAsyncHandler(async (req, res) => {
	const { moduleName } = req.body;

	try {
		const newModule = await Module.create({
			module_name: moduleName,
		});

		res.status(200).json(newModule);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

export const getAllModules = expressAsyncHandler(async (req, res) => {
	try {
		const allModules = await Module.findAll();
		res.status(200).json(allModules);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});
