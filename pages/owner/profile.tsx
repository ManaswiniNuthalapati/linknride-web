// web/pages/owner/profile.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaTruck, FaMapMarkerAlt, FaArrowLeft, FaUser } from "react-icons/fa";

export default function OwnerProfile() {
  const router = useRouter();
  const [ownerData, setOwnerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const uid = localStorage.getItem("linknride_uid");
        if (!uid) {
          router.push("/login");
          return;
        }
        const docRef = doc(db, "owners", uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) setOwnerData(snap.data());
      } catch (err) {
        console.error("Error loading owner profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  if (!ownerData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-blue-50">
        <p className="text-gray-600 text-lg mb-4">No owner data found 😔</p>
        <button
          onClick={() => router.push("/onboard/owner")}
          className="bg-[#0F3F66] text-white px-5 py-2 rounded-lg hover:bg-[#0c3454] transition"
        >
          Complete Onboarding
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800">

      {/* ================= HEADER ================= */}
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0F3F66] flex items-center gap-2">
          <FaUser /> Owner Profile
        </h1>
        <button
          onClick={() => router.push("/owner/dashboard")}
          className="text-[#0F3F66] font-medium hover:underline flex items-center gap-2"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </header>

      {/* ================= PROFILE CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-lg border"
      >
        <h2 className="text-2xl font-bold text-[#0F3F66] mb-8 text-center">
          {ownerData.fullName || "Owner Name"}
        </h2>

        {/* ================= BASIC INFO ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-gray-700">
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p><span className="font-semibold">📞 Mobile:</span> {ownerData.phone}</p>
            <p className="mt-2"><span className="font-semibold">📧 Email:</span> {ownerData.email || "N/A"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border">
            <p><span className="font-semibold">🏙️ City:</span> {ownerData.city}</p>
            <p className="mt-2"><span className="font-semibold">🗺️ State:</span> {ownerData.state}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border">
            <p><span className="font-semibold">📮 Pincode:</span> {ownerData.pincode}</p>
            <p className="mt-2"><span className="font-semibold">📍 Address:</span> {ownerData.address}</p>
          </div>
        </div>

        {/* ================= AADHAAR ================= */}
        {ownerData.aadharUrl && (
          <div className="mb-10 bg-gray-50 p-4 rounded-xl border">
            <h3 className="text-lg font-semibold text-[#0F3F66] mb-2">Aadhaar Document</h3>
            <a
              href={ownerData.aadharUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0F3F66] underline hover:text-[#0c3454]"
            >
              View Uploaded Aadhaar
            </a>
          </div>
        )}

        {/* ================= VEHICLES SECTION ================= */}
        <div>
          <h3 className="text-xl font-bold text-[#0F3F66] mb-4 flex items-center gap-2">
            <FaTruck /> Registered Vehicles ({ownerData.vehicles?.length || 0})
          </h3>

          {ownerData.vehicles && ownerData.vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownerData.vehicles.map((vehicle: any, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -6 }}
                  className="bg-white border rounded-2xl shadow-md p-6"
                >
                  <h4 className="text-lg font-semibold text-[#0F3F66] mb-2">
                    🚚 {vehicle.vehicleNumber || "Unknown Vehicle"}
                  </h4>

                  <p className="text-gray-600 mt-1">
                    <span className="font-medium text-gray-800">Type:</span>{" "}
                    {vehicle.vehicleType}
                  </p>

                  <p className="text-gray-600 mt-1">
                    <span className="font-medium text-gray-800">Capacity:</span>{" "}
                    {vehicle.capacity} tons
                  </p>

                  {vehicle.rcNumber && (
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium text-gray-800">RC Number:</span>{" "}
                      {vehicle.rcNumber}
                    </p>
                  )}

                  <p className="text-gray-500 text-sm mt-3">
                    Added: {new Date(vehicle.addedAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-xl border text-center text-gray-500">
              No vehicles registered yet 🚗
            </div>
          )}
        </div>
      </motion.div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0F3F66] text-white text-center text-sm py-4 mt-12">
        © {new Date().getFullYear()} <span className="font-semibold">LinknRide</span>. All rights reserved.
      </footer>
    </div>
  );
}
