import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { useRouter } from "next/router";
import Image from "next/image";

import {
  FiTruck,
  FiMapPin,
  FiPackage,
  FiCalendar,
  FiClock,
} from "react-icons/fi";

type LoadItem = {
  id: string;
  pickup?: string;
  drop?: string;
  pickupDate?: string;
  pickupTime?: string;
  capacityRequired?: number;
  price?: number;
  customerId?: string;
  typeOfGoods?: string;
};

export default function OwnerSearchLoads() {
  const router = useRouter();

  const [search, setSearch] = useState({ pickup: "", drop: "" });
  const [loads, setLoads] = useState<LoadItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) router.push("/login");
  }, [router]);

  /* FETCH LOADS */

  useEffect(() => {
    setLoading(true);

    const loadsRef = collection(db, "loads");

    let q: any = query(loadsRef, orderBy("createdAt", "desc"));

    if (search.pickup && search.drop) {
      q = query(
        loadsRef,
        where("pickup", "==", search.pickup),
        where("drop", "==", search.drop),
        orderBy("createdAt", "desc")
      );
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
  }, [search]);

  const handleChange = (e: any) =>
    setSearch({ ...search, [e.target.name]: e.target.value });

  const handleSearch = (e: any) => {
    e.preventDefault();
  };

  /* ACCEPT LOAD */

  const handleAcceptLoad = async (load: LoadItem) => {
    try {
      const ownerId = localStorage.getItem("linknride_uid");
      if (!ownerId) return;

      const existingQuery = query(
        collection(db, "requests"),
        where("loadId", "==", load.id),
        where("ownerId", "==", ownerId)
      );

      const snap = await getDocs(existingQuery);

      if (!snap.empty) {
        const requestId = snap.docs[0].id;

        await updateDoc(doc(db, "requests", requestId), {
          status: "accepted",
          finalPrice: load.price || 0,
          lastAction: "owner",
          updatedAt: serverTimestamp(),
        });

        router.push("/owner/my-requests");
        return;
      }

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

      router.push("/owner/my-requests");
    } catch (err) {
      console.error(err);
      alert("Error accepting load");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">

      {/* HEADER */}

      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">

        <div
          onClick={() => router.push("/owner/dashboard")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Image
            src="/logo.jpg"
            alt="logo"
            width={45}
            height={45}
            className="rounded-full"
          />

          <h1 className="text-2xl font-extrabold">
            <span className="text-black">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-black">RIDE</span>
          </h1>
        </div>

        <button
          onClick={() => router.push("/owner/dashboard")}
          className="px-5 py-2 border-2 border-[#F4B400] rounded-lg hover:bg-[#FFE8A3]"
        >
          Back
        </button>

      </header>


      {/* SEARCH */}

      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-14 flex justify-center"
      >

        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-10 border">

          <h2 className="text-2xl font-bold text-center mb-8">
            Search Loads
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <Input
              name="pickup"
              label="Pickup Location"
              value={search.pickup}
              onChange={handleChange}
            />

            <Input
              name="drop"
              label="Drop Location"
              value={search.drop}
              onChange={handleChange}
            />

          </div>

          <button
            type="submit"
            className="mt-10 w-full py-3 font-semibold rounded-xl
            bg-[#F4B400] text-black hover:bg-[#e0a800]"
          >
            Search Loads
          </button>

        </div>

      </motion.form>


      {/* LOADING */}

      {loading && (
        <p className="text-center mb-10">
          Loading loads...
        </p>
      )}

      {!loading && loads.length === 0 && (
        <p className="text-center mb-10">
          No loads available
        </p>
      )}


      {/* LOAD CARDS */}

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 mb-16">

        {loads.map((load) => (

          <motion.div
            key={load.id}
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-white rounded-2xl shadow-md p-14 border-2 border-gray-200
            hover:border-[#F4B400] hover:shadow-xl transition"
          >

            {/* GOODS */}

            <div className="flex items-center gap-3 text-xl font-semibold mb-5">

              <FiTruck className="text-[#F4B400] text-2xl" />

              {load.typeOfGoods}

            </div>


            {/* ROUTE */}

            <p className="flex items-center gap-3 text-gray-600 mb-3">

              <FiMapPin className="text-[#F4B400] text-xl" />

              {load.pickup} → {load.drop}

            </p>


            {/* DATE */}

            <p className="flex items-center gap-3 text-gray-600 mb-3">

              <FiCalendar className="text-[#F4B400]" />

              {load.pickupDate}

              <FiClock className="ml-3 text-[#F4B400]" />

              {load.pickupTime}

            </p>


            {/* CAPACITY */}

            <p className="flex items-center gap-3 text-gray-600 mb-6">

              <FiPackage className="text-[#F4B400] text-xl" />

              Capacity: {load.capacityRequired} tons

            </p>


            {/* PRICE */}

            <p className="text-lg font-semibold mb-8">

              ₹ {load.price}

            </p>


            <button
              onClick={() => handleAcceptLoad(load)}
              className="w-full py-4 rounded-xl border-2 border-[#F4B400]
              font-semibold hover:bg-[#FFE8A3] transition"
            >
              Accept Load
            </button>

          </motion.div>

        ))}

      </div>


      {/* FOOTER */}

      <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">

        © {new Date().getFullYear()}{" "}
        <span className="text-[#F4B400] font-semibold">
          LinknRide
        </span>

      </footer>

    </div>
  );
}


/* INPUT COMPONENT */

function Input({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div>

      {label && (
        <label className="block text-sm font-semibold mb-1">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2
        focus:border-[#F4B400] outline-none"
      />

    </div>
  );
}