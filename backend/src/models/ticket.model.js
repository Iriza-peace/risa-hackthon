import { DataTypes } from "sequelize";

import { sequelize } from "../config/db.config.js";
import Module from './module.model.js'

const Ticket = sequelize.define(
	"Ticket",
	{
		ticket_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		issuer_id_number: {
			type: DataTypes.STRING(20),
			// allowNull: false,
		},
		issuer_full_name: {
			type: DataTypes.STRING(255),
			// allowNull: false,
		},
		issuer_avatar: {
			type: DataTypes.STRING,
		},


		issuer_phone_number: {
			type: DataTypes.STRING(10),
			// allowNull: false,
		},
		issuer_location: {
			type: DataTypes.STRING(32),
			// allowNull: false,
		},
		// ticket_module: {
		// 	type: DataTypes.STRING(25),
		// 	// allowNull: false,
		// },
		 module_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Module,
                key: 'module_id'
            }
        },
		ticket_title: {
			type: DataTypes.STRING(250),
			// allowNull: false,
		},
		ticket_category: {
			type: DataTypes.STRING(250)
		},
		upvotes: {
			type: DataTypes.INTEGER,
			// allowNull: false,

		},
		downvotes: {
			type: DataTypes.INTEGER,
			// allowNull: false,
		},
		comments: {
			type: DataTypes.STRING,
			// allowNull: false,
		},
		ticket_description: {
			type: DataTypes.STRING(1055),
			// allowNull: false,
		},
		images: {
			type: DataTypes.JSON,
			defaultValue: [],
		},
		ticket_status: {
			type: DataTypes.STRING(15),
			defaultValue: "Received",
			allowNull: false,
			validate: {
				isIn: {
					args: [["Received", "Resolved"]],
					msg: "ticket_status must be one of 'Received', or 'Resolved'",
				},
			},
		},
	},
	{ timestamps: false, tableName: "tickets" }
);

export { Ticket as default };
