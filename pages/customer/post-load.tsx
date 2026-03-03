// pages/customer/post-load.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Image from "next/image";

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
    price: "",
    instructions: "",
  });

  const handleChange = (e:any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) return alert("Login required");

    await addDoc(collection(db, "loads"), {
      ...form,
      customerId: uid,
      createdAt: serverTimestamp(),
    });

    alert("Load Posted Successfully 🚚");
    router.push("/customer/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* HEADER */}
      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
        <div onClick={()=>router.push("/customer/dashboard")}
          className="flex items-center gap-3 cursor-pointer">
          <Image src="/logo.jpg" alt="logo" width={45} height={45} className="rounded-full"/>
          <h1 className="text-2xl font-extrabold">
            <span className="text-black">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-black">RIDE</span>
          </h1>
        </div>

        <button onClick={()=>router.push("/customer/dashboard")}
          className="text-[#F4B400] font-semibold">
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
            <Input name="price" label="Proposed Price (₹)" onChange={handleChange}/>
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold">Additional Instructions</label>
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

/* INPUT COMPONENT */
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