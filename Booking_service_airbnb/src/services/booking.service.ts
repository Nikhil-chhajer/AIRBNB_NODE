import { Prisma } from "@prisma/client";
import { createBooking } from "../repositories/booking";
export async function createBookingService(bookingInput:Prisma.BookingCreateInput) {
    try {
        const booking=await createBooking(bookingInput);
        return booking
    } catch (error) {
        
    }
    
}