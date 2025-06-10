import express from "express";
import {createHotelHandler,getHotelById}  from "../../controllers/hotel.controller";
import { hotelschema } from "../../validators/ping.validator";
import { validateRequestBody } from "../../validators";

const hotelRouter = express.Router();


// Correct: Use HTTP verb method
hotelRouter.post("/hotels", validateRequestBody(hotelschema),createHotelHandler);
hotelRouter.get("/hotels/:id", getHotelById);
export default hotelRouter;
