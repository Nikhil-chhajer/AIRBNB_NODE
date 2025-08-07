import { z } from "zod";
export const createBookingSchema = z.object({
    userId: z.number({ message: "userid must be number" }).positive(),
    hotelId: z.number().positive(),
    bookingAmount: z.number().positive().min(1),
    totalGuests: z.number().positive(),
    checkInDate: z.string({ message: "checkin date must be present" }),
    checkOutDate: z.string({ message: "checkout date must be present" }),
    roomCategoryId: z.number({ message: "Room Category Id must be present" }),

})