require("dotenv").config();
const express = require("express");
const db = require("./models/index.js");
const route = require("./routes/index.js");
const userRouter = require("./routes/users.js");
const middleware = require("./middlewares/index.js");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(middleware.CheckDbConnectionAndCacheControlAndPayloadCheck);

app.use("/v1/user", userRouter);
app.use("/", route);

db.sequelize
    .sync({ alter: true })
    .then(() => {})
    .catch((error) => {
        console.log("Error connecting to database : ", error);
    });

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running on Port :", process.env.PORT || 3000);
});
