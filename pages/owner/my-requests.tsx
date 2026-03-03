import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  orderBy,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

export default function OwnerMyRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [newPrice, setNewPrice] = useState("");

  // 🔄 Real-time fetch
  useEffect(() => {
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) return;

    const q = query(
      collection(db, "requests"),
      where("ownerId", "==", uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (reqSnap) => {
      const temp: any[] = [];

      for (const docSnap of reqSnap.docs) {
        const reqData = docSnap.data();
        let loadData = null;

        if (reqData.loadId) {
          const loadRef = doc(db, "loads", reqData.loadId);
          const loadSnap = await getDoc(loadRef);
          if (loadSnap.exists()) loadData = loadSnap.data();
        }

        if (!loadData?.pickup || !loadData?.drop) continue;

        temp.push({ id: docSnap.id, ...reqData, load: loadData });
      }

      setRequests(temp);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (id: string, finalPrice: number) => {
    await updateDoc(doc(db, "requests", id), {
      status: "accepted",
      finalPrice,
      lastAction: "owner",
      updatedAt: new Date(),
    });
    alert("Bid Accepted");
  };

  const handleReject = async (id: string) => {
    await updateDoc(doc(db, "requests", id), {
      status: "rejected",
      lastAction: "owner",
      updatedAt: new Date(),
    });
    alert("Bid Rejected");
  };

  const openCounter = (req: any) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const submitCounter = async () => {
    if (!selectedRequest || !newPrice) return;

    await updateDoc(doc(db, "requests", selectedRequest.id), {
      bids: arrayUnion({
        by: "owner",
        amount: Number(newPrice),
        at: new Date(),
      }),
      status: "pending",
      lastAction: "owner",
      updatedAt: new Date(),
    });

    alert("New price sent!");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">

      {/* HEADER */}
      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
        <div onClick={()=>router.push("/owner/dashboard")} className="flex items-center gap-3 cursor-pointer">
          <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="rounded-full"/>
          <h1 className="text-3xl font-extrabold tracking-wider">
            <span className="text-black">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-black">RIDE</span>
          </h1>
        </div>

        <button onClick={()=>router.push("/owner/dashboard")} className="text-[#F4B400] font-semibold hover:underline">
          ← Back to Dashboard
        </button>
      </header>

      {/* CONTENT */}
      <motion.section className="flex-grow px-10 py-10">
        <h2 className="text-2xl font-bold text-center mb-10">
          My Requests / Bids
        </h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-600">No requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map((r) => {
              const lastBid = r.bids?.[r.bids.length - 1];

              return (
                <motion.div
                  key={r.id}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#F4B400] transition shadow-sm hover:shadow-xl"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold">
                      {r.load.pickup} → {r.load.drop}
                    </h3>

                    <span className={`px-3 py-1 text-xs rounded-full font-semibold
                      ${r.status==="accepted"?"bg-green-100 text-green-700":
                        r.status==="rejected"?"bg-red-100 text-red-700":
                        "bg-yellow-100 text-yellow-700"}`}>
                      {r.status?.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm mt-3">
                    {r.bids?.map((bid:any,i:number)=>(
                      <div key={i} className={`font-semibold ${bid.by==="owner"?"text-black":"text-[#F4B400]"}`}>
                        {bid.by==="owner"?"You":"Customer"} Bid: ₹ {bid.amount}
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    Sent: {r.createdAt?.seconds ? new Date(r.createdAt.seconds*1000).toLocaleString() : "—"}
                  </p>

                  {r.status==="pending" && r.lastAction==="customer" && (
                    <div className="flex gap-3 mt-4">
                      <button onClick={()=>handleAccept(r.id,lastBid.amount)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                        Accept
                      </button>

                      <button onClick={()=>handleReject(r.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                        Reject
                      </button>

                      <button onClick={()=>openCounter(r)}
                        className="bg-[#F4B400] text-black px-4 py-2 rounded-lg text-sm font-semibold">
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
              <h3 className="text-lg font-semibold mb-4">Enter New Price</h3>

              <input
                type="number"
                value={newPrice}
                onChange={(e)=>setNewPrice(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4 focus:border-[#F4B400] focus:outline-none"
              />

              <div className="flex justify-end gap-3">
                <button onClick={()=>setShowModal(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button onClick={submitCounter} className="px-4 py-2 bg-[#F4B400] text-black rounded-lg font-semibold">
                  Send Bid
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
        © {new Date().getFullYear()} <span className="text-[#F4B400]">LinknRide</span>
      </footer>
    </div>
  );
}