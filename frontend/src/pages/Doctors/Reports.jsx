import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function Reports() {
  // Static data for reports
  const [reports] = useState([
    { id: 1, title: 'Monthly Revenue', date: '2025-04-01', type: 'Finance' },
    { id: 2, title: 'Patient Statistics', date: '2025-04-05', type: 'Patient' },
    { id: 3, title: 'Doctor Performance', date: '2025-04-10', type: 'Doctor' },
    { id: 4, title: 'Appointment Trends', date: '2025-04-15', type: 'Appointment' },
  ]);
  const [filter, setFilter] = useState('');
  const [filteredReports, setFilteredReports] = useState(reports);

  // Handle filter input change
  const handleFilterChange = (e) => {
    const query = e.target.value.toLowerCase();
    setFilter(query);
    setFilteredReports(
      reports.filter(
        (report) =>
          report.title.toLowerCase().includes(query) ||
          report.type.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <Toaster />
      <h1 className="text-2xl font-bold text-[#2C698D] mb-4">Reports</h1>

      {/* Filter Section */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or type"
          value={filter}
          onChange={handleFilterChange}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td className="border border-gray-300 p-2">{report.title}</td>
                <td className="border border-gray-300 p-2">{report.date}</td>
                <td className="border border-gray-300 p-2">{report.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500 mt-4">No reports found.</div>
      )}
    </div>
  );
}

export default Reports;