import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  FaRoute,
  FaCalendarAlt,
  FaClock,
  FaWeightHanging,
  FaRupeeSign,
  FaBoxOpen,
} from "react-icons/fa";
import Image from "next/image";

type LoadItem = {
  id: string;
  pickup?: string;
  drop?: string;
  pickupDate?: string;
  pickupTime?: string;
  capacityRequired?: string | number;
  price?: number | null;
  customerId?: string;
  typeOfGoods?: string;
};

export default function OwnerSearchLoads() {
  const router = useRouter();

  const [pickupInput, setPickupInput] = useState("");
  const [dropInput, setDropInput] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [loads, setLoads] = useState<LoadItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Auth check
  useEffect(() => {
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) router.push("/login");
  }, [router]);

  // 🔄 Fetch Loads from Firestore
  useEffect(() => {
    setLoading(true);
    const loadsRef = collection(db, "loads");

    let q: any = query(loadsRef, orderBy("createdAt", "desc"));

    if (pickup && drop) {
      q = query(
        loadsRef,
        where("pickup", "==", pickup),
        where("drop", "==", drop),
        orderBy("createdAt", "desc")
      );
    } else if (pickup) {
      q = query(loadsRef, where("pickup", "==", pickup), orderBy("createdAt", "desc"));
    } else if (drop) {
      q = query(loadsRef, where("drop", "==", drop), orderBy("createdAt", "desc"));
    }

    const unsub = onSnapshot(q, (snap) => {
      const items: LoadItem[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));
      setLoads(items);
      setLoading(false);
    });

    return () => unsub();
  }, [pickup, drop]);

  const handleSearch = () => {
    setPickup(pickupInput.trim());
    setDrop(dropInput.trim());
  };

  // ⭐⭐⭐ FIXED ACCEPT LOAD FUNCTION ⭐⭐⭐
  const handleAcceptLoad = async (load: LoadItem) => {
    try {
      const ownerId = localStorage.getItem("linknride_uid");
      if (!ownerId) return;

      // 1️⃣ Check if request already exists
      const existingQuery = query(
        collection(db, "requests"),
        where("loadId", "==", load.id),
        where("ownerId", "==", ownerId)
      );

      const snap = await getDocs(existingQuery);

      // 2️⃣ If exists → UPDATE (no duplicates)
      if (!snap.empty) {
        const requestId = snap.docs[0].id;

        await updateDoc(doc(db, "requests", requestId), {
          status: "accepted",
          finalPrice: load.price || 0,
          lastAction: "owner",
          updatedAt: serverTimestamp(),
        });

        alert("✅ Load accepted!");
        router.push("/owner/my-requests");
        return;
      }

      // 3️⃣ If not exists → create new request
      await addDoc(collection(db, "requests"), {
        loadId: load.id,
        customerId: load.customerId,
        ownerId: ownerId,
        status: "accepted",
        finalPrice: load.price || 0,
        lastAction: "owner",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      alert("✅ Load accepted!");
      router.push("/owner/my-requests");

    } catch (err) {
      console.error(err);
      alert("Error accepting load");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">

      {/* HEADER */}
      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={()=>router.push("/owner/dashboard")}>
          <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="rounded-full"/>
          <h1 className="text-3xl font-extrabold tracking-wider">
            <span className="text-black">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-black">RIDE</span>
          </h1>
        </div>

        <button onClick={()=>router.push("/owner/dashboard")} className="text-[#F4B400] font-semibold">
          ← Back to Dashboard
        </button>
      </header>

      {/* CONTENT */}
      <motion.section className="flex-grow px-10 py-10">
        <h2 className="text-2xl font-bold mb-6">Search Loads</h2>

        {/* SEARCH BAR */}
        <div className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={pickupInput} onChange={(e)=>setPickupInput(e.target.value)} placeholder="Pickup Location" className="border rounded px-3 py-2"/>
          <input value={dropInput} onChange={(e)=>setDropInput(e.target.value)} placeholder="Drop Location" className="border rounded px-3 py-2"/>
          <button onClick={handleSearch} className="bg-[#F4B400] text-black rounded px-4 py-2 font-semibold">
            Search
          </button>
        </div>

        {/* LOAD CARDS */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : loads.length === 0 ? (
          <p className="text-center text-gray-500">No loads found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loads.map((l) => (
              <motion.div key={l.id} whileHover={{y:-6}}
                className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#F4B400] transition shadow-sm hover:shadow-xl">

                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <FaBoxOpen className="text-[#F4B400]" /> {l.typeOfGoods}
                </h3>

                <p className="text-gray-700"><FaRoute className="inline"/> {l.pickup} → {l.drop}</p>
                <p className="text-gray-700"><FaCalendarAlt className="inline"/> {l.pickupDate} <FaClock className="inline ml-2"/> {l.pickupTime}</p>
                <p className="text-gray-700"><FaWeightHanging className="inline"/> {l.capacityRequired} tons</p>
                <p className="text-gray-900 font-bold"><FaRupeeSign className="inline"/> {l.price}</p>

                <button
                  onClick={()=>handleAcceptLoad(l)}
                  className="mt-4 bg-[#F4B400] text-black py-2 rounded-lg font-semibold hover:bg-[#e0a800] w-full"
                >
                  Accept Load
                </button>

              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      <footer className="bg-black text-white text-center text-sm py-4">
        © {new Date().getFullYear()} <span className="text-[#F4B400]">LinknRide</span>
      </footer>
    </div>
  );
}