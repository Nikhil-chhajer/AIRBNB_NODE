import { Prisma} from "@prisma/client";
import  prismaClient  from "../prisma/client.js";
import { InternalServerError } from "../utils/app.error";

export async function createBooking(bookingInput:Prisma.BookingCreateInput) {
  try {
    const booking = await prismaClient.booking.create({
      data: bookingInput,
    });
    return booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new InternalServerError("Failed to create booking");
  }
}