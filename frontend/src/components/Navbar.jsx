import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignInAlt,
  faTimes,
  faCalendarCheck,
  faEnvelope,
  faMobileAlt,
  faUser,
  faLock,
  faSpinner,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { logo } from "../assets";

const BASE_URL = 'https://docucare-2jro.onrender.com'; // Define the base URL as a variable

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile_no: '',
    role: '', // Default role is Patient
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const openPopup = () => setShowPopup(true);

  const closePopup = () => {
    setShowPopup(false);
    setIsOtpSent(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setIsOtpSent(false);
  };

  const switchToSignUp = () => {
    setIsLogin(false);
    setIsOtpSent(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e) => setOtp(e.target.value);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, formData);

      const userId = response.data.user._id; //
      const userRole = formData.role;

      localStorage.setItem('userId', userId);
      localStorage.setItem('role', userRole);

      toast.success(response.data.message);

      setFormData({ fullName: '', email: '', mobile_no: '', role: '' });
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign-up failed');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: loginMethod === 'email' ? formData.email : '',
        mobile_no: loginMethod === 'mobile' ? formData.mobile_no : '',
      });

      toast.success(response.data.message);
      setIsOtpSent(true);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/verify-otp`, {
        email: loginMethod === 'email' ? formData.email : '',
        mobile_no: loginMethod === 'mobile' ? formData.mobile_no : '',
        otp,
      });

      const { token } = response.data;
      const role = response.data.user.role;
      const userId = response.data.user._id;
      const fullName = response.data.user.fullName;
      const email = response.data.user.email;
      const mobile_no = response.data.user.mobile_no;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('fullName', fullName);
      localStorage.setItem('email', email);
      localStorage.setItem('mobile_no', mobile_no);

      toast.success(response.data.message);
      setOtp('');
      closePopup();
      setIsLoggedIn(true);

      if (role === 'Admin') {
        navigate('/admin-dashboard');
      } else if (role === 'Doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }

      setIsLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsOpen(false);
  };

  const handleBookAppointment = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to book an appointment.');
      return;
    }
    navigate('/book-appointment');
  };

  return (
    <>
      <Toaster />
      <nav className="p-3 relative" style={{ backgroundColor: '#4597B5' }}>
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-1">
            <img src={logo} alt="Docucare Logo" className="h-13 w-13" />
            <Link to="/" className="text-white text-2xl font-bold">
              DocuCare
            </Link>
          </div>
          <div className="block lg:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              )}
            </button>
          </div>
          <div
            className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${
              isOpen ? 'block' : 'hidden'
            }`}
          >
            <ul className="text-center lg:flex lg:space-x-6 lg:mx-auto">
              <li>
                <Link
                  to="/"
                  className={`block mt-4 lg:inline-block lg:mt-0 ${
                    activeLink === 'home' ? 'text-yellow-400' : 'text-white'
                  } hover:text-yellow-400 transition duration-300`}
                  onClick={() => handleLinkClick('home')}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`block mt-4 lg:inline-block lg:mt-0 ${
                    activeLink === 'about' ? 'text-yellow-400' : 'text-white'
                  } hover:text-yellow-400 transition duration-300`}
                  onClick={() => handleLinkClick('about')}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`block mt-4 lg:inline-block lg:mt-0 ${
                    activeLink === 'contact' ? 'text-yellow-400' : 'text-white'
                  } hover:text-yellow-400 transition duration-300`}
                  onClick={() => handleLinkClick('contact')}
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4 lg:mt-0 lg:ml-4 justify-center">
              <button
                className="bg-[#E3EDF2] text-[#2C698D] px-4 py-2 rounded hover:bg-[#5EBEC4] transition duration-300 flex items-center space-x-2"
                onClick={() => {
                  handleLinkClick('book-appointment');
                  handleBookAppointment();
                }}
              >
                <FontAwesomeIcon icon={faCalendarCheck} />
                <span>Book Appointment</span>
              </button>
              {isLoggedIn ? (
                <button
                  className="bg-[#E3EDF2] text-[#2C698D] px-4 py-2 rounded hover:bg-[#5EBEC4] transition duration-300 flex items-center space-x-2"
                  onClick={() => {
                    handleLinkClick('logout');
                    handleLogout();
                  }}
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  className="bg-[#E3EDF2] text-[#2C698D] px-4 py-2 rounded hover:bg-[#5EBEC4] transition duration-300 flex items-center space-x-2"
                  onClick={() => {
                    handleLinkClick('login');
                    openPopup();
                  }}
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Popup for Login/SignUp */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700 transition duration-300"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              </button>

              <button
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700 transition duration-300"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            {isOtpSent ? (
              <>
                <h3 className="text-lg font-semibold text-center mb-4 text-[#2C698D]">
                  OTP Verification
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Please enter the OTP sent to your registered email.
                </p>
                <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
                  <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    className="w-full outline-none"
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  className="w-full bg-[#2C698D] text-white py-2 rounded hover:bg-[#5EBEC4] transition duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Verify OTP'}
                </button>
              </>
            ) : isLogin ? (
              <>
                <h3 className="text-lg font-semibold text-center mb-4 text-[#2C698D]">
                  Welcome Back!
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Please log in to access your account.
                </p>
                <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  className="w-full bg-[#2C698D] text-white py-2 rounded hover:bg-[#5EBEC4] transition duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Send OTP'}
                </button>
                <p className="text-sm text-center mt-4">
                  Don't have an account?{' '}
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={switchToSignUp}
                  >
                    Sign Up
                  </span>
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-center mb-4 text-[#2C698D]">
                  Create an Account
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Sign up to book appointments and manage your health records.
                </p>
                <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                  />
                </div>
                <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                  />
                </div>
                <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
                  <FontAwesomeIcon icon={faMobileAlt} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="mobile_no"
                    placeholder="Enter your mobile number"
                    value={formData.mobile_no}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                  />
                </div>
                <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
                  <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-2" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full outline-none"
                  >
                    <option value="" disabled>
                      Select the Role
                    </option>
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <button
                  onClick={handleSignUp}
                  className="w-full bg-[#2C698D] text-white py-2 rounded hover:bg-[#5EBEC4] transition duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Sign Up'}
                </button>
                <p className="text-sm text-center mt-4">
                  Already have an account?{' '}
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={switchToLogin}
                  >
                    Login
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
