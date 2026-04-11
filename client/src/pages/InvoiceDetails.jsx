import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/invoice?id=${invoiceId}`);
        // If backend returns an array, pick the first one
        setInvoice(Array.isArray(res.data) ? res.data[0] : res.data);
      } catch (err) {
        setError("Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!invoice) return <div className="p-6">Invoice not found.</div>;

  return (
    <div className="glass-card p-6 max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>
      <div className="mb-2"><b>Invoice ID:</b> {invoice._id}</div>
      <div className="mb-2"><b>Vehicle:</b> {invoice.vehicleId?.model} ({invoice.vehicleId?.vehicleNumber})</div>
      <div className="mb-2"><b>Total Amount:</b> ₹{invoice.totalAmount}</div>
      <div className="mb-2"><b>Status:</b> <span className={`badge ${invoice.paymentStatus === "Paid" ? "badge-success" : "badge-error"}`}>{invoice.paymentStatus}</span></div>
      <div className="mb-2"><b>Created At:</b> {new Date(invoice.createdAt).toLocaleString()}</div>
    </div>
  );
};

export default InvoiceDetails;
