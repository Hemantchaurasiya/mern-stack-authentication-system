const express = require("express");
const authRouter = express.Router();

const isAuthenticated = require("../middlewares/auth-middleware");
const {Register,Login,Logout,changePassword,sendResetPassword,getResetPassword} = require("../controllers/auth-controller");
const {verifyRegisterEmail} = require("../services/verify-email-token-service");
const refreshToken = require("../services/jwt-refresh-token-service");

// register user
authRouter.post("/register",Register);

// verify email for register the user
authRouter.get("/verify-email",verifyRegisterEmail);

// login user
authRouter.post("/login",Login);

// logout user
authRouter.post("/logout",isAuthenticated,Logout);

// send email for reset password (on click reset password button)
authRouter.post("/send-email-reset-password",sendResetPassword);

// get the reset password after the verify reset password token
authRouter.post("/get-reset-password",getResetPassword);

// change password
authRouter.post("/change-password/:userId",isAuthenticated,changePassword);

// for refresh jwt token
authRouter.post("/refresh-token",refreshToken);

module.exports = authRouter;