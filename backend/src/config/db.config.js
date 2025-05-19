import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
	process.env.DB_URL
);

async function startDB() {
	try {
		await sequelize.authenticate();
		console.log("Connected to the database successfully!");
		await sequelize.sync({ alter: true });
		console.log("Database synchronized successfully!");
	} catch (err) {
		console.error("Error in the database:", err);
	}
}

export { startDB as default, sequelize };
