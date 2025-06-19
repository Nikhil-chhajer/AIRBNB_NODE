import { getRedisConnObject } from "../config/redis.config";
import {Queue} from "bullmq";

export const MAILER_QUEUE = "queue-mailer";

export const mailerQueue=new Queue(MAILER_QUEUE,{
    connection:getRedisConnObject(),
})
