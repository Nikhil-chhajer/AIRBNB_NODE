import { Request, Response, NextFunction } from 'express';
import { createBookingService, confirmBookingService } from '../services/booking.service';
import { InternalServerError } from '../utils/app.error';

export const createBookingHandler=async(req:Request, res:Response, next:NextFunction)=> {
    try {
        const booking=await createBookingService(req.body);
        res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        throw new InternalServerError("Error creating booking");
    }
}
export const confirmBookingHandler=async(req:Request, res:Response, next:NextFunction)=> {
    try {
        const booking=await confirmBookingService(req.params.idempotencyKey) 
        console.log("the ",booking)
      // Logic to confirm booking
        res.status(200).json({
            message: "Booking confirmed successfully",
            data:{userId:booking.userId,
                bookingId:booking.id
            }
        });
    } catch (error) {
        next( error);
    }
}
