import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  FaHome,
  FaUserTie,
  FaSyncAlt,
  FaRoute,
  FaHistory,
  FaUser,
  FaBell,
  FaIdBadge,
  FaUserCircle
} from "react-icons/fa";
import Image from "next/image";

// ✅ Helper to validate Indian vehicle numbers
const isValidVehicleNumber = (num: string) => {
  return /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(num.toUpperCase());
};

export default function PostVehicle() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "",
    capacity: "",
    pickupLocation: "",
    dropLocation: "",
    availableDate: "",
    availableTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicleValid, setVehicleValid] = useState(true);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "vehicleNumber") {
      setVehicleValid(isValidVehicleNumber(value));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const uid = localStorage.getItem("linknride_uid");
      if (!uid) throw new Error("User not authenticated");

      if (
        !form.vehicleNumber ||
        !form.pickupLocation ||
        !form.dropLocation ||
        !form.availableDate
      ) {
        throw new Error("Please fill all required fields");
      }

      if (!vehicleValid) throw new Error("Invalid vehicle number format");

      await addDoc(collection(db, "vehicles"), {
        ownerId: uid,
        vehicleNumber: form.vehicleNumber.toUpperCase(),
        vehicleType: form.vehicleType,
        capacity: form.capacity,
        pickupLocation: form.pickupLocation,
        dropLocation: form.dropLocation,
        availableDate: form.availableDate,
        availableTime: form.availableTime,
        status: "available",
        postedAt: serverTimestamp(),
      });

      alert("✅ Vehicle posted successfully!");
      router.push("/owner/dashboard");
    } catch (err: any) {
      console.error("Error posting vehicle:", err);
      setError(err.message || "Failed to post vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-light text-gray-800">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#0F3F66] text-white flex flex-col py-6 px-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Vehicle Owner</h2>
          <p className="text-sm opacity-80">Dashboard</p>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <button onClick={() => router.push("/owner/dashboard")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FaHome /> Dashboard
          </button>

          <button onClick={() => router.push("/owner/hire-drivers")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FaUserTie /> Hire Drivers
          </button>

          <button onClick={() => router.push("/owner/active-requests")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FaSyncAlt /> Active Requests / Bids
          </button>

          <button onClick={() => router.push("/owner/ongoing-trips")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FaRoute /> Ongoing Trips
          </button>

          <button onClick={() => router.push("/owner/trip-history")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FaHistory /> Trip History
          </button>

          <button onClick={() => router.push("/owner/driver-requests")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FaIdBadge /> Driver Requests
          </button>

          <button onClick={() => router.push("/owner/profile")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FaUser /> Profile & Vehicles
          </button>

          <button onClick={() => router.push("/owner/notifications")} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10">
            <FaBell /> Notifications
          </button>
        </nav>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">

        {/* ================= HEADER ================= */}
        <header className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">
          <div onClick={() => router.push("/owner/dashboard")} className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/logo.jpg"
              alt="LinknRide Logo"
              width={36}
              height={36}
              className="rounded-full border border-gray-300"
            />
            <h1 className="text-2xl font-bold text-[#0F3F66] tracking-wide">
              LINKNRIDE
            </h1>
          </div>

          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 focus:outline-none">
              <FaUserCircle className="text-3xl text-[#0F3F66]" />
              <span className="font-medium text-gray-700 text-sm">Owner ▾</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                <button onClick={() => router.push("/owner/profile")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  👤 View Profile
                </button>
                <button onClick={() => router.push("/onboard/owner")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    router.push("/login");
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-grow px-10 py-12"
        >
          <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">

            <h2 className="text-2xl font-bold text-[#0F3F66] mb-6 text-center">
              Add Vehicle Availability
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Vehicle Number */}
                <div>
                  <label className="block font-medium mb-2">Vehicle Number *</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    placeholder="e.g. AP09AB1234"
                    className={`w-full border rounded-lg px-4 py-2 ${
                      vehicleValid ? "focus:ring-blue-200" : "border-red-400"
                    }`}
                    required
                  />
                  {!vehicleValid && (
                    <p className="text-red-600 text-sm mt-1">
                      Invalid format (e.g., AP09AB1234)
                    </p>
                  )}
                </div>

                {/* Vehicle Type */}
                <div>
                  <label className="block font-medium mb-2">Vehicle Type *</label>
                  <select
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Truck">Truck</option>
                    <option value="Mini Van">Mini Van</option>
                    <option value="DCM">DCM</option>
                    <option value="Tempo">Tempo</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block font-medium mb-2">Capacity (tons)</label>
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 6"
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                {/* Pickup */}
                <div>
                  <label className="block font-medium mb-2">Pickup Location *</label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={form.pickupLocation}
                    onChange={handleChange}
                    placeholder="e.g. Guntur"
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                {/* Drop */}
                <div>
                  <label className="block font-medium mb-2">Drop Location *</label>
                  <input
                    type="text"
                    name="dropLocation"
                    value={form.dropLocation}
                    onChange={handleChange}
                    placeholder="e.g. Hyderabad"
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block font-medium mb-2">Available Date *</label>
                  <input
                    type="date"
                    name="availableDate"
                    value={form.availableDate}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block font-medium mb-2">Available Time</label>
                  <input
                    type="time"
                    name="availableTime"
                    value={form.availableTime}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

              </div>

              {error && <p className="text-red-600 mt-4">{error}</p>}

              <button
                type="submit"
                disabled={loading || !vehicleValid}
                className={`mt-8 w-full py-3 text-white font-semibold rounded-lg ${
                  loading || !vehicleValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0F3F66] hover:bg-[#0c3454]"
                }`}
              >
                {loading ? "Posting..." : "Post Vehicle"}
              </button>
            </form>
          </div>
        </motion.section>

        {/* ================= FOOTER ================= */}
        <footer className="bg-[#0F3F66] text-white text-center text-sm py-4">
          © {new Date().getFullYear()} <span className="font-semibold">LinknRide</span>. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
