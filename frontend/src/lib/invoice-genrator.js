import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateExcelInvoice = (invoiceData) => {
  const wb = XLSX.utils.book_new();

  const headerData = [
    ["GET YOUR PROJECT DONE - INVOICE"],
    ["Premium Engineering Project Kits & Solutions"],
    ["Email: support@getyourprojectdone.com | Phone: +91-9876543210"],
    ["Website: www.getyourprojectdone.com"],
    [""],
    ["INVOICE DETAILS"],
    ["Invoice Number:", invoiceData.orderId],
    ["Invoice Date:", invoiceData.orderDate],
    ["Payment Method:", invoiceData.paymentMethod],
    [""],
    ["BILLING INFORMATION"],
    ["Customer Name:", invoiceData.customerInfo.name],
    ["Email:", invoiceData.customerInfo.email],
    ["Mobile:", invoiceData.customerInfo.mobile],
    ["Address:", invoiceData.customerInfo.address],
    ["City:", invoiceData.customerInfo.city],
    ["State:", invoiceData.customerInfo.state],
    ["Pincode:", invoiceData.customerInfo.pincode],
  ];

  if (invoiceData.customerInfo.landmark) {
    headerData.push(["Landmark:", invoiceData.customerInfo.landmark]);
  }

  headerData.push(
    [""],
    ["ORDER ITEMS"],
    ["S.No.", "Product Name", "Quantity", "Unit Price (₹)", "Total (₹)"]
  );

  invoiceData.items.forEach((item, index) => {
    headerData.push([
      (index + 1).toString(),
      item.title,
      item.quantity.toString(),
      item.price.toLocaleString(),
      item.total.toLocaleString(),
    ]);
  });

  headerData.push(
    [""],
    ["PRICING SUMMARY"],
    ["Subtotal:", `₹${invoiceData.pricing.subtotal.toLocaleString()}`],
    ["Discount (5%):", `-₹${invoiceData.pricing.discount.toLocaleString()}`],
    ["GST (18%):", `₹${invoiceData.pricing.gst.toLocaleString()}`],
    [
      "Delivery Charges:",
      invoiceData.pricing.deliveryCharge === 0
        ? "FREE"
        : `₹${invoiceData.pricing.deliveryCharge.toLocaleString()}`,
    ],
    [""],
    ["TOTAL AMOUNT:", `₹${invoiceData.pricing.finalTotal.toLocaleString()}`],
    [""],
    ["Thank you for choosing Get Your Project Done!"],
    ["For support, contact us at support@getyourprojectdone.com"]
  );

  const ws = XLSX.utils.aoa_to_sheet(headerData);

  ws["!cols"] = [
    { wch: 15 },
    { wch: 40 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Invoice");

  const fileName = `GetYourProjectDone_Invoice_${invoiceData.orderId}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

export const generatePDFInvoice = (invoiceData) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("GET YOUR PROJECT DONE", 20, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Engineering Project Kits & Solutions", 20, 30);
  doc.text(
    "Email: support@getyourprojectdone.com | Phone: +91-9876543210",
    20,
    38
  );
  doc.text("Website: www.getyourprojectdone.com", 20, 46);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 20, 65);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice Number: ${invoiceData.orderId}`, 20, 75);
  doc.text(`Invoice Date: ${invoiceData.orderDate}`, 20, 83);
  doc.text(`Payment Method: ${invoiceData.paymentMethod}`, 20, 91);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("BILLING INFORMATION", 20, 110);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let yPos = 120;
  doc.text(`Name: ${invoiceData.customerInfo.name}`, 20, yPos);
  doc.text(`Email: ${invoiceData.customerInfo.email}`, 20, yPos + 8);
  doc.text(`Mobile: ${invoiceData.customerInfo.mobile}`, 20, yPos + 16);
  doc.text(`Address: ${invoiceData.customerInfo.address}`, 20, yPos + 24);
  doc.text(
    `City: ${invoiceData.customerInfo.city}, ${invoiceData.customerInfo.state} - ${invoiceData.customerInfo.pincode}`,
    20,
    yPos + 32
  );

  if (invoiceData.customerInfo.landmark) {
    doc.text(`Landmark: ${invoiceData.customerInfo.landmark}`, 20, yPos + 40);
    yPos += 8;
  }

  const tableStartY = yPos + 55;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("ORDER ITEMS", 20, tableStartY - 10);

  const tableData = invoiceData.items.map((item, index) => [
    (index + 1).toString(),
    item.title,
    item.quantity.toString(),
    `₹${item.price.toLocaleString()}`,
    `₹${item.total.toLocaleString()}`,
  ]);

  doc.autoTable({
    startY: tableStartY,
    head: [["S.No.", "Product Name", "Qty", "Unit Price", "Total"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [220, 38, 38] },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 80 },
      2: { cellWidth: 20 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
    },
  });

  const finalY = doc.lastAutoTable.finalY + 20;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PRICING SUMMARY", 120, finalY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Subtotal: ₹${invoiceData.pricing.subtotal.toLocaleString()}`,
    120,
    finalY + 12
  );
  doc.text(
    `Discount (5%): -₹${invoiceData.pricing.discount.toLocaleString()}`,
    120,
    finalY + 20
  );
  doc.text(
    `GST (18%): ₹${invoiceData.pricing.gst.toLocaleString()}`,
    120,
    finalY + 28
  );
  doc.text(
    `Delivery: ${
      invoiceData.pricing.deliveryCharge === 0
        ? "FREE"
        : `₹${invoiceData.pricing.deliveryCharge.toLocaleString()}`
    }`,
    120,
    finalY + 36
  );

  doc.setFont("helvetica", "bold");
  doc.text(
    `TOTAL: ₹${invoiceData.pricing.finalTotal.toLocaleString()}`,
    120,
    finalY + 50
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for choosing Get Your Project Done!", 20, finalY + 80);
  doc.text(
    "For support, contact us at support@getyourprojectdone.com",
    20,
    finalY + 88
  );

  const fileName = `GetYourProjectDone_Invoice_${invoiceData.orderId}.pdf`;
  doc.save(fileName);
};
