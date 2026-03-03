import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import {
  FiTruck, FiMapPin, FiUser, FiBox, FiArrowRight
} from "react-icons/fi";

export default function OngoingTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      const uid = localStorage.getItem("linknride_uid");
      if (!uid) {
        router.push("/login");
        return;
      }

      try {
        const q = query(
          collection(db, "loads"),
          where("customerId", "==", uid),
          where("status", "==", "ongoing")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTrips(data);
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-gray-800 flex flex-col">

      {/* HEADER */}
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">
          Ongoing Trips
        </h1>

        <button
          onClick={() => router.push("/customer/dashboard")}
          className="text-sm font-semibold text-black hover:underline"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto w-full p-8"
      >
        {loading ? (
          <p className="text-center text-gray-500">Loading ongoing trips…</p>
        ) : trips.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-lg font-medium">You have no ongoing trips right now</p>
            <p className="text-sm text-gray-500 mt-2">
              Your active trips will appear here once a driver is assigned.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ y: -6 }}
                className="
                  bg-white
                  rounded-xl
                  shadow-sm
                  border border-gray-200
                  p-6
                  transition-all
                  hover:border-yellow-400
                  hover:shadow-[0_8px_30px_rgba(250,204,21,0.25)]
                "
              >
                {/* TOP */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FiBox />
                    {trip.typeOfGoods || "Goods"}
                  </h3>

                  <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-800 font-medium">
                    In Transit
                  </span>
                </div>

                {/* DETAILS */}
                <div className="text-sm text-gray-700 space-y-2">
                  <p className="flex items-center gap-2">
                    <FiMapPin /> {trip.pickup} <FiArrowRight /> {trip.drop}
                  </p>

                  <p className="flex items-center gap-2">
                    <FiUser /> Driver: {trip.driverName || "Assigned"}
                  </p>

                  <p className="flex items-center gap-2">
                    <FiTruck /> Vehicle: {trip.vehicleType || "—"}
                  </p>
                </div>

                <button
                  onClick={() => router.push(`/customer/load/${trip.id}`)}
                  className="mt-5 text-sm font-semibold text-black hover:text-yellow-600 transition"
                >
                  View Details →
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* FOOTER */}
      <footer className="bg-white border-t text-center text-gray-500 text-sm py-4 mt-auto">
        © {new Date().getFullYear()} LinknRide. All rights reserved.
      </footer>
    </div>
  );
}
