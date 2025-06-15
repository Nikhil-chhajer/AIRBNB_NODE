import express from "express"
import BookingRouter from "./booking.router";

const v1Router=express.Router();
v1Router.use('/booking',BookingRouter)
export default v1Router;