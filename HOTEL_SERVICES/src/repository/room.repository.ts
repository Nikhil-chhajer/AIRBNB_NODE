import BaseRepository from "./base.repository";
import Room from "../db/models/room";
// import { InternalServerError } from "../utils/app.error";
class RoomRepository extends BaseRepository<Room> {
    constructor() {
        super(Room);
    }
}
export default RoomRepository;