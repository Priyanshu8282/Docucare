import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function PatientRecords() {
  // Static data for patients
  const [patients] = useState([
    {
      _id: 'P001',
      name: 'John Doe',
      age: 30,
      contact: '123-456-7890',
      address: '123 Main St, Springfield',
      medicalHistory: 'Diabetes, Hypertension',
    },
    {
      _id: 'P002',
      name: 'Jane Smith',
      age: 25,
      contact: '987-654-3210',
      address: '456 Elm St, Shelbyville',
      medicalHistory: 'Asthma',
    },
    {
      _id: 'P003',
      name: 'Alice Johnson',
      age: 40,
      contact: '555-123-4567',
      address: '789 Oak St, Capital City',
      medicalHistory: 'None',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPatients(
      patients.filter(
        (patient) =>
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