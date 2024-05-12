const express = require("express");
const route = require("./routes/index.js");
const userRouter = require("./routes/users.js");
const middleware = require("./middlewares/index.js");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(middleware.CheckDbConnectionAndCacheControlAndPayloadCheck);

app.use("/v1/user", userRouter);
app.use("/", route);

module.exports = {
    app,
};
