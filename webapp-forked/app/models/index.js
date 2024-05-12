const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const mysql = require("mysql2/promise");
const process = require("process");
const basename = path.basename(__filename);
const logger = require('../logs-app/index');
// require("dotenv").config();
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;

const checkDatabaseConnectivityAndCreation = async () => {
    logger.debug('check Database Connectivity And Creation api called');
    // console.log(process.env.NODE_ENV);
    try {
        const { host, port, username: user, password, database } = config;
        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
        });
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS \`${database}\`;`
        );
        await connection.close();
        await db.sequelize.sync({ alter: true });
        // .then(() => {
        //     console.log("check Database Connectivity And Creation");
        // })
        // .catch((error) => {
        //     console.log("Error connecting with database!", error);
        // });

        // console.log("MYSQL Database has been created / updated : ", database);
        logger.info(`MYSQL Database has been created / updated: ${database}`);
    } catch (error) {
        // console.error("Error while creating database: ", error.message);
        logger.error(`Error while creating database: ${error.message}`);
    }
};

const closeSequelizeSQLDatabaseConnection = async () => {
    try {
        await db.sequelize.close();
    } catch (error) {}
};

// checkDatabaseConnectivityAndCreation();

// async function initializeApp() {
//     try {
//         await db.sequelize.authenticate(); // Test the connection
//         console.log("Connection has been established successfully.");

//         await db.sequelize.sync({ force: true }); // Use { force: true } only if you want to drop tables and recreate them
//         console.log("All models were synchronized successfully.");

//         app.listen(process.env.PORT, () => {
//             console.log("Server is Running on Port :", process.env.PORT);
//         });
//     } catch (error) {
//         console.error("Unable to connect to the database:", error);
//     }
// }

// initializeApp();

const sequelizeOptions = {
    ...config,
    define: {
        timestamps: false,
    },
    logging: false,
    alter: true,
};

if (config.use_env_variable) {
    sequelize = new Sequelize(
        process.env[config.use_env_variable],
        sequelizeOptions
    );
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        sequelizeOptions,
        config
    );
}

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js" &&
            file.indexOf(".test.js") === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.checkDatabaseConnectivityAndCreation = checkDatabaseConnectivityAndCreation;
db.closeSequelizeSQLDatabaseConnection = closeSequelizeSQLDatabaseConnection;

module.exports = db;
