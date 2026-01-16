import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables
dotenv.config({
    path: './.env'  // Fixed: added dot
});

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8000;
        const server = app.listen(PORT, () => {
            console.log(`Server is running at port: ${PORT}`);
            console.log(`Database: ${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        });

        server.on("error", (error) => {
            console.log("Server Error:", error);
            throw error;
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed!", err);
        process.exit(1);
    });


/*
===============================================================
 ALTERNATE WAY (Using IIFE with async/await in the same file)
===============================================================

import express from "express"
const app = express();

;(async () => {
    try {
        //  Connect DB inside an IIFE async function
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

        //  Server error handling (rare but important)
        app.on("error", (error) => {
            console.log("Err:", error);
            throw error;
        });

        //  Start server
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        });

    } catch (error) {
        //  Any error in DB connect or server start comes here
        console.error("ERROR:", error);
        throw err;
    }

})();
*/
/*
                +------------------+
                |   env file       |
                |  (MONGODB_URL)   |
                +--------+---------+
                         |
                         v
                 +---------------+
                 |  src/index.js |
                 |  (entry file) |
                 +-------+-------+
                         |
         load .env using dotenv
                         |
                         v
                call connectDB()
                         |
                         v
            +------------------------+
            |   src/db/index.js      |
            |  async connectDB() {   |
            |   mongoose.connect()   |
            |  }                     |
            +-----------+------------+
                        |
         DB connect success / fail
                        |
        +---------------+------------------------+
        |                                        |
        v                                        v
+------------------+                     +--------------------+
|  SUCCESS         |                     |  FAIL              |
|                  |                     |                    |
| back to index.js |                     | log error          |
+--------+---------+                     | process.exit(1)    |
         |                               +--------------------+
         v
+------------------------+
|  import app from       |
|     src/app.js         |
+-----------+------------+
            |
            v
  app.listen(PORT)  --->  Server running
*/