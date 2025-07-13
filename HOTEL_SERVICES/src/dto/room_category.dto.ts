import { RoomType } from "../db/models/roomCategory"


export type room_categoryDTO={
    hotelId:number, 
    price: number ,
    roomType: RoomType
    roomCount: number,
}