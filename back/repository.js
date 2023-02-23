import Sequelize from "sequelize";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./users.db",
});

// Entities: User (isAdmin property, if set to false, then user is transporter), Transport, TransportingCar, Merchandise,
// TransportingCarXUser, DestinationAddress
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
		allowNull: false,
		primaryKey: true,
	},
	firstName: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
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

const DestinationAddress = sequelize.define("destinationAddress", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true,
	},
	longitude: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	latitude: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	street: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	number: {
		type: Sequelize.NUMBER,
		allowNull: false,
	},
	county: {
		type: Sequelize.STRING,
		allowNull: false,
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
		type: Sequelize.FLOAT,
		allowNull: false,
	},
	maxWeight: {
		type: Sequelize.FLOAT,
		allowNull: false,
	},
});

const TransportingCarXUser = sequelize.define("transportingCarXUser", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true,
	},
	transportingCarId: {
		type: Sequelize.UUID,
		allowNull: false,
	},
	userId: {},
});

const Merchandise = sequelize.define("merchandise", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true,
	},
	destinationAddressId: {
		type: Sequelize.UUID,
		allowNull: false,
	},
	volume: {
		type: Sequelize.FLOAT,
		allowNull: false,
	},
	weight: {
		type: Sequelize.FLOAT,
		allowNull: false,
	},
	desirableDeliveringDate: {
		type: Sequelize.DATE,
		allowNull: false,
	},
	priority: {
		type: Sequelize.ENUM,
		values: [0, 1],
		defaultValue: 1,
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
	transportingCarXUser: {
		type: Sequelize.UUID,
		allowNull: false,
	},
	merchandiseId: {
		type: Sequelize.UUID,
		allowNull: false,
	},
});

Transport.hasOne(TransportingCarXUser, {
	foreignKey: "transportingCarXUserId",
});
Transport.hasOne(TransportingCarXUser, {
	foreignKey: "transportingCarXUserId",
});
Clinic.hasOne(Address, { foreignKey: "clinicId" });

async function initialize() {
	await sequelize.authenticate();
	// await sequelize.sync({
	//   alter: true,
	// });
}

export {
	initialize,
	User,
	Merchandise,
	Transport,
	DestinationAddress /*Policy*/,
};
