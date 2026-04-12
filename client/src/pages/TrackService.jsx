import React, { useEffect, useState } from "react";
import { getUserAppointments } from "../services/appointmentService";

const TrackService = () => {
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				const data = await getUserAppointments();
				setAppointments(data);
			} catch (err) {
				console.error("Failed to fetch tracking data", err);
			} finally {
				setLoading(false);
			}
		};
		fetchAppointments();
	}, []);

	const getProgress = (status) => {
		switch (status) {
			case "PENDING": return 0;
			case "ASSIGNED": return 25;
			case "IN_PROGRESS": return 60;
			case "COMPLETED": return 100;
			default: return 0;
		}
	};

	if (loading) return <div className="main-content">Loading...</div>;

	const activeAppointments = appointments.filter(a => a.status !== "COMPLETED");

	return (
		<div className="main-content">
			<header className="mb-8">
				<h1 className="text-3xl font-bold">Track Service</h1>
				<p className="text-muted">Real-time status of your active service appointments.</p>
			</header>

			<div className="space-y-6">
				{activeAppointments.length === 0 ? (
					<div className="bg-slate-900 border border-white/5 p-12 text-center rounded-3xl">
						<p className="text-slate-500 italic">No active services tracking. Completed services are in history.</p>
					</div>
				) : (
					activeAppointments.map((app) => (
						<div key={app._id} className="bg-slate-900 border border-white/10 p-8 rounded-[2rem] shadow-xl">
							<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
								<div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border border-white/10">
                                        {app.vehicleId?.imageUrl ? (
                                            <img src={app.vehicleId.imageUrl} alt={app.vehicleId.model} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
									<div>
										<h2 className="text-2xl font-bold text-white">{app.vehicleId?.model}</h2>
										<p className="text-primary font-bold text-xs tracking-widest uppercase">{app.serviceType}</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Current Status</p>
									<span className={`badge ${
										app.status === "IN_PROGRESS" ? "badge-info" :
										app.status === "ASSIGNED" ? "badge-warning" : "badge-success"
									} px-5 py-2 text-xs font-bold rounded-xl`}>
										{app.status}
									</span>
								</div>
							</div>

							<div className="relative pt-1 px-2">
								<div className="flex mb-4 items-center justify-between">
									<div className="text-xs font-bold inline-block py-2 px-4 uppercase rounded-xl text-primary bg-primary/10 border border-primary/20">
										Completion: {getProgress(app.status)}%
									</div>
								</div>
								<div className="overflow-hidden h-3 mb-6 text-xs flex rounded-full bg-slate-800">
									<div style={{ width: `${getProgress(app.status)}%` }} 
										className="shadow-glow flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000 ease-out">
									</div>
								</div>
							</div>

							<div className="grid grid-cols-4 gap-4 text-[10px] uppercase font-black text-center tracking-tighter">
								<div className={app.status === "PENDING" ? "text-primary" : "text-slate-600"}>Pending</div>
								<div className={app.status === "ASSIGNED" ? "text-primary" : "text-slate-600"}>Assigned</div>
								<div className={app.status === "IN_PROGRESS" ? "text-primary" : "text-slate-600"}>Ongoing</div>
								<div className={app.status === "COMPLETED" ? "text-primary" : "text-slate-600"}>Ready</div>
							</div>
						</div>
					))
				)}
			</div>

		</div>
	);
};

export default TrackService;