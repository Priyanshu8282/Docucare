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
import bodyParser from "body-parser";


const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(bodyParser.json({ limit: "10mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

connection();


app.use('/auth', authRouter);
app.use('/admin',adminRouter,messageRouter);
app.use('/patients', patientRouter,appointmentRouter); // Use patient routes  
app.use('/doctors', doctorRouter); // Use doctor routes
app.use('/generate', billingRouter); // Use billing routes

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});