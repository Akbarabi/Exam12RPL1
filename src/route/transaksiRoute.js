import express from "express";
import * as transaksi from "../controller/transactionController.js";
import * as auth from "../middleware/tokenVerify.js";
import * as transaksiVerify from "../middleware/transaksiVerify.js";

const app = express();

app.post("/create", [auth.adminTokenVerify, transaksiVerify.transaksiCreate], transaksi.createTransaksi);
app.get("/", auth.adminTokenVerify, transaksi.getTransaction);
app.delete("/delete/:id", auth.adminTokenVerify, transaksi.deleteTransaction);
app.patch("/update/:id", [auth.adminTokenVerify, transaksiVerify.transaksiUpdate], transaksi.updateTransaction);

export default app; 