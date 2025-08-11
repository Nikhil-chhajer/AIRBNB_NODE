import express from "express";

import { generateRoomHandler } from "../../controllers/roomgenration.controller";

import { RoomGenerationJobSchema } from "../../dto/roomGeneration.dto";
import { validateRequestBody } from "../../validators";

const roomGenerationRouter = express.Router();


// Correct: Use HTTP verb method

roomGenerationRouter.post('/batch',validateRequestBody(RoomGenerationJobSchema),generateRoomHandler)

export default roomGenerationRouter;
