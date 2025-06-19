import logger from "../config/logger.config";
import transporter from "../config/mailer.config";
import { serverConfig } from "../config/server";
import { InternalServerError } from "../utils/app.error";
console.log("this is email ",serverConfig.EMAIL_ID)
export async function sendEmail(to:string,subject:string,body:string){
    try {
         await transporter.sendMail({
        from:serverConfig.EMAIL_ID,
        to,
        subject,
        html:body
    });
    logger.info(`email sent to ${to} with subject ${subject}`)
    } 
    catch (error) {
        throw new InternalServerError("Not able to send email");
    }
   

} 