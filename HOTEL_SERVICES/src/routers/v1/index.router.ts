
import hotelRouter from "./hotel.router";
import roomRouter from "./roomGeneration.router";
import express from "express";
const v1Router = express.Router();
v1Router.use("/hotels", hotelRouter);
v1Router.use('/room-generation',roomRouter)
export default v1Router;