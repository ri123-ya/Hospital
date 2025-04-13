import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js"




const app = express();


config({ path: "./config/.env"});

/************ Middleware ***************/
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json()); // converts json.string into json.object
app.use(express.urlencoded({ extended: true }));// parse data form html form 

app.use(fileUpload({
    useTemplate: true,
    createFileDir: "/tmp/",
}));

/***********Routes ****************/
app.use("/api/v1/message", messageRouter);

dbConnection();


app.use(errorMiddleware);
export default app;