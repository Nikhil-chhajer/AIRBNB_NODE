import hotelRouter from "./hotel.router";
import express from "express";
const v1Router = express.Router();
v1Router.use("/v1", hotelRouter);
export default v1Router;