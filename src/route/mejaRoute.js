import express from "express";
import * as meja from "../controller/mejaController.js";
import * as auth from "../middleware/tokenVerify.js";

const app = express();

app.post("/create", auth.verifyRole(["ADMIN"]), meja.postMeja);
app.get("/", auth.verifyRole(["ADMIN"]), meja.getMeja);
app.delete("/delete/:id", auth.verifyRole(["ADMIN"]), meja.deleteMeja);
app.put("/update/:id", auth.verifyRole(["ADMIN"]), meja.updateMeja);

export default app;