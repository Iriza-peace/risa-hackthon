import { DataTypes } from "sequelize";

import { sequelize } from "../config/db.config.js";

const Module = sequelize.define(
	"Module",
	{
		module_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		module_name: {
			type: DataTypes.STRING(100),
			// allowNull: false,
		},
	},
	{
		timestamps: false,
		tableName: "modules",
	}
);

export { Module as default };
