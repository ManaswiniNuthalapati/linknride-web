import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc
} from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck
} from "react-icons/fa";

export default function OwnerNotifications() {

  const router = useRouter();

  const [notifications,setNotifications] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);



  /* FETCH NOTIFICATIONS */

  useEffect(()=>{

    const ownerId = localStorage.getItem("linknride_uid");
    if(!ownerId) return;

    const q = query(
      collection(db,"notifications"),
      orderBy("createdAt","desc")
    );

    const unsub = onSnapshot(q,(snapshot)=>{

      const list:any[] = [];

      snapshot.forEach(docSnap=>{
        list.push({
          id:docSnap.id,
          ...docSnap.data()
        });
      });

      setNotifications(list);
      setLoading(false);

    });

    return ()=>unsub();

  },[]);

const handleDelete = async (id:string) => {
  try{
    await deleteDoc(doc(db,"notifications",id));
  }catch(err){
    console.error(err);
  }
};

  /* MARK AS READ */

  const markRead = async(id:string)=>{

    await updateDoc(doc(db,"notifications",id),{
      read:true
    });

  };



  return(

  <div className="min-h-screen flex flex-col bg-[#FAFAFA]">

    {/* HEADER */}

    <header className="bg-white border-b px-10 py-4 flex justify-between items-center">

      <div
        onClick={()=>router.push("/owner/dashboard")}
        className="flex items-center gap-3 cursor-pointer"
      >

        <Image
          src="/logo.jpg"
          alt="logo"
          width={45}
          height={45}
          className="rounded-full border"
        />

        <h1 className="text-3xl font-extrabold tracking-wide">
          <span className="text-black">LINK</span>
          <span className="text-[#F4B400]">N</span>
          <span className="text-black">RIDE</span>
        </h1>

      </div>

      <button
        onClick={()=>router.push("/owner/dashboard")}
        className="text-[#F4B400] font-semibold"
      >
        ← Back to Dashboard
      </button>

    </header>



    {/* CONTENT */}

    <div className="flex-grow px-10 py-12">

      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <FaBell /> Notifications
      </h2>


      {loading ? (

        <p className="text-center text-gray-600">
          Loading notifications...
        </p>

      ) : notifications.length===0 ? (

        <p className="text-center text-gray-500">
          No notifications yet
        </p>

      ) : (

        <div className="space-y-4">

          {notifications.map((n)=>(

           <motion.div
 key={n.id}
 whileHover={{y:-4}}
 onClick={() => router.push(`/owner/search-loads?loadId=${n.loadId}`)}
 className="p-4 rounded-xl border bg-yellow-50 border-yellow-300 cursor-pointer hover:shadow-md transition flex justify-between items-center"
>

 <div className="flex items-center gap-3">

  <FaTruck className="text-[#F4B400]" />

  <div>

   <p className="font-semibold">
    {n.customerName} posted a load from {n.pickup} → {n.drop}
   </p>

   <p className="text-sm text-gray-500">
    {new Date(n.createdAt?.seconds * 1000).toLocaleString()}
   </p>

  </div>

 </div>

 {/* DELETE BUTTON */}

 <button
  onClick={(e)=>{
    e.stopPropagation();   // 🚨 prevents card click
    handleDelete(n.id);
  }}
  className="text-red-500 hover:text-red-700 text-lg font-bold ml-4"
 >
  ✖
 </button>

</motion.div>
          ))}

        </div>

      )}

    </div>



    {/* FOOTER */}

    <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
      © {new Date().getFullYear()}
      <span className="text-[#F4B400] font-semibold"> LinknRide</span>
    </footer>

  </div>

  );

}