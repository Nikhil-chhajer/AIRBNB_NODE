import {  Prisma} from "@prisma/client";
import  prismaClient  from "../prisma/client";
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
export async function createIdempotencyKey(idempotencyKey: string,bookingId:number) {
  try {
    const key = await prismaClient.idempotencyKey.create({
      data: { key: idempotencyKey, 
        booking:{
          connect:{
            id: bookingId
          }
        }
      },
    });
    return key;
  } catch (error) {
    console.error("Error creating idempotency key:", error);
    throw new InternalServerError("Failed to create idempotency key");
  }
}
export async function getIdempotencyKey(idempotencyKey: string) {
  try {
    const key = await prismaClient.idempotencyKey.findUnique({
      where: { key: idempotencyKey },
    });
    return key;
  } catch (error) {
    console.error("Error retrieving idempotency key:", error);
    throw new InternalServerError("Failed to retrieve idempotency key");
  }
}
export async function getBookingById(bookingId: number) {
  try {
    const booking = await prismaClient.booking.findUnique({
      where: { id: bookingId },
    });
    return booking;
  } catch (error) {
    console.error("Error retrieving booking:", error);
    throw new InternalServerError("Failed to retrieve booking");
  }
}
export async function confirmBooking(bookingId: number) {
  try {
    const booking = await prismaClient.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
    });
    return booking;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw new InternalServerError("Failed to confirm booking");
  }
}
export async function cancelBooking(bookingId: number) {
  try {
    const booking = await prismaClient.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
    return booking;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw new InternalServerError("Failed to cancel booking");
  }
}
export async function finalizeIdempotencyKey(idempotencyKey: string) {
  try {
    const key = await prismaClient.idempotencyKey.update({
      where: { key: idempotencyKey },
      data: { finalized: true },
    });
    return key;
  } catch (error) {
    console.error("Error finalizing idempotency key:", error);
    throw new InternalServerError("Failed to finalize idempotency key");
  }
}