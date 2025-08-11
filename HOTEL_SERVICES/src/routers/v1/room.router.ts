import express from "express";

import { validateQueryParams, validateRequestBody } from "../../validators";
import { getAvailableRoomsHandler, updateBookingIdToRoomHandler } from "../../controllers/room.controller";
import { roomschema, updateBookingIdToRoomSchema } from "../../validators/room.validator";

const roomsRouter = express.Router();


// Correct: Use HTTP verb method

roomsRouter.get("/available",validateQueryParams(roomschema),getAvailableRoomsHandler);
roomsRouter.post("/update-booking-id",validateRequestBody(updateBookingIdToRoomSchema),updateBookingIdToRoomHandler);
export default roomsRouter;
