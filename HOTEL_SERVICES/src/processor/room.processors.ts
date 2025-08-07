import { Job, Worker } from "bullmq";
import { getRedisConnObject } from "../config/redis.config";
import { ROOMS_GENERATE_QUEUE } from "../queue/room.queue";
import { ROOM_GEN_PAYLOAD } from "../producers/room.producers";
import { generateRooms } from "../services/roomGeneration.service";
import { RoomGenerationJob } from "../dto/roomGeneration.dto";
import logger from "../config/logger.config";



export const setupRoomGenerator = () => {
    const roomprocessor = new Worker<RoomGenerationJob>(ROOMS_GENERATE_QUEUE,
        async (job: Job) => {
            if (job.name !== ROOM_GEN_PAYLOAD) {
                throw new Error("Invalid job name");
            }
            const payload = job.data;
            console.log(`Processing room generation for: ${JSON.stringify(payload)}`);
            console.log(`Processing rooms for`, job.data);
            await generateRooms(payload)
            logger.info(`Room generation completed for: ${JSON.stringify(payload)}`);


        },
        {
            connection: getRedisConnObject()
        }
    );
    roomprocessor.on("failed", () => {
        console.log(`rooms processing failed`);
    })
    roomprocessor.on("completed", () => {
        console.log(`rooms processing completed successfully`);
    })
}

