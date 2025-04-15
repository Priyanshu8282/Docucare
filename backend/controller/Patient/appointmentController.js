import Appointment from "../../models/Appointment.js";
import Patient from "../../models/Patient.js";
import Doctor from "../../models/Doctor.js";

// ✅ Create a New Appointment
export const createAppointment = async (req, res) => {
  try {
    const { user, doctor, appointmentTime, reason } = req.body;

    if (!user || !doctor || !appointmentTime) {
      return res.status(400).json({ message: 'User, doctor, and appointment time are required.' });
    }

    // Fetch the doctor's name
    const existingDoctor = await Doctor.findById(doctor);
    if (!existingDoctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const newAppointment = new Appointment({
      user,
      doctor,
      doctorName: existingDoctor.name, // Store the doctor's name
      appointmentTime,
      reason,
    });

    await newAppointment.save();

    res.status(201).json({
      message: 'Appointment created successfully.',
      appointment: newAppointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment.', error });
  }
};



// ✅ Get Single Appointment by ID
// ✅ Get Appointments by User ID
export const getAppointmentById = async (req, res) => {
  try {
    const { userId } = req.params; // Extract user ID from route parameters

    // Find all appointments for the given user ID
    const appointments = await Appointment.find({ user: userId })
      .populate("doctor", "name email") // Populate doctor details
      .sort({ appointmentTime: 1 }); // Sort by appointment time in ascending order

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this user." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments.", error });
  }
};

// ✅ Update Appointment
export const updateAppointment = async (req, res) => {
  try {
    const { doctor, appointmentTime, reason, status } = req.body;

    // Validate required fields
    if (!doctor || !appointmentTime) {
      return res.status(400).json({ message: 'Doctor and appointment time are required.' });
    }

    // Fetch the doctor's name
    const existingDoctor = await Doctor.findById(doctor);
    if (!existingDoctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        doctor,
        doctorName: existingDoctor.name, // Update the doctor's name
        appointmentTime,
        reason,
        status,
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json({
      message: 'Appointment updated successfully.',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment.', error });
  }
};

// ✅ Delete Appointment
export const deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppointment) return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: "Error deleting appointment", error });
  }
};


// ✅ Get All Appointments (Admin)
