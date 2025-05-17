import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PWD,
	{
		host: "localhost",
		dialect: "mysql",
		logging: (msg) => {
			if (process.env.NODE_ENV !== "development") {
				console.log(msg);
			}
		},
	}
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
