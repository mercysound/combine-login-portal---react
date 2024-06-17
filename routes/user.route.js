const express = require("express");
const userRouter = express.Router();
const {sendmail, landingPage, postSignUpPage, userLoginAuthentication, getDashboard, uploadFile} = require("../controllers/user.controller")
userRouter.get("/", landingPage)
userRouter.get("/sendmail", sendmail)
userRouter.post("/postsignup", postSignUpPage)
userRouter.post("/signin", userLoginAuthentication)
userRouter.get("/dashboard", getDashboard)
userRouter.post("/upload", uploadFile);


module.exports = userRouter;
