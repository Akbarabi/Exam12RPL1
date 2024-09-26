import express from "express";
import * as detail from "../controller/detailController.js";
import * as detailVerify from "../middleware/detailVerify.js";

const app = express();

app.post("/create",detailVerify.postDetail detail.postDetail);
app.get("/", detail.getDetail);
app.delete("/delete/:id", detail.deleteDetail);
app.patch("/update/:id",detailVerify.postDetail, detail.updateDetail);

export default app;
