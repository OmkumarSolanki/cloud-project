const { User } = require("../models");
const bcrypt = require("bcrypt");
const logger = require("../logs-app/index")
const { publishMessage } = require("../pub_sub/index");
const moment = require('moment');

async function verifyEmail(req, res) {
    try {
        let token = req._parsedUrl.query.split('=')[1];
        if (req._parsedUrl.query.split('=')[0] == "token" && token != null) {
            const user = await User.findOne({
                where: { token: token },
                attributes: ["username", "email_expiry"], 
            });

            if (user) {
                console.log(user.email_expiry)
                const emailExpiry = moment(user.email_expiry); 
                const currentTime = moment.utc(); 
                console.log(emailExpiry);
                console.log(currentTime);

                if (currentTime.isBefore(emailExpiry)) { 
                    const user1 = await User.findOne({
                        where: { token: token, email_verified: true},
                        attributes: ["username", "email_expiry"], 
                    });
                    if(user1)
                    {
                        logger.info(`Email Already Verified for Username : ${user1.username} `);
                        return res.status(400).json({ message: `Email Already Verified for Username : ${user1.username}` });
                    }

                    await User.update(
                        { email_verified: true },
                        { where: { token: token } }
                    );
                    logger.info(`Email Verified for Username : ${user.username} `);
                    return res.status(200).json({ message: `Email Verified for Username : ${user.username}` });
                } else {
                    logger.error(`Token has expired for Username : ${user.username}`);
                    return res.status(401).json({ message: `Token has expired for Username : ${user.username}` });
                }
            } else {
                logger.error(`Token is invalid : ${token}`);
                return res.status(404).json({ message: `Token is invalid : ${token}` });
            }
        } else {
            logger.error(`Token format is not valid`);
            return res.status(400).json({ message: `Token format is not valid` });
        }
    } catch (error) {
        logger.error(`Error While Verifying Token: ${error}`);
        return res.status(400).json({ message: `Error While Verifying Token: ${error}` });
    }
}


async function updateUser(req, res) {
    try {
        const { first_name, last_name, password } = req.body;

        if (req.body.username != undefined) {
            logger.warn(`Update should not have username in it ${req.body.username}`)
            return res.status(400).end();
        }

        if (!first_name || !last_name || !password || first_name == "" || last_name == "" || password == "") {
            logger.warn(`When updating for username ${req.user.username} details such as first name : ${first_name} , last name : ${last_name} and password should not be empty `);
            return res.status(400).end();
        }

        // console.log("REQ User : ", req.user);
        const username = req.user.username;
        // console.log("UserName Auth wala", username);

        const user = req.user;

        if (first_name) {
            user.first_name = first_name;
        }
        if (last_name) {
            user.last_name = last_name;
        }
        if (password) {
            const BcryptPassword = await bcrypt.hash(password, 10);
            user.password = BcryptPassword;
        }
        user.account_updated = new Date();
        console.log("Final User ", user);

        await User.update(user, { where: { username: username } });

        logger.info(`Update user has been sucessfull for username ${username} with details provided ( ${first_name} ${last_name} )`)

        return res.status(204).end();
    } catch (error) {
        // console.error("Error updating user:", error);
        logger.error(` Error While Updating user : ${error}`);
        return res.status(400).end();
    }
}

async function getUser(req, res) {
    try {
        const username = req.user.username;
        // console.log(username);
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // console.log(user);
        // Return user information
        logger.info(`Information for user with username ${user.username} has been retrieved : { first name : ${user.first_name}, last name : ${user.last_name} } `);
        return res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            account_created: user.account_created,
            account_updated: user.account_updated,
        });
    } catch (error) {
        // console.error("Error retrieving user:", error);
        logger.error(`error retrieving user : ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function createNewUser(req, res) {
    try {
        const { first_name, last_name, password, username } = req.body;
        var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // console.log("first_name", first_name);
        // console.log("first_name", last_name);
        // console.log("first_name", username);
        logger.info(`User Create Process Started for ${first_name} ${last_name} with email id ${username}`);

        if (!first_name || !last_name || !password || !regex.test(username)) {
            logger.warn(`User ${first_name} ${last_name} with email id ${username} has incorrect or insufficent details`);
            return res.status(400).end();
        }

        const chechIfExistingUser = await User.findOne({ where: { username } });
        if (chechIfExistingUser) {
            logger.warn(`User with email id ${username} already exists`);
            return res.status(400).end();
        }

        const BcryptPassword = await bcrypt.hash(password, 10);

        const newCreatedUser = await User.create({
            first_name: first_name,
            last_name: last_name,
            username: username,
            password: BcryptPassword,
        });
        // console.log(newCreatedUser.dataValues.first_name);
        logger.info(`User Create Process Successfull for ${newCreatedUser.dataValues.first_name} ${newCreatedUser.dataValues.last_name} with email id ${newCreatedUser.dataValues.username}`);
        // return res.status(201).end();
        delete newCreatedUser.dataValues.password;
        delete newCreatedUser.dataValues.email_expiry;
        delete newCreatedUser.dataValues.token;
        delete newCreatedUser.dataValues.email_verified;
        // Everything is successfull
        // Now Send verification Link
        
        const emailData = {
            username: newCreatedUser.dataValues.username
        };
        if(process.env.NODE_ENV == 'test'){
            newCreatedUser.update({email_verified: true});
        } else {
            publishMessage(process.env.TOPIC_ID, emailData);
        }
        return res.status(201).json(newCreatedUser);

    } catch (error) {
        // console.error("Error creating user:", error);
        logger.error(`Error Creating user : ${error}`)
        return res.status(400).end();
    }
}

module.exports = {
    createNewUser,
    updateUser,
    getUser,
    verifyEmail
};
