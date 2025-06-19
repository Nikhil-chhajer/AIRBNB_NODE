import express from "express";
import { serverConfig } from './config/server'
import v1Router from "./routers/v1/index.router";
import v2Router from "./routers/v2/index.router";
import logger from "./config/logger.config";

import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
// import { z } from "zod/v4";
import { genericErrorHandler } from "./middlewares/error.middleware";
import { setupMailerWorker } from "./processors/email.processor";
import { addEmailtoQueue } from "./producers/email.producer";
// import { renderMailTemplate } from "./templates/template.handler";
const app = express();
const PORT = serverConfig.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(attachCorrelationIdMiddleware)
app.use('/api/v1', v1Router)
app.use('/api/v2', v2Router)
app.listen(PORT, async () => {
    logger.info("server started at", { PORT });
    //whatever we pass in {} in this is taken as data in logger.config file if donot use {} the data obj is empty
    // const obj={
    //     name:"nikhil",
    //     age:1
    // }

    // const objschema=z.object({
    //     name:z.string(),
    //     age:z.number().int().positive()
    // })
    // console.log(objschema.parse(obj));

    setupMailerWorker();
    logger.info("Mailer worker setup completed")
    await addEmailtoQueue({
        to:"nikhil.chhajer80@gmail.com",
        subject:"this is testing mail",
        templateId:"welcome",
        params:{
            name:"nikhil",
            appName:"algocamp"
        }
    })

    // const response=await renderMailTemplate('welcome',{
    //     name: "Nikhil",
    //     appName: "Algocamp"
    // })
    // console.log(response);








}
);
    app.use(genericErrorHandler)


