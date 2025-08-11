

import hotelRouter from "./hotel.router";
import roomGenerationRouter from "./roomGeneration.router";
import roomRouter from "./room.router";
import express from "express";
const v1Router = express.Router();
v1Router.use("/hotels", hotelRouter);
v1Router.use('/room-generation',roomGenerationRouter)
v1Router.use('/rooms',roomRouter)
export default v1Router;