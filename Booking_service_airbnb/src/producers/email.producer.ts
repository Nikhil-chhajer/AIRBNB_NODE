import { NotificationDto } from "../dto/notification.dto";
import { mailerQueue } from "../queues/email.queue"

export const MAILER_PAYLOAD="payload:mailer";
export const addEmailtoQueue=async(payload:NotificationDto)=>{
    await mailerQueue.add(MAILER_PAYLOAD,payload);
    return payload;

}
