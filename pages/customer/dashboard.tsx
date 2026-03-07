import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import {
  FiHome,
  FiBox,
  FiSearch,
  FiRepeat,
  FiMapPin,
  FiBell,
  FiHelpCircle,
  FiLogOut,
  FiMenu
} from "react-icons/fi";

export default function CustomerDashboard() {

  const router = useRouter();
  const [userName, setUserName] = useState("Customer");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = localStorage.getItem("linknride_uid");
      if (!uid) return;

      const snap = await getDoc(doc(db, "users", uid));

      if (snap.exists())
        setUserName(snap.data()?.profile?.fullName || "Customer");
    };

    fetchProfile();
  }, []);

  return (

<div className="min-h-screen flex bg-[#FAFAFA] text-[#111]">

{/* OVERLAY */}

{sidebarOpen && (
<div
onClick={()=>setSidebarOpen(false)}
className="fixed inset-0 bg-black/40 z-40"
/>
)}

{/* SIDEBAR */}

<aside
className={`fixed top-0 left-0 h-full w-64 bg-[#0B0B0B] text-white flex flex-col py-6 px-4 justify-between transform transition-transform duration-300 z-50
${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
`}
>

<div>

{/* LOGO */}

<div className="flex items-center gap-3 mb-10 px-2">
<img src="/logo.jpg" className="w-10 h-10 rounded-full border"/>
<h1 className="text-xl font-bold">
<span className="text-white">LINK</span>
<span className="text-[#F4B400]">N</span>
<span className="text-white">RIDE</span>
</h1>
</div>

{/* NAV */}

<nav className="flex flex-col gap-2 text-sm">

<NavItem icon={<FiHome/>} label="Dashboard"
onClick={()=>router.push("/customer/dashboard")}
active/>

<NavItem icon={<FiBox/>} label="My Load History"
onClick={()=>router.push("/customer/my-loads")}/>

<NavItem icon={<FiRepeat/>} label="Active Requests"
onClick={()=>router.push("/customer/my-requests")}/>

<NavItem icon={<FiMapPin/>} label="Ongoing Trips"
onClick={()=>router.push("/customer/ongoing-trips")}/>

<NavItem icon={<FiBell/>} label="Notifications"
onClick={()=>router.push("/customer/notifications")}/>

</nav>

</div>

{/* FOOTER */}

<div className="space-y-3">

<button
onClick={()=>router.push("/support")}
className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F4B400]/20 text-sm text-gray-300 hover:text-[#F4B400] transition">
<FiHelpCircle/> Help & Support
</button>

<button
onClick={()=>{
localStorage.removeItem("linknride_uid");
router.push("/login");
}}
className="w-full bg-[#F4B400] hover:bg-[#e0a800] text-black py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition">
<FiLogOut/> Logout
</button>

</div>

</aside>


{/* MAIN */}

<main className="flex-1 flex flex-col">

{/* HEADER */}

<header className="bg-white border-b px-10 py-4 shadow-sm flex justify-between items-center">

{/* LEFT */}

<div className="flex items-center gap-4">

<button
onClick={()=>setSidebarOpen(!sidebarOpen)}
className="text-2xl"
>
<FiMenu/>
</button>

<h2 className="text-xl font-bold text-black">
Welcome Back, {userName.split(" ")[0]}
</h2>

</div>

{/* RIGHT PROFILE */}

<div
onClick={()=>router.push("/customer/profile")}
className="flex items-center gap-3 cursor-pointer">

<span className="font-medium text-gray-700 hidden sm:block">
{userName}
</span>

<div className="bg-[#F4B400] text-black w-10 h-10 flex items-center justify-center rounded-full font-bold">
{userName.charAt(0)}
</div>

</div>

</header>


{/* BODY */}

<motion.section
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="p-10">

<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">

<DashboardCard
title="Post My Load"
icon={<FiBox size={22}/>}
description="Add goods, pickup & drop details and share with owners."
onClick={()=>router.push("/customer/post-load")}
/>

<DashboardCard
title="Search Vehicles"
icon={<FiSearch size={22}/>}
description="Find available vehicles posted by owners."
onClick={()=>router.push("/customer/search-vehicles")}
/>

</div>

</motion.section>

</main>

</div>
  );
}


/* NAV ITEM */

function NavItem({icon,label,onClick,active=false}:any){

return(

<button
onClick={onClick}
className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
${active
? "bg-[#F4B400] text-black font-semibold"
: "text-gray-300 hover:bg-[#F4B400]/20 hover:text-[#F4B400]"
}`}
>

{icon}
{label}

</button>

);

}


/* DASHBOARD CARD */

function DashboardCard({title,icon,description,onClick}:any){

return(

<motion.div
whileHover={{y:-6}}
className="bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-200 hover:border-[#F4B400] transition flex flex-col justify-between">

<div>

<div className="w-12 h-12 bg-[#FFF3CC] text-[#F4B400] rounded-xl flex items-center justify-center mb-4">
{icon}
</div>

<h3 className="text-xl font-semibold text-black">{title}</h3>

<p className="text-gray-600 mt-3">{description}</p>

</div>

<button
onClick={onClick}
className="mt-8 bg-[#F4B400] hover:bg-[#e0a800] text-black py-3 rounded-xl font-semibold transition">

Open

</button>

</motion.div>

);

}