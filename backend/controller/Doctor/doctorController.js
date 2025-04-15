import Doctor from "../../models/Doctor.js";
import PatientRecords from "../../models/patientRecord.js";

// ✅ Create a New Doctor
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      ProfileImage,
      phoneNumber,
      specialty,
      yearsOfExperience,
      availability,
      fees,
      isApproved,
    } = req.body;

    // Validate required fields
    if (!name || !phoneNumber || !specialty || !yearsOfExperience || !fees) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Create a new doctor
    const newDoctor = new Doctor({
      name,
      age,
      gender,
      ProfileImage,
      phoneNumber,
      specialty,
      yearsOfExperience,
      availability,
      fees,
      isApproved,
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor created successfully", doctor: newDoctor });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Error creating doctor", error });
  }
};

// ✅ Get Single Doctor by ID
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(500).json({ message: "Error fetching doctor", error });
  }
};
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find(); // Fetch all doctors
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Error fetching doctors", error });
  }
};
// ✅ Update Doctor Details
export const updateDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation is applied
    });

    if (!updatedDoctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    res.status(200).json({ doctor: updatedDoctor });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
// ✅ Delete Doctor
export const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Error deleting doctor", error });
  }
};


// ✅ Fetch All Doctor Names
export const getDoctorNames = async (req, res) => {
  try {
    // Fetch only the 'name' field of all doctors
    const doctorNames = await Doctor.find().select('name');

    res.status(200).json(doctorNames);
  } catch (error) {
    console.error("Error fetching doctor names:", error);
    res.status(500).json({ message: "Error fetching doctor names.", error });
  }
};


export const createPatient = async (req, res) => {
  try {
    const { name, age, contact, address, medicalHistory } = req.body;

    // Validate required fields
    if (!name || !age || !contact || !address) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Create a new patient record
    const newPatient = new PatientRecords({
      name,
      age,
      contact,
      address,
      medicalHistory,
    });

    await newPatient.save();
    res.status(201).json({ message: "Patient created successfully", patient: newPatient });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ message: "Error creating patient", error });
  }
};

// ✅ Get All Patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await PatientRecords.find(); // Fetch all patient records
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ message: "Error fetching patients", error });
  }
};

// ✅ Get Single Patient by ID
export const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await PatientRecords.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Error fetching patient", error });
  }
};

// ✅ Update Patient Details
export const updatePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedPatient = await PatientRecords.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation is applied
    });

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient updated successfully", patient: updatedPatient });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Error updating patient", error });
  }
};

// ✅ Delete Patient
export const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPatient = await PatientRecords.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Error deleting patient", error });
  }
};




