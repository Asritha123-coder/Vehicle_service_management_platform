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
					<div className="glass-card p-10 text-center">
						<p className="text-muted italic">No active services tracking. Completed services are in history.</p>
					</div>
				) : (
					activeAppointments.map((app) => (
						<div key={app._id} className="glass-card p-8">
							<div className="flex justify-between items-start mb-8">
								<div>
									<h2 className="text-2xl mb-1">{app.vehicleId?.model}</h2>
									<p className="text-muted">{app.serviceType}</p>
								</div>
								<div className="text-right">
									<p className="text-xs text-muted uppercase font-bold tracking-widest mb-1">Status</p>
									<span className={`badge ${
										app.status === "IN_PROGRESS" ? "badge-info" :
										app.status === "ASSIGNED" ? "badge-warning" : "badge-success"
									} px-4 py-2 text-sm`}>
										{app.status}
									</span>
								</div>
							</div>

							<div className="relative pt-1">
								<div className="flex mb-2 items-center justify-between">
									<div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
										Progress: {getProgress(app.status)}%
									</div>
								</div>
								<div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/5">
									<div style={{ width: `${getProgress(app.status)}%` }} 
										className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500">
									</div>
								</div>
							</div>

							<div className="grid grid-cols-4 gap-2 text-[10px] uppercase font-bold text-center">
								<div className={app.status === "PENDING" ? "text-primary" : "text-muted"}>Pending</div>
								<div className={app.status === "ASSIGNED" ? "text-primary" : "text-muted"}>Assigned</div>
								<div className={app.status === "IN_PROGRESS" ? "text-primary" : "text-muted"}>In Progress</div>
								<div className={app.status === "COMPLETED" ? "text-primary" : "text-muted"}>Ready</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default TrackService;