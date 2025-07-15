import React from "react";
import { Button } from "../components/ui/Botton"; // adjust path if needed
import { FileSpreadsheet, FileText } from "lucide-react";
import {
  generateExcelInvoice,
  generatePDFInvoice,
} from "../lib/invoice-genrator"; // adjust path if needed

export const InvoiceDownload = ({ orderData }) => {
  const handleExcelDownload = () => {
    generateExcelInvoice(orderData);
  };

  const handlePDFDownload = () => {
    generatePDFInvoice(orderData);
  };

  return (
    <div className="flex gap-3">
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExcelDownload}
          className="flex items-center gap-2 bg-transparent"
        >
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          Excel
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handlePDFDownload}
        className="flex items-center gap-2 bg-transparent"
      >
        <FileText className="h-4 w-4 text-red-600" />
        PDF
      </Button>
    </div>
  );
};

export default InvoiceDownload;
