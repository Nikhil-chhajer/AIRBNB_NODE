import express from "express";

import { generateRoomHandler } from "../../controllers/roomgenration.controller";

import { RoomGenerationJobSchema } from "../../dto/roomGeneration.dto";
import { validateRequestBody } from "../../validators";

const roomRouter = express.Router();


// Correct: Use HTTP verb method

roomRouter.post('/batch',validateRequestBody(RoomGenerationJobSchema),generateRoomHandler)

export default roomRouter;
