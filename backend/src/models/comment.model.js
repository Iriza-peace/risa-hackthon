import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import Ticket from "./ticket.model.js";
import Chat from "./chat.model.js";
const Comment = sequelize.define(
  "Comment",
  {
    comment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chat_id:{
      type: DataTypes.INTEGER,
      references:{
        model:'chats',
        key:'chat_id'
      }
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tickets",
        key: "ticket_id",
      },
    },
    author_type: {
      // type: DataTypes.ENUM("admin", "user"),
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    author_name: {
      type: DataTypes.STRING(100),
    },
    author_avatar: {
      type: DataTypes.STRING,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // true means visible to everyone
    },
    content: {
      type: DataTypes.STRING(1055),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "comments",
  }
);

export default Comment;
