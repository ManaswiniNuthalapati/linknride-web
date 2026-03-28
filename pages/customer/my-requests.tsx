import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

type RequestType = {
  id: string;
  loadId: string;
  ownerPrice: number;
  ownerId: string;
  status: string;
  load: any;
};

export default function CustomerMyRequests() {

  const router = useRouter();

  const [requests,setRequests] = useState<RequestType[]>([]);
  const [loading,setLoading] = useState(true);
  const [timeLeft,setTimeLeft] = useState<{[key:string]:number}>({});

  const uid =
    typeof window !== "undefined"
    ? localStorage.getItem("linknride_uid")
    : null;

  /* FETCH CUSTOMER REQUESTS */

  useEffect(()=>{

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

  },[uid]);


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


  /* GET CUSTOMER NAME */

  const getCustomerName = async ()=>{

    if(!uid) return "Customer";

    const userSnap = await getDoc(doc(db,"users",uid));

    if(userSnap.exists()){
      return userSnap.data()?.profile?.fullName || "Customer";
    }

    return "Customer";

  };


  /* ACCEPT LOAD */

  const handleAccept = async (req: RequestType) => {

    await updateDoc(doc(db,"requests",req.id),{
      status:"accepted"
    });

    await updateDoc(doc(db,"loads",req.loadId),{
      status:"booked"
    });

    const customerName = await getCustomerName();

    await addDoc(collection(db,"notifications"),{

      userId:req.ownerId,
      customerName:customerName,
      pickup:req.load.pickup,
      drop:req.load.drop,
      message:"accepted your load offer",
      type:"loadAccepted",
      loadId:req.loadId,
      createdAt:serverTimestamp(),
      read:false

    });

    await addDoc(collection(db,"notifications"),{
  userId:req.ownerId,
  customerName:customerName,
  pickup:req.load.pickup,
  drop:req.load.drop,
  message:`${customerName} accepted your load offer`,
  type:"loadAcceptedByCustomer",
  loadId:req.loadId,
  createdAt:serverTimestamp(),
  read:false
});

    alert("Load booked successfully");

  };


  /* REJECT LOAD */

  const handleReject = async(req:RequestType)=>{

    try{

      await updateDoc(doc(db,"requests",req.id),{
        status:"rejected",
        updatedAt:serverTimestamp()
      });

      await updateDoc(doc(db,"loads",req.loadId),{
        status:"open",
        lockedBy:null,
        lockExpiresAt:null
      });

      const customerName = await getCustomerName();

      await addDoc(collection(db,"notifications"),{

        userId:req.ownerId,
        customerName:customerName,
        pickup:req.load.pickup,
        drop:req.load.drop,
        message:"rejected your load offer",
        type:"loadRejected",
        loadId:req.loadId,
        createdAt:serverTimestamp(),
        read:false

      });


      alert("Request rejected");

    }catch(err){
      console.log(err);
    }

  };


  return (
  <div className="min-h-screen bg-[#F5F6F8] flex flex-col">

    {/* HEADER */}
    <header className="flex justify-between items-center px-8 py-4 bg-white border-b">
      <h1 className="text-2xl font-bold text-black">My Requests</h1>

      <button
        onClick={() => router.push("/customer/dashboard")}
        className="text-black font-semibold hover:underline"
      >
        ← Back to Dashboard
      </button>
    </header>

    {/* CONTENT */}
    <motion.div className="max-w-6xl mx-auto w-full p-6 flex-grow">

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Active Requests
      </h2>

      {loading ? (
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          Loading...
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
          No active requests
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {requests.map((r) => {
            const remaining = timeLeft[r.id] || 0;

            return (
              <motion.div
                key={r.id}
                whileHover={{ y: -6 }}
                className="
                  bg-white
                  border border-gray-200
                  rounded-xl
                  p-5
                  shadow-sm
                  transition
                  hover:border-yellow-400
                  hover:shadow-[0_8px_30px_rgba(250,204,21,0.25)]
                "
              >

                {/* TITLE */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {r.load.pickup} → {r.load.drop}
                </h3>

                {/* INFO */}
                <p className="text-sm text-gray-600">
                  Your Price: ₹{r.load.price}
                </p>

                <p className="text-md font-semibold text-green-600 mt-1">
                  Owner Offer: ₹{r.ownerPrice}
                </p>

                {/* TIMER */}
                {remaining > 0 && (
                  <p className="mt-3 text-[#F4B400] font-semibold">
                    ⏳ {formatTime(remaining)} left
                  </p>
                )}

                {/* ACTIONS */}
                <div className="flex gap-3 mt-5">

                  <button
                    onClick={() => handleAccept(r)}
                    className="flex-1 bg-[#F4B400] hover:bg-yellow-500 text-black py-2 rounded-lg font-semibold"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(r)}
                    className="flex-1 border border-gray-300 hover:bg-gray-100 py-2 rounded-lg font-semibold"
                  >
                    Reject
                  </button>

                </div>

              </motion.div>
            );
          })}

        </div>
      )}

    </motion.div>

    {/* FOOTER */}
    <footer className="text-center text-gray-500 text-sm py-4 border-t">
      © {new Date().getFullYear()} LinknRide. All rights reserved.
    </footer>

  </div>
);
}