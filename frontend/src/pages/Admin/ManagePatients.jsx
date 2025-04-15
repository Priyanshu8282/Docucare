import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000'; // Define the base URL as a variable

function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    email: '',
    age: '',
    mobile_no: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    bloodGroup: '',
    gender: '',
    profilePicture: '',
    allergies: [],
  });
  const [editingPatient, setEditingPatient] = useState(null);

  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: BASE_URL, // Use the base URL variable
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get('/patients');
      setPatients(response.data);
      toast.success('Patients fetched successfully!');
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to fetch patients.');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setNewPatient((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setNewPatient((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewPatient((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAllergiesChange = (e) => {
    const { value } = e.target;
    setNewPatient((prev) => ({
      ...prev,
      allergies: value.split(',').map((item) => item.trim()),
    }));
  };

  // Add a new patient
  const handleAddPatient = async () => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
  
    if (
      !userId || // Ensure userId is provided
      !newPatient.fullName ||
      !newPatient.email ||
      !newPatient.age ||
      !newPatient.mobile_no ||
      !newPatient.address.street ||
      !newPatient.address.city ||
      !newPatient.address.state ||
      !newPatient.address.zipCode ||
      !newPatient.bloodGroup ||
      !newPatient.gender ||
      !newPatient.profilePicture
    ) {
      toast.error('Please fill in all fields, upload an image, and ensure user is logged in.');
      return;
    }
  
    try {
      const response = await axiosInstance.post('/patients/create', {
        ...newPatient,
        user: userId, // Add userId to the payload
      });
      setPatients((prev) => [...prev, response.data.patient]);
      resetForm();
      toast.success('Patient added successfully!');
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient.');
    }
  };

  // Edit a patient
  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setNewPatient(patient);
    toast('Editing patient details.');
  };

  // Update a patient
  const handleUpdatePatient = async () => {
    if (!editingPatient) return;

    try {
      const response = await axiosInstance.patch(`/patients/${editingPatient._id}`, newPatient);
      console.log('Patient updated successfully:', response.data);
      fetchPatients();
      resetForm();
      toast.success('Patient updated successfully!');
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient.');
    }
  };

  // Delete a patient
  const handleDeletePatient = async (id) => {
    if (!id) {
      console.error('Patient ID is missing.');
      toast.error('Patient ID is missing.');
      return;
    }

    try {
      await axiosInstance.delete(`/patients/${id}`);
      setPatients((prev) => prev.filter((patient) => patient._id !== id));
      toast.success('Patient deleted successfully!');
    } catch (error) {
      console.error('Error deleting patient:', error.response?.data || error.message);
      toast.error('Failed to delete patient.');
    }
  };

  const resetForm = () => {
    setNewPatient({
      fullName: '',
      email: '',
      age: '',
      mobile_no: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      bloodGroup: '',
      gender: '',
      profilePicture: '',
      allergies: [],
    });
    setEditingPatient(null);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold text-[#2C698D] mb-4">
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        Manage Patients
      </h1>

      {/* Add/Edit Patient Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingPatient ? 'Edit Patient' : 'Add Patient'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={newPatient.fullName}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newPatient.email}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newPatient.age}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="mobile_no"
            placeholder="Mobile Number"
            value={newPatient.mobile_no}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="address.street"
            placeholder="Street"
            value={newPatient.address.street}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="address.city"
            placeholder="City"
            value={newPatient.address.city}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="address.state"
            placeholder="State"
            value={newPatient.address.state}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="address.zipCode"
            placeholder="Zip Code"
            value={newPatient.address.zipCode}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            name="bloodGroup"
            value={newPatient.bloodGroup}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>
              Select Blood Group
            </option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          <select
            name="gender"
            value={newPatient.gender}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="allergies"
            placeholder="Allergies (comma-separated)"
            value={newPatient.allergies.join(', ')}
            onChange={handleAllergiesChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={editingPatient ? handleUpdatePatient : handleAddPatient}
          className="mt-4 bg-[#2C698D] text-white px-4 py-2 rounded hover:bg-[#5EBEC4] transition duration-300"
        >
          {editingPatient ? 'Update Patient' : 'Add Patient'}
        </button>
      </div>

      {/* Patients List */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">All Patients</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Full Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Age</th>
            <th className="border border-gray-300 p-2">Mobile No</th>
            <th className="border border-gray-300 p-2">Gender</th>
            <th className="border border-gray-300 p-2">Blood Group</th>
            <th className="border border-gray-300 p-2">Address</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id}>
              <td className="border border-gray-300 p-2">
                <img src={patient.profilePicture} alt={patient.fullName} className="h-16 w-16 rounded-full" />
              </td>
              <td className="border border-gray-300 p-2">{patient.fullName}</td>
              <td className="border border-gray-300 p-2">{patient.email}</td>
              <td className="border border-gray-300 p-2">{patient.age}</td>
              <td className="border border-gray-300 p-2">{patient.mobile_no}</td>
              <td className="border border-gray-300 p-2">{patient.gender}</td>
              <td className="border border-gray-300 p-2">{patient.bloodGroup}</td>
              <td className="border border-gray-300 p-2">
                {patient.address.street}, {patient.address.city}, {patient.address.state}, {patient.address.zipCode}
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEditPatient(patient)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDeletePatient(patient._id)}
                  className="text-red-500 hover:underline"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagePatients;
