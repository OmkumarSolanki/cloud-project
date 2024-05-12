require("dotenv").config();
const { app } = require("./app");
const db = require("./models/index.js");
const logger = require('./logs-app/index.js');

// db.sequelize
//     .sync({ alter: true })
//     .then(() => {})
//     .catch((error) => {
//         console.log("Error connecting to database : ", error);
//     });
logger.info('Application Started');
logger.debug('Testing for logging - Debug');
logger.warn('Testing for logging - Warning');
logger.error('Testing for logging - Error');
db.checkDatabaseConnectivityAndCreation()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            // console.log(
            //     "Server is Running on Port :",
            //     process.env.PORT || 3000
            // );
            logger.info(`Server is Running on Port: ${process.env.PORT || 3000}`);
        });
    })
    .catch(() => {
        // console.log("Error in connecting to database");
        logger.error('Error in connecting to database')
    });
