import express from "express";
import * as menu from "../controller/menuController.js";
import * as auth from "../middleware/tokenVerify.js";
import * as menuVerify from "../middleware/menuVerify.js";
import upload from "../middleware/imageSave.js";

const app = express();

app.post(
  "/create",
  [auth.verifyRole(["ADMIN"]), menuVerify.menuCreate, upload.single("image")],
  menu.postMenu
);
app.get("/", auth.verifyRole(["ADMIN"]), menu.getMenu);
app.delete("/delete/:id", auth.verifyRole(["ADMIN"]), menu.deleteMenu);
app.patch(
  "/update/:id",
  [auth.verifyRole(["ADMIN"]), menuVerify.menuUpdate, upload.single("image")],
  menu.updateMenu
);

export default app;
