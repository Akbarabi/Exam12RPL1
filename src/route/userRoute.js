import express from "express";
import * as user from "../controller/userController.js";
import * as authVerify from "../middleware/userVerify.js";
import * as tokenVerify from "../middleware/tokenVerify.js";

const app = express();

app.post("/register",authVerify.userRegister, user.postUser);
app.post("/login",authVerify.userLogin, user.loginUser)
app.get("/",tokenVerify.adminTokenVerify, user.getUser,);
app.delete("/delete/:id",tokenVerify.adminTokenVerify, user.deleteUser);
app.patch("/update/:id", tokenVerify.adminTokenVerify, user.updateUser);

export default app