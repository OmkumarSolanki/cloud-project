// https://jasonwatmore.com/post/2018/09/24/nodejs-basic-authentication-tutorial-with-example-api

const bcrypt = require("bcrypt");
const { User } = require("../models");
const logger = require("../logs-app/index")
async function basicAuth(req, res, next) {
    if (req.path === "/users/authenticate") {
        return next();
    }

    if (
        !req.headers.authorization ||
        req.headers.authorization.indexOf("Basic ") === -1
    ) {
        return res.status(400).end();
    }

    const base64Credentials = req.headers.authorization.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii"
    );
    const [username, password] = credentials.split(":");
    // console.log(username);
    // console.log(password);

    logger.info(`Authentication started for user with username : ${username}`);

    try {
        const user = await User.findOne({
            where: { username: username },
            attributes: [
                "id",
                "username",
                "password",
                "first_name",
                "last_name",
            ],
        });

        if (!user) {
            logger.warn(`user with username : ${username} not found `);
            logger.debug(`user with username : ${username} not found `);
            return res.status(404).end();
            // 404 - Not Found
        }

        const user1 = await User.findOne({
            where: { username: username, email_verified: true },
            attributes: [
                "username"
            ],
        });

        if (!user1) {
            logger.warn(`user with username : ${username} not verified`);
            logger.debug(`user with username : ${username} not verified`);
            return res.status(403).end();
            // 404 - forbidden
        }
        
        // console.log("User", user);
        // console.log("password ", user.password);
        const passwordMatch = await bcrypt.compare(password, user.password);
        // console.log("password match ", passwordMatch);

        if (!passwordMatch) {
            logger.debug(`password is not correct for user with username : ${username}`);
            logger.warn(`password is not correct for user with username : ${username}`);
            return res.status(401).end();
            // 401 - Unauthorized
        }

        req.user = {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
        };
        // console.log("Auth Done");
        logger.info(`Authentication Successfull for user with username : ${username} `);

        next();
    } catch (error) {
        logger.error(`Error in Basic Auth : ${error}`);
        return res.status(400).end();
    }
}

module.exports = basicAuth;
