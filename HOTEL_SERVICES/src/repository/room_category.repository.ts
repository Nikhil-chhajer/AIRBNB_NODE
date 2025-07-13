import RoomCategory from "../db/models/roomCategory";
import BaseRepository from "./base.repository";
export class RoomCategoryRepository extends BaseRepository<RoomCategory> {
    constructor() {
        super(RoomCategory);
    }
    async findAllByHotelId(hotelId: number) {
        const roomCategories = await RoomCategory.findAll({
            where: {
                hotelId: hotelId,
                deletedAt:null
            },
        })
        if(!roomCategories || roomCategories.length === 0) {
            throw new Error("No room categories found for the specified hotel.");
        }
        return roomCategories;
    }

}