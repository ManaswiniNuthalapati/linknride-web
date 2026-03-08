import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  FaHome,
  FaUser,
  FaLifeRing,
  FaSignOutAlt,
  FaUserCircle,
  FaBars
} from "react-icons/fa";
import Image from "next/image";
import { db } from "../../firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

type Driver = {
  fullName?: string;
  preferredVehicle?: string;
  city?: string;
  isAvailable?: boolean;
};

export default function DriverDashboard() {

  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // ⭐ SIDEBAR STATE
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // FETCH DRIVER PROFILE
  useEffect(() => {

    const uid = localStorage.getItem("linknride_uid");

    if (!uid) {
      router.push("/login");
      return;
    }

    const fetchDriver = async () => {

      try {

        const snap = await getDoc(doc(db, "drivers", uid));

        if (snap.exists()) {
          setDriver(snap.data() as Driver);
        } else {
          router.push("/onboard/driver");
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

    };

    fetchDriver();

  }, [router]);

  // POST AVAILABILITY
  const postAvailability = async () => {

    const uid = localStorage.getItem("linknride_uid");
    if (!uid) return;

    try {

      setPosting(true);

      const driverRef = doc(db, "drivers", uid);
      const snap = await getDoc(driverRef);

      if (!snap.exists()) {
        alert("Driver profile not found");
        return;
      }

      const driverData = snap.data();

      await updateDoc(driverRef, { isAvailable: true });

      await addDoc(collection(db, "driverAvailability"), {
        driverId: uid,
        driverName: driverData.fullName,
        location: driverData.city,
        vehicleType: driverData.preferredVehicle || "Truck",
        isAvailable: true,
        createdAt: serverTimestamp(),
      });

      alert("✅ Owners can now see you!");

      setDriver((d) => (d ? { ...d, isAvailable: true } : d));

    } catch (e) {

      console.error(e);
      alert("❌ Failed to post availability");

    } finally {
      setPosting(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        Loading...
      </div>
    );

  const firstName = driver?.fullName?.split(" ")[0] || "Driver";

  return (

<div className="min-h-screen flex bg-[#FAFAFA] text-black">

{/* OVERLAY */}

{sidebarOpen && (
<div
onClick={() => setSidebarOpen(false)}
className="fixed inset-0 bg-black/40 z-40"
/>
)}

{/* SIDEBAR */}

<aside
className={`fixed top-0 left-0 h-full w-64 bg-[#0B0B0B] text-white flex flex-col justify-between py-6 px-4 transform transition-transform duration-300 z-50
${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
`}
>

<div>

<div className="mb-10 flex items-center gap-2">

<Image
src="/logo.jpg"
alt="logo"
width={36}
height={36}
className="rounded-full"
/>

<h2 className="text-xl font-extrabold tracking-wide">
<span className="text-white">LINK</span>
<span className="text-[#F4B400]">N</span>
<span className="text-white">RIDE</span>
</h2>

</div>
<nav className="flex flex-col gap-2 text-sm">

<button
className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#F4B400] text-black font-semibold"
>
<FaHome /> Dashboard
</button>

<button
onClick={() => router.push("/driver/profile")}
className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F4B400]/20 hover:text-[#F4B400]"
>
<FaUser /> Profile
</button>

<button
onClick={() => router.push("/driver/support")}
className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F4B400]/20 hover:text-[#F4B400]"
>
<FaLifeRing /> Help & Support
</button>

</nav>

</div>

<button
onClick={logout}
className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20"
>
<FaSignOutAlt /> Logout
</button>

</aside>


{/* MAIN AREA */}

<div className="flex-1 flex flex-col">

{/* HEADER */}

<header className="bg-white border-b px-10 py-4 flex justify-between items-center">

{/* LEFT SIDE */}

<div className="flex items-center gap-4">

<button
onClick={() => setSidebarOpen(!sidebarOpen)}
className="text-2xl"
>
<FaBars />
</button>

<Image
src="/logo.jpg"
alt="logo"
width={40}
height={40}
className="rounded-full"
/>

<h1 className="text-2xl font-semibold">
Welcome Back, {firstName}
</h1>

</div>


{/* RIGHT SIDE PROFILE */}

<div className="flex items-center gap-3">

<span className="text-gray-700 font-medium">
</span>

<button
onClick={() => router.push("/driver/profile")}
className="w-10 h-10 bg-[#F4B400] rounded-full flex items-center justify-center font-bold text-black"
>

{firstName.charAt(0).toUpperCase()}

</button>


{/* DROPDOWN */}

{menuOpen && (

<div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">

<button
onClick={() => router.push("/driver/profile")}
className="block w-full text-left px-4 py-2 hover:bg-[#FFF3CC]"
>
View Profile
</button>

<button
onClick={() => router.push("/driver/edit-profile")}
className="block w-full text-left px-4 py-2 hover:bg-[#FFF3CC]"
>
Edit Profile
</button>

<button
onClick={logout}
className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
>
Logout
</button>

</div>

)}

</div>

</header>

{/* CONTENT */}

<motion.section
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
className="flex-grow flex flex-col items-center justify-center text-center"
>

<h2 className="text-3xl font-bold mb-3">
Driver Dashboard
</h2>

<p className="text-gray-600 mb-8">
Post your availability so owners can hire you
</p>
<button
onClick={postAvailability}
disabled={posting}
className={`px-10 py-4 rounded-xl font-bold text-lg transition ${
posting
? "bg-[#ccc]"
: "bg-[#F4B400] hover:bg-[#e0a800] text-black"
}`}
>

{posting ? "Posting..." : "Post Availability"}

</button>

</motion.section>


<footer className="bg-[#0B0B0B] text-white text-center py-4">
© {new Date().getFullYear()}
<span className="text-[#F4B400]"> LinknRide</span>
</footer>

</div>

</div>

  );
}