const { error } = require("console");
const db = require("../models/index.js");
const logger = require("../logs-app/index.js")

async function CheckDbConnectionAndCacheControlAndPayloadCheck(req, res, next) {
    res.setHeader("Cache-Control", "no-cache");

    if (req.method === "GET") {
        if(req._parsedUrl.query && req._parsedUrl.query.split('=')[0] != 'token' && req._parsedUrl.pathname != '/v1/user/email')
        {
            if (req.get("content-length") >= 1 || req._parsedUrl.search != null) {
                // console.log("Get has payload");
                logger.warn('Get Method Cannot have PayLoad1');
                res.status(400).end();
                return;
            }
        } else {
            if (req.get("content-length") >= 1) {
                // console.log("Get has payload");
                logger.warn('Get Method Cannot have PayLoad1');
                res.status(400).end();
                return;
            }
        }
    }
    try {
        await db.sequelize.authenticate();
    } catch {
        res.status(503).end();
        return;
    }

    next();
}

module.exports = {
    CheckDbConnectionAndCacheControlAndPayloadCheck,
};
