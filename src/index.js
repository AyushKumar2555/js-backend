// Load environment variables from .env file
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
//  Must load .env before using process.env values
dotenv.config({
    path: './env'
});

//  connectDB() returns a Promise → so we use .then() & .catch()
connectDB()
    .then(() => {
        //  Start server ONLY after DB connection is successful
        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        });

        //  Catch server-level errors (port in use, permission denied, etc.)
        server.on("error", (error) => {
            console.log("Server Error:", error);
            throw error;
        });

    })
    .catch((err) => {
        //  If DB connection fails, server will not start
        console.log("MongoDB connection failed !!!", err);
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