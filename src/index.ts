import express from "express";
import { connectToMongoDB } from "./infrastructure/database/mongo";
import router from './https/routes/routes'
import { ProcessedTransaction } from "./domain/models/ProcessedTransaction"

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use("/", router);

app.get("/", (_req, res) => {
    res.send("HexAPI is Live");
});

app.get("/health", (_req, res) => { //'health' checking if the app is alive
    res.status(200).send({ status: "OK", message: "API is running" });
});

//remove all; no mongo
connectToMongoDB().then(async () => {
    if (process.env.NODE_ENV !== "production") {
        await ProcessedTransaction.deleteMany({});
        console.log("Cleared processed transactions (dev only)");
    }
    //keep this though; will be moved to main.ts and use .await
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});
