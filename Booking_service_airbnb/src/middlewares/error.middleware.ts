import {Request,Response,NextFunction } from "express";
import {AppError } from "../utils/app.error";

export function genericErrorHandler(err:AppError,req:Request,res:Response,next:NextFunction){
    console.log(err);
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

}