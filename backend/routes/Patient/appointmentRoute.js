import express from 'express';
import {
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
} from '../../controller/Patient/appointmentController.js';

const appointmentRouter = express.Router();

appointmentRouter
  .route('/appointments')
  .post(createAppointment);

appointmentRouter
  .route('/appointments/:userId')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

export default appointmentRouter;