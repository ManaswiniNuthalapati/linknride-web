import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaTruck, FaUserTie, FaSearch } from "react-icons/fa";

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

  /* AUTH CHECK */

  useEffect(() => {
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) router.push("/login");
  }, [router]);

  /* FETCH DRIVERS */

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

  /* FILTER */

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

<header className="bg-white border-b px-12 py-5 flex justify-between items-center">

<h1
onClick={() => router.push("/owner/dashboard")}
className="text-2xl font-bold text-black cursor-pointer"
>
Hire Drivers
</h1>

<button
onClick={()=>router.push("/owner/dashboard")}
className="text-[#F4B400] font-semibold hover:underline"
>
← Back
</button>

</header>


{/* CONTENT */}

<main className="flex-grow px-12 py-10 max-w-7xl mx-auto w-full">

{/* SEARCH PANEL */}

<div className="bg-white rounded-2xl shadow-md border p-6 mb-10">

<h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
<FaSearch className="text-[#F4B400]" />
Search Drivers
</h2>

<div className="grid md:grid-cols-2 gap-5">

<input
value={locationFilter}
onChange={(e)=>setLocationFilter(e.target.value)}
placeholder="Search by location (Hyderabad, Vijayawada...)"
className="border rounded-lg px-4 py-3 focus:outline-none focus:border-[#F4B400]"
/>

<input
value={vehicleFilter}
onChange={(e)=>setVehicleFilter(e.target.value)}
placeholder="Search by vehicle type (Truck, Tempo...)"
className="border rounded-lg px-4 py-3 focus:outline-none focus:border-[#F4B400]"
/>

</div>

</div>


{/* DRIVER LIST */}

{loading ? (

<p className="text-center text-gray-500">Loading drivers...</p>

) : filteredDrivers.length === 0 ? (

<p className="text-center text-gray-500">No drivers match your filters</p>

) : (

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

{filteredDrivers.map((driver) => (

<motion.div
key={driver.id}
whileHover={{ y:-6 }}
className="bg-white rounded-2xl p-7 border border-gray-200 hover:border-[#F4B400] transition shadow-sm hover:shadow-lg"
>

{/* DRIVER NAME */}

<h3 className="text-lg font-semibold flex items-center gap-2 mb-4">

<FaUserTie className="text-[#F4B400]" />

{driver.driverName}

</h3>


{/* DRIVER DETAILS */}

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


{/* REQUEST BUTTON */}

<button
onClick={()=>alert("Driver request flow next 🚀")}
className="mt-6 w-full border-2 border-[#F4B400] bg-white text-black py-2 rounded-lg font-semibold hover:bg-[#EAD7A1] transition duration-200"
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