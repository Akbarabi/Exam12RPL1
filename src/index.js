import express from "express";
import userRoute from "./route/userRoute.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/user", userRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});