import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  FaBox,
  FaSearch,
  FaUserCircle,
  FaHome,
  FaSyncAlt,
  FaRoute,
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

export default function CustomerDashboard() {

  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const uid = localStorage.getItem("linknride_uid");

      if (!uid) {
        router.push("/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", uid));

      if (snap.exists()) {
        setUser(snap.data());
      }
    };

    fetchUser();
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  /* SIDEBAR MENU */

  const menuItems = [
    { icon: <FaBox />, label: "My Loads", path: "/customer/my-loads" },
    { icon: <FaSyncAlt />, label: "My Requests", path: "/customer/my-requests" },
    { icon: <FaRoute />, label: "Ongoing Trips", path: "/customer/ongoing-trips" },
    { icon: <FaUser />, label: "Profile", path: "/customer/profile" },
    { icon: <FaBell />, label: "Notifications", path: "/customer/notifications" },
    { icon: <FaLifeRing />, label: "Support", path: "/customer/support" }
  ];

  /* MAIN DASHBOARD CARDS (ONLY 2) */

  const cards = [
    {
      icon: <FaBox className="text-5xl text-[#F4B400] mb-4" />,
      title: "Post My Load",
      path: "/customer/post-load",
      desc: "Add goods, pickup & drop details."
    },
    {
      icon: <FaSearch className="text-5xl text-[#F4B400] mb-4" />,
      title: "Search Vehicles",
      path: "/customer/search-vehicles",
      desc: "Find available vehicles."
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
<Image src="/logo.jpg" alt="logo" width={36} height={36} className="rounded-full"/>
<h2 className="text-xl font-extrabold">
<span>LINK</span><span className="text-[#F4B400]">N</span><span>RIDE</span>
</h2>
</div>

<nav className="flex flex-col gap-2 text-sm">

<button
onClick={() => router.push("/customer/dashboard")}
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


{/* MAIN */}
<div className="flex-1 flex flex-col">

{/* HEADER */}
<header className="bg-white border-b px-10 py-4 flex justify-between items-center">

<div className="flex items-center gap-4">

<button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl">
<FaBars />
</button>

<div className="flex items-center gap-3">
<Image src="/logo.jpg" alt="logo" width={50} height={50} className="rounded-full border"/>
<h1 className="text-2xl font-semibold">
Welcome Back, {user?.profile?.fullName?.split(" ")[0] || "Customer"}
</h1>
</div>

</div>

<div>
{user?.avatarUrl
? <Image src={user.avatarUrl} alt="user" width={36} height={36} className="rounded-full"/>
: <FaUserCircle className="text-3xl text-[#F4B400]" />}
</div>

</header>


{/* CONTENT */}
<motion.section
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
className="flex-grow px-10 py-16"
>

<div className="max-w-4xl mx-auto text-center">

<h2 className="text-2xl font-bold mb-2">
Customer Dashboard
</h2>

<p className="text-gray-600 mb-12">
Post loads, find vehicles, and manage your shipments
</p>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

{cards.map((card, i) => (
<motion.div
  whileHover={{ y: -6 }}
  onClick={() => router.push(card.path)}
  className="
    cursor-pointer 
    bg-white 
    rounded-2xl 
    p-8 
    border-2 border-gray-200 
    hover:border-[#F4B400]
    flex flex-col items-center justify-center text-center
  "
>

  {/* ICON */}
  <div className="flex justify-center items-center mb-4">
    {card.icon}
  </div>

  {/* TITLE */}
  <h3 className="text-xl font-semibold mb-2 text-center">
    {card.title}
  </h3>

  {/* DESC */}
  <p className="text-gray-600 text-center">
    {card.desc}
  </p>

</motion.div>
))}

</div>

</div>

</motion.section>


{/* FOOTER */}
<footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
© {new Date().getFullYear()}
<span className="text-[#F4B400] font-semibold"> LinknRide</span>
</footer>

</div>

</div>
);
}