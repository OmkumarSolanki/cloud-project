const express = require("express");
const router = express.Router();
const { createNewUser } = require("../controllers/user.js");
const { updateUser, getUser, verifyEmail} = require("../controllers/user.js");
const basicAuth = require("../middlewares/auth.js");

router.post("/", createNewUser);
router.get("/email", verifyEmail);

router.use(basicAuth);
router.put("/self", updateUser);
router.get("/self", getUser);

module.exports = router;
