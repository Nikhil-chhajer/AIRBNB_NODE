import  express  from 'express';
import { Request,Response } from 'express';
import { validateRequestBody } from '../../validators';

const pingRouter=express.Router();
import { pingHandler } from '../../controllers/pingHandler';
import { pingSchema } from '../../validators/ping.validator';
pingRouter.get('/',validateRequestBody(pingSchema),pingHandler);
pingRouter.post('/home',(req:Request,res:Response)=>{
    res.send("hello  and bye")
})
export default pingRouter;