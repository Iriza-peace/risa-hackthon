import { DataTypes } from "sequelize";

import { sequelize } from "../config/db.config.js";

const Agent = sequelize.define(
	"Agent",
	{
		agent_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		agent_full_name: {
			type: DataTypes.STRING(255),
			
		},
		ippis_id: {
			type: DataTypes.BIGINT,
			
		},
		can_support: {
			type: DataTypes.BOOLEAN,
			
		},
	},
	{
		timestamps: false,
		tableName: "agents",
	}
);

export { Agent as default };
