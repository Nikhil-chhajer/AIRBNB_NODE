import { createHotelDTO } from "../dto/hotel.dto";
// import { createHotel, getHotelById,softDeleteHotel} from "../repository/hotel.repository";
import { HotelRepository } from "../repository/hotel.repository";
import { InternalServerError, Notfound } from "../utils/app.error";
import logger  from "../config/logger.config";
const hotelRepository = new HotelRepository();


export async function createHotelService(hotelData: createHotelDTO) {
    try {
        const hotel = await hotelRepository.create(hotelData);
        return hotel;
    } catch (error) {
        logger.error(`Error creating hotel: ${error}`);
        throw new InternalServerError("Failed to create hotel");
    }
}
export async function getHotelByIdService(id: number) {
    try {
        const hotel = await hotelRepository.findById(id);
        return hotel;
    } catch (error) {
        logger.error(`Error retrieving hotel with id ${id}: ${error}`);
        throw new Notfound("Failed to retrieve hotel");
    }
}
export async function deleteHotelService(id: number) {
    try {
        const response=await hotelRepository.softDeleteHotel(id);
        if (!response) {
            logger.error(`Hotel with id ${id} not found`);
            throw new Notfound("hotel not found");
        }
        return response;
    } catch (error) {
        logger.error(`Error soft deleting hotel with id ${id}: ${error}`);
        throw new Notfound("Failed to soft delete hotel");
        
    }
}   