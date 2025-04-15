import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000'; // Define the base URL as a variable

function PatientRecords() {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contact: '',
    address: '',
    medicalHistory: '',
  });
  const [editingPatient, setEditingPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch patient records from the API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Token is missing. Please log in again.');
          return;
        }

        // Fetch patient records from the API
        const response = await axios.get(`${BASE_URL}/doctors/patientrecords`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched patients:', response.data); // Log the fetched data for debugging

        // Update state with fetched data
        setPatients(response.data);
        setFilteredPatients(response.data);
      } catch (error) {
        console.error('Error fetching patient records:', error.response?.data || error.message);
        toast.error('Failed to fetch patient records.');
      }
    };

    fetchPatients();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPatients(
      patients.filter((patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.contact.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4 text-[#2C698D]">Patient Records 📋</h1>

      <input
        type="text"
        placeholder="Search by name or contact"
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />

      {filteredPatients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Age</th>
                <th className="py-2 px-4 border">Contact</th>
                <th className="py-2 px-4 border">Address</th>
                <th className="py-2 px-4 border">Medical History</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient._id}>
                  <td className="py-2 px-4 border">{patient.name}</td>
                  <td className="py-2 px-4 border">{patient.age}</td>
                  <td className="py-2 px-4 border">{patient.contact}</td>
                  <td className="py-2 px-4 border">{patient.address}</td>
                  <td className="py-2 px-4 border">{patient.medicalHistory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No patients found.</p>
      )}
    </div>
  );
}

export default PatientRecords;