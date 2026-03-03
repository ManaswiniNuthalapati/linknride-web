import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "next/router";
import { FaMapMarkerAlt, FaWeightHanging } from "react-icons/fa";
import Image from "next/image";

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

  const handleChange = (e:any) =>
    setSearch({ ...search, [e.target.name]: e.target.value });

  const handleFormChange = (e:any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* 🚀 LOAD ALL VEHICLES ON PAGE LOAD */
  useEffect(() => {
    fetchAllVehicles();
  }, []);

  const fetchAllVehicles = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "vehicles"));
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehicles(results);
    } catch (err) {
      console.error("Error loading vehicles", err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔍 SEARCH FILTER */
  const handleSearch = async (e:any) => {
    e.preventDefault();

    // If empty → show all vehicles again
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
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVehicles(results);
    } catch {
      alert("No vehicles found");
    } finally {
      setLoading(false);
    }
  };

  const openRequestForm = (vehicle:any) => {
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

  const handleRequest = async (e:any) => {
    e.preventDefault();
    const uid = localStorage.getItem("linknride_uid");
    if (!uid || !selectedVehicle) return;

    await addDoc(collection(db, "requests"), {
      customerId: uid,
      ownerId: selectedVehicle.ownerId,
      vehicleId: selectedVehicle.id,
      ...form,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("✅ Request sent successfully!");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">

      {/* HEADER */}
      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
        <div onClick={()=>router.push("/customer/dashboard")}
          className="flex items-center gap-3 cursor-pointer">
          <Image src="/logo.jpg" alt="logo" width={45} height={45} className="rounded-full"/>
          <h1 className="text-2xl font-extrabold">
            <span className="text-black">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-black">RIDE</span>
          </h1>
        </div>

        <button onClick={()=>router.push("/customer/dashboard")}
          className="text-[#F4B400] font-semibold">
          ← Back to Dashboard
        </button>
      </header>

      {/* SEARCH BOX */}
      <motion.form onSubmit={handleSearch}
        initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
        className="px-6 py-14 flex justify-center">

        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-center mb-8">
            Find the Best Vehicle for Your Load
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input name="pickup" label="Pickup Location" value={search.pickup} onChange={handleChange}/>
            <Input name="drop" label="Drop Location" value={search.drop} onChange={handleChange}/>
          </div>

          <button type="submit"
            className="mt-10 w-full py-3 font-semibold rounded-xl bg-[#F4B400] hover:bg-[#e0a800] text-black">
            Search Vehicles
          </button>
        </div>
      </motion.form>

      {/* LOADING / EMPTY */}
      {loading && <p className="text-center mb-10">Loading vehicles...</p>}
      {!loading && vehicles.length === 0 &&
        <p className="text-center mb-10">No vehicles available 🚚</p>
      }

      {/* VEHICLE CARDS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 mb-16">
        {vehicles.map(vehicle => (
          <motion.div key={vehicle.id} whileHover={{y:-6}}
            className="bg-white shadow-xl rounded-2xl p-8 border-2 border-gray-200 hover:border-[#F4B400]">

            <h3 className="text-xl font-semibold">🚚 {vehicle.vehicleType}</h3>

            <p className="mt-3 flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt className="text-[#F4B400]" />
              {vehicle.pickupLocation} → {vehicle.dropLocation}
            </p>

            <p className="mt-2 flex items-center gap-2 text-gray-600">
              <FaWeightHanging className="text-[#F4B400]" />
              Capacity: {vehicle.capacity} tons
            </p>

            <button onClick={()=>openRequestForm(vehicle)}
              className="mt-8 bg-[#F4B400] hover:bg-[#e0a800] text-black font-semibold py-3 rounded-xl w-full">
              Request Vehicle
            </button>
          </motion.div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
        © {new Date().getFullYear()} <span className="text-[#F4B400] font-semibold">LinknRide</span>
      </footer>
    </div>
  );
}

/* INPUT */
function Input({label,name,value,onChange,type="text"}:any){
  return(
    <div>
      {label && <label className="block text-sm font-semibold mb-1">{label}</label>}
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