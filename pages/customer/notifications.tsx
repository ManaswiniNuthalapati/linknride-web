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


  return (
  <div className="min-h-screen bg-[#F5F6F8] flex flex-col">

    {/* HEADER */}
    <header className="flex justify-between items-center px-8 py-4 bg-white border-b">
      <h1 className="text-2xl font-bold text-black">Notifications</h1>

      <button
        onClick={() => router.push("/customer/dashboard")}
        className="text-black font-semibold hover:underline"
      >
        ← Back to Dashboard
      </button>
    </header>

    {/* CONTENT */}
    <div className="max-w-5xl mx-auto w-full p-6 flex-grow">

      {notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
          No notifications yet
        </div>
      ) : (
        <div className="space-y-5">

          {notifications.map((n) => (
            <motion.div
              key={n.id}
              whileHover={{ y: -4 }}
              onClick={() =>
                router.push(`/customer/my-requests?loadId=${n.loadId}`)
              }
              className="
                bg-white
                border border-gray-200
                rounded-xl
                p-5
                shadow-sm
                cursor-pointer
                transition
                hover:border-yellow-400
                hover:shadow-[0_8px_30px_rgba(250,204,21,0.25)]
                flex justify-between items-center
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">

                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaTruck className="text-[#F4B400]" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {n.ownerName} confirmed your load
                  </p>

                  <p className="text-sm text-gray-600">
                    {n.pickup} → {n.drop}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {n.createdAt?.seconds
                      ? new Date(n.createdAt.seconds * 1000).toLocaleString()
                      : ""}
                  </p>
                </div>

              </div>

              {/* DELETE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(n.id);
                }}
                className="text-gray-400 hover:text-red-600 text-lg font-bold transition"
              >
                ✖
              </button>

            </motion.div>
          ))}

        </div>
      )}

    </div>

    {/* FOOTER */}
    <footer className="text-center text-gray-500 text-sm py-4 border-t">
      © {new Date().getFullYear()} LinknRide. All rights reserved.
    </footer>

  </div>
);
}