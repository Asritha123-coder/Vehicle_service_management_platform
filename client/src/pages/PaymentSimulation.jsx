import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updatePaymentStatus } from "../services/invoiceService";

const PaymentSimulation = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSimulatePayment = async () => {
    setProcessing(true);
    await new Promise(res => setTimeout(res, 2000));
    await updatePaymentStatus(invoiceId, "PAID");
    setSuccess(true);
    setTimeout(() => navigate(-1), 1500); // Go back after success
  };

  return (
    <div className="glass-card p-8 max-w-md mx-auto mt-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Payment Simulation</h2>
      <div className="mb-6">Invoice ID: <b>{invoiceId}</b></div>
      {!success ? (
        <button
          className={`btn-primary px-6 py-3 text-lg ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSimulatePayment}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Simulate Payment'}
        </button>
      ) : (
        <div className="text-green-500 text-xl font-bold">Payment Successful!</div>
      )}
    </div>
  );
};

export default PaymentSimulation;
