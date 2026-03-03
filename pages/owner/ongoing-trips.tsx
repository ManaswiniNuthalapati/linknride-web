import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  FaRoute,
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaCheckCircle,
} from "react-icons/fa";
import Image from "next/image";

export default function OwnerOngoingTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Auth check
  useEffect(() => {
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) router.push("/login");
  }, [router]);

  // 🔄 Fetch Accepted Requests
  useEffect(() => {
    const ownerId = localStorage.getItem("linknride_uid");
    if (!ownerId) return;

    const q = query(
      collection(db, "requests"),
      where("ownerId", "==", ownerId),
      where("status", "==", "accepted")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const list: any[] = [];

      for (const docSnap of snap.docs) {
        const reqData = docSnap.data();

        // fetch load details
        const loadRef = doc(db, "loads", reqData.loadId);
        const loadSnap = await getDoc(loadRef);

        if (!loadSnap.exists()) continue;

        list.push({
          id: docSnap.id,
          ...reqData,
          load: loadSnap.data(),
        });
      }

      setTrips(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ✅ Mark trip completed
  const markCompleted = async (tripId: string) => {
    await updateDoc(doc(db, "requests", tripId), {
      status: "completed",
      completedAt: new Date(),
    });

    alert("Trip marked as completed 🎉");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">

      {/* HEADER */}
      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/owner/dashboard")}
        >
          <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="rounded-full"/>
          <h1 className="text-3xl font-extrabold tracking-wider">
            <span className="text-black">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-black">RIDE</span>
          </h1>
        </div>

        <button
          onClick={() => router.push("/owner/dashboard")}
          className="text-[#F4B400] font-semibold"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* CONTENT */}
      <div className="flex-grow px-10 py-10">
        <h2 className="text-2xl font-bold mb-8">Ongoing Trips</h2>

        {loading ? (
          <p className="text-center">Loading trips...</p>
        ) : trips.length === 0 ? (
          <p className="text-center text-gray-500">No ongoing trips</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#F4B400] shadow-sm hover:shadow-xl"
              >
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <FaRoute className="text-[#F4B400]" />
                  {trip.load.pickup} → {trip.load.drop}
                </h3>

                <p className="text-gray-700">
                  <FaCalendarAlt className="inline"/> {trip.load.pickupDate}
                  <FaClock className="inline ml-2"/> {trip.load.pickupTime}
                </p>

                <p className="text-gray-800 font-semibold mt-2">
                  <FaRupeeSign className="inline"/> {trip.finalPrice}
                </p>

                <button
                  onClick={() => markCompleted(trip.id)}
                  className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <FaCheckCircle /> Mark Trip Completed
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center text-sm py-4">
        © {new Date().getFullYear()} <span className="text-[#F4B400]">LinknRide</span>
      </footer>
    </div>
  );
}