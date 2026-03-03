import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  FaTruck, FaSearch, FaUserTie, FaUserCircle, FaHome,
  FaSyncAlt, FaRoute, FaHistory, FaUser, FaBell, FaIdBadge, FaSignOutAlt
} from "react-icons/fa";
import { useEffect, useState } from "react";
import Image from "next/image";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function OwnerDashboard() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [owner, setOwner] = useState<any>(null);
  const [selectedCard, setSelectedCard] = useState("");

  // 🔐 Fetch owner
  useEffect(() => {
    const fetchOwner = async () => {
      const uid = localStorage.getItem("linknride_uid");
      if (!uid) return router.push("/login");

      const snapshot = await getDoc(doc(db, "owners", uid));
      snapshot.exists() ? setOwner(snapshot.data()) : router.push("/onboard/owner");
    };
    fetchOwner();
  }, [router]);

  const handleNavigate = (path: string) => router.push(path);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // ⭐ Sidebar menu items (Trip History fixed)
  const menuItems = [
    { icon: <FaUserTie />, label: "Hire Drivers", path: "/owner/hire-drivers" },
    { icon: <FaSyncAlt />, label: "Active Requests / Bids", path: "/owner/my-requests" },
    { icon: <FaRoute />, label: "Ongoing Trips", path: "/owner/ongoing-trips" },
    { icon: <FaHistory />, label: "Trip History", path: "/owner/view-history" }, // ✅ fixed
   
    { icon: <FaUser />, label: "Profile & Vehicles", path: "/owner/profile" },
    { icon: <FaBell />, label: "Notifications", path: "/owner/notifications" },
  ];

  const cards = [
    { id:"post", icon:<FaTruck className="text-5xl text-[#F4B400] mb-4"/>, title:"Post My Vehicle", path:"/owner/post-vehicle", desc:"Add and publish vehicle availability."},
    { id:"search", icon:<FaSearch className="text-5xl text-[#F4B400] mb-4"/>, title:"Search Loads", path:"/owner/search-loads", desc:"Browse customer loads and accept bookings."},
    { id:"hire", icon:<FaUserTie className="text-5xl text-[#F4B400] mb-4"/>, title:"Hire Drivers", path:"/owner/hire-drivers", desc:"Find skilled drivers for your fleet."},
  ];

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] text-[#111]">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0B0B0B] text-white flex flex-col justify-between py-6 px-4">
        <div>
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#F4B400]">Vehicle Owner</h2>
            <p className="text-sm opacity-70">Manage your fleet</p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <button
              onClick={() => handleNavigate("/owner/dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold 
                ${router.pathname === "/owner/dashboard"
                  ? "bg-[#F4B400] text-black"
                  : "hover:bg-[#F4B400]/20 hover:text-[#F4B400]"}`}
            >
              <FaHome /> Dashboard
            </button>

            {menuItems.map((item, i) => (
              <button key={i}
                onClick={() => handleNavigate(item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${router.pathname === item.path
                    ? "bg-[#F4B400] text-black"
                    : "hover:bg-[#F4B400]/20 hover:text-[#F4B400]"}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* LOGOUT */}
        <button onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
          <div onClick={()=>router.push("/owner/dashboard")} className="flex items-center gap-3 cursor-pointer">
            <Image src="/logo.jpg" alt="logo" width={50} height={50} className="rounded-full border"/>
            <h1 className="text-3xl font-extrabold tracking-wide">
              <span className="text-black">LINK</span>
              <span className="text-[#F4B400]">N</span>
              <span className="text-black">RIDE</span>
            </h1>
          </div>

          {/* PROFILE */}
          <div className="relative">
            <button onClick={()=>setMenuOpen(!menuOpen)} className="flex items-center gap-3">
              {owner?.avatarUrl
                ? <Image src={owner.avatarUrl} alt="Owner" width={36} height={36} className="rounded-full"/>
                : <FaUserCircle className="text-3xl text-[#F4B400]"/>}
              <span className="text-sm">Hi, {owner?.fullName?.split(" ")[0] || "Owner"} ▾</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button onClick={()=>handleNavigate("/owner/profile")} className="block w-full text-left px-4 py-2 hover:bg-[#FFF3CC]">👤 View Profile</button>
                <button onClick={()=>handleNavigate("/onboard/owner")} className="block w-full text-left px-4 py-2 hover:bg-[#FFF3CC]">✏️ Edit Profile</button>
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">🚪 Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* CARDS */}
        <motion.section initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className="flex-grow px-10 py-16">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">
              Welcome Back, {owner?.fullName?.split(" ")[0] || "Owner"} 👋
            </h2>
            <p className="text-gray-600 mb-12">Manage your fleet, find loads, and hire drivers</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {cards.map(card=>(
                <motion.div
                  key={card.id}
                  whileHover={{ y:-6 }}
                  onClick={()=>{setSelectedCard(card.id); handleNavigate(card.path);}}
                  className={`cursor-pointer bg-white rounded-2xl p-8 flex flex-col items-center border-2 transition
                    ${selectedCard===card.id
                      ? "border-[#F4B400] shadow-2xl"
                      : "border-gray-200 hover:border-[#F4B400]"}`}
                >
                  {card.icon}
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-center">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
          © {new Date().getFullYear()} <span className="text-[#F4B400] font-semibold">LinknRide</span>
        </footer>

      </div>
    </div>
  );
}