import express from "express"
const v2Router=express.Router();
import { pingHandler } from "../../controllers/pingHandler";
v2Router.get('/ping',pingHandler)
export default v2Router;