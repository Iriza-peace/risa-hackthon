// DATABASE RELATIONS File

import Ticket from "./ticket.model.js";
import Agent from "./agent.model.js";
import Module from "./module.model.js";
import Category from "./category.model.js";
import Comment from './comment.model.js';
// define foreign key relations
Ticket.belongsTo(Agent, { foreignKey: "agent_id" });
Agent.hasMany(Ticket, { foreignKey: "agent_id" });

Category.belongsTo(Module, { foreignKey: "module_id" });
Module.hasMany(Category, { foreignKey: "module_id" });

Ticket.hasMany(Comment, {foreignKey:"ticket_id", as:"comment"});
Comment.belongsTo(Ticket,{foreignKey:"ticket_id"});



export { Agent, Ticket, Category, Module, Comment};
