import React, { useEffect, useState } from "react";
import { getServiceHistory } from "../services/serviceRecordService";
import { getUserInvoices } from "../services/invoiceService";

const ServiceHistory = () => {
	const [history, setHistory] = useState([]);
	const [invoices, setInvoices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const [data, invs] = await Promise.all([
					getServiceHistory(),
					getUserInvoices()
				]);
				setHistory(data);
				setInvoices(invs);
			} catch (err) {
				setError("Failed to load service history.");
			} finally {
				setLoading(false);
			}
		};
		fetchHistory();
	}, []);

	if (loading) return <div className="main-content">Loading...</div>;

	return (
		<div className="main-content">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">Service History</h1>
				<p className="text-muted">Track all maintenance and repairs done for your vehicles.</p>
			</header>

			{error && <div className="glass-card p-4 mb-6 text-red-400">{error}</div>}

			<div className="space-y-6">
				{history.length === 0 ? (
					<div className="glass-card p-10 text-center">
						<p className="text-muted italic">No service records found. Book your first service today!</p>
					</div>
				) : (
					history.map((record) => (
						<div key={record._id} className="glass-card p-6 flex flex-col md:flex-row gap-6">
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<h3 className="text-xl font-bold">{record.vehicleId?.model}</h3>
									<span className="text-xs font-mono text-muted bg-white/5 px-2 py-1 rounded">
										{record.vehicleId?.vehicleNumber}
									</span>
								</div>
								<p className="text-sm text-muted mb-4">
									Date: {new Date(record.createdAt).toLocaleDateString()}
								</p>
								<div className="bg-black/20 p-4 rounded-lg">
									<p className="text-sm font-semibold mb-1">Repair Details:</p>
									<p className="text-sm text-muted">{record.repairDetails}</p>
								</div>
							</div>
							<div className="flex flex-col justify-between items-end min-w-[150px]">
								<span className={`badge ${
									record.serviceStatus === "COMPLETED" ? "badge-success" : 
									record.serviceStatus === "IN_PROGRESS" ? "badge-info" : "badge-warning"
								}`}>
									{record.serviceStatus}
								</span>
								<div className="text-right">
									<p className="text-xs text-muted">Technician</p>
									<p className="text-sm font-medium">{record.technicianId?.name || "Assigned"}</p>
									<div className="mt-2">
										{(() => {
											const inv = invoices.find(inv => inv.vehicleId?._id === record.vehicleId?._id && inv.createdAt >= record.createdAt);
											return inv ? (
												<span
													className={`badge cursor-pointer ${inv.paymentStatus === "PAID" ? "badge-success" : "badge-warning"}`}
													onClick={() => window.location.href = `/invoices/${inv._id}`}
													title="View Invoice"
												>
													Invoice: {inv.paymentStatus}
												</span>
											) : null;
										})()}
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default ServiceHistory;