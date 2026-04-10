import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import PhoneIcon from "@heroicons/react/24/solid/PhoneIcon";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  orderBy,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

export default function OwnerMyRequests() {

  const router = useRouter();

  const [requests,setRequests] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);
  const [timeLeft,setTimeLeft] = useState<{[key:string]:number}>({});

  /* FETCH OWNER REQUESTS */

  useEffect(()=>{

    const uid = localStorage.getItem("linknride_uid");
    if(!uid) return;

    const q = query(
      collection(db,"requests"),
      where("ownerId","==",uid),
      orderBy("createdAt","desc")
    );

    const unsub = onSnapshot(q, async(reqSnap)=>{

      const temp:any[] = [];

      for(const docSnap of reqSnap.docs){

        const reqData = docSnap.data();
        let loadData:any = null;

        if(reqData.loadId){

          const loadSnap = await getDoc(doc(db,"loads",reqData.loadId));

          if(loadSnap.exists()){
            loadData = loadSnap.data();
          }

        }

        if(!loadData) continue;
        if(reqData.status === "deleted") continue;

        temp.push({
          id:docSnap.id,
          ...reqData,
          load:loadData
        });

      }

      setRequests(temp);
      setLoading(false);

    });

    return ()=>unsub();

  },[]);


  /* COUNTDOWN TIMER */

  useEffect(()=>{

    const interval = setInterval(()=>{

      const updated:any = {};

      requests.forEach(r=>{

        if(r.status !== "pending") return;
        if(!r.load?.lockExpiresAt) return;

        const remaining = r.load.lockExpiresAt - Date.now();

        updated[r.id] = remaining > 0 ? remaining : 0;

        /* AUTO UNLOCK WHEN TIMER ENDS */

        if(remaining <= 0 && r.status === "pending"){

          updateDoc(doc(db,"loads",r.loadId),{
            status:"open",
            lockedBy:null,
            lockExpiresAt:null
          });

          updateDoc(doc(db,"requests",r.id),{
            status:"expired"
          });

        }

      });

      setTimeLeft(updated);

    },1000);

    return ()=>clearInterval(interval);

  },[requests]);


  /* FORMAT TIMER */

  const formatTime = (ms:number)=>{

    const minutes = Math.floor(ms/60000);
    const seconds = Math.floor((ms%60000)/1000);

    return `${minutes}:${seconds.toString().padStart(2,"0")}`;

  };
  const handleDelete = async(id:string)=>{

await updateDoc(doc(db,"requests",id),{
status:"deleted"
});

setRequests(prev => prev.filter(r=>r.id!==id));

}


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
        alt="Logo"
        width={50}
        height={50}
        className="rounded-full"
        />

        <h1 className="text-3xl font-extrabold tracking-wider">
          <span className="text-black">LINK</span>
          <span className="text-[#F4B400]">N</span>
          <span className="text-black">RIDE</span>
        </h1>

      </div>

      <button
      onClick={()=>router.push("/owner/dashboard")}
      className="text-[#F4B400] font-semibold hover:underline"
      >
      ← Back to Dashboard
      </button>

    </header>


    {/* CONTENT */}

    <motion.section className="flex-grow px-10 py-10">

      <h2 className="text-2xl font-bold text-center mb-10">
        My Active Requests
      </h2>

      {loading ? (

        <p className="text-center">Loading...</p>

      ) : requests.length===0 ? (

        <p className="text-center text-gray-600">
          No active requests.
        </p>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {requests.map((r)=>{

            const remaining = timeLeft[r.id] || 0;

            return(

              <motion.div
              key={r.id}
              whileHover={{y:-6}}
              className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#F4B400] transition shadow-sm hover:shadow-xl"
              >

                {/* TOP SECTION */}

                <div className="flex justify-between items-center mb-2">

                  <h3 className="text-lg font-bold">
                    {r.load.pickup} → {r.load.drop}
                  </h3>

                  <div className="flex items-center gap-3">

                    {/* CALL ICON */}

                    {r.status === "pending" && remaining > 0 && (

                      <a
                      href="tel:9014572504"
                      title="Call LinknRide"
                      className="flex items-center justify-center w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition hover:scale-110"
                      >

                        <PhoneIcon className="w-5 h-5"/>

                      </a>

                    )}

                    {/* STATUS BADGE */}

                    <span className={`px-3 py-1 text-xs rounded-full font-semibold
                      ${
                        r.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : r.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : r.status === "expired"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}>
                      {r.status?.toUpperCase() || "PENDING"}
                    </span>
                    {r.status === "expired" && (

<button
onClick={()=>handleDelete(r.id)}
className="flex items-center justify-center w-6 h-6 bg-gray-100 hover:bg-red-100 rounded-full transition"
title="Remove request"
>

<FiX className="w-3 h-3 text-gray-500 hover:text-red-500"/>

</button>

)}

                  </div>

                </div>


                {/* OWNER PRICE */}

                <p className="text-sm text-gray-600">
                  Owner Price: ₹{r.ownerPrice}
                </p>


                {/* TIMER */}

                {remaining > 0 && r.status === "pending" && (

                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">

                    <p className="text-yellow-700 font-semibold flex items-center gap-2">
                      Reserved for you
                    </p>

                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {formatTime(remaining)} remaining
                    </p>

                    

                  </div>

                )}


                {/* REJECT MESSAGE */}

                {r.status === "rejected" && (

                  <p className="mt-3 text-red-600 font-semibold">
                    Request Rejected by Customer
                  </p>

                )}

              </motion.div>

            )

          })}

        </div>

      )}

    </motion.section>


    {/* FOOTER */}

    <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">

      © {new Date().getFullYear()}{" "}
      <span className="text-[#F4B400]">
        LinknRide
      </span>

    </footer>

  </div>

  );

}