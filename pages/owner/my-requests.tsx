import { useEffect, useState } from "react";
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

        if(remaining <= 0){

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

            const showPhone =
              remaining <= (10 * 60 * 1000) && remaining > 0;

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

                  {/* STATUS BADGE */}

                  <span className={`px-3 py-1 text-xs rounded-full font-semibold
                    ${
                      r.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : r.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}>
                    {r.status?.toUpperCase() || "PENDING"}
                  </span>

                </div>


                {/* OWNER PRICE */}

                <p className="text-sm text-gray-600">
                  Owner Price: ₹{r.ownerPrice}
                </p>


                {/* TIMER */}

                {remaining > 0 && r.status === "pending" && (

                  <p className="mt-3 text-[#F4B400] font-semibold">
                    Time Left: {formatTime(remaining)}
                  </p>

                )}


                {/* REJECT MESSAGE */}

                {r.status === "rejected" && (

                  <p className="mt-3 text-red-600 font-semibold">
                    Request Rejected by Customer
                  </p>

                )}


                {/* CUSTOMER PHONE */}

                {showPhone && (

                  <div className="mt-4">

                    <p className="text-sm text-gray-600">
                      Customer Phone
                    </p>

                    <a
                    href={`tel:${r.load.customerPhone}`}
                    className="inline-block mt-2 bg-[#F4B400] px-4 py-2 rounded-lg font-semibold"
                    >
                    Call Customer
                    </a>

                  </div>

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