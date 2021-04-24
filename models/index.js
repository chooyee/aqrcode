const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
});


const db = {};
db.sequelize = sequelize;
db.Client = require("../entity/client.entity")(sequelize, DataTypes);
module.exports = db;