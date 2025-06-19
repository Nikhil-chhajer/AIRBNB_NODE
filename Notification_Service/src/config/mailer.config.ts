import nodemailer from "nodemailer"
import { serverConfig } from "./server";
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:serverConfig.EMAIL_ID,
        pass:serverConfig.EMAIL_PASSWORD
    }
});
export default transporter ;

