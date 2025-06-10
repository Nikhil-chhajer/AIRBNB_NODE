import { createHotelService,getHotelByIdService } from "../services/hotel.service";
import { NextFunction, Request, Response } from "express";
export async function createHotelHandler(req:Request,res:Response,next:NextFunction){
    try {
        const hotelresponse = await createHotelService(req.body);
        res.status(201).json({
            status: "success",  
            message: "Hotel created successfully",  
            data: hotelresponse});
            console.log("Hotel created successfully", hotelresponse);
    } catch (error) {
       next(error);
       
    }
    
}
export async function getHotelById(req:Request,res:Response,next:NextFunction){
    try {
        const hotel= await getHotelByIdService(Number(req.params.id));
        if (!hotel) {
             res.status(404).json({
                status: "fail",
                message: "Hotel not found"
            });
        }
        res.status(200).json({
            status: "success",
            message: "Hotel retrieved successfully",
            data: hotel
        });
    } catch (error) {
        
        next(error);
    }
}