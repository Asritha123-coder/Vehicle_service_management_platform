import api from "./api";

// Create a new invoice
export const createInvoice = async (invoiceData) => {
  const response = await api.post("/invoice/create", invoiceData);
  return response.data;
};

// Get all invoices for the current user
export const getUserInvoices = async () => {
  const response = await api.get("/invoice");
  return response.data;
};

// Update payment status
export const updatePaymentStatus = async (id, status) => {
  const response = await api.patch(`/invoice/${id}/status`, { paymentStatus: status });
  return response.data;
};