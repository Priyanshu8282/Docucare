import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

// ✅ Centralized base URL
const baseURL = 'http://localhost:3000';

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/appointments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAppointments(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching appointments:', error.response?.data || error.message);
        toast.error('Failed to fetch appointments.');
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  // Update appointment status
  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.patch(
        `${baseURL}/admin/appointments/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setAppointments(
        appointments.map((appt) =>
          appt._id === id ? { ...appt, status: response.data.appointment.status } : appt
        )
      );
      toast.success('Appointment status updated!');
    } catch (error) {
      console.error('Status update failed:', error.response?.data || error.message);
      toast.error('Failed to update status.');
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async (id) => {
    try {
      await axios.delete(`${baseURL}/admin/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setAppointments(appointments.filter((appt) => appt._id !== id));
      toast.success('Appointment deleted!');
    } catch (error) {
      console.error('Delete failed:', error.response?.data || error.message);
      toast.error('Failed to delete appointment.');
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-[#2C698D] mb-4">
        <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
        Manage Appointments
      </h1>

      <h2 className="text-xl font-semibold text-gray-700 mb-2">All Appointments</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Patient</th>
            <th className="border p-2">Doctor</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="border p-2">{appointment.patientName}</td>
                <td className="border p-2">{appointment.doctorName}</td>
                <td className="border p-2">
                  {new Date(appointment.appointmentTime).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {new Date(appointment.appointmentTime).toLocaleTimeString()}
                </td>
                <td className="border p-2">
                  <select
                    value={appointment.status}
                    onChange={(e) => handleUpdateStatus(appointment._id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="booked">booked</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
                <td className="border p-2">
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
              <td colSpan="6" className="text-center text-gray-500 p-4">
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
