import { z } from "zod";
export const createBookingSchema=z.object({
    userId:z.number({message:"userid must be number"}).positive(),
    hotelId:z.number().positive(),
    bookingAmount:z.number().positive().min(1),
    totalGuests:z.number().positive(), 

})