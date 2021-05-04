const express = require("express");
const UserController = require("./controllers/UserController");
const routes = express();

const { JWTValidation } = require("./middlewares/AuthMiddleware");

routes.post("/user", UserController.create);
routes.post("/user/login", UserController.login);
routes.get("/user/logout", UserController.logout);

routes.get("/user/validate-login", JWTValidation, UserController.validateLogin);

module.exports = routes;
