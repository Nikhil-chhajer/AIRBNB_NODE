export type GetAvailableRoomsDTO={
    roomCategoryId:number,
    checkInDate:string,
     checkOutDate:string,
}

export type UpdateBoookingIdToRoomsDTO={
    bookingId:number,
    roomIds:number[]
}
