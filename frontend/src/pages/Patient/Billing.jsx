import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function Billing() {
  // Static data for bills
  const [bills] = useState([
    { invoiceId: 'INV001', date: '2025-04-01', amount: 500, status: 'Paid' },
    { invoiceId: 'INV002', date: '2025-04-05', amount: 300, status: 'Unpaid' },
    { invoiceId: 'INV003', date: '2025-04-10', amount: 700, status: 'Paid' },
    { invoiceId: 'INV004', date: '2025-04-15', amount: 450, status: 'Unpaid' },
  ]);

  // Handle invoice download (mock functionality)
  const handleDownloadInvoice = (invoiceId) => {
    toast.success(`Invoice ${invoiceId} downloaded successfully!`);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <Toaster />
      <h1 className="text-2xl font-bold text-[#2C698D] mb-4">Billing</h1>

      {bills.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Invoice ID</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.invoiceId}>
                <td className="border border-gray-300 p-2">{bill.invoiceId}</td>
                <td className="border border-gray-300 p-2">{bill.date}</td>
                <td className="border border-gray-300 p-2">${bill.amount}</td>
                <td className="border border-gray-300 p-2">
                  {bill.status === 'Paid' ? (
                    <span className="text-green-500 font-semibold">{bill.status}</span>
                  ) : (
                    <span className="text-red-500 font-semibold">{bill.status}</span>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDownloadInvoice(bill.invoiceId)}
                    className="text-blue-500 hover:underline"
                  >
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500 mt-4">No bills found.</div>
      )}
    </div>
  );
}

export default Billing;