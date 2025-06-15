import  express  from 'express';
import { validateRequestBody } from '../../validators';

const BookingRouter=express.Router();
import { confirmBookingHandler, createBookingHandler } from '../../controllers/booking.controller';
import { createBookingSchema } from '../../validators/booking.validator';
BookingRouter.get('/',validateRequestBody(createBookingSchema),createBookingHandler);
BookingRouter.post('/confirm/:idempotencyKey',confirmBookingHandler)
export default BookingRouter;