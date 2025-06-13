import  {NextFunction, Request,Response} from "express";
import fs from "fs/promises";
import {InternalServerError } from "../utils/app.error";

export const pingHandler=async (req:Request,res:Response,next:NextFunction) =>{
 try {
    await fs.readFile("sample");
    res.status(200).json({
      message:"pong"
    })
 } catch (error) {
    throw new InternalServerError("something went wrong");
 }
    

}