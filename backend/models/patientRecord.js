import mongoose from 'mongoose';

const patientRecordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true, // Ensures contact is unique
    },
    address: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: String,
      default: '', // Optional field
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);

export default PatientRecord;