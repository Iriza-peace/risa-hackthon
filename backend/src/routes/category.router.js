import express from "express";

import {
	addNewCategory,
	getAllCategories,
	getCategoriesByModuleName,
	getCategoriesByModuleId,
} from "../controllers/category.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const categoryRouter = express.Router();

categoryRouter.route("/").post(addNewCategory);
categoryRouter.route("/").get(getAllCategories);
categoryRouter.route("/:moduleName").get(getCategoriesByModuleName);
categoryRouter.route("/id/:moduleId").get(getCategoriesByModuleId);

export { categoryRouter as default };
