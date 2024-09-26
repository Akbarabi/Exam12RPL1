import express from "express";
import userRoute from "./route/userRoute.js";
import menuRoute from "./route/menuRoute.js";
import mejaRoute from "./route/mejaRoute.js";
import transaksiRoute from "./route/transaksiRoute.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/user", userRoute);
app.use("/menu", menuRoute);
app.use("/meja", mejaRoute);
app.use("/transaksi", transaksiRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});