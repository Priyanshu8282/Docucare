import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faCalendarCheck,
} from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000'; // Define the base URL as a variable

function Appointments() {
  const [appointments, setAppointments] = useState([]); // Ensure initial state is an array
  const [doctors, setDoctors] = useState([]); // State for doctor names
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
  });
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Fetch appointments and doctor names from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/appointments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
          },
        });
        setAppointments(Array.isArray(response.data) ? response.data : []); // Ensure response is an array
      } catch (error) {
        console.error('Error fetching appointments:', error.response?.data || error.message);
        toast.error('Failed to fetch appointments.');
        setAppointments([]); // Fallback to an empty array in case of an error
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/doctors/names`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
          },
        });
        setDoctors(response.data || []); // Set the fetched doctor names
      } catch (error) {
        console.error('Error fetching doctor names:', error.response?.data || error.message);
        toast.error('Failed to fetch doctor names.');
      }
    };

    fetchAppointments();
    fetchDoctors();
  }, []);

  const handleDeleteAppointment = async (id) => {
    try {
      // Send the DELETE request to the backend
      await axios.delete(`${BASE_URL}/admin/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
        },
      });

      // Update the appointments state by removing the deleted appointment
      setAppointments(appointments.filter((appointment) => appointment._id !== id));

      // Show success notification
      toast.success('Appointment deleted successfully!');
    } catch (error) {
      console.error('Error deleting appointment:', error.response?.data || error.message);
      toast.error('Failed to delete appointment.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment({ ...newAppointment, [name]: value });
  };

  const handleAddAppointment = async () => {
    // Validate required fields
    if (!newAppointment.patientName || !newAppointment.doctor || !newAppointment.date || !newAppointment.time) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      // Find the selected doctor from the dropdown
      const selectedDoctor = doctors.find((doc) => doc._id === newAppointment.doctor);
      if (!selectedDoctor) {
        toast.error('Invalid doctor selected.');
        return;
      }

      const doctorName = selectedDoctor.name;

      // Prepare the payload for the API
      const payload = {
        ...newAppointment,
        doctorName, // Add doctorName from the dropdown
        appointmentTime: `${newAppointment.date}T${newAppointment.time}`, // Combine date and time
      };

      // Send the POST request to create an appointment
      const response = await axios.post(`${BASE_URL}/admin/appointments`, payload);

      // Update the appointments state with the new appointment
      setAppointments([...appointments, response.data.appointment]);

      // Reset the form fields
      setNewAppointment({ patientName: '', doctor: '', date: '', time: '', reason: '' });

      // Show success notification
      toast.success('Appointment added successfully!');
    } catch (error) {
      console.error('Error adding appointment:', error.response?.data || error.message);
      toast.error('Failed to add appointment.');
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setNewAppointment({
      patientName: appointment.patientName,
      doctor: appointment.doctor, // This should be the doctor's ID
      date: new Date(appointment.appointmentTime).toISOString().split('T')[0], // Extract date
      time: new Date(appointment.appointmentTime).toISOString().split('T')[1].slice(0, 5), // Extract time
      reason: appointment.reason,
    });
  };

  const handleUpdateAppointment = async () => {
    if (!newAppointment.patientName || !newAppointment.doctor || !newAppointment.date || !newAppointment.time) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      // Find the selected doctor from the dropdown
      const selectedDoctor = doctors.find((doc) => doc._id === newAppointment.doctor);
      if (!selectedDoctor) {
        toast.error('Invalid doctor selected.');
        return;
      }

      const doctorName = selectedDoctor.name;

      // Prepare the payload for the API
      const payload = {
        patientName: newAppointment.patientName,
        doctorName,
        appointmentTime: `${newAppointment.date}T${newAppointment.time}`,
        reason: newAppointment.reason,
      };

      // Send the PATCH request to update the appointment
      const response = await axios.patch(`${BASE_URL}/admin/appointments/${editingAppointment._id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
        },
      });

      // Update the appointments state with the updated appointment
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === editingAppointment._id ? response.data.appointment : appointment
        )
      );

      // Reset the form fields and editing state
      setNewAppointment({ patientName: '', doctor: '', date: '', time: '', reason: '' });
      setEditingAppointment(null);

      // Show success notification
      toast.success('Appointment updated successfully!');
    } catch (error) {
      console.error('Error updating appointment:', error.response?.data || error.message);
      toast.error('Failed to update appointment.');
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-2xl font-bold text-[#2C698D] mb-4">
        <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
        Manage Appointments
      </h1>

      {/* Add/Edit Appointment Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {editingAppointment ? 'Edit Appointment' : 'Add Appointment'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="patientName"
            placeholder="Patient Name"
            value={newAppointment.patientName}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <select
            name="doctor"
            value={newAppointment.doctor}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>
              Select a Doctor
            </option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            value={newAppointment.date}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="time"
            name="time"
            value={newAppointment.time}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <textarea
            name="reason"
            placeholder="Reason for Appointment"
            value={newAppointment.reason}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded col-span-1 md:col-span-2 lg:col-span-4"
          />
        </div>
        <button
          onClick={editingAppointment ? handleUpdateAppointment : handleAddAppointment}
          className="mt-4 bg-[#2C698D] text-white px-4 py-2 rounded hover:bg-[#5EBEC4] transition duration-300"
        >
          {editingAppointment ? 'Update Appointment' : 'Add Appointment'}
        </button>
      </div>

      {/* Appointments List */}
      <h2 className="text-xl font-semibold text-gray-700 mb-2">All Appointments</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Patient</th>
            <th className="border border-gray-300 p-2">Doctor</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Time</th>
            <th className="border border-gray-300 p-2">Reason</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(appointments) && appointments.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="border border-gray-300 p-2">{appointment.patientName}</td>
                <td className="border border-gray-300 p-2">{appointment.doctorName}</td>
                <td className="border border-gray-300 p-2">{new Date(appointment.appointmentTime).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2">{new Date(appointment.appointmentTime).toLocaleTimeString()}</td>
                <td className="border border-gray-300 p-2">{appointment.reason}</td>
                <td className="border border-gray-300 p-2">{appointment.status}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleEditAppointment(appointment)}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteAppointment(appointment._id)}
                    className="text-red-500 hover:underline"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 p-4">
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Appointments;