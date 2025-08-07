import { RoomGenerationJob } from "../dto/roomGeneration.dto";
import { roomGenerationQueue } from "../queue/room.queue"
export const ROOM_GEN_PAYLOAD="payload:room-generation";
export const addRoomstoQueue=async(roomgenjob:RoomGenerationJob)=>{
    await roomGenerationQueue.add(ROOM_GEN_PAYLOAD,roomgenjob);
    return roomgenjob;
}
