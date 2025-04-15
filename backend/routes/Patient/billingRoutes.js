import express from 'express';
import {
  createBilling,
  getBillingById,
  updateBilling,
  deleteBilling,
} from '../../controller/Patient/billingController.js';

const billingRouter = express.Router();

// Route to create a new billing record
billingRouter
  .route('/billing')
  .post(createBilling);

// Routes to get, update, and delete a billing record by ID
billingRouter
  .route('/billing/:id')
  .get(getBillingById)
  .put(updateBilling)
  .delete(deleteBilling);

export default billingRouter;