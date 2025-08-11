import {RoomRepository } from "../repository/room.repository"; 
import { GetAvailableRoomsDTO, UpdateBoookingIdToRoomsDTO } from "../dto/room.dto";

const roomRepository=new RoomRepository();

export async function getAvailableRoomsService(getAvailableRoomsDTO:GetAvailableRoomsDTO){
 
     const rooms=await roomRepository.findByRoomCategoryIdAndDateRange(getAvailableRoomsDTO.roomCategoryId,
        new Date(getAvailableRoomsDTO.checkInDate),new Date(getAvailableRoomsDTO.checkOutDate));
    return rooms;
    
}
export async function updateBookingIdToRoomService(updateBookingIdToRoomDTO:UpdateBoookingIdToRoomsDTO){
    const room=await roomRepository.updateBookingIdToRooms(updateBookingIdToRoomDTO.bookingId,
        updateBookingIdToRoomDTO.roomIds);
    return room;
}