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
					<div className="bg-slate-900 border border-white/5 p-12 text-center rounded-3xl">
						<p className="text-slate-500 italic">No service records found. Book your first service today!</p>
					</div>
				) : (
					history.map((record) => (
						<div key={record._id} className="bg-slate-900 border border-white/10 p-6 rounded-[2rem] flex flex-col md:flex-row gap-6 shadow-xl">
							<div className="flex-1">
								<div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden border border-white/10 flex-shrink-0">
                                        {record.vehicleId?.imageUrl ? (
                                            <img src={record.vehicleId.imageUrl} alt={record.vehicleId.model} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-800">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
									<div>
										<h3 className="text-lg font-bold text-white">{record.vehicleId?.model}</h3>
										<p className="text-[10px] font-mono font-bold text-primary tracking-widest uppercase">{record.vehicleId?.vehicleNumber}</p>
									</div>
								</div>
								<p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
									Service Date: {new Date(record.createdAt).toLocaleDateString()}
								</p>
								<div className="bg-black/40 p-4 rounded-2xl border border-white/5">
									<p className="text-xs font-bold text-slate-400 uppercase mb-2">Repair Details</p>
									<p className="text-sm text-slate-300 leading-relaxed">{record.repairDetails}</p>
								</div>
							</div>
							<div className="flex flex-col justify-between items-start md:items-end min-w-[150px] gap-4">
								<span className={`badge ${
									record.serviceStatus === "COMPLETED" ? "badge-success" : 
									record.serviceStatus === "IN_PROGRESS" ? "badge-info" : "badge-warning"
								} px-4 py-1.5 text-[10px] font-bold rounded-xl`}>
									{record.serviceStatus}
								</span>
								<div className="text-left md:text-right">
									<p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Assigned Technician</p>
									<p className="text-sm font-bold text-slate-200">{record.technicianId?.name || "Team Member"}</p>
									<div className="mt-4">
										{(() => {
											// More robust matching: allow any invoice for this vehicle that was created around or after the service record
											const inv = invoices.find(inv => 
                                                (inv.vehicleId?._id === record.vehicleId?._id || inv.vehicleId === record.vehicleId?._id)
                                            );
											return inv ? (
												<div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => window.location.href = `/invoices/${inv._id}`}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                                                            inv.paymentStatus === "PAID" 
                                                            ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20" 
                                                            : "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                                                        }`}
                                                    >
                                                        {inv.paymentStatus === "PAID" ? "View Receipt" : "Pay Invoice"}
                                                    </button>
                                                    {inv.paymentStatus === "PENDING" && (
                                                        <button
                                                            onClick={() => window.location.href = `/pay/${inv._id}`}
                                                            className="bg-primary text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-glow"
                                                        >
                                                            Checkout Now
                                                        </button>
                                                    )}
                                                </div>
											) : (
                                                <p className="text-[10px] text-slate-500 italic mt-2">Processing Invoice...</p>
                                            );
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