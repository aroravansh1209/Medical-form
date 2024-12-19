import React from 'react';
import { IoCloudDownloadOutline } from "react-icons/io5";

const Download = ({ data }) => {
  console.log('data', data);

  const handleDownload = () => {
    // Ensure data exists and is an array before proceeding
    if (!data || !Array.isArray(data)) {
      console.error("Data is not valid");
      return;
    }

    // Create CSV content
    const csvContent = [
      [
        "age",
        "bloodGroup",
        "gender",
        "hemoglobin",
        "mch",
        "mcv",
        "name",
        "redCell"
      ],
      ...data.map((item) => [
        item.age || "N/A",
        item.bloodGroup || "N/A",
        item.gender || "N/A",
        item.hemoglobin || "N/A",
        item.mch || "N/A",
        item.mcv || "N/A",
        item.name || "N/A",
        item.redCell || "N/A"
      ])
    ];

    // Convert CSV content to string
    const csvString = [
      csvContent[0].join(","),
      ...csvContent.slice(1).map((row) => row.join(","))
    ].join("\n");

    // Trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const fileName = `report_${new Date().toLocaleDateString()}.csv`;  // Example filename with current date
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button className="download_btn" onClick={handleDownload}>
        <IoCloudDownloadOutline /> Download Csv
      </button>
    </div>
  );
};

export default Download;
