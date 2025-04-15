import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faUserMd } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast'; // Import React Hot Toast

const BASE_URL = 'http://localhost:3000'; // Define the base URL as a variable

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    age: '',
    gender: '',
    specialty: '',
    phoneNumber: '',
    yearsOfExperience: '',
    availability: [],
    fees: '',
    ProfileImage: '',
  });
  const [availability, setAvailability] = useState({ day: '', startTime: '', endTime: '' });
  const [editingDoctor, setEditingDoctor] = useState(null);

  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    baseURL: BASE_URL, // Use the base URL variable
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get('/doctors');
      setDoctors(response.data);
      toast.success('Doctors fetched successfully!');
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to fetch doctors.');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewDoctor({ ...newDoctor, ProfileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setAvailability({ ...availability, [name]: value });
  };

  const addAvailability = () => {
    if (!availability.day || !availability.startTime || !availability.endTime) {
      toast.error('Please fill in all availability fields.');
      return;
    }
    setNewDoctor({
      ...newDoctor,
      availability: [...newDoctor.availability, availability],
    });
    setAvailability({ day: '', startTime: '', endTime: '' });
    toast.success('Availability added!');
  };

  // Add a new doctor
  const handleAddDoctor = async () => {
    if (
      !newDoctor.name ||
      !newDoctor.age ||
      !newDoctor.gender ||
      !newDoctor.specialty ||
      !newDoctor.phoneNumber ||
      !newDoctor.yearsOfExperience ||
      !newDoctor.fees ||
      !newDoctor.ProfileImage
    ) {
      toast.error('Please fill in all fields and upload an image.');
      return;
    }
    try {
      const response = await axiosInstance.post('/doctors', newDoctor);
      setDoctors([...doctors, response.data.doctor]);
      setNewDoctor({
        name: '',
        age: '',
        gender: '',
        specialty: '',
        phoneNumber: '',
        yearsOfExperience: '',
        availability: [],
        fees: '',
        ProfileImage: '',
      });
      toast.success('Doctor added successfully!');
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error('Failed to add doctor.');
    }
  };

  // Edit a doctor
  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setNewDoctor({
      ...doctor,
      availability: doctor.availability || [], // Ensure availability is an array
    });
    toast('Editing doctor details.');
  };

  // Update a doctor
  const handleUpdateDoctor = async () => {
    if (!editingDoctor) return;

    try {
      const response = await axiosInstance.patch(`/doctors/${editingDoctor._id}`, newDoctor);
      console.log('Doctor updated successfully:', response.data);
      fetchDoctors();
      setEditingDoctor(null);
      setNewDoctor({
        name: '',
        age: '',
        gender: '',
        specialty: '',
        phoneNumber: '',
        yearsOfExperience: '',
        availability: [],
        fees: '',
        ProfileImage: '',
      });
      toast.success('Doctor updated successfully!');
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast.error('Failed to update doctor.');
    }
  };

  // Delete a doctor
  const handleDeleteDoctor = async (id) => {
    if (!id) {
      console.error('Doctor ID is missing.');
      toast.error('Doctor ID is missing.');
      return;
    }

    try {
      await axiosInstance.delete(`/doctors/${id}`);
      setDoctors(doctors.filter((doctor) => doctor._id !== id)); // Use `_id` for MongoDB
      toast.success('Doctor deleted successfully!');
    } catch (error) {
      console.error('Error deleting doctor:', error.response?.data || error.message);
      toast.error('Failed to delete doctor.');
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <Toaster position="top-right" reverseOrder={false} /> {/* Add Toaster for notifications */}
      <h1 className="text-2xl font-bold text-[#2C698D] mb-4">
        <FontAwesomeIcon icon={faUserMd} className="mr-2" />
        Manage Doctors
      </h1>

      {/* Add/Edit Doctor Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Doctor Name"
            value={newDoctor.name}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newDoctor.age}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            name="gender"
            value={newDoctor.gender}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            name="specialty"
            placeholder="Specialization"
            value={newDoctor.specialty}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={newDoctor.phoneNumber}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="yearsOfExperience"
            placeholder="Years of Experience"
            value={newDoctor.yearsOfExperience}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="fees"
            placeholder="Consultation Fees"
            value={newDoctor.fees}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Availability Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              name="day"
              value={availability.day}
              onChange={handleAvailabilityChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>
                Select Day
              </option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <input
              type="time"
              name="startTime"
              value={availability.startTime}
              onChange={handleAvailabilityChange}
              className="p-2 border border-gray-300 rounded"
            />
            <input
              type="time"
              name="endTime"
              value={availability.endTime}
              onChange={handleAvailabilityChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            onClick={addAvailability}
            className="mt-2 bg-[#2C698D] text-white px-4 py-2 rounded hover:bg-[#5EBEC4] transition duration-300"
          >
            Add Availability
          </button>
          <div className="mt-2">
            {(newDoctor.availability || []).map((slot, index) => (
              <div key={index} className="text-gray-700">
                {slot.day}: {slot.startTime} - {slot.endTime}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={editingDoctor ? handleUpdateDoctor : handleAddDoctor}
          className="mt-4 bg-[#2C698D] text-white px-4 py-2 rounded hover:bg-[#5EBEC4] transition duration-300"
        >
          {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
        </button>
      </div>

      {/* Doctors List */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">All Doctors</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Age</th>
            <th className="border border-gray-300 p-2">Gender</th>
            <th className="border border-gray-300 p-2">Specialization</th>
            <th className="border border-gray-300 p-2">Phone</th>
            <th className="border border-gray-300 p-2">Experience</th>
            <th className="border border-gray-300 p-2">Fees</th>
            <th className="border border-gray-300 p-2">Availability</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id}>
              <td className="border border-gray-300 p-2">
                <img src={doctor.ProfileImage} alt={doctor.name} className="h-16 w-16 rounded-full" />
              </td>
              <td className="border border-gray-300 p-2">{doctor.name}</td>
              <td className="border border-gray-300 p-2">{doctor.age}</td>
              <td className="border border-gray-300 p-2">{doctor.gender}</td>
              <td className="border border-gray-300 p-2">{doctor.specialty}</td>
              <td className="border border-gray-300 p-2">{doctor.phoneNumber}</td>
              <td className="border border-gray-300 p-2">{doctor.yearsOfExperience} years</td>
              <td className="border border-gray-300 p-2">${doctor.fees}</td>
              <td className="border border-gray-300 p-2">
                {doctor.availability.map((slot, index) => (
                  <div key={index}>
                    {slot.day}: {slot.startTime} - {slot.endTime}
                  </div>
                ))}
              </td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEditDoctor(doctor)}
                  className="text-blue-500 hover:underline mr-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDeleteDoctor(doctor._id)}
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

export default ManageDoctors;