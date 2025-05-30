import { Request,Response,NextFunction } from "express";
import { AnyZodObject } from "zod";
import logger from "../config/logger.config";

export const validateRequestBody=(schema:AnyZodObject)=>{
   return async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try {
            await schema.parse(req.body);
            const id=req.headers.correlationId
            console.log(id)
            logger.info("req body is valid",);
            next();
        } catch (error) {
             res.status(400).json({
                message:"invalid object ",
                error:error
            });
        }
    }
}