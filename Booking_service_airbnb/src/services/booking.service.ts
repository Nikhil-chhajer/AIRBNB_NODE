
import { confirmBooking, createBooking } from "../repositories/booking";
import { createIdempotencyKey } from "../repositories/booking"; 
import { generateIdempotencyKey } from "../utils/generateidempotencyKey";
import { getIdempotencyKey } from "../repositories/booking";
import { InternalServerError } from "../utils/app.error";
import { finalizeIdempotencyKey } from "../repositories/booking";
import { createBookingDto } from "../dto/booking.dto";

export async function createBookingService(BookingDto:createBookingDto) {
    try {
        const booking=await createBooking({userId:BookingDto.userId,hotelId:BookingDto.hotelId,totalGuests:BookingDto.totalGuests,bookingAmount:BookingDto.bookingAmount});
        const idempotencyKey = generateIdempotencyKey();
        await createIdempotencyKey(idempotencyKey, booking.id);
        return { bookingId:booking, idempotencyKey:idempotencyKey };
    } catch (error) {
        
    }
    
}
export async function confirmBookingService(idempotencyKey: string) {
    try {
        const idempotencyKeyData = await getIdempotencyKey(idempotencyKey);
        if(!idempotencyKeyData) {
            throw new InternalServerError("Idempotency key not found");   
        }
        if(idempotencyKeyData.finalized){
            console.log("Idempotency key data",idempotencyKeyData);
            throw new InternalServerError ("Booking already finalized" );
        }
        //paymen here
        const booking = await confirmBooking(idempotencyKeyData.bookingId);
        await finalizeIdempotencyKey(idempotencyKey);
        return booking;
        
    } catch (error) {
        if(error instanceof InternalServerError) {
            throw error; // Re-throw known errors   
        }
        throw new InternalServerError("Error finalizing booking");
    }
}
// export async function finalizeBookingService(bookingId: string) {
//     try {
//         const booking = await createBooking();
//         return booking;
//     } catch (error) {
//         throw new Error("Error finalizing booking");
//     }
// }