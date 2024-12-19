import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import './App.css';
import Download from "./Download";

// Register the components required for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper functions to calculate mean, mode, and median
const calculateMean = (arr) => {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((acc, value) => acc + value, 0);
  return sum / arr.length;
};

const calculateMode = (arr) => {
  const frequency = {};
  let maxFrequency = 0;
  let mode = [];

  arr.forEach((num) => {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxFrequency) {
      maxFrequency = frequency[num];
      mode = [num];
    } else if (frequency[num] === maxFrequency) {
      mode.push(num);
    }
  });

  return mode;
};

const calculateMedian = (arr) => {
  if (arr.length === 0) return 0;
  const sortedArr = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sortedArr.length / 2);
  return sortedArr.length % 2 === 0
    ? (sortedArr[mid - 1] + sortedArr[mid]) / 2
    : sortedArr[mid];
};

function App() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    redCell: "",
    hemoglobin: "",
    mcv: "",
    mch: "",
  });

  const [records, setRecords] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);  // State to manage modal visibility
  const [errorMessage, setErrorMessage] = useState("");  // State to manage error message visibility

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for required fields (e.g., name, age, blood group)
    if (!formData.name || !formData.age || !formData.bloodGroup || !formData.hemoglobin || !formData.mcv || !formData.mch) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    // If we're editing an existing record
    if (editingIndex !== null) {
      const updatedRecords = records.map((record, index) =>
        index === editingIndex ? formData : record
      );
      setRecords(updatedRecords);
      setEditingIndex(null); // Reset edit mode
    } else {
      // Add new record
      setRecords([...records, formData]);
    }

    // Close the modal after submitting
    setShowModal(false);

    // Clear form and error message
    setFormData({
      name: "",
      age: "",
      gender: "",
      bloodGroup: "",
      redCell: "",
      hemoglobin: "",
      mcv: "",
      mch: "",
    });
    setErrorMessage("");  // Clear error message
  };

  // Handle edit button click
  const handleEdit = (index) => {
    setFormData(records[index]);
    setEditingIndex(index);
    setShowModal(true);  // Show modal when editing
  };

  // Handle delete button click
  const handleDelete = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index);
    setRecords(updatedRecords);
  };

  // Calculate mean, mode, and median for Hemoglobin, MCV, and MCH
  const hemoglobinValues = records
    .map((record) => parseFloat(record.hemoglobin))
    .filter((val) => !isNaN(val));
  const mcvValues = records
    .map((record) => parseFloat(record.mcv))
    .filter((val) => !isNaN(val));
  const mchValues = records
    .map((record) => parseFloat(record.mch))
    .filter((val) => !isNaN(val));

  const hemoglobinMean = calculateMean(hemoglobinValues);
  const mcvMean = calculateMean(mcvValues);
  const mchMean = calculateMean(mchValues);

  const hemoglobinMode = calculateMode(hemoglobinValues);
  const mcvMode = calculateMode(mcvValues);
  const mchMode = calculateMode(mchValues);

  const hemoglobinMedian = calculateMedian(hemoglobinValues);
  const mcvMedian = calculateMedian(mcvValues);
  const mchMedian = calculateMedian(mchValues);

  // Prepare data for charting
  const chartData = (label, data) => ({
    labels: records.map((record, index) => `Record ${index + 1}`),
    datasets: [
      {
        label: label,
        data: data,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  });

  return (
    <div className="App">
      <h1>Medical Record Form</h1>

      {/* Button to open modal */}
      <button onClick={() => setShowModal(true)}>Add Record</button>

      {/* Modal for form */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>{editingIndex !== null ? "Edit Record" : "Add Record"}</h2>

            {/* Form to add or edit records */}
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              {/* Gender */}
              <div>
                <label>Gender:</label>
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                />
                <label htmlFor="male">Male</label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                />
                <label htmlFor="female">Female</label>
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="Other"
                  checked={formData.gender === "Other"}
                  onChange={handleChange}
                />
                <label htmlFor="other">Other</label>
              </div>

              {/* Blood Group */}
              <div>
                <label htmlFor="bloodGroup">Blood Group:</label>
                <input
                  type="text"
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                />
              </div>

              {/* Red Blood Cell Count */}
              <div>
                <label htmlFor="redCell">Red Blood Cell Count:</label>
                <input
                  type="number"
                  id="redCell"
                  name="redCell"
                  value={formData.redCell}
                  onChange={handleChange}
                />
              </div>

              {/* Hemoglobin Level */}
              <div>
                <label htmlFor="hemoglobin">Hemoglobin Level:</label>
                <input
                  type="number"
                  id="hemoglobin"
                  name="hemoglobin"
                  value={formData.hemoglobin}
                  onChange={handleChange}
                />
              </div>

              {/* Mean Corpuscular Volume (MCV) */}
              <div>
                <label htmlFor="mcv">MCV:</label>
                <input
                  type="number"
                  id="mcv"
                  name="mcv"
                  value={formData.mcv}
                  onChange={handleChange}
                />
              </div>

              {/* Mean Corpuscular Hemoglobin (MCH) */}
              <div>
                <label htmlFor="mch">MCH:</label>
                <input
                  type="number"
                  id="mch"
                  name="mch"
                  value={formData.mch}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <div>
                <button type="submit">
                  {editingIndex !== null ? "Update" : "Submit"}
                </button>
              </div>
            </form>

            {/* Error Message */}
            {errorMessage && (
              <div className="error-message">
                <p>{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table of records */}
      <div className="submit-form">
        <h2>Submitted Records</h2>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Red Cell Count</th>
              <th>Hemoglobin</th>
              <th>MCV</th>
              <th>MCH</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={index}>
                <td>{record.name}</td>
                <td>{record.age}</td>
                <td>{record.gender}</td>
                <td>{record.bloodGroup}</td>
                <td>{record.redCell}</td>
                <td>{record.hemoglobin}</td>
                <td>{record.mcv}</td>
                <td>{record.mch}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display Mean, Mode, and Median for Hemoglobin, MCV, and MCH */}
      <h3>Statistics</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Mean</th>
            <th>Mode</th>
            <th>Median</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hemoglobin</td>
            <td>{hemoglobinMean}</td>
            <td>{hemoglobinMode.join(", ")}</td>
            <td>{hemoglobinMedian}</td>
          </tr>
          <tr>
            <td>MCV</td>
            <td>{mcvMean}</td>
            <td>{mcvMode.join(", ")}</td>
            <td>{mcvMedian}</td>
          </tr>
          <tr>
            <td>MCH</td>
            <td>{mchMean}</td>
            <td>{mchMode.join(", ")}</td>
            <td>{mchMedian}</td>
          </tr>
        </tbody>
      </table>

      {/* Charts */}
      <div className="chart-download">
        <h3>Charts</h3>
        <Download data={records} />
      </div>
      <div className="chart__section">
        <div>
          <h4>Hemoglobin</h4>
          <Line data={chartData("Hemoglobin Level", hemoglobinValues)} />
        </div>
        <div>
          <h4>MCV</h4>
          <Line data={chartData("MCV", mcvValues)} />
        </div>
        <div>
          <h4>MCH</h4>
          <Line data={chartData("MCH", mchValues)} />
        </div>
      </div>
    </div>
  );
}

export default App;
