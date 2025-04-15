import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    appointmentTime: '',
    reason: '',
  });
  const [doctors, setDoctors] = useState([]);
  const BASE_URL = 'https://docucare-2jro.onrender.com';

  // Fetch appointments and doctor names on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        if (!token || !userId) {
          toast.error('You must be logged in to view appointments.');
          return;
        }

        // Fetch appointments using userId
        const response = await axios.get(`${BASE_URL}/patients/appointments/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppointments(response.data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error.response?.data || error.message);
        toast.error('Failed to fetch appointments.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/doctors/names`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setDoctors(response.data || []);
      } catch (error) {
        console.error('Error fetching doctor names:', error.response?.data || error.message);
        toast.error('Failed to fetch doctor names.');
      }
    };

    fetchAppointments();
    fetchDoctors();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission to book an appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage
      const patientName = localStorage.getItem('fullName'); // Retrieve fullName from localStorage

      if (!token || !userId || !patientName) {
        toast.error('You must be logged in to book an appointment.');
        return;
      }

      // Include the user ID and patientName in the form data
      const appointmentData = {
        ...formData,
        user: userId,
        patientName,
      };

      const response = await axios.post(
        `${BASE_URL}/patients/appointments`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments([...appointments, response.data.appointment]);
      toast.success('Appointment booked successfully!');
      setFormData({ doctor: '', appointmentTime: '', reason: '' });
    } catch (error) {
      console.error('Error booking appointment:', error.response?.data || error.message);
      toast.error('Failed to book appointment.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4 text-[#2C698D]">My Appointments</h1>

      {/* Appointment Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[#2C698D]">Book an Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor</label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="" disabled>
                Select a doctor
              </option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Appointment Time</label>
            <input
              type="datetime-local"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2"
              rows="3"
              placeholder="Enter the reason for the appointment"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-[#2C698D] text-white px-4 py-2 rounded hover:bg-[#5EBEC4] transition duration-300"
          >
            Book Appointment
          </button>
        </form>
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <p className="text-gray-600">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-lg font-semibold text-[#2C698D] mb-2">
                Doctor: {appointment.doctorName || 'N/A'}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Date:</strong> {new Date(appointment.appointmentTime).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Time:</strong>{' '}
                {new Date(appointment.appointmentTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Status:</strong> <span className="font-medium">{appointment.status}</span>
              </p>
              <p className="text-sm text-gray-600">
                <strong>Reason:</strong> {appointment.reason || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointment;
