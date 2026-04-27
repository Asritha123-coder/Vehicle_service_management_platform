import React, { useState } from "react";
import { addVehicle } from "../services/vehicleService";
import { useNavigate } from "react-router-dom";
import { Car, Fuel, Calendar, Disc, ArrowLeft, Plus, Image as ImageIcon, Upload, X } from "lucide-react";

const AddVehicle = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [model, setModel] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [purchaseYear, setPurchaseYear] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("vehicleNumber", vehicleNumber);
      formData.append("model", model);
      formData.append("fuelType", fuelType);
      formData.append("purchaseYear", purchaseYear);
      if (image) {
        formData.append("image", image);
      }

      await addVehicle(formData);

      setMessage("Vehicle added successfully!");

      setTimeout(() => {
        setMessage("");
        navigate("/customer/vehicles");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ FIXED WRAPPER (CENTERED)
    <div className="min-h-screen flex justify-center items-start bg-slate-50 py-10 px-4">
      
      <div className="w-full max-w-2xl">

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Register New Vehicle</h1>
          <p className="text-slate-600 text-lg">
            Add your vehicle details to start booking services.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl">

          {/* Image Upload */}
          <div className="mb-8">
            <label className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
              <ImageIcon size={16} className="text-blue-600" />
              Vehicle Image
            </label>

            <div className="flex flex-col items-center justify-center">
              {preview ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-blue-200 group">
                  <img src={preview} alt="Vehicle Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-2 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
               <div className="w-full">
  <label className="w-full h-64 rounded-2xl border-2 border-dashed border-slate-400 bg-white hover:border-blue-500 transition-all cursor-pointer flex items-center justify-center">
    
    <div className="flex flex-col items-center justify-center text-center gap-3 h-full w-full">
      
      <div className="p-4 rounded-full bg-slate-100 flex items-center justify-center">
        <Upload size={32} className="text-slate-500" />
      </div>

      <p className="font-semibold text-lg text-slate-700">
        Click to upload vehicle photo
      </p>

      <p className="text-sm text-slate-500">
        PNG, JPG or JPEG (Max 5MB)
      </p>

    </div>

    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
  </label>
</div>
              )}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Vehicle Number */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
                <Disc size={16} className="text-blue-600" />
                Vehicle Number
              </label>
              <input
                type="text"
                placeholder="e.g. MH 12 AB 1234"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                required
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

            {/* Model */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
                <Car size={16} className="text-blue-600" />
                Vehicle Model
              </label>
              <input
                type="text"
                placeholder="e.g. Tesla Model 3"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
                <Fuel size={16} className="text-blue-600" />
                Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                required
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Select Engine Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
                <option value="LPG">LPG</option>
              </select>
            </div>

            {/* Purchase Year */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
                <Calendar size={16} className="text-blue-600" />
                Purchase Year
              </label>
              <input
                type="number"
                value={purchaseYear}
                onChange={(e) => setPurchaseYear(e.target.value)}
                required
                min="1900"
                max={new Date().getFullYear()}
                placeholder="YYYY"
                className="border border-slate-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

          </div>

          {/* Messages */}
          {message && <div className="mt-4 p-3 bg-green-100 text-green-600 rounded">{message}</div>}
          {error && <div className="mt-4 p-3 bg-red-100 text-red-600 rounded">{error}</div>}

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-6 flex items-center justify-center gap-2"
          >
            {loading ? "Registering..." : (
              <>
                <Plus size={20} />
                Register Vehicle
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddVehicle;