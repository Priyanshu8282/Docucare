import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
   
  },
  patientName: {
    type: String, // Store the patient's name
   
  },
  doctorName: {
    type: String, // Store the doctor's name
    required: true,
  },
  appointmentTime: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['booked', 'completed', 'cancelled'], 
    default: 'booked' 
  },
  reason: { 
    type: String, 
    default: '', // Optional field with a default empty string
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;