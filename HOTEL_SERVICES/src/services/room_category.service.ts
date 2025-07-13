import { RoomCategoryRepository } from "../repository/room_category.repository";
import { InternalServerError } from "../utils/app.error";
import { room_categoryDTO } from "../dto/room_category.dto";
import { HotelRepository } from "../repository/hotel.repository";
const room_category=new RoomCategoryRepository();
const hotelRepository=new HotelRepository();
 export async function createRoomCategory(data:room_categoryDTO){
    try {
        const roomCategory=await room_category.create(data);
        return roomCategory
    } catch (error) {
        throw new InternalServerError("Failed to create room category");
    }
 }
 export async function getRoomCategoryByIdService(id:number){
    try {
        const roomCategory=await room_category.findById(id);
        return roomCategory
    } catch (error) {
        throw new InternalServerError("Failed to get room category by id");
    }
 }
 export async function getAllRoomCategoriesByHotelIdService(hotelId:number){
    const hotel=await hotelRepository.findById(hotelId);
    if(!hotel){
        throw new InternalServerError("Hotel not found");
    }
    try {
        const roomCategories=await room_category.findAllByHotelId(hotelId);
        return roomCategories;
    } catch (error) {
        throw new InternalServerError("Failed to get all room categories by hotel id");     
    }
 }
 export async function deleteRoomCategoryByIdService(id:number){
    try {
        const deleteroomCategory=await room_category.findById(id);
        if(!deleteroomCategory){
            throw new InternalServerError("Room category not found");
        }
        await room_category.delete({id});
        return true;
    } catch (error) {
        throw new InternalServerError("Failed to delete room category by id");
    }
 }