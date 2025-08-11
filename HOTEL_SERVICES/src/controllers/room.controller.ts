import { getAvailableRoomsService, updateBookingIdToRoomService } from "../services/room.service";
import { NextFunction, Request, Response } from "express";
export async function getAvailableRoomsHandler(req:Request,res:Response,next:NextFunction){
  try {
    console.log("Fetching available rooms with query params:", req.query);
      const rooms=await getAvailableRoomsService({
        roomCategoryId: Number(req.query.roomCategoryId),
        checkInDate: req.query.checkInDate as string,
        checkOutDate: req.query.checkOutDate as string,
      });
    res.status(201).json({
            status: "success",  
            message: "Rooms Fetched successfully",  
            data: rooms});

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch available rooms",
      error: error instanceof Error ? error.message : "Unknown error"})
      next(error);
  }
}

export async function updateBookingIdToRoomHandler(req:Request,res:Response,next:NextFunction){
  

  try {
    console.log("Updating booking ID to rooms with body:", req.body);
      const room=await updateBookingIdToRoomService(req.body);
    res.status(201).json({
            status: "success",  
            message: "Booking ID updated successfully",  
            data: room});

  } catch (error) {
      next(error);
  }
}
