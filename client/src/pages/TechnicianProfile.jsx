import React from "react";
import { User, Mail, Phone, Wrench, Calendar, BadgeCheck } from "lucide-react";

// Dummy data for demonstration; replace with real technician data from context or props
const technician = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  role: "Technician",
  joined: "2023-01-15",
  skills: ["Engine Repair", "Diagnostics", "Oil Change", "Brake Service"],
  certifications: ["ASE Certified", "EV Specialist"],
  avatar: null // You can use a URL or null for initials
};

const TechnicianProfile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-blue-100 p-10 flex flex-col items-center">
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center mb-6 shadow-lg">
          {technician.avatar ? (
            <img src={technician.avatar} alt={technician.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-4xl font-black text-blue-600">
              {technician.name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        {/* Name & Role */}
        <h1 className="text-3xl font-black text-slate-800 mb-1">{technician.name}</h1>
        <p className="text-blue-600 font-bold uppercase tracking-widest mb-4">{technician.role}</p>
        {/* Contact Info */}
        <div className="flex flex-col gap-2 w-full mb-8">
          <div className="flex items-center gap-3 text-slate-600">
            <Mail size={18} /> <span>{technician.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Phone size={18} /> <span>{technician.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Calendar size={18} /> <span>Joined: {new Date(technician.joined).toLocaleDateString()}</span>
          </div>
        </div>
        {/* Skills */}
        <div className="w-full mb-8">
          <h2 className="text-lg font-black text-slate-700 mb-2 flex items-center gap-2"><Wrench size={18} /> Skills</h2>
          <div className="flex flex-wrap gap-2">
            {technician.skills.map((skill, idx) => (
              <span key={idx} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest border border-blue-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
        {/* Certifications */}
        <div className="w-full">
          <h2 className="text-lg font-black text-slate-700 mb-2 flex items-center gap-2"><BadgeCheck size={18} /> Certifications</h2>
          <div className="flex flex-wrap gap-2">
            {technician.certifications.map((cert, idx) => (
              <span key={idx} className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-widest border border-emerald-200">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfile;
