import { env } from "./config/env.js";
import { app } from "./app.js";
// start the server
const start = async () => {
    try {
        app.listen(env.PORT, () => {
            console.log(`server listening on port ${env.PORT}`);
        });
    }
    catch (err) {
        console.error("failed to start server:", err);
        process.exit(1); // stop early if we can't start
    }
};
// using top-level await instead of .then()
// no need to nest logic in .then()
await start();
