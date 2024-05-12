const express = require("express");
const router = express.Router();
const {
    otherMethodsNotAllowed,
    healthCheck,
} = require("../controllers/index.js");

router
    .head("/healthz", otherMethodsNotAllowed)
    .get("/healthz", healthCheck)
    .all("/*", otherMethodsNotAllowed);

module.exports = router;
