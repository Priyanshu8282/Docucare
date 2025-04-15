import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = 'https://docucare-2jro.onrender.com'; // Define the base URL as a variable

function Billing() {
  const [billingReports, setBillingReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    services: [{ description: '', amount: 0 }],
    totalAmount: 0,
    status: 'Unpaid',
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors
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

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/patients/names`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
        },
      });
      setPatients(response.data || []); // Set the fetched patient names
    } catch (error) {
      console.error('Error fetching patient names:', error.response?.data || error.message);
      toast.error('Failed to fetch patient names.');
    }
  };

  // Fetch billing reports, patients, and doctors
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Token is missing. Please log in again.');
          return;
        }

        // Fetch billing reports
        const billingResponse = await axios.get(`${BASE_URL}/generate/billing`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBillingReports(billingResponse.data.reports);
        setTotalRevenue(billingResponse.data.totalRevenue);

        // Fetch patients and doctors concurrently
        await Promise.all([fetchPatients(), fetchDoctors()]);
        toast.success('Data fetched successfully!');
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
        toast.error('Failed to fetch data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === 'description' || name === 'amount') {
      const updatedServices = [...formData.services];
      updatedServices[index][name] = name === 'amount' ? parseFloat(value) : value;
      setFormData({ ...formData, services: updatedServices });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add a new service row
  const addServiceRow = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { description: '', amount: 0 }],
    });
  };

  // Calculate total amount
  useEffect(() => {
    const total = formData.services.reduce((sum, service) => sum + service.amount, 0);
    setFormData({ ...formData, totalAmount: total });
  }, [formData.services]);

  // Handle form submission to create a new billing record
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Token is missing. Please log in again.');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/generate/billing`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBillingReports([...billingReports, response.data.billing]);
      toast.success('Billing record created successfully!');
      setFormData({
        patient: '',
        doctor: '',
        services: [{ description: '', amount: 0 }],
        totalAmount: 0,
        status: 'Unpaid',
      });
    } catch (error) {
      console.error('Error creating billing record:', error.response?.data || error.message);
      toast.error('Failed to create billing record.');
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <Toaster />
      <h1 className="text-2xl font-bold text-[#2C698D] mb-4">Billing Management</h1>

      {/* Total Revenue */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
        <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
      </div>

      {/* Billing Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Create Billing Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient</label>
            <select
              name="patient"
              value={formData.patient}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="" disabled>
                Select a patient
              </option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.fullName}
                </option>
              ))}
            </select>
          </div>
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
            <label className="block text-sm font-medium text-gray-700">Services</label>
            {formData.services.map((service, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  name="description"
                  placeholder="Service Description"
                  value={service.description}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-2/3 border border-gray-300 rounded p-2"
                  required
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={service.amount}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-1/3 border border-gray-300 rounded p-2"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addServiceRow}
              className="text-blue-500 hover:underline"
            >
              Add Service
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="w-full border border-gray-300 rounded p-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-[#2C698D] text-white px-4 py-2 rounded hover:bg-[#5EBEC4] transition duration-300"
          >
            Create Billing Record
          </button>
        </form>
      </div>

      {/* Billing Reports Table */}
      {isLoading ? (
        <div className="text-center text-gray-500">Loading billing reports...</div>
      ) : billingReports.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Report ID</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {billingReports.map((report) => (
              <tr key={report.id}>
                <td className="border border-gray-300 p-2">{report.id}</td>
                <td className="border border-gray-300 p-2">{report.date}</td>
                <td className="border border-gray-300 p-2">${report.amount.toLocaleString()}</td>
                <td className="border border-gray-300 p-2">
                  {report.status === 'Paid' ? (
                    <span className="text-green-500 font-semibold">{report.status}</span>
                  ) : (
                    <span className="text-red-500 font-semibold">{report.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500 mt-4">No billing reports found.</div>
      )}
    </div>
  );
}

export default Billing;
