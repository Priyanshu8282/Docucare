import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = 'https://docucare-2jro.onrender.com'; // Define the base URL as a variable

function DoctorsTable() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/doctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setDoctors(response.data);
          toast.success('Doctors fetched successfully!');
        } else {
          toast.error('Unexpected response format.');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error.response?.data || error.message);
        toast.error('Failed to fetch doctors.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4 text-[#2C698D]">Doctors List</h1>

      {isLoading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Age</th>
              <th className="border border-gray-300 p-2">Gender</th>
              <th className="border border-gray-300 p-2">Specialization</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Experience</th>
              <th className="border border-gray-300 p-2">Fees</th>
              <th className="border border-gray-300 p-2">Availability</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td className="border border-gray-300 p-2">
                  <img
                    src={doctor.ProfileImage || 'https://via.placeholder.com/150'}
                    alt={doctor.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                </td>
                <td className="border border-gray-300 p-2">{doctor.name}</td>
                <td className="border border-gray-300 p-2">{doctor.age}</td>
                <td className="border border-gray-300 p-2">{doctor.gender}</td>
                <td className="border border-gray-300 p-2">{doctor.specialty}</td>
                <td className="border border-gray-300 p-2">{doctor.phoneNumber}</td>
                <td className="border border-gray-300 p-2">{doctor.yearsOfExperience} years</td>
                <td className="border border-gray-300 p-2">₹{doctor.fees}</td>
                <td className="border border-gray-300 p-2">
                  {Array.isArray(doctor.availability) && doctor.availability.length > 0 ? (
                    doctor.availability.map((slot, index) => (
                      <div key={index}>
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </div>
                    ))
                  ) : (
                    <span>Not Available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DoctorsTable;
