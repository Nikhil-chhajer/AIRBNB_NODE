import {z}from "zod"
export const pingSchema=z.object({
    message:z.string()
})
export const hotelschema=z.object({
    name:z.string().min(1),
    address:z.string().min(1),
    location:z.string().min(1),
    rating:z.coerce.number().int().positive(),
    rating_count:z.coerce.number().int().positive()

})