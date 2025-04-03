import express from "express";
import router from "./https/routes/index.js"; // central route entrypoint
export const app = express();
app.use(express.json());
app.use("/", router);
app.get("/", (_req, res) => {
    res.send("HexAPI is live");
});
app.get("/health", (_req, res) => {
    res.status(200).send({ status: "ok", message: "API is running" });
});
