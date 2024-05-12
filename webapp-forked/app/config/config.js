require("dotenv").config();

module.exports = {
    development: {
        port: 3306,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
        host: "127.0.0.1",
        dialect: "mysql",
    },
    test: {
        port: 3306,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.TEST_MYSQL_DB_NAME,
        host: "127.0.0.1",
        dialect: "mysql",
    },
    production: {
        port: 3306,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
        host: process.env.MYSQL_HOST,
        dialect: "mysql",
    },
};
