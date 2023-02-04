import Sequelize from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./users.db",
});

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
  privateCode: {
    type: Sequelize.UUID,
    allowNull: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  icon: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  ethAddress: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  deathCertificateHash: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  cnp: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  iban: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM,
    defaultValue: "Inactive",
    values: ["Active", "Inactive"],
    allowNull: true,
  },
});

const Address = sequelize.define("address", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  latitude: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  longitude: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Clinic = sequelize.define("clinic", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ethAddress: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

const Application = sequelize.define("application", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  period: {
    type: Sequelize.ENUM,
    values: ["10", "15", "20", "25", "30"],
    allowNull: false,
  },
  premium: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM,
    values: ["Policy issued", "Pending", "Canceled"],
    allowNull: true,
  },
});

User.hasMany(Application, { foreignKey: "userId" });
Clinic.hasOne(Address, { foreignKey: "clinicId" });

async function initialize() {
  await sequelize.authenticate();
  // await sequelize.sync({
  //   alter: true,
  // });
}

export { initialize, User, Application, Clinic, Address /*Policy*/ };
