import expressAsyncHandler from "express-async-handler";

import { Category, Module } from "../models/_index.js";

export const addNewCategory = expressAsyncHandler(async (req, res) => {
	const { categoryTitle, moduleId } = req.body;
	try {
		const moduleData = await Module.findByPk(moduleId);

		if (!moduleData) {
			return res.status(404).json({ message: "Module not found" });
		}

		const newCategory = await Category.create({
			category_title: categoryTitle,
			module_id: moduleId,
		});

		res.status(200).json(newCategory);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

export const getAllCategories = expressAsyncHandler(async (req, res) => {
	try {
		const allCategories = await Category.findAll();
		res.status(200).json(allCategories);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal server error" });
	}
});

export const getCategoriesByModuleName = expressAsyncHandler(
	async (req, res) => {
		let { moduleName } = req.params;
		moduleName = moduleName.toUpperCase();
		try {
			const categories = await Category.findAll({
				include: [
					{
						model: Module,
						where: {
							module_name: moduleName,
						},
					},
					{
						model: Article,
					},
				],
			});

			res.status(200).json(categories);
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: "Internal server error" });
		}
	}
);

export const getCategoriesByModuleId = expressAsyncHandler(async (req, res) => {
	const { moduleId } = req.params;

	try {
		const categories = await Category.findAll({
			where: { module_id: moduleId },
		});

		res.status(200).json(categories);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to fetch categories" });
	}
});
