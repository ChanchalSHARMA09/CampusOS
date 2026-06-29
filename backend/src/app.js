import express from "express";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use((req,res,next)=>{
    console.log("middleware executed");
    next();
});

app.get("/api/v1/health",(req,res)=>{
    res.status(200).json({
        status:true,
        message:"campusOS api is running"
    });
});

app.use(errorHandler);

export default app;