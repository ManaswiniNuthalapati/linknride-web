import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaTruck, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function MyVehicles() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) {
      router.push("/login");
      return;
    }

    // ✅ Real-time Firestore listener for this owner's vehicles
    const q = query(collection(db, "vehicles"), where("ownerId", "==", uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehicles(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-blue-100 text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 shadow-sm bg-white/80 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-wide flex items-center gap-2">
          <FaTruck className="text-blue-600" /> My Vehicles
        </h1>
        <button
          onClick={() => router.push("/owner/dashboard")}
          className="text-blue-600 font-medium hover:underline"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto mt-10 mb-12 px-6"
      >
        {loading ? (
          <p className="text-center text-gray-600 text-lg mt-10">Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20">
            <FaTruck className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-600 text-lg">No vehicles posted yet</h3>
            <button
              onClick={() => router.push("/owner/post-vehicle")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
            >
              + Post a Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-xl shadow-md border border-blue-100 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
                    <FaTruck /> {vehicle.vehicleNumber}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Type: {vehicle.vehicleType || "N/A"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Capacity: {vehicle.capacity || "N/A"} tons
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-2 mt-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    {vehicle.pickupLocation} → {vehicle.dropLocation}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                    <FaClock className="text-blue-500" />{" "}
                    {vehicle.availableDate || "—"}{" "}
                    {vehicle.availableTime ? `at ${vehicle.availableTime}` : ""}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      vehicle.status === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {vehicle.status || "unknown"}
                  </span>
                  <button
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() =>
                      alert(
                        `Vehicle: ${vehicle.vehicleNumber}\nPickup: ${vehicle.pickupLocation}\nDrop: ${vehicle.dropLocation}`
                      )
                    }
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-4 border-t mt-auto">
        © {new Date().getFullYear()} LinknRide. All rights reserved.
      </footer>
    </div>
  );
}
