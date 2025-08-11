
import { confirmBooking, createBooking, getIdempotencyKeywithlock } from "../repositories/booking";
import { createIdempotencyKey } from "../repositories/booking";
import { generateIdempotencyKey } from "../utils/generateidempotencyKey";
import { InternalServerError } from "../utils/app.error";
import prismaClient from "../prisma/client";
import { finalizeIdempotencyKey } from "../repositories/booking";
import { createBookingDto } from "../dto/booking.dto";
import { serverconfig } from "../config/server";
import { redlock } from "../config/redis.config";
import { getAvailableRooms, updateBookingIdToRoom } from "../api/hotel.api";
type AvailableRoom={
    id:number,
    roomCategoryId:number,
    dateAvailable:Date

}
export async function createBookingService(BookingDto: createBookingDto) {
    console.log("BookingDto", BookingDto);
 const ttl = serverconfig.TTL;
        const bookingResource = `hotel:${BookingDto.hotelId}`;
           
    

    try {
       const availableRooms=await getAvailableRooms(
            BookingDto.roomCategoryId,
            BookingDto.checkInDate,
            BookingDto.checkOutDate
        )
        const checkInDate=new Date(BookingDto.checkInDate);
        const checkOutDate=new Date(BookingDto.checkOutDate);
        const totalnights=Math.ceil((checkOutDate.getTime()-checkInDate.getTime())/(1000*60*60*24))
        console.log("totalnights",totalnights);
        console.log("availableRooms",availableRooms);
           if (availableRooms.data.length==0 || totalnights > availableRooms.data.length){
            console.error("No rooms available for the selected dates");
            throw new InternalServerError("no rooms available")
        }

     




     
        await redlock.acquire([bookingResource], ttl);

        const booking = await createBooking({ 
            userId: BookingDto.userId, 
            hotelId: BookingDto.hotelId, 
            totalGuests: BookingDto.totalGuests, 
            bookingAmount: BookingDto.bookingAmount,
            checkInDate:new Date(BookingDto.checkInDate),
            checkOutDate:new Date(BookingDto.checkOutDate),
            roomCategoryId:BookingDto.roomCategoryId
            }
        );
        console.log("booking", booking);
        const idempotencyKey = generateIdempotencyKey();
        await createIdempotencyKey(idempotencyKey, booking.id);
        console.log("idempotencyKey", idempotencyKey);
        await updateBookingIdToRoom(booking.id,availableRooms.data.map((room: AvailableRoom) => room.id));
        return { bookingId: booking, idempotencyKey: idempotencyKey };
    } catch (error) {
        if (error instanceof InternalServerError){
            console.error("Error creating booking:", error.message);
            throw new InternalServerError(error.message);
        }
        throw new Error("Error creating booking");
    }
    // return await redlock.using([bookingResource], ttl, async () => {
    //     const booking = await createBooking({ userId: BookingDto.userId, hotelId: BookingDto.hotelId, totalGuests: BookingDto.totalGuests, bookingAmount: BookingDto.bookingAmount });
    //     const idempotencyKey = generateIdempotencyKey();
    //     await createIdempotencyKey(idempotencyKey, booking.id);
    //     return { bookingId: booking, idempotencyKey: idempotencyKey };
    // });


}
export async function confirmBookingService(idempotencyKey: string) {
    return await prismaClient.$transaction(async (tx: any) => {
        // Check if the idempotency key exists and is not finalized         
        const idempotencyKeyData = await getIdempotencyKeywithlock(tx, idempotencyKey);
        if (!idempotencyKeyData) {
            throw new InternalServerError("Idempotency key not found");
        }
        if (idempotencyKeyData.finalized) {
            console.log("Idempotency key data", idempotencyKeyData);
            throw new InternalServerError("Booking already finalized");
        }
        //payment here
        const booking = await confirmBooking(tx, idempotencyKeyData.bookingId);
        await finalizeIdempotencyKey(tx, idempotencyKey);
        return booking;
    })


}
// export async function finalizeBookingService(bookingId: string) {
//     try {
//         const booking = await createBooking();
//         return booking;
//     } catch (error) {
//         throw new Error("Error finalizing booking");
//     }
// }