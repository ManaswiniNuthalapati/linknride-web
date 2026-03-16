import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

type RequestType = {
  id: string;
  loadId: string;
  ownerPrice: number;
  status: string;
  load: any;
};

export default function CustomerMyRequests() {

  const router = useRouter();

  const [requests,setRequests] = useState<RequestType[]>([]);
  const [loading,setLoading] = useState(true);
  const [timeLeft,setTimeLeft] = useState<{[key:string]:number}>({});

  /* FETCH CUSTOMER REQUESTS */

  useEffect(()=>{

    const uid = localStorage.getItem("linknride_uid");

    if(!uid){
      setLoading(false);
      return;
    }

    const q = query(
  collection(db,"requests"),
  where("customerId","==",uid),
  where("status","==","pending")
);
    const unsub = onSnapshot(q, async(snapshot)=>{

      const temp:RequestType[] = [];

      for(const d of snapshot.docs){

        const data:any = d.data();

        if(!data.loadId) continue;

        const loadSnap = await getDoc(doc(db,"loads",data.loadId));

        if(!loadSnap.exists()) continue;

        temp.push({
          id:d.id,
          ...data,
          load:loadSnap.data()
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

    const updated:{[key:string]:number} = {};

    requests.forEach((r)=>{

      if(!r.load?.lockExpiresAt) return;

      const remaining = r.load.lockExpiresAt - Date.now();

      updated[r.id] = remaining > 0 ? remaining : 0;

      if(remaining <= 0){

        updateDoc(doc(db,"requests",r.id),{
          status:"expired"
        });

        updateDoc(doc(db,"loads",r.loadId),{
          status:"open",
          lockedBy:null,
          lockExpiresAt:null
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

  /* ACCEPT LOAD */

  const handleAccept = async(req:RequestType)=>{

    await updateDoc(doc(db,"requests",req.id),{
      status:"accepted"
    });

    await updateDoc(doc(db,"loads",req.loadId),{
      status:"booked"
    });

    alert("Load booked successfully");

  };

  /* REJECT LOAD */

  const handleReject = async(req:RequestType)=>{

  try{

    // update request status
    await updateDoc(doc(db,"requests",req.id),{
      status:"rejected",
      updatedAt:new Date()
    });

    // unlock load
    await updateDoc(doc(db,"loads",req.loadId),{
      status:"open",
      lockedBy:null,
      lockExpiresAt:null
    });

    alert("Request rejected");

  }catch(err){
    console.log(err);
  }

};
  return(

    <div className="min-h-screen flex flex-col bg-[#F5F6F8]">

      <header className="bg-white shadow-sm px-10 py-4 flex justify-between items-center">

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={()=>router.push("/customer/dashboard")}
        >

          <Image
            src="/logo.jpg"
            alt="Logo"
            width={36}
            height={36}
            className="rounded-full"
          />

          <h1 className="text-2xl font-bold text-black">
            LinknRide
          </h1>

        </div>

        <button
          onClick={()=>router.push("/customer/dashboard")}
          className="text-sm text-black font-semibold hover:underline"
        >

          ← Back to Dashboard

        </button>

      </header>


      <motion.section className="flex-grow px-10 py-10">

        <h2 className="text-2xl font-bold text-black mb-8 text-center">
          Active Requests
        </h2>

        {loading ? (

          <div className="bg-white p-6 rounded-lg shadow text-center">
            Loading...
          </div>

        ) : requests.length===0 ? (

          <div className="bg-white p-8 rounded-lg shadow text-center">
            No active requests.
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

  {requests
  .filter(r => r.status === "pending")
  .map((r)=>{

    const remaining = timeLeft[r.id] || 0;

    return(
                <motion.div
                  key={r.id}
                  whileHover={{y:-6}}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 hover:border-yellow-400"
                >

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {r.load.pickup} → {r.load.drop}
                  </h3>

                  <p className="text-sm text-gray-600">
                    Customer Price: ₹{r.load.price}
                  </p>

                  <p className="text-lg font-semibold text-green-600">
                    Owner Offer: ₹{r.ownerPrice}
                  </p>

                  {remaining>0 && (

                    <p className="mt-3 text-[#F4B400] font-semibold">
                      Time Left: {formatTime(remaining)}
                    </p>

                  )}

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={()=>handleAccept(r)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Accept
                    </button>

                    <button
                      onClick={()=>handleReject(r)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>

                  </div>

                </motion.div>

              )

            })}

          </div>

        )}

      </motion.section>

      <footer className="bg-white border-t text-center text-gray-500 text-sm py-4">
        © {new Date().getFullYear()} LinknRide
      </footer>

    </div>

  );

}