import express from 'express';
import {
  getAllUsers,
  deleteUser,
  getAllAppointments,
  deleteAppointment,
  getAllBills,
  deleteBill,
  updateDoctorStatus,
  getAllDoctors,
  getAllPatients,
  updatePatient,
  deletePatient,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus
} from '../../controller/Admin/adminController.js';

const adminRouter = express.Router();

// User routes
adminRouter.get('/users', getAllUsers);
adminRouter.delete('/users/:userId', deleteUser);

// Appointment routes
adminRouter.post('/appointments', createAppointment); // Create an appointment
adminRouter.get('/appointments', getAllAppointments);
adminRouter.delete('/appointments/:appointmentId', deleteAppointment);

adminRouter.patch('/appointments/:appointmentId', updateAppointment)//
//  Update an appointment
// Billing routes
adminRouter.patch('/appointments/:appointmentId/status', updateAppointmentStatus);

adminRouter.get('/bills', getAllBills);
adminRouter.delete('/bills/:billId', deleteBill);

// Doctor routes
adminRouter.get('/doctors', getAllDoctors);
adminRouter.put('/doctors/status', updateDoctorStatus);




// Patient routes
adminRouter.get('/patients', getAllPatients);
adminRouter.put('/patients/:id', updatePatient);
adminRouter.delete('/patients/:id', deletePatient);

export default adminRouter;