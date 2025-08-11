import {z}from "zod"

export const roomschema=z.object({
    roomCategoryId:z.string({
        message:"room category is needed"
    }),
    checkInDate:z.string({  message:"check in date  is needed"}),
    checkOutDate:z.string({  message:"check out date is needed"})
})
export const updateBookingIdToRoomSchema=z.object({
    bookingId:z.number({  message:"booking id is needed"}),
    roomIds:z.array(z.number(),{  message:"room ids are needed"})
})