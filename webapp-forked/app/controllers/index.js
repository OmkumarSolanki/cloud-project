const logger = require('../logs-app/index');

function otherMethodsNotAllowed(req, res, next) {
    res.setHeader("Cache-Control", "no-cache");
    logger.warn('This method is not allowed');
    res.status(405).end();
}

function healthCheck(req, res, next) {
    res.setHeader("Cache-Control", "no-cache");

    
    logger.info('Health Check api called');
    // console.log(JSON.stringify(req.body) == JSON.stringify({}));
    // console.log(req.get("content-length") >= 1);
    // console.log(req._parsedUrl.search != null);

    // If Payload
    if (req.get("content-length") >= 1 || req._parsedUrl.search != null) {
        logger.debug('Health Check api called with payload');
        res.status(400).end();
    }
    logger.info('Health Check api is successfull');
    res.status(200).end();
}

module.exports = {
    otherMethodsNotAllowed,
    healthCheck,
};
