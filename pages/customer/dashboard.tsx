import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import {
  FiHome, FiBox, FiSearch, FiRepeat,
  FiMapPin, FiBell, FiHelpCircle, FiLogOut,
  FiMenu, FiX
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
    <div className="min-h-screen flex bg-[#FAFAFA] text-[#111] relative">

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#F4B400] p-2 rounded-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX size={22}/> : <FiMenu size={22}/>}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-[#0B0B0B] text-white 
          flex flex-col py-6 px-4 justify-between
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300 z-40
        `}
      >
        <div>

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <img src="/logo.jpg" className="w-10 h-10 rounded-full border"/>
            <h1 className="text-xl font-bold">
              <span>LINK</span>
              <span className="text-[#F4B400]">N</span>
              <span>RIDE</span>
            </h1>
          </div>

          {/* USER */}
          <div className="px-2 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#F4B400] text-black w-9 h-9 flex items-center justify-center rounded-full font-bold">
                {userName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{userName}</p>
                <p className="text-xs text-gray-400">Customer</p>
              </div>
            </div>

            <button
              onClick={()=>router.push("/customer/profile")}
              className="text-xs text-[#F4B400] mt-2 hover:underline"
            >
              Edit Profile
            </button>
          </div>

          {/* NAV */}
          <nav className="flex flex-col gap-2 text-sm">
            <NavItem icon={<FiHome/>} label="Dashboard" active onClick={()=>router.push("/customer/dashboard")}/>
            <NavItem icon={<FiBox/>} label="My Load History" onClick={()=>router.push("/customer/my-loads")}/>
            <NavItem icon={<FiRepeat/>} label="Active Requests" onClick={()=>router.push("/customer/my-requests")}/>
            <NavItem icon={<FiMapPin/>} label="Ongoing Trips" onClick={()=>router.push("/customer/ongoing-trips")}/>
            <NavItem icon={<FiBell/>} label="Notifications" onClick={()=>router.push("/customer/notifications")}/>
          </nav>
        </div>

        {/* FOOTER */}
        <div className="space-y-3">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F4B400]/20 text-sm text-gray-300 hover:text-[#F4B400] transition">
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col md:ml-0">

        {/* HEADER */}
        <header className="bg-white border-b px-4 md:px-10 py-6 shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold">
            Welcome Back, {userName.split(" ")[0]}
          </h2>
        </header>

        {/* BODY */}
        <motion.section
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          className="p-4 md:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl">

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
    <button onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
      ${active
        ? "bg-[#F4B400] text-black font-semibold"
        : "text-gray-300 hover:bg-[#F4B400]/20 hover:text-[#F4B400]"}`}>
      {icon}{label}
    </button>
  );
}

/* DASHBOARD CARD */
function DashboardCard({title,icon,description,onClick}:any){
  return(
    <motion.div whileHover={{y:-6}}
      className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-2 border-gray-200 hover:border-[#F4B400] transition flex flex-col justify-between">

      <div>
        <div className="w-12 h-12 bg-[#FFF3CC] text-[#F4B400] rounded-xl flex items-center justify-center mb-4">
          {icon}
        </div>

        <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-3 text-sm md:text-base">{description}</p>
      </div>

      <button onClick={onClick}
        className="mt-6 bg-[#F4B400] hover:bg-[#e0a800] text-black py-3 rounded-xl font-semibold transition">
        Open
      </button>
    </motion.div>
  );
}