// web/pages/owner/profile.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FaTruck, FaArrowLeft, FaUser, FaEdit } from "react-icons/fa";

export default function OwnerProfile() {

  const router = useRouter();
  const [ownerData, setOwnerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchOwnerData = async () => {

      try {

        const uid = localStorage.getItem("linknride_uid");

        if (!uid) {
          router.push("/login");
          return;
        }

        const snap = await getDoc(doc(db, "owners", uid));

        if (snap.exists()) {
          setOwnerData(snap.data());
        }

      } catch (err) {
        console.error("Error loading owner profile:", err);
      } finally {
        setLoading(false);
      }

    };

    fetchOwnerData();

  }, [router]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!ownerData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#FAFAFA]">
        <p className="text-gray-600 text-lg mb-4">
          No owner data found
        </p>

        <button
          onClick={() => router.push("/onboard/owner")}
          className="bg-[#F4B400] text-black px-6 py-3 rounded-lg font-semibold"
        >
          Complete Onboarding
        </button>
      </div>
    );
  }

  return (

<div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111]">

{/* ================= HEADER ================= */}

<header className="bg-white border-b px-8 py-4 flex justify-between items-center">

<h1 className="text-2xl font-bold flex items-center gap-2">
<FaUser className="text-[#F4B400]" />
Owner Profile
</h1>

<div className="flex gap-4">

<button
onClick={() => router.push("/owner/edit-profile")}
className="flex items-center gap-2 bg-[#F4B400] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#e0a800]"
>
<FaEdit /> Edit Profile
</button>

<button
onClick={() => router.push("/owner/dashboard")}
className="flex items-center gap-2 text-gray-700 hover:text-black"
>
<FaArrowLeft />
Back
</button>

</div>

</header>


{/* ================= PROFILE CARD ================= */}

<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
className="max-w-5xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-sm border"
>

<h2 className="text-2xl font-bold text-center mb-8">
{ownerData.fullName || "Owner"}
</h2>


{/* ================= BASIC INFO ================= */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

<div className="bg-[#FAFAFA] p-4 rounded-xl border">

<p>
<span className="font-semibold">Mobile:</span>
{" "}
{ownerData.phone}
</p>

<p className="mt-2">
<span className="font-semibold">Email:</span>
{" "}
{ownerData.email || "N/A"}
</p>

</div>


<div className="bg-[#FAFAFA] p-4 rounded-xl border">

<p>
<span className="font-semibold">City:</span>
{" "}
{ownerData.city}
</p>

<p className="mt-2">
<span className="font-semibold">State:</span>
{" "}
{ownerData.state}
</p>

</div>


<div className="bg-[#FAFAFA] p-4 rounded-xl border">

<p>
<span className="font-semibold">Pincode:</span>
{" "}
{ownerData.pincode}
</p>

<p className="mt-2">
<span className="font-semibold">Address:</span>
{" "}
{ownerData.address}
</p>

</div>

</div>


{/* ================= AADHAAR ================= */}

{ownerData.aadharUrl && (

<div className="mb-10 bg-[#FAFAFA] p-4 rounded-xl border">

<h3 className="text-lg font-semibold mb-2">
Aadhaar Document
</h3>

<a
href={ownerData.aadharUrl}
target="_blank"
rel="noopener noreferrer"
className="text-[#F4B400] underline"
>
View Uploaded Aadhaar
</a>

</div>

)}


{/* ================= VEHICLES ================= */}

<div>

<h3 className="text-xl font-bold mb-6 flex items-center gap-2">

<FaTruck className="text-[#F4B400]" />

Registered Vehicles ({ownerData.vehicles?.length || 0})

</h3>


{ownerData.vehicles && ownerData.vehicles.length > 0 ? (

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{ownerData.vehicles.map((vehicle: any, index: number) => (

<motion.div
key={index}
whileHover={{ y: -6 }}
className="bg-white border rounded-2xl shadow-sm p-6 hover:border-[#F4B400]"
>

<h4 className="text-lg font-semibold mb-2">

🚚 {vehicle.vehicleNumber || "Vehicle"}

</h4>


<p className="text-gray-600">

<span className="font-medium text-gray-800">
Type:
</span>{" "}
{vehicle.vehicleType || "N/A"}

</p>


<p className="text-gray-600">

<span className="font-medium text-gray-800">
Capacity:
</span>{" "}
{vehicle.capacity || "0"} tons

</p>


{vehicle.rcNumber && (

<p className="text-gray-600">

<span className="font-medium text-gray-800">
RC Number:
</span>{" "}
{vehicle.rcNumber}

</p>

)}

</motion.div>

))}

</div>

) : (

<div className="bg-[#FAFAFA] p-6 rounded-xl border text-center text-gray-500">

No vehicles registered yet

</div>

)}

</div>

</motion.div>


{/* ================= FOOTER ================= */}

<footer className="bg-[#0B0B0B] text-white text-center text-sm py-4 mt-12">

© {new Date().getFullYear()}

<span className="text-[#F4B400] font-semibold">
{" "}LinknRide
</span>

</footer>

</div>

  );
}