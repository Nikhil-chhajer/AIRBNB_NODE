import { addRoomstoQueue } from "../producers/room.producers";

import { Request, Response } from "express";
export async function generateRoomHandler(req:Request,res:Response){
    try {
        
        const response = await addRoomstoQueue(req.body);
                 res.status(201).json({
                    status: "success",  
                    message: "rooms queued  successfully",  
                    data: response});
                    console.log("Hotel created successfully", response);
    } catch (error) {
        res.status(201).json({
                    status: "false",  
                    message: "rooms not crated successfully",  
                    data: error});
                
    }
}

