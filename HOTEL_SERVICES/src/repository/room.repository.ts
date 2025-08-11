import { CreationAttributes, Op } from "sequelize";
import Room from "../db/models/room";
import BaseRepository from "./base.repository";

export class RoomRepository extends BaseRepository<Room> {
    constructor() {
        super(Room);
    }

    async findByRoomCategoryIdAndDate(
        roomCategoryId: number,
        currentDate: Date
    ) {
        console.log(roomCategoryId,currentDate)
        return await this.model.findOne({
            where: {
                roomCategoryId,
                dateOfAvailability: currentDate,
                deletedAt: null
            }
        })
    }

    async bulkCreate(rooms: CreationAttributes<Room>[]) {
        return await this.model.bulkCreate(rooms);
    }
    async findByRoomCategoryIdAndDateRange(
        roomCategoryId:number,
        checkInDate:Date,
        checkOutDate:Date
    ){
        return await this.model.findAll({
            where:{
                roomCategoryId,
                bookingId:null,
                dateOfAvailability:{
                    [Op.between]:[checkInDate,checkOutDate]
                }
            }
        })

    }
    async updateBookingIdToRooms(bookingId:number,roomIds:number[]){
        return await this.model.update(
            {bookingId},
            {where:{id:{[Op.in]:roomIds}}}
        )
    }
}