import logger from "../config/logger.config";
import Hotel from "../db/models/hotel";
import { createHotelDTO } from "../dto/hotel.dto";
import { InternalServerError } from "../utils/app.error";
export async function createHotel(hotelData:createHotelDTO){
    try {
        const hotel =await Hotel.create({
            name: hotelData.name,
            address: hotelData.address,
            location: hotelData.location,
            rating: hotelData.rating ,
            rating_count: hotelData.rating_count 
        });
        logger.info("Hotel created successfully");
        return hotel;
    } catch (error) {
        
    }
}
export async function getHotelById(id:number){  
    try {
        const hotel = await Hotel.findByPk(id);
        if (!hotel) {
            logger.error(`Hotel with id ${id} not found`);
            throw new InternalServerError("hotel not found");
        }
        logger.info(`Hotel with id ${id} retrieved successfully`);
        return hotel;
    } catch (error) {
        logger.error(`Error retrieving hotel with id ${id}: ${error}`);
        throw error;
    }
}  
export async function getAllHotels(){
    try {
        const hotels = await Hotel.findAll({
            where: {
                deleted_at: null // Ensure we only get non-deleted hotels
            }
        });
        logger.info("All hotels retrieved successfully");
        return hotels;
    } catch (error) {
        logger.error(`Error retrieving all hotels: ${error}`);
        throw new InternalServerError("Failed to retrieve hotels");
    }
}                    
export async function softDeleteHotel(id:number){  
    try {
        const hotel = await Hotel.findByPk(id);
        if (!hotel) {
            logger.error(`Hotel with id ${id} not found`);
            throw new InternalServerError("hotel not found");
        }
        hotel.deleted_at=new Date();
        await hotel.save();
        logger.info(`Hotel with id ${id} soft deleted successfully`);
        return true;
    } catch (error) {
        logger.error(`Error retrieving hotel with id ${id}: ${error}`);
        throw error;
    }
}  