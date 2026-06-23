import cors from "cors";
import express from "express";
import "dotenv/config";
import siteUrls from "./routes/index.js"


const server = express();
const port = process.env.PORT;

server.use(express.json())
server.use(cors())

server.use("/",siteUrls)

server.listen(port,() => {
    console.log(`Server open on http://localhost:${port}`);
})
