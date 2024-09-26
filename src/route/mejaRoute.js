import express from "express";
import * as meja from "../controller/mejaController.js";
import * as auth from "../middleware/tokenVerify.js";

const app = express();

app.post("/create", auth.adminTokenVerify, meja.postMeja);
app.get("/", auth.adminTokenVerify, meja.getMeja);
app.delete("/delete/:id", auth.adminTokenVerify, meja.deleteMeja);
app.put("/update/:id", auth.adminTokenVerify, meja.updateMeja);

export default app;