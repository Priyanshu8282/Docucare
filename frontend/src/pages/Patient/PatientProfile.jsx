import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const BASE_URL = 'https://docucare-2jro.onrender.com'; // Define the base URL as a variable

function PatientProfile() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile_no: '',
    age: '',
    gender: '',
    bloodGroup: '',
    profilePicture: null, // Updated to handle file uploads
    allergies: [],
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch profile data on component load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
        if (!token || !userId) {
          toast.error('Token or userId is missing. Please log in again.');
          return;
        }

        const response = await axios.get(`${BASE_URL}/patients/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data;
        setFormData({
          fullName: profile.fullName || '',
          email: profile.email || '',
          mobile_no: profile.mobile_no || '',
          age: profile.age || '',
          gender: profile.gender || '',
          bloodGroup: profile.bloodGroup || '',
          profilePicture: null, // Profile picture is not fetched here
          allergies: profile.allergies || [],
          address: profile.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
          },
        });
        toast.success('Profile data fetched successfully!');
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
        toast.error('Failed to fetch profile data.');
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: { ...formData.address, [name]: value },
    });
  };

  const handleAllergiesChange = (e) => {
    setFormData({ ...formData, allergies: e.target.value.split(',') });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Retrieve the userId from localStorage
      if (!token || !userId) {
        toast.error('Token or userId is missing. Please log in again.');
        return;
      }

      // Prepare form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('user', userId); // Add userId to the form data
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile_no', formData.mobile_no);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('bloodGroup', formData.bloodGroup);
      formDataToSend.append('allergies', JSON.stringify(formData.allergies));
      formDataToSend.append('address', JSON.stringify(formData.address));
      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }

      const response = await axios.post(`${BASE_URL}/patients`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token for authorization
          // Do not set 'Content-Type' manually; Axios will set it automatically for FormData
        },
      });

      toast.success(response.data.message || 'Patient profile updated successfully!');
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update patient profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster /> {/* Add Toaster component to display toast notifications */}
      <h1 className="text-2xl font-bold mb-4 text-[#2C698D]">Patient Profile</h1>

      {/* Profile Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-[#2C698D]">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#2C698D]">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-[#2C698D]">Mobile Number</label>
          <input
            type="text"
            name="mobile_no"
            value={formData.mobile_no}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-[#2C698D]">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-[#2C698D]">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-[#2C698D]">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="" disabled>
              Select Blood Group
            </option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-[#2C698D]">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-[#2C698D]">Allergies</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies.join(',')}
            onChange={handleAllergiesChange}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Enter allergies separated by commas"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-[#2C698D]">Address</label>
          <input
            type="text"
            name="street"
            value={formData.address.street}
            onChange={handleAddressChange}
            className="w-full border border-gray-300 rounded p-2 mb-2"
            placeholder="Street"
          />
          <input
            type="text"
            name="city"
            value={formData.address.city}
            onChange={handleAddressChange}
            className="w-full border border-gray-300 rounded p-2 mb-2"
            placeholder="City"
          />
          <input
            type="text"
            name="state"
            value={formData.address.state}
            onChange={handleAddressChange}
            className="w-full border border-gray-300 rounded p-2 mb-2"
            placeholder="State"
          />
          <input
            type="text"
            name="zipCode"
            value={formData.address.zipCode}
            onChange={handleAddressChange}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Zip Code"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#2C698D] text-white px-4 py-2 rounded hover:bg-[#5EBEC4]"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      {/* Display Fetched Data */}
      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-[#2C698D] mb-4">Fetched Patient Data</h2>
        {/* Profile Image */}

        <p><strong>Full Name:</strong> {formData.fullName || 'Null'}</p>
        <p><strong>Email:</strong> {formData.email || 'Null'}</p>
        <p><strong>Mobile Number:</strong> {formData.mobile_no || 'Null'}</p>
        <p><strong>Age:</strong> {formData.age || 'Null'}</p>
        <p><strong>Gender:</strong> {formData.gender || 'Null'}</p>
        <p><strong>Blood Group:</strong> {formData.bloodGroup || 'Null'}</p>
        <p><strong>Allergies:</strong> {formData.allergies.length > 0 ? formData.allergies.join(', ') : 'Null'}</p>
        <h3 className="text-lg font-semibold text-[#2C698D] mt-4">Address</h3>
        <p><strong>Street:</strong> {formData.address.street || 'Null'}</p>
        <p><strong>City:</strong> {formData.address.city || 'Null'}</p>
        <p><strong>State:</strong> {formData.address.state || 'Null'}</p>
        <p><strong>Zip Code:</strong> {formData.address.zipCode || 'Null'}</p>
      </div>
    </div>
  );
}

export default PatientProfile;
