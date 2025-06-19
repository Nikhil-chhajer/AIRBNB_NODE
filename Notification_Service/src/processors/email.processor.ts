import { Job, Worker } from "bullmq";
import { NotificationDto } from "../dto/notification.dto";
import { MAILER_QUEUE} from "../queues/mailer.queue";
import { getRedisConnObject } from "../config/redis.config";
import { MAILER_PAYLOAD } from "../producers/email.producer";
import { renderMailTemplate } from "../templates/template.handler";
import { sendEmail } from "../services/mailer.service";
import logger from "../config/logger.config"

export const setupMailerWorker = () => {
    const emailProcessor=new Worker<NotificationDto>( MAILER_QUEUE,
    async (job:Job)=>{
        if(job.name !== MAILER_PAYLOAD) {
            throw new Error("Invalid job name");
        }
        //call the service layer
        const payload=job.data;
        console.log(`Processing email for`,job.data);
        const emailContent=await renderMailTemplate(payload.templateId,payload.params);
        await sendEmail(payload.to,payload.subject,emailContent);
        logger.info("email has been sent")
        
    },// how u want to process the job
{
    connection:getRedisConnObject()
});
emailProcessor.on("failed",()=>{
    console.log(`Email processing failed`);
})
emailProcessor.on("completed", () => {
    console.log(`Email processing completed successfully`);
})
}
// completd and failed events are given by bullmq and there are many more events that can be used
// like active, waiting, removed, paused, resumed, etc.