import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaTruck, FaUserTie } from "react-icons/fa";

type DriverAvailability = {
  id: string;
  driverName: string;
  experience: string | number;
  location: string;
  vehicleType: string;
  isAvailable: boolean;
};

export default function HireDrivers() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<DriverAvailability[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔐 Auth check
  useEffect(() => {
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) router.push("/login");
  }, [router]);

  // 🔄 Fetch ALL available drivers immediately
  useEffect(() => {
    const ref = collection(db, "driverAvailability");
    const q = query(ref, where("isAvailable", "==", true));

    const unsub = onSnapshot(q, (snap) => {
      const list: DriverAvailability[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setDrivers(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔎 Filters (optional — only reduces list)
  const filteredDrivers = drivers.filter((d) => {
    const locationMatch = locationFilter
      ? d.location?.toLowerCase().includes(locationFilter.toLowerCase())
      : true;

    const vehicleMatch = vehicleFilter
      ? d.vehicleType?.toLowerCase().includes(vehicleFilter.toLowerCase())
      : true;

    return locationMatch && vehicleMatch;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">

      {/* HEADER */}
      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <span className="text-black">Hire Drivers</span>
        </h1>
        <button
          onClick={() => router.push("/owner/dashboard")}
          className="text-[#F4B400] font-semibold hover:underline"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* CONTENT */}
      <main className="flex-grow px-10 py-8">

        {/* FILTER BOX */}
        <div className="bg-white rounded-xl shadow p-6 mb-10 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by location"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F4B400]"
            />
            <input
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              placeholder="Filter by vehicle type"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F4B400]"
            />
          </div>
        </div>

        {/* DRIVER LIST */}
        {loading ? (
          <p className="text-center text-gray-500">Loading drivers...</p>
        ) : filteredDrivers.length === 0 ? (
          <p className="text-center text-gray-500">No drivers match your filters</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDrivers.map((driver) => (
              <motion.div
                key={driver.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#F4B400] transition shadow-sm hover:shadow-xl"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <FaUserTie className="text-[#F4B400]" />
                  {driver.driverName}
                </h3>

                <div className="text-sm space-y-3">

  <p className="flex items-center gap-2 text-gray-700 font-medium">
    <FaMapMarkerAlt className="text-[#F4B400]" />
    {driver.location}
  </p>

  <p className="flex items-center gap-2 text-gray-700 font-medium">
    <FaTruck className="text-[#F4B400]" />
    {driver.vehicleType}
  </p>

  <p className="text-gray-800 font-semibold">
    Experience: {driver.experience}
  </p>

</div>

                <button
                  onClick={() => alert("Driver request flow next 🚀")}
                  className="mt-6 w-full bg-[#F4B400] text-black py-2 rounded-lg font-semibold hover:bg-yellow-400"
                >
                  Request Driver
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
        © {new Date().getFullYear()} <span className="text-[#F4B400]">LinknRide</span>
      </footer>
    </div>
  );
}