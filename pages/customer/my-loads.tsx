import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function MyLoads() {
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLoads = async () => {
      const uid = localStorage.getItem("linknride_uid");
      if (!uid) {
        router.push("/login");
        return;
      }

      try {
        const q = query(
          collection(db, "loads"),
          where("customerId", "==", uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLoads(data);
      } catch (error) {
        console.error("Error fetching loads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-gray-800 flex flex-col">

      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-black">My Loads</h1>

        <button
          onClick={() => router.push("/customer/dashboard")}
          className="text-black font-semibold hover:underline"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto w-full p-6"
      >
        {loading ? (
          <p className="text-center text-gray-600">Loading your loads...</p>
        ) : loads.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p>You haven’t posted any loads yet.</p>
            <button
              onClick={() => router.push("/customer/post-load")}
              className="text-black font-semibold hover:underline mt-2"
            >
              Post Your First Load →
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {loads.map((load) => (
              <motion.div
  key={load.id}
  whileHover={{ y: -6 }}
  className="
    bg-white
    shadow-sm
    rounded-xl
    p-5
    border
    border-gray-200
    transition-all
    duration-300
    hover:border-yellow-400
    hover:shadow-[0_8px_30px_rgba(250,204,21,0.25)]
  "
>

                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900 tracking-wide">


                    {load.typeOfGoods || "Untitled Load"}
                  </h3>

                  {/* STATUS BADGE */}
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium ${
                      load.status === "open"
                        ? "bg-yellow-100 text-yellow-800"
                        : load.status === "ongoing"
                        ? "bg-gray-200 text-gray-800"
                        : load.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {load.status?.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-700 text-sm">
  <strong>Route:</strong> {load.pickup} → {load.drop}
  <br />
  <strong>Date:</strong>{" "}
{load.pickupDate && load.pickupTime
  ? `${load.pickupDate} ${load.pickupTime}`
  : "N/A"}<br />
  <strong>Capacity:</strong> {load.capacityRequired} tons
  <br />
  <strong>Vehicle:</strong>{" "}
  {load.preferredVehicle || load.vehicleType || "N/A"}
  <br />
  <strong>Price:</strong> ₹{load.price}
</p>
                <button
                  onClick={() => router.push(`/customer/load/${load.id}`)}
                  className="mt-4 text-sm text-black font-semibold hover:underline"
                >
                  View Details →
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <footer className="text-center text-gray-500 text-sm py-4 border-t mt-auto">
        © {new Date().getFullYear()} LinknRide. All rights reserved.
      </footer>
    </div>
  );
}
