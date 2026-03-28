import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { motion } from "framer-motion";

export default function LoadDetails() {
  const router = useRouter();
  const { loadId } = router.query;

  const [load, setLoad] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loadId) return;

    const fetchLoad = async () => {
      try {
        const ref = doc(db, "loads", loadId as string);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("Load not found");
          router.push("/customer/my-loads");
          return;
        }

        setLoad({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error(err);
        alert("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchLoad();
  }, [loadId, router]);

  const handleCancel = async () => {
    if (!confirm("Cancel this load?")) return;

    await updateDoc(doc(db, "loads", load.id), {
      status: "cancelled",
    });

    alert("Load cancelled");
    router.push("/customer/my-loads");
  };

  const handleRepost = () => {
    router.push(`/customer/post-load?repost=${load.id}`);
  };

  if (loading) {
    return <p className="text-center mt-20">Loading details...</p>;
  }

  return (
  <div className="min-h-screen bg-[#F5F6F8] flex flex-col">

    {/* HEADER */}
    <div className="flex justify-between items-center px-8 py-5 border-b bg-white">
      <h1 className="text-2xl font-bold text-black">Load Details</h1>

      <button
        onClick={() => router.push("/customer/my-loads")}
        className="text-gray-700 font-medium hover:underline"
      >
        ← Back to My Loads
      </button>
    </div>

    {/* CONTENT */}
    <div className="flex flex-1 items-center justify-center px-4">

      {load ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-xl"
        >

          {/* STATUS */}
          <span
            className={`inline-block mb-5 px-3 py-1 rounded-full text-sm font-medium ${
              load.status === "open"
                ? "bg-yellow-100 text-yellow-800"
                : load.status === "ongoing"
                ? "bg-blue-100 text-blue-800"
                : load.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {load.status?.toUpperCase()}
          </span>

          {/* DETAILS */}
          <div className="space-y-3 text-gray-800 text-[15px]">
            <p><strong>Goods:</strong> {load.typeOfGoods}</p>
            <p><strong>Pickup:</strong> {load.pickup}</p>
            <p><strong>Drop:</strong> {load.drop}</p>

            <p>
              <strong>Date & Time:</strong>{" "}
              {load.pickupDate && load.pickupTime
                ? `${load.pickupDate} ${load.pickupTime}`
                : "N/A"}
            </p>

            <p><strong>Capacity:</strong> {load.capacityRequired} tons</p>

            <p>
              <strong>Preferred Vehicle:</strong>{" "}
              {load.preferredVehicle || load.vehicleType || "N/A"}
            </p>

            <p><strong>Price:</strong> ₹{load.price}</p>
          </div>

          {/* DRIVER INFO */}
          {(load.status === "ongoing" || load.status === "completed") && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold mb-2">Assigned Driver</h3>
              <p><strong>Name:</strong> {load.driverName || "—"}</p>
              <p><strong>Vehicle:</strong> {load.vehicleType || "—"}</p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-6 flex gap-3">

            {load.status === "open" && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Cancel Load
              </button>
            )}

            {(load.status === "completed" || load.status === "cancelled") && (
              <button
                onClick={handleRepost}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Repost Load
              </button>
            )}

          </div>

        </motion.div>
      ) : (
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No load found</p>
        </div>
      )}

    </div>

    {/* FOOTER */}
    <footer className="text-center text-gray-500 text-sm py-4 border-t">
      © {new Date().getFullYear()} LinknRide. All rights reserved.
    </footer>

  </div>
);
}
