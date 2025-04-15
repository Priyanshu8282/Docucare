import express from 'express';
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorNames, // Import the new controller
} from '../../controller/Doctor/doctorController.js';
import { VerifyToken } from '../../middleware/auth.js'; // Import the middleware

const doctorRouter = express.Router();

doctorRouter
  .route('/')
  .post(
    VerifyToken(['Admin', 'Doctor']), // Only Admins can create a doctor
    createDoctor
  )
  .get(
    VerifyToken(['Admin', 'Patient']), // Admins and Patients can view all doctors
    getAllDoctors
  );

doctorRouter
  .route('/names') // New route for fetching doctor names
  .get(
    VerifyToken(['Admin', 'Patient', 'Doctor']), // Allow Admins, Patients, and Doctors to fetch doctor names
    getDoctorNames
  );

doctorRouter
  .route('/:id')
  .get(
    VerifyToken(['Admin', 'Doctor', 'Patient']), // Admins, Doctors, and Patients can view doctor details
    getDoctorById
  )
  .patch(
    VerifyToken(['Admin', 'Doctor']), // Only Admins can update doctor details
    updateDoctor
  )
  .delete(
    VerifyToken(['Admin']), // Only Admins can delete a doctor
    deleteDoctor
  );

export default doctorRouter;