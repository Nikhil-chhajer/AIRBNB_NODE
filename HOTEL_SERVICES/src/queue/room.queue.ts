import { Queue } from "bullmq";
import { getRedisConnObject } from "../config/redis.config";

export const ROOMS_GENERATE_QUEUE="queue-rooms-generation";

export const roomGenerationQueue=new Queue(ROOMS_GENERATE_QUEUE,{
    connection:getRedisConnObject()
})