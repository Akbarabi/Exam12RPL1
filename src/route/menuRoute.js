import express from "express";
import * as menu from "../controller/menuController.js";
import * as auth from "../middleware/tokenVerify.js";
import * as menuVerify from "../middleware/menuVerify.js";
import upload from "../middleware/imageSave.js";

const app = express();

app.post(
  "/create",
  [auth.adminTokenVerify, upload.single("image"), menuVerify.menuCreate],
  menu.postMenu
);
app.get("/", auth.adminTokenVerify, menu.getMenu);
app.delete("/delete/:id", auth.adminTokenVerify, menu.deleteMenu);
app.patch(
  "/update/:id",
  [auth.adminTokenVerify, menuVerify.menuUpdate, upload.single("image")],
  menu.updateMenu
);

export default app;
