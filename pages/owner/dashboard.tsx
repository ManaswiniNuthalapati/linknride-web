import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  FaTruck,
  FaSearch,
  FaUserTie,
  FaUserCircle,
  FaHome,
  FaSyncAlt,
  FaRoute,
  FaHistory,
  FaUser,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaLifeRing
} from "react-icons/fa";
import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function OwnerDashboard() {

  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [owner, setOwner] = useState<any>(null);

  useEffect(() => {

    const fetchOwner = async () => {

      const uid = localStorage.getItem("linknride_uid");

      if (!uid) {
        router.push("/login");
        return;
      }

      const snap = await getDoc(doc(db, "owners", uid));

      if (snap.exists()) {
        setOwner(snap.data());
      } else {
        router.push("/onboard/owner");
      }

    };

    fetchOwner();

  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const menuItems = [
  { icon: <FaUserTie />, label: "Hire Drivers", path: "/owner/hire-drivers" },
  { icon: <FaSyncAlt />, label: "Active Requests / Bids", path: "/owner/my-requests" },
  { icon: <FaRoute />, label: "Ongoing Trips", path: "/owner/ongoing-trips" },
  { icon: <FaHistory />, label: "Trip History", path: "/owner/view-history" },
  { icon: <FaUser />, label: "Profile & Vehicles", path: "/owner/profile" },
  { icon: <FaBell />, label: "Notifications", path: "/owner/notifications" },
  { icon: <FaLifeRing />, label: "Support", path: "/owner/support" }
];

  const cards = [
    {
      icon: <FaTruck className="text-5xl text-[#F4B400] mb-4" />,
      title: "Post My Vehicle",
      path: "/owner/post-vehicle",
      desc: "Add and publish vehicle availability."
    },
    {
      icon: <FaSearch className="text-5xl text-[#F4B400] mb-4" />,
      title: "Search Loads",
      path: "/owner/search-loads",
      desc: "Browse customer loads and accept bookings."
    },
    {
      icon: <FaUserTie className="text-5xl text-[#F4B400] mb-4" />,
      title: "Hire Drivers",
      path: "/owner/hire-drivers",
      desc: "Find skilled drivers for your fleet."
    }
  ];

  return (

<div className="min-h-screen flex bg-[#FAFAFA] text-[#111]">

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

{/* BRAND */}

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
onClick={() => router.push("/owner/dashboard")}
className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#F4B400] text-black font-semibold"
>
<FaHome /> Dashboard
</button>

{menuItems.map((item, i) => (

<button
key={i}
onClick={() => router.push(item.path)}
className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F4B400]/20 hover:text-[#F4B400]"
>
{item.icon}
{item.label}
</button>

))}

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

<div className="flex-1 flex flex-col transition-all duration-300">

{/* HEADER */}

<header className="bg-white border-b px-10 py-4 flex justify-between items-center">

{/* LEFT SECTION */}

<div className="flex items-center gap-4">

<button
onClick={() => setSidebarOpen(!sidebarOpen)}
className="text-2xl text-black"
>
<FaBars />
</button>

<div className="flex items-center gap-3">

<Image
src="/logo.jpg"
alt="logo"
width={50}
height={50}
className="rounded-full border"
/>

<h1 className="text-2xl font-semibold">
Welcome Back, {owner?.fullName?.split(" ")[0] || "Owner"}
</h1>

</div>

</div>


{/* PROFILE */}

<div className="relative">

<button
onClick={() => setMenuOpen(!menuOpen)}
className="flex items-center gap-3"
>

{owner?.avatarUrl
? <Image src={owner.avatarUrl} alt="Owner" width={36} height={36} className="rounded-full"/>
: <FaUserCircle className="text-3xl text-[#F4B400]" />}

</button>

{menuOpen && (

<div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">

<button
onClick={() => router.push("/owner/profile")}
className="block w-full text-left px-4 py-2 hover:bg-[#FFF3CC]"
>
View Profile
</button>

<button
onClick={() => router.push("/owner/edit-profile")}
className="block w-full text-left px-4 py-2 hover:bg-[#FFF3CC]"
>
Edit Profile
</button>

<button
 onClick={()=>router.push("/owner/notifications")}
 className="bg-[#F4B400] px-4 py-2 rounded-lg font-semibold"
>
Notifications
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


{/* DASHBOARD CARDS */}

<motion.section
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
className="flex-grow px-10 py-16"
>

<div className="max-w-6xl mx-auto text-center">

<h2 className="text-2xl font-bold mb-2">
Owner Dashboard
</h2>

<p className="text-gray-600 mb-12">
Manage your fleet, find loads, and hire drivers
</p>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

{cards.map((card, i) => (

<motion.div
key={i}
whileHover={{ y: -6 }}
onClick={() => router.push(card.path)}
className="cursor-pointer bg-white rounded-2xl p-8 flex flex-col items-center border-2 border-gray-200 hover:border-[#F4B400]"
>

{card.icon}

<h3 className="text-xl font-semibold mb-2">
{card.title}
</h3>

<p className="text-gray-600 text-center">
{card.desc}
</p>

</motion.div>

))}

</div>

</div>

</motion.section>


<footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
© {new Date().getFullYear()}
<span className="text-[#F4B400] font-semibold"> LinknRide</span>
</footer>

</div>

</div>

  );
}