// pages/owner/view-history.tsx

import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc
} from "firebase/firestore";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import {
  FaTruck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserTie,
  FaRupeeSign
} from "react-icons/fa";

import Image from "next/image";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function ViewHistory() {

  const router = useRouter();

  const [history,setHistory] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);
  const [noDataAnim,setNoDataAnim] = useState<any | null>(null);

  /* LOAD EMPTY ANIMATION */

  useEffect(()=>{

    let mounted = true;

    (async()=>{

      try{

        const res = await fetch("/animations/no-data.json");
        const json = await res.json();

        if(mounted) setNoDataAnim(json);

      }
      catch{
        setNoDataAnim(null);
      }

    })();

    return ()=>{ mounted = false };

  },[]);



  /* FETCH HISTORY */

  useEffect(()=>{

    const fetchHistory = async()=>{

      try{

        const uid = localStorage.getItem("linknride_uid");
        if(!uid) return;

        const q = query(
          collection(db,"requests"),
          where("ownerId","==",uid),
          orderBy("createdAt","desc")
        );

        const snapshot = await getDocs(q);

        const results:any[] = [];

        for(const docSnap of snapshot.docs){

          const data:any = docSnap.data();

          if(
            data.status !== "completed" &&
            data.status !== "rejected" &&
            data.status !== "expired"
          ){
            continue;
          }

          let loadData:any = null;

          if(data.loadId){

            const loadSnap = await getDoc(doc(db,"loads",data.loadId));

            if(loadSnap.exists()){
              loadData = loadSnap.data();
            }

          }

          results.push({
            id:docSnap.id,
            ...data,
            load:loadData
          });

        }

        setHistory(results);

      }
      catch(err){

        console.error(err);
        setHistory([]);

      }
      finally{

        setLoading(false);

      }

    };

    fetchHistory();

  },[]);



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

      <h2 className="text-2xl font-bold text-center mb-10">
        Trip History
      </h2>


      {loading ? (

        <p className="text-center text-gray-600">
          Loading trip history...
        </p>

      ) : history.length === 0 ? (

        <div className="flex flex-col items-center mt-10">

          {noDataAnim ? (
            <div className="w-64 h-64">
              {/* @ts-ignore */}
              <Lottie animationData={noDataAnim} loop />
            </div>
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-white rounded-lg shadow">
              <span className="text-sm text-gray-400">
                No animation
              </span>
            </div>
          )}

          <p className="text-gray-600 mt-4 text-center">
            No trip history yet.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {history.map((trip)=>(

            <motion.div
              key={trip.id}
              whileHover={{y:-6}}
              className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#F4B400] shadow-sm hover:shadow-xl transition"
            >

              {/* LOAD TYPE */}

              <div className="flex items-center gap-3 mb-4">
                <FaTruck className="text-[#F4B400] text-2xl" />
                <h3 className="font-semibold text-lg">
                  {trip.load?.loadType || "General Goods"}
                </h3>
              </div>


              {/* DETAILS */}

              <div className="space-y-2 text-sm text-gray-700">

                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  <strong>Pickup:</strong> {trip.load?.pickup || "N/A"}
                </p>

                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  <strong>Drop:</strong> {trip.load?.drop || "N/A"}
                </p>

                <p className="flex items-center gap-2">
                  <FaCalendarAlt className="text-[#F4B400]" />
                  <strong>Date:</strong>{" "}
                  {trip.completedAt
                    ? new Date(trip.completedAt.seconds * 1000).toLocaleDateString()
                    : "N/A"}
                </p>

                <p className="flex items-center gap-2">
                  <FaUserTie className="text-[#F4B400]" />
                  <strong>Driver:</strong>{" "}
                  {trip.driverName || "Not Assigned"}
                </p>

                <p>
                  <strong>Vehicle:</strong>{" "}
                  {trip.vehicleNumber || "N/A"}
                </p>

                <p>
                  <FaRupeeSign className="inline" />
                  <strong> Price:</strong>{" "}
                  {trip.finalPrice || trip.ownerPrice || "N/A"}
                </p>


                {/* STATUS */}

                <p
                  className={`font-semibold mt-2 ${
                    trip.status === "completed"
                      ? "text-green-600"
                      : trip.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {trip.status?.toUpperCase()}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      )}

    </div>



    {/* FOOTER */}

    <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
      © {new Date().getFullYear()}{" "}
      <span className="text-[#F4B400] font-semibold">
        LinknRide
      </span>
    </footer>

  </div>

  );

}