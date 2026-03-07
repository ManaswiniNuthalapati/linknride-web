import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "next/router";
import Image from "next/image";

import { FiTruck, FiMapPin, FiPackage } from "react-icons/fi";

export default function SearchVehicles() {
  const router = useRouter();

  const [search, setSearch] = useState({ pickup: "", drop: "" });
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const [form, setForm] = useState({
    loadType: "",
    pickup: "",
    drop: "",
    date: "",
    time: "",
    price: "",
  });

  const handleChange = (e: any) =>
    setSearch({ ...search, [e.target.name]: e.target.value });

  const handleFormChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  const fetchAllVehicles = async () => {
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "vehicles"));

      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVehicles(results);
    } catch (err) {
      console.error("Error loading vehicles", err);
    }

    setLoading(false);
  };

  const handleSearch = async (e: any) => {
    e.preventDefault();

    if (!search.pickup && !search.drop) {
      fetchAllVehicles();
      return;
    }

    setLoading(true);

    try {
      const q = query(
        collection(db, "vehicles"),
        where("pickupLocation", "==", search.pickup),
        where("dropLocation", "==", search.drop)
      );

      const snapshot = await getDocs(q);

      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVehicles(results);
    } catch {
      alert("No vehicles found");
    }

    setLoading(false);
  };

  const openRequestForm = (vehicle: any) => {
    setSelectedVehicle(vehicle);

    setForm({
      loadType: "",
      pickup: vehicle.pickupLocation,
      drop: vehicle.dropLocation,
      date: "",
      time: "",
      price: "",
    });

    setShowModal(true);
  };

  const handleRequest = async (e: any) => {
    e.preventDefault();

    const uid = localStorage.getItem("linknride_uid");

    if (!uid || !selectedVehicle) {
      alert("User not logged in");
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        customerId: uid,
        ownerId: selectedVehicle.ownerId,
        vehicleId: selectedVehicle.id,
        vehicleType: selectedVehicle.vehicleType,
        ...form,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("✅ Request sent successfully!");

      setShowModal(false);

      setForm({
        loadType: "",
        pickup: "",
        drop: "",
        date: "",
        time: "",
        price: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
        <div
          onClick={() => router.push("/customer/dashboard")}
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
          onClick={() => router.push("/customer/dashboard")}
          className="px-5 py-2 border-2 border-[#F4B400] rounded-lg hover:bg-[#FFE8A3] transition"
        >
          Back
        </button>
      </header>

      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-14 flex justify-center"
      >
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-10 border">
          <h2 className="text-2xl font-bold text-center mb-8">
            Find the Best Vehicle for Your Load
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
            className="mt-10 w-full py-3 font-semibold rounded-xl bg-[#F4B400] text-black hover:bg-[#e0a800]"
          >
            Search Vehicles
          </button>
        </div>
      </motion.form>

      {loading && <p className="text-center mb-10">Loading vehicles...</p>}

      {!loading && vehicles.length === 0 && (
        <p className="text-center mb-10">No vehicles available</p>
      )}

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 mb-16">
        {vehicles.map((vehicle) => (
          <motion.div
            key={vehicle.id}
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-white rounded-2xl shadow-md p-14 border-2 border-gray-200 hover:border-[#F4B400] hover:shadow-xl transition"
          >
            <div className="flex items-center gap-3 text-xl font-semibold mb-5">
              <FiTruck className="text-[#F4B400] text-2xl" />
              {vehicle.vehicleType}
            </div>

            <p className="flex items-center gap-3 text-gray-600 mb-3">
              <FiMapPin className="text-[#F4B400] text-xl" />
              {vehicle.pickupLocation} → {vehicle.dropLocation}
            </p>

            <p className="flex items-center gap-3 text-gray-600 mb-10">
              <FiPackage className="text-[#F4B400] text-xl" />
              Capacity: {vehicle.capacity} tons
            </p>

            <button
              onClick={() => openRequestForm(vehicle)}
              className="w-full py-4 rounded-xl border-2 border-[#F4B400] font-semibold hover:bg-[#FFE8A3]"
            >
              Request Vehicle
            </button>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[420px] shadow-xl">
            <h2 className="text-xl font-bold mb-6">Request Vehicle</h2>

            <form onSubmit={handleRequest} className="space-y-4">
              <Input
                label="Load Type"
                name="loadType"
                value={form.loadType}
                onChange={handleFormChange}
              />

              <Input
                label="Pickup"
                name="pickup"
                value={form.pickup}
                onChange={handleFormChange}
              />

              <Input
                label="Drop"
                name="drop"
                value={form.drop}
                onChange={handleFormChange}
              />

              <Input
                label="Date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleFormChange}
              />

              <Input
                label="Time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleFormChange}
              />

              <Input
                label="Offered Price"
                name="price"
                value={form.price}
                onChange={handleFormChange}
              />

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border rounded-lg py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-[#F4B400] rounded-lg py-2 font-semibold"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
        © {new Date().getFullYear()}
        <span className="text-[#F4B400] font-semibold"> LinknRide</span>
      </footer>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }: any) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold mb-1">{label}</label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-[#F4B400] outline-none"
      />
    </div>
  );
}