import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { addDoc, collection, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Image from "next/image";
import { calculateSuggestedPrice } from "../../utils/priceEngine";

export default function PostLoad() {

  const router = useRouter();

  const [form, setForm] = useState({
    typeOfGoods: "",
    capacityRequired: "",
    vehicleType: "",
    pickup: "",
    drop: "",
    pickupDate: "",
    pickupTime: "",
    instructions: "",
  });

  const [suggestedPrice,setSuggestedPrice] = useState(0);
  const [finalPrice,setFinalPrice] = useState("");

  const handleChange = (e:any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Auto calculate suggested price
  useEffect(()=>{

    if(form.vehicleType){

      const distance = 100; // temporary until Google Maps distance added

      const price = calculateSuggestedPrice(distance,form.vehicleType);

      setSuggestedPrice(price);
      setFinalPrice(price.toString());
    }

  },[form.vehicleType]);

  const handleSubmit = async (e:any) => {

  e.preventDefault();

  const uid = localStorage.getItem("linknride_uid");

  if (!uid) return alert("Login required");

  const price = Number(finalPrice);

  const minAllowed = suggestedPrice * 0.97;

  if(price < minAllowed){
    alert("Prices are too low");
    return;
  }

  // 🔹 get customer name from users collection
  const userSnap = await getDoc(doc(db,"users",uid));

let customerName = "Customer";

if(userSnap.exists()){
  const data = userSnap.data();

  customerName =
    data.profile?.fullName ||
    data.name ||
    "Customer";
}
  // 🔹 create load
  const loadRef = await addDoc(collection(db,"loads"),{
    ...form,
    price,
    customerId: uid,
    customerName: customerName,
    createdAt: serverTimestamp(),
    status:"open"
  });

  const loadId = loadRef.id;

  // 🔔 create notification
  await addDoc(collection(db,"notifications"),{
  type:"loadPosted",
  customerName:customerName,
  pickup:form.pickup,
  drop:form.drop,
  loadId:loadId,
  createdAt:serverTimestamp(),
  read:false
});
  alert("Load Posted Successfully 🚚");

  router.push("/customer/dashboard");

};
  return (
    <div className="min-h-screen bg-[#FAFAFA]">

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
          className="text-[#F4B400] font-semibold"
        >
          ← Back to Dashboard
        </button>

      </header>

      {/* FORM */}
      <div className="flex justify-center py-14 px-6">

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl border-2 border-gray-200"
        >

          <h2 className="text-2xl font-bold text-center mb-8">
            Enter Load Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <Input name="typeOfGoods" label="Type of Goods" onChange={handleChange}/>
            <Input name="capacityRequired" label="Required Capacity (Tons)" onChange={handleChange}/>
            <Input name="vehicleType" label="Preferred Vehicle Type" onChange={handleChange}/>
            <Input name="pickup" label="Pickup Location" onChange={handleChange}/>
            <Input name="drop" label="Drop Location" onChange={handleChange}/>
            <Input type="date" name="pickupDate" label="Pickup Date" onChange={handleChange}/>
            <Input type="time" name="pickupTime" label="Pickup Time" onChange={handleChange}/>

          </div>

          {/* Suggested Price */}
          {suggestedPrice > 0 && (

            <div className="mt-6">

              <label className="text-sm font-semibold">
                Suggested Price
              </label>

              <div className="text-xl font-bold text-[#F4B400] mt-2">
                ₹{suggestedPrice}
              </div>

              <label className="text-sm font-semibold mt-4 block">
                Your Price
              </label>

              <input
                type="number"
                value={finalPrice}
                onChange={(e)=>setFinalPrice(e.target.value)}
                className="w-full mt-2 border-2 border-gray-200 rounded-lg px-4 py-3"
              />
            </div>

          )}

          {/* Instructions */}
          <div className="mt-6">

            <label className="text-sm font-semibold">
              Additional Instructions
            </label>

            <textarea
              name="instructions"
              onChange={handleChange}
              className="w-full mt-2 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-[#F4B400] focus:outline-none"
              rows={3}
            />

          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-[#F4B400] hover:bg-[#e0a800] text-black py-3 rounded-xl font-semibold text-lg transition"
          >
            Submit Load
          </button>

        </form>

      </div>
    </div>
  );
}

function Input({label,name,onChange,type="text"}:any){
  return(
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        className="w-full mt-2 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-[#F4B400] focus:outline-none"
      />
    </div>
  );
}