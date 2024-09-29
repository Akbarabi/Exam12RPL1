import express from "express";
import * as transaksi from "../controller/transactionController.js";
import * as auth from "../middleware/tokenVerify.js";
import * as transaksiVerify from "../middleware/transaksiVerify.js";

const app = express();

app.post(
  "/create",
  [auth.verifyRole(["KASIR"])],
  transaksiVerify.transaksiCreate,
  transaksi.createTransaksi
);
app.get("/", [auth.verifyRole(["KASIR", "MANAGER"])], transaksi.getTransaction);
app.delete("/delete/:id", transaksi.deleteTransaction);
app.patch(
  "/update/:id",
  transaksiVerify.transaksiUpdate,
  transaksi.updateTransaction
);

export default app;
