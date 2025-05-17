import { DataTypes } from "sequelize";

import { sequelize } from "../config/db.config.js";

const Category = sequelize.define(
	"Category",
	{
		category_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		category_title: {
			type: DataTypes.STRING(100),
			// allowNull: false,
		},
	},
	{
		timestamps: false,
		tableName: "categories",
	}
);

export { Category as default };
