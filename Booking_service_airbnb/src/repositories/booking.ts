import {  IdempotencyKey, Prisma} from "@prisma/client";
import  prismaClient  from "../prisma/client";
import { InternalServerError } from "../utils/app.error";
import { validate as isvalidUUID } from "uuid";

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
      data: { idemKey: idempotencyKey, 
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
export async function getIdempotencyKeywithlock(tx:Prisma.TransactionClient,idempotencyKey: string) {
  try {
    if(!isvalidUUID(idempotencyKey)){
      throw new InternalServerError("Invalid idempotency key format");
    }
    const key:Array<IdempotencyKey> = await tx.$queryRaw(Prisma.raw(`SELECT * FROM IdempotencyKey WHERE idemKey = "${idempotencyKey}" FOR UPDATE;`))
    if(!key || key.length === 0) {
      throw new InternalServerError("Idempotency key not found");
    }
    return key[0];
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
export async function confirmBooking(tx:Prisma.TransactionClient,bookingId: number) {
  try {
    const booking = await tx.booking.update({
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
export async function finalizeIdempotencyKey(tx:Prisma.TransactionClient,idempotencyKey: string) {
  try {
    const key = await tx.idempotencyKey.update({
      where: { idemKey: idempotencyKey },
      data: { finalized: true },
    });
    return key;
  } catch (error) {
    console.error("Error finalizing idempotency key:", error);
    throw new InternalServerError("Failed to finalize idempotency key");
  }
}