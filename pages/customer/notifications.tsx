import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaTruck } from "react-icons/fa";

export default function CustomerNotifications() {

  const router = useRouter();

  const [notifications,setNotifications] = useState<any[]>([]);

  const uid =
  typeof window !== "undefined"
  ? localStorage.getItem("linknride_uid")
  : null;


  /* FETCH NOTIFICATIONS */

  useEffect(()=>{

    if(!uid) return;

    const q = query(
      collection(db,"notifications"),
      where("userId","==",uid)
    );

    const unsub = onSnapshot(q,(snap)=>{

      const list:any[] = [];

      snap.docs.forEach((d)=>{
        list.push({
          id:d.id,
          ...d.data()
        });
      });

      /* newest first */

      list.sort((a,b)=>{

        const A = a.createdAt?.seconds || 0;
        const B = b.createdAt?.seconds || 0;

        return B-A;

      });

      setNotifications(list);

    });

    return ()=>unsub();

  },[uid]);


  /* DELETE */

  const handleDelete = async(id:string)=>{

    await deleteDoc(doc(db,"notifications",id));

  };


  return(

    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">


      {/* HEADER */}

      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">

        <div
        onClick={()=>router.push("/customer/dashboard")}
        className="flex items-center gap-3 cursor-pointer"
        >

          <Image
          src="/logo.jpg"
          alt="logo"
          width={45}
          height={45}
          className="rounded-full"
          />

          <h1 className="text-2xl font-extrabold">
            <span className="text-black">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-black">RIDE</span>
          </h1>

        </div>

        <button
        onClick={()=>router.push("/customer/dashboard")}
        className="px-5 py-2 border-2 border-[#F4B400] rounded-lg hover:bg-[#FFE8A3]"
        >
        Back
        </button>

      </header>



      {/* PAGE */}

      <div className="max-w-5xl mx-auto w-full px-6 mt-10 flex-grow">

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🔔 Notifications
        </h2>


        {notifications.length === 0 && (

          <p className="text-gray-500">
            No notifications
          </p>

        )}



        <div className="space-y-4">


        {notifications.map((n)=>(

          <motion.div
          key={n.id}
          whileHover={{y:-4}}
          onClick={()=>router.push(`/customer/my-requests?loadId=${n.loadId}`)}
          className="group p-4 rounded-xl border bg-yellow-50 border-yellow-300 cursor-pointer hover:shadow-md transition flex justify-between items-center"
          >


          <div className="flex items-center gap-3">

            <FaTruck className="text-[#F4B400]" />

            <div>

              <p className="font-semibold">

                {n.ownerName} accepted your load from {n.pickup} → {n.drop}

              </p>

              <p className="text-sm text-gray-500">

                {n.createdAt?.seconds
                ? new Date(n.createdAt.seconds*1000).toLocaleString()
                : ""}

              </p>

            </div>

          </div>



          {/* DELETE BUTTON */}

          <button
          onClick={(e)=>{
            e.stopPropagation();
            handleDelete(n.id);
          }}
          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-lg font-bold transition"
          >
          ✖
          </button>


          </motion.div>

        ))}

        </div>


      </div>



      {/* FOOTER */}

      <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
        © {new Date().getFullYear()} 
        <span className="text-[#F4B400] font-semibold"> LinknRide</span>
      </footer>


    </div>

  );
}