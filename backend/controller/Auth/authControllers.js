import User from '../../models/AuthModel.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { sendOtpEmail, sendWelcomeEmail } from '../../config/nodemailer.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to create a JWT token
const createToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    try {
        return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '2d' });
    } catch (error) {
        console.error('Token creation error:', error);
        return null;
    }
};

// Helper function to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// In-memory storage for OTPs with expiry
const otpStorage = {};

// ✅ Register User
const registerUser = async (req, res) => {
    const { fullName, email, mobile_no, role } = req.body;

    try {
        // Validate input
        if (!fullName || !email || !mobile_no || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!['Patient', 'Doctor', 'Admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Only "Patient", "Doctor", and "Admin" roles are allowed.' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        if (!validator.isMobilePhone(mobile_no, 'en-IN')) {
            return res.status(400).json({ message: 'Invalid mobile number' });
        }

        // Check if email or mobile number already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const mobileExists = await User.findOne({ mobile_no });
        if (mobileExists) {
            return res.status(400).json({ message: 'User with this mobile number already exists' });
        }

        // Create user
        const newUser = await User.create({ fullName, email, mobile_no, role });

        // Create token
        const token = createToken(newUser._id, role);

        // Store token in accessToken field
        newUser.accessToken = token;
        await newUser.save();

        // Send Welcome Email
        await sendWelcomeEmail(email, fullName);

        res.status(200).json({
            message: 'User Registration Successfully',
            token,
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                mobile_no: newUser.mobile_no,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Login User
const loginUser = async (req, res) => {
    const { email, mobile_no } = req.body;

    try {
        if (!email && !mobile_no) {
            return res.status(400).json({ message: 'Email or mobile number is required' });
        }

        const user = await User.findOne({ $or: [{ email }, { mobile_no }] });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        const key = email || mobile_no;

        // Store OTP with expiry (5 minutes)
        otpStorage[key] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

        if (email) {
            // Send OTP email
            await sendOtpEmail(email, 'Your DocuCare OTP Code', {
                name: `${user.fullName}`,   
                otp,
            });
        } else if (mobile_no) {
            // Send OTP via SMS (implement sendSMS function)
            await sendSMS(mobile_no, otp);
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Verify OTP
const verifyOTP = async (req, res) => {
    const { email, mobile_no, otp } = req.body;

    try {
        if (!email && !mobile_no) {
            return res.status(400).json({ message: 'Email or mobile number is required' });
        }

        if (!otp || otp.length !== 6) {
            return res.status(400).json({ message: 'Invalid OTP', status: 'error' });
        }

        const key = email || mobile_no;
        const storedOtpData = otpStorage[key];

        if (!storedOtpData || storedOtpData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP', status: 'error' });
        }

        if (Date.now() > storedOtpData.expiresAt) {
            delete otpStorage[key];
            return res.status(400).json({ message: 'OTP expired', status: 'error' });
        }

        // Clear the OTP after successful verification
        delete otpStorage[key];

        const user = await User.findOne({ $or: [{ email }, { mobile_no }] });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create token
        const token = createToken(user._id, user.role);
        res.status(200).json({
            message: 'OTP verified successfully',
            token, user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobile_no: user.mobile_no,
                role: user.role,

            },
            status: 'success',
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Logout User
const logoutUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.body._id,
            { accessToken: '' },
            { new: true }
        );

        if (user) {
            return res.status(200).json({
                message: 'Successfully Logged Out',
            });
        }

        return res.status(400).json({
            message: 'Could Not Logout, Please Try Again',
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { registerUser, loginUser, verifyOTP, logoutUser };