import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection, query, where, getDoc, doc,
  orderBy, updateDoc, arrayUnion, onSnapshot
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaClock, FaRupeeSign } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";

export default function CustomerMyRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) return;

    const q = query(
      collection(db, "requests"),
      where("customerId", "==", uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, async (reqSnap) => {
      const temp: any[] = [];
      for (const docSnap of reqSnap.docs) {
        const reqData = docSnap.data();
        let loadData = null;

        if (reqData.loadId) {
          const loadSnap = await getDoc(doc(db, "loads", reqData.loadId));
          if (loadSnap.exists()) loadData = loadSnap.data();
        }
        if (!loadData?.pickup || !loadData?.drop) continue;

        temp.push({
          id: docSnap.id,
          ...reqData,
          bids: reqData.bids || [],
          load: loadData,
        });
      }

      setRequests(temp);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleAccept = async (id: string, finalPrice: number) => {
    await updateDoc(doc(db, "requests", id), {
      status: "accepted",
      finalPrice,
      lastAction: "customer",
      updatedAt: new Date(),
    });
    alert("Bid Accepted");
    window.location.reload();
  };

  const handleReject = async (id: string) => {
    await updateDoc(doc(db, "requests", id), {
      status: "rejected",
      lastAction: "customer",
      updatedAt: new Date(),
    });
    alert("Bid Rejected");
    window.location.reload();
  };

  const openCounter = (req: any) => {
    setSelectedRequest(req);
    setNewPrice("");
    setShowModal(true);
  };

  const submitCounter = async () => {
    if (!selectedRequest || !newPrice) return;
    await updateDoc(doc(db, "requests", selectedRequest.id), {
      bids: arrayUnion({ by: "customer", amount: Number(newPrice), at: new Date() }),
      status: "pending",
      lastAction: "customer",
      updatedAt: new Date(),
    });
    alert("New price sent to owner!");
    setShowModal(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6F8]">

      {/* HEADER */}
      <header className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=>router.push("/customer/dashboard")}>
          <Image src="/logo.jpg" alt="Logo" width={36} height={36} className="rounded-full"/>
          <h1 className="text-2xl font-bold text-black">LinknRide</h1>
        </div>

        <button onClick={()=>router.push("/customer/dashboard")}
          className="text-sm text-black font-semibold hover:underline">
          ← Back to Dashboard
        </button>
      </header>

      {/* CONTENT */}
      <motion.section className="flex-grow px-10 py-10">
        <h2 className="text-2xl font-bold text-black mb-8 text-center">
          My Requests / Bids
        </h2>

        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">No requests found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((r) => {
              const lastBid = r.bids?.length ? r.bids[r.bids.length - 1] : null;

              return (
                <motion.div key={r.id} whileHover={{y:-6}}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:border-yellow-400 hover:shadow-[0_8px_30px_rgba(250,204,21,0.25)]">

                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {r.load.pickup} → {r.load.drop}
                    </h3>

                    <span className={`px-3 py-1 text-xs rounded-full font-semibold
                      ${r.status==="accepted"?"bg-green-100 text-green-700":
                        r.status==="rejected"?"bg-red-100 text-red-700":
                        "bg-yellow-100 text-yellow-700"}`}>
                      {r.status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-2">
                    <div><FaCalendarAlt className="inline mr-2"/> {r.load.pickupDate || "—"}</div>
                    <div><FaClock className="inline mr-2"/> {r.load.pickupTime || "—"}</div>
                    <div><FaRupeeSign className="inline mr-2"/> Initial Price: ₹ {r.load.price}</div>
                  </div>

                  {/* BID HISTORY */}
                  <div className="mt-3 space-y-1 text-sm">
                    {r.bids?.map((bid:any,i:number)=>(
                      <div key={i} className={`font-semibold ${bid.by==="customer"?"text-black":"text-green-600"}`}>
                        {bid.by==="customer"?"You":"Owner"} Bid: ₹ {bid.amount}
                      </div>
                    ))}
                  </div>

                  {/* ACTION BUTTONS */}
                  {r.status==="pending" && r.lastAction==="owner" && (
                    <div className="flex gap-3 mt-4">
                      <button onClick={()=>lastBid && handleAccept(r.id,lastBid.amount)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                        Accept
                      </button>
                      <button onClick={()=>handleReject(r.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                        Reject
                      </button>
                      <button onClick={()=>openCounter(r)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm">
                        Bid Again
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Enter New Price</h3>
              <input type="number" placeholder="Enter your price"
                value={newPrice} onChange={(e)=>setNewPrice(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4"/>
              <div className="flex justify-end gap-3">
                <button onClick={()=>setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                <button onClick={submitCounter}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg">
                  Send Bid
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t text-center text-gray-500 text-sm py-4">
        © {new Date().getFullYear()} LinknRide. All rights reserved.
      </footer>
    </div>
  );
}
