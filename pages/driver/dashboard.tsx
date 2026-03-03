import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaHome, FaUser, FaLifeRing, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
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

  // 🔹 FETCH DRIVER PROFILE
  useEffect(() => {
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) {
      router.push("/login");
      return;
    }

    const fetchDriver = async () => {
      try {
        const snap = await getDoc(doc(db, "drivers", uid));
        if (snap.exists()) setDriver(snap.data() as Driver);
        else router.push("/onboard/driver");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [router]);

  // 🔹 POST AVAILABILITY
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

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0B0B0B] text-white flex flex-col justify-between py-6 px-4">

        <div>
          <h2 className="text-xl font-bold text-[#F4B400] mb-10">Driver Panel</h2>

          <nav className="flex flex-col gap-2 text-sm">
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#F4B400] text-black font-semibold">
              <FaHome /> Dashboard
            </button>

            <button
              onClick={() => router.push("/driver/profile")}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F4B400]/20 hover:text-[#F4B400]"
            >
              <FaUser /> Profile
            </button>

            {/* ✅ FIXED ROUTE HERE */}
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

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="logo" width={45} height={45} className="rounded-full"/>
            <h1 className="text-2xl font-extrabold">
              <span className="text-black">LINK</span>
              <span className="text-[#F4B400]">N</span>
              <span className="text-black">RIDE</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 font-semibold">
            <FaUserCircle className="text-3xl text-[#F4B400]" />
            Hi, {firstName}
          </div>
        </header>

        {/* CONTENT */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-grow flex flex-col items-center justify-center text-center"
        >
          <h2 className="text-3xl font-bold mb-10">
            Welcome Back, {firstName} 👋
          </h2>

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

        {/* FOOTER */}
        <footer className="bg-[#0B0B0B] text-white text-center py-4">
          © {new Date().getFullYear()} <span className="text-[#F4B400]">LinknRide</span>
        </footer>
      </div>
    </div>
  );
}