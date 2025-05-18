import { DataTypes } from "sequelize";

import { sequelize } from "../config/db.config.js";

const Chat = sequelize.define(
    "Chat",
    {
        chat_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        ticket_id:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },
    {
        timestamps: true,
        tableName: "chats"
    }
)
export { Chat as default }