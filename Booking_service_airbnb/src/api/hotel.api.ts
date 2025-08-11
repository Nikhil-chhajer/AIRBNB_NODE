import axios from "axios";
import { serverconfig } from "../config/server";
export const getAvailableRooms=async(roomCategoryId:number,checkInDate:string,checkOutDate:string)=>{
    console.log("Fetching available rooms for:", { roomCategoryId, checkInDate, checkOutDate });
    const response=await axios.get(`${serverconfig.HOTEL_SERVICE_URL}rooms/available`,{
        params:{
            roomCategoryId,
            checkInDate,
            checkOutDate
        },
    });
    console.log("Available rooms response:", response.data);
    return response.data;
}
export const updateBookingIdToRoom=async(bookingId:number,roomIds:number[])=>{
    try {
        const response=await axios.post(`${serverconfig.HOTEL_SERVICE_URL}rooms/update-booking-id`,{
        bookingId,
        roomIds
    });
    return response.data;
    } catch (error) {
        console.error("Error updating booking ID to rooms:", error);
        throw new Error("Failed to update booking ID to rooms");
        
    }
    
}
