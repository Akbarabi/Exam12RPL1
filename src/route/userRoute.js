import express from "express";
import * as user from "../controller/userController.js";
import * as authVerify from "../middleware/userVerify.js";
import { VerifyToken } from "../middleware/tokenVerify.js";

const app = express();

app.post("/register",authVerify.userRegister, user.createUser);
app.post("/login",authVerify.userLogin, user.loginUser)
app.get("/",VerifyToken, user.getUser,);
app.delete("/delete/:id",VerifyToken, user.deleteUser);
app.patch("/update/:id", VerifyToken, user.updateUser);

export default app