import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "next/router";
import Image from "next/image";

import {
  FiTruck,
  FiMapPin,
  FiPackage,
  FiCalendar,
  FiClock,
} from "react-icons/fi";

type LoadItem = {
  id: string;
  pickup?: string;
  drop?: string;
  pickupDate?: string;
  pickupTime?: string;
  capacityRequired?: number;
  price?: number;
  customerId?: string;
  typeOfGoods?: string;

  status?: string;
  lockedBy?: string;
  lockExpiresAt?: number;
};

export default function OwnerSearchLoads() {

  const router = useRouter();
  const { loadId } = router.query;


  const [search, setSearch] = useState({ pickup: "", drop: "" });
  const [loads, setLoads] = useState<LoadItem[]>([]);
  const [selectedLoad,setSelectedLoad] = useState<LoadItem | null>(null);
  const [bidPrice,setBidPrice] = useState(0);
  

  const ownerId =
    typeof window !== "undefined"
      ? localStorage.getItem("linknride_uid")
      : null;

  useEffect(()=>{
    if(!ownerId) router.push("/login");
  },[router,ownerId]);

  /* FETCH LOADS */

  useEffect(()=>{

    const loadsRef = collection(db,"loads");

    let q:any = query(loadsRef,orderBy("createdAt","desc"));

    if(search.pickup && search.drop){
      q = query(
        loadsRef,
        where("pickup","==",search.pickup),
        where("drop","==",search.drop),
        orderBy("createdAt","desc")
      );
    }

    const unsub = onSnapshot(q,(snap)=>{

      const now = Date.now();

      const items:LoadItem[] = snap.docs.map((d)=>({
        id:d.id,
        ...(d.data() as any)
      }));

      /* Hide locked loads from other owners */

      const visibleLoads = items.filter(load => {

        if(load.status !== "locked") return true;

        if(load.lockedBy === ownerId) return true;

        if(load.lockExpiresAt && load.lockExpiresAt < now) return true;

        return false;

      });

      setLoads(visibleLoads);

    });

    return ()=>unsub();

  },[search,ownerId]);

  const handleChange = (e:any)=>
    setSearch({...search,[e.target.name]:e.target.value});

  const handleSearch = (e:any)=>e.preventDefault();


  /* ACCEPT LOAD */

  const handleAcceptLoad = async (load:LoadItem,price:number)=>{

  try{

    if(!ownerId) return;

    const commission = Math.round(price * 0.05);
    const ownerEarning = Math.round(price * 0.95);

    const now = Date.now();
    const lockExpiresAt = now + (30 * 60 * 1000);

    /* LOCK LOAD */

    await updateDoc(doc(db,"loads",load.id),{
      status:"locked",
      lockedBy:ownerId,
      lockExpiresAt
    });

    /* CREATE CUSTOMER REQUEST */

    await addDoc(collection(db,"requests"),{
      loadId:load.id,
      customerId:load.customerId,
      ownerId,
      ownerPrice:price,
      customerPrice:load.price,
      commission,
      ownerEarning,
      status:"pending",
      createdAt:serverTimestamp(),
      lockExpiresAt
    });

    /* GET OWNER NAME */

    const userSnap = await getDocs(
      query(collection(db,"users"), where("uid","==",ownerId))
    );

    let ownerName = "Owner";

    userSnap.forEach((doc)=>{
      ownerName = doc.data()?.profile?.fullName || "Owner";
    });

    /* SEND CUSTOMER NOTIFICATION */

    await addDoc(collection(db,"notifications"),{
      userId:load.customerId,
      ownerName:ownerName,
      message:`${ownerName} accepted your load`,
      pickup:load.pickup,
      drop:load.drop,
      loadId:load.id,
      type:"loadAccepted",
      createdAt:serverTimestamp()
    });

    router.push("/owner/my-requests");

  }catch(err){
    console.error(err);
    alert("Error accepting load");
  }

};
  return(
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">

      {/* HEADER */}

      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">

        <div
          onClick={()=>router.push("/owner/dashboard")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Image src="/logo.jpg" alt="logo" width={45} height={45} className="rounded-full"/>

          <h1 className="text-2xl font-extrabold">
            <span className="text-black">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-black">RIDE</span>
          </h1>
        </div>

        <button
          onClick={()=>router.push("/owner/dashboard")}
          className="px-5 py-2 border-2 border-[#F4B400] rounded-lg hover:bg-[#FFE8A3]"
        >
          Back
        </button>

      </header>


      {/* SEARCH */}

      <motion.form
        onSubmit={handleSearch}
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className="px-6 py-14 flex justify-center"
      >

        <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-10 border">

          <h2 className="text-2xl font-bold text-center mb-8">
            Search Loads
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <Input name="pickup" label="Pickup Location" value={search.pickup} onChange={handleChange}/>
            <Input name="drop" label="Drop Location" value={search.drop} onChange={handleChange}/>

          </div>

          <button
            type="submit"
            className="mt-10 w-full py-3 font-semibold rounded-xl bg-[#F4B400] text-black hover:bg-[#e0a800]"
          >
            Search Loads
          </button>

        </div>

      </motion.form>


      {/* LOAD CARDS */}

<div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 mb-16">

{loads.map((load) => (

<motion.div
  key={load.id}
  whileHover={{ y: -6, scale: 1.02 }}
  className={`bg-white rounded-2xl shadow-md p-14 border-2 transition hover:shadow-xl ${
    load.id === loadId
      ? "border-[#F4B400] bg-yellow-50"
      : "border-gray-200 hover:border-[#F4B400]"
  }`}
>

  <div className="flex items-center gap-3 text-xl font-semibold mb-5">
    <FiTruck className="text-[#F4B400] text-2xl"/>
    {load.typeOfGoods}
  </div>

  <p className="flex items-center gap-3 text-gray-600 mb-3">
    <FiMapPin className="text-[#F4B400] text-xl"/>
    {load.pickup} → {load.drop}
  </p>

  <p className="flex items-center gap-3 text-gray-600 mb-3">
    <FiCalendar className="text-[#F4B400]"/>
    {load.pickupDate}
    <FiClock className="ml-3 text-[#F4B400]"/>
    {load.pickupTime}
  </p>

  <p className="flex items-center gap-3 text-gray-600 mb-6">
    <FiPackage className="text-[#F4B400] text-xl"/>
    Capacity: {load.capacityRequired} tons
  </p>

  <p className="text-lg font-semibold mb-6">
    Customer Price: ₹ {load.price}
  </p>

  <button
    onClick={()=>{
      setSelectedLoad(load);
      setBidPrice(load.price || 0);
    }}
    className="w-full py-3 rounded-xl border-2 border-gray-300 font-semibold hover:bg-gray-100"
  >
    View Details
  </button>

</motion.div>

))}

</div>

      {/* MODAL */}

      {selectedLoad && (

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white w-[420px] rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Load Details
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">

            <p className="text-gray-600 text-sm">Route</p>

            <p className="font-semibold text-lg">
              {selectedLoad.pickup} → {selectedLoad.drop}
            </p>

          </div>

          <div className="mb-6">

            <p className="text-sm text-gray-500">Customer Price</p>

            <p className="text-2xl font-bold text-[#F4B400]">
              ₹{selectedLoad.price}
            </p>

          </div>

          <div className="mb-6">

            <input
              type="range"
              min={selectedLoad.price || 0}
              max={Math.round((selectedLoad.price || 0) * 1.1)}
              value={bidPrice}
              onChange={(e)=>setBidPrice(Number(e.target.value))}
              className="w-full accent-[#F4B400]"
            />

          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">

            <div className="flex justify-between">
              <span>Your Price</span>
              <span className="font-semibold">₹{bidPrice}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Platform Fee (5%)</span>
              <span>₹{Math.round(bidPrice*0.05)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Your Earnings</span>
              <span className="text-green-600">
                ₹{Math.round(bidPrice*0.95)}
              </span>
            </div>

          </div>

          <div className="flex gap-4">

            <button
              onClick={()=>setSelectedLoad(null)}
              className="flex-1 py-3 rounded-lg border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={()=>handleAcceptLoad(selectedLoad,bidPrice)}
              className="flex-1 py-3 rounded-lg bg-[#F4B400] font-semibold hover:bg-[#e0a800]"
            >
              Accept Load
            </button>

          </div>

        </div>

      </div>

      )}

      <footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
        © {new Date().getFullYear()} <span className="text-[#F4B400] font-semibold">LinknRide</span>
      </footer>

    </div>
  );
}

function Input({label,name,value,onChange,type="text"}:any){
  return(
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-[#F4B400] outline-none"
      />
    </div>
  );
}