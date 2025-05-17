import express from "express";

import { addNewModule, getAllModules } from "../controllers/module.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const moduleRouter = express.Router();

moduleRouter.route("/").post(addNewModule);
moduleRouter.route("/").get(getAllModules);

export { moduleRouter as default };
