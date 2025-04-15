import express from 'express';
import connection from './database/connection.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/Auth/authRoute.js';
import patientRouter from './routes/Patient/patientRoutes.js';
import doctorRouter from './routes/Doctor/doctorRoutes.js';
import billingRouter from './routes/Patient/billingRoutes.js';
import adminRouter from './routes/Admin/adminRoute.js';
import appointmentRouter from './routes/Patient/appointmentRoute.js';
import messageRouter from './routes/Admin/messageRoute.js';



dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// DB connection
connection();

// Routes
app.use('/auth', authRouter);
app.use('/admin', adminRouter, messageRouter);
app.use('/patients', patientRouter, appointmentRouter);
app.use('/doctors', doctorRouter);
app.use('/generate', billingRouter);

// Server
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
