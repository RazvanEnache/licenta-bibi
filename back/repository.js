import Sequelize from "sequelize";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./transport.db",
});

// Entities: User (isAdmin property, if set to false, then user is transporter), Transport, TransportingCar, Merchandise,
// TransportingCarXUser, DestinationAddress, TransportigCarXUserXMerchandise
/* 
    Relations: 
    - Transport has only one TransportingCarXUser
    - Transport has only one Merchandise
    - User can have one or more TransportingCar 
*/
const User = sequelize.define("user", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: true,
		primaryKey: true,
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
	isAdmin: {
		type: Sequelize.BOOLEAN,
		allowNull: true,
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
	associated: {
		type: Sequelize.BOOLEAN,
		defaultValue: false,
	},
});

/* 
	Characterizing transport priorty:	
	- priority 0: must be delivered at specified date and time
	- priority 1: can be delivered within the week of specified date
*/
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
