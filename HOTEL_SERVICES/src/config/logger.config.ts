import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file"
import { getCorrelationId } from "../utils/helpers/request.helpers";
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: "MM-DD-YYYY HH:mm:ss" }),
        winston.format.json(),//format the log in json
        //define the custom print
        winston.format.printf(({ level, message, timestamp, ...data }) => {
            const output = { level, message, timestamp, 
                correlationId:getCorrelationId(),
                data };
            return JSON.stringify(output);
        })
    ),
    transports:[
        new winston.transports.Console(),
        new DailyRotateFile({
            filename:"logs/%DATE%-app.log",
            datePattern:"YYYY-MM-DD",
            maxFiles:"14d"
        })
      

    ]
});
export default logger;