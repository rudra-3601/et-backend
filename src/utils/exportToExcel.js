import XLSX from "xlsx";

/**
 * Exports data to Excel and sends it in the response
 * @param {Array} data - Array of objects to export
 * @param {String} sheetName - Name of the Excel sheet
 * @param {String} fileName - File name for download (e.g., "incomes.xlsx")
 * @param {Object} res - Express response object
 */
const exportToExcel = (data, sheetName, fileName, res) => {
  if (!data || !data.length) {
    return res.status(404).json({
      success: false,
      message: `No ${sheetName.toLowerCase()} data found to export`,
    });
  }

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Convert workbook to buffer
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  // Set headers for download
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment;filename=${fileName}`);

  // Send file as response
  return res.status(200).send(buffer);
};

export default exportToExcel;
