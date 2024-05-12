const { app } = require("../app.js");
const db = require("../models/index.js");
const request = require("supertest");

beforeAll(async () => {
    await db.checkDatabaseConnectivityAndCreation();
});

// beforeAll(() => {
//     return app
//         .then(() => db.checkDatabaseConnectivicltyAndCreation())
//         .catch((error) => {
//             console.error("An error occurred:", error);
//         });
// });

const newUser = {
    first_name: "om",
    last_name: "solanki",
    username: "test@gmail.com",
    password: "1234",
};
// Test 1 - Create an account, and using the GET call, validate account exists.
test("Test 1 - Create an account and Use the Get Call to validate if account exists.", async () => {
    const createdUser = await request(app)
        .post("/v1/user")
        .send(newUser)
        .set("Accept", "application/json")
        .expect("Cache-Control", /no-cache/)
        .expect(201);

    delete createdUser.body.account_created;
    delete createdUser.body.account_updated;
    delete createdUser.body.email_verified;

    const getUser = await request(app)
        .get("/v1/user/self")
        .auth(newUser.username, newUser.password)
        .expect("Cache-Control", /no-cache/)
        .expect(200);

    delete getUser.body.account_created;
    delete getUser.body.account_updated;

    // console.log(createdUser.body);
    // console.log(getUser.body);
    expect(createdUser.body).toEqual(getUser.body);
});

// Test 2 - Update the account and using the GET call, validate the account was updated.
test("Test 2 - Update the account and using the GET call validate if the account was updated.", async () => {
    const updateUser = {
        first_name: "Omkumar",
        last_name: "Solankiii",
        password: "12345",
    };

    const updatedUserPUT = await request(app)
        .put("/v1/user/self")
        .auth(newUser.username, newUser.password)
        .send(updateUser)
        .set("Accept", "application/json")
        .expect("Cache-Control", /no-cache/)
        .expect(204);

    const getUser = await request(app)
        .get("/v1/user/self")
        .auth(newUser.username, updateUser.password)
        .expect("Cache-Control", /no-cache/)
        .expect(200);

    expect(updateUser.first_name).toEqual(getUser.body.first_name);
    expect(updateUser.last_name).toEqual(getUser.body.last_name);
});

afterAll(async () => {
    await db.closeSequelizeSQLDatabaseConnection();
});
