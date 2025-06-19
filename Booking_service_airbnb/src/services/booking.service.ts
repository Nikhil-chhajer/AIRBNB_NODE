
import { confirmBooking, createBooking, getIdempotencyKeywithlock } from "../repositories/booking";
import { createIdempotencyKey } from "../repositories/booking";
import { generateIdempotencyKey } from "../utils/generateidempotencyKey";
import { InternalServerError } from "../utils/app.error";
import prismaClient from "../prisma/client";
import { finalizeIdempotencyKey } from "../repositories/booking";
import { createBookingDto } from "../dto/booking.dto";
import { serverconfig } from "../config/server";
import { redlock } from "../config/redis.config";

export async function createBookingService(BookingDto: createBookingDto) {


    

    try {
        const ttl = serverconfig.TTL;
        const bookingResource = `hotel:${BookingDto.hotelId}`;
        await redlock.acquire([bookingResource], ttl);

        const booking = await createBooking({ userId: BookingDto.userId, hotelId: BookingDto.hotelId, totalGuests: BookingDto.totalGuests, bookingAmount: BookingDto.bookingAmount });
        const idempotencyKey = generateIdempotencyKey();
        await createIdempotencyKey(idempotencyKey, booking.id);
        return { bookingId: booking, idempotencyKey: idempotencyKey };
    } catch (error) {
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