import React, { useEffect, useState } from "react";
import { getUserInvoices, updatePaymentStatus } from "../services/invoiceService";
import { useNavigate } from "react-router-dom";

const Payments = () => {
	const [invoices, setInvoices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchInvoices = async () => {
			try {
				const data = await getUserInvoices();
				setInvoices(data);
			} catch (err) {
				setError("Failed to load invoices.");
			} finally {
				setLoading(false);
			}
		};
		fetchInvoices();
	}, []);

	const handlePay = (id) => {
		navigate(`/pay/${id}`);
	};

	if (loading) return <div className="main-content">Loading...</div>;

	return (
		<div className="main-content">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">Invoices & Payments</h1>
				<p className="text-muted">Manage your service bills and payment history.</p>
			</header>

			{error && <div className="glass-card p-4 mb-6 text-red-400">{error}</div>}
	// Removed successMsg display (variable not defined)

			<div className="glass-card overflow-hidden">
				<table className="w-full text-left">
					<thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-muted font-bold">
						<tr>
							<th className="px-6 py-4">Vehicle</th>
							<th className="px-6 py-4">Date</th>
							<th className="px-6 py-4">Amount</th>
							<th className="px-6 py-4">Status</th>
							<th className="px-6 py-4 text-right sticky right-0 bg-inherit">Action</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-white/5">
						{invoices.length === 0 ? (
							<tr>
								<td colSpan="5" className="px-6 py-10 text-center text-muted italic">No invoices found.</td>
							</tr>
						) : (
							invoices.map((invoice) => (
								<tr key={invoice._id} className="hover:bg-white/5 transition-colors">
									<td className="px-6 py-4">
										<div className="font-medium">{invoice.vehicleId?.model}</div>
										<div className="text-xs text-muted">{invoice.vehicleId?.vehicleNumber}</div>
									</td>
									<td className="px-6 py-4 text-sm text-muted">
										{new Date(invoice.createdAt).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 font-bold text-primary">
										${invoice.totalAmount?.toLocaleString()}
									</td>
									<td className="px-6 py-4">
										<span className={`badge ${
											invoice.paymentStatus === "PAID" ? "badge-success" : "badge-warning"
										}`}>
											{invoice.paymentStatus}
										</span>
									</td>
									<td className="px-6 py-4 text-right sticky right-0 bg-inherit">
										{invoice.paymentStatus === "PENDING" ? (
											<button 
												onClick={() => handlePay(invoice._id)}
												className="btn-primary py-2 px-4 text-sm"
											>
												Pay Now
											</button>
										) : (
											<button 
												className="btn-secondary py-2 px-4 text-sm"
												onClick={() => navigate(`/invoices/${invoice._id}`)}
											>
												Receipt
											</button>
										)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Payments;