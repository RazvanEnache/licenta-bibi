import Sequelize from "sequelize";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./transport.db",
});

const User = sequelize.define("user", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
	},
	user: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	pwd: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	firstName: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: true,
		validate: {
			isEmail: true,
		},
	},
	phoneNumber: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	cnp: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	refreshToken: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	cui: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	roles: {
		type: Sequelize.STRING,
		allowNull: true,
		defaultValue: "2001",
	},
});

const TransportingCar = sequelize.define("transportingCar", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true,
	},
	maxVolume: {
		type: Sequelize.REAL,
		allowNull: true,
	},
	maxWeight: {
		type: Sequelize.REAL,
		allowNull: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	consumption: {
		type: Sequelize.REAL,
		allowNull: true,
	},
});

const Merchandise = sequelize.define("merchandise", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true,
	},
	volume: {
		type: Sequelize.REAL,
		allowNull: true,
	},
	weight: {
		type: Sequelize.REAL,
		allowNull: true,
	},
	desirableDeliveringDate: {
		type: Sequelize.DATE,
		allowNull: true,
	},
	priority: {
		type: Sequelize.ENUM,
		values: [0, 1],
		defaultValue: 1,
	},
	longitude: {
		type: Sequelize.REAL,
		allowNull: true,
	},
	latitude: {
		type: Sequelize.REAL,
		allowNull: true,
	},
	cancelled: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	associated: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
	client: {
		type: Sequelize.STRING,
		allowNull: true,
	},
});

const Transport = sequelize.define("transport", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true,
	},
	date: {
		type: Sequelize.DATE,
		allowNull: true,
	},
	dateDelivered: {
		type: Sequelize.DATE,
		allowNull: true,
	},
	status: {
		type: Sequelize.ENUM,
		values: ["Efectuat", "In progres livrare", "Draft", "Anulat"],
		defaultValue: "Draft",
	},
	distanceTraveled: {
		type: Sequelize.REAL,
		allowNull: true,
	},
	fuelConsumption: {
		type: Sequelize.REAL,
		allowNull: true,
	},
	cost: {
		type: Sequelize.REAL,
		allowNull: true,
	},
});

Merchandise.hasOne(Transport, {
	foreignKey: "merchandiseId",
});
User.hasOne(Transport, {
	foreignKey: "userId",
});
User.hasOne(TransportingCar, {
	foreignKey: {
		name: "userId",
		allowNull: true,
	},
});

async function initialize() {
	await sequelize.authenticate();
	await sequelize.sync({
		alter: true,
	});
}

export { initialize, User, Merchandise, Transport, TransportingCar };
