import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { motion } from "framer-motion";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

type Vehicle = {
  vehicleNumber: string;
  rcNumber: string;
  vehicleType: string;
  capacity: string;
};

export default function EditOwnerProfile() {

  const router = useRouter();

  const [loading,setLoading] = useState(true);

  const [fullName,setFullName] = useState("");
  const [phone,setPhone] = useState("");
  const [email,setEmail] = useState("");
  const [address,setAddress] = useState("");
  const [city,setCity] = useState("");
  const [stateVal,setStateVal] = useState("");
  const [pincode,setPincode] = useState("");

  const [vehicles,setVehicles] = useState<Vehicle[]>([]);

  const [saving,setSaving] = useState(false);
  const [error,setError] = useState("");



  /* LOAD PROFILE DATA */

  useEffect(()=>{

    const loadProfile = async()=>{

      try{

        const uid = localStorage.getItem("linknride_uid");

        if(!uid) return;

        const snap = await getDoc(doc(db,"owners",uid));

        if(snap.exists()){

          const data:any = snap.data();

          setFullName(data.fullName || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setAddress(data.address || "");
          setCity(data.city || "");
          setStateVal(data.state || "");
          setPincode(data.pincode || "");

          if(data.vehicles){
            setVehicles(data.vehicles);
          }

        }

      }catch(err){
        console.error(err);
      }

      setLoading(false);

    };

    loadProfile();

  },[]);



  /* PINCODE AUTO CITY */

  useEffect(()=>{

    const fetchLocation = async()=>{

      if(pincode.length !== 6) return;

      try{

        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);

        const data = await res.json();

        if(data[0].Status === "Success"){

          setCity(data[0].PostOffice[0].District);
          setStateVal(data[0].PostOffice[0].State);

        }

      }catch(err){
        console.error(err);
      }

    };

    fetchLocation();

  },[pincode]);



  /* VEHICLES */

  const addVehicle = ()=>{

    setVehicles([
      ...vehicles,
      {vehicleNumber:"",rcNumber:"",vehicleType:"",capacity:""}
    ]);

  };


  const removeVehicle = (index:number)=>{

    setVehicles(vehicles.filter((_,i)=>i!==index));

  };


  const handleVehicleChange = (index:number,name:string,value:string)=>{

    const updated = [...vehicles];

    updated[index][name as keyof Vehicle] = value;

    setVehicles(updated);

  };



  /* SAVE PROFILE */

  const handleSubmit = async(e:FormEvent)=>{

    e.preventDefault();

    setSaving(true);

    try{

      const uid = localStorage.getItem("linknride_uid");

      if(!uid) throw new Error("Not authenticated");

      await updateDoc(doc(db,"owners",uid),{

        fullName,
        email,
        address,
        city,
        state:stateVal,
        pincode,
        vehicles

      });

      alert("Profile Updated");

      router.push("/owner/profile");

    }catch(err){

      console.error(err);

      setError("Failed to update profile");

    }

    setSaving(false);

  };



  if(loading){

    return(

      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading profile...
      </div>

    );

  }



  return(

<div className="min-h-screen bg-[#FAFAFA] flex justify-center px-6 py-10">

<motion.form
onSubmit={handleSubmit}
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="bg-white w-full max-w-5xl rounded-2xl shadow-xl p-10 border"
>

<div className="flex items-center justify-between mb-8">

  <h2 className="text-2xl font-bold">
    Edit Owner Profile
  </h2>

  <button
    onClick={() => router.push("/owner/dashboard")}
    className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
  >
    <FaArrowLeft />
    Back to Dashboard
  </button>

</div>



{/* BASIC DETAILS */}

<div className="grid md:grid-cols-2 gap-6">

<Input label="Full Name" value={fullName} onChange={setFullName} />

<Input label="Phone" value={phone} disabled />

<Input label="Email" value={email} onChange={setEmail} />

<Input label="Pincode" value={pincode} onChange={setPincode} />

<Input label="City" value={city} disabled />

<Input label="State" value={stateVal} disabled />

<Input label="Address" value={address} onChange={setAddress} />

</div>



{/* VEHICLES */}

<div className="mt-10">

<div className="flex justify-between items-center mb-4">

<h3 className="text-lg font-bold">

Vehicles

</h3>

<button
type="button"
onClick={addVehicle}
className="bg-[#F4B400] px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
>

<FaPlus/> Add Vehicle

</button>

</div>



{vehicles.map((v,i)=>(

<div
key={i}
className="grid md:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-xl mb-4 border"
>

<Input
label="Vehicle No"
value={v.vehicleNumber}
onChange={(val)=>handleVehicleChange(i,"vehicleNumber",val)}
/>

<Input
label="RC No"
value={v.rcNumber}
onChange={(val)=>handleVehicleChange(i,"rcNumber",val)}
/>

<Input
label="Type"
value={v.vehicleType}
onChange={(val)=>handleVehicleChange(i,"vehicleType",val)}
/>

<Input
label="Capacity"
value={v.capacity}
onChange={(val)=>handleVehicleChange(i,"capacity",val)}
/>

<button
type="button"
onClick={()=>removeVehicle(i)}
className="text-red-500"
>
<FaTrash/>
</button>

</div>

))}

</div>



{error && <p className="text-red-600 mt-4">{error}</p>}



<button
type="submit"
disabled={saving}
className="w-full mt-8 py-3 bg-[#F4B400] hover:bg-[#e0a800] rounded-xl font-semibold"
>

{saving ? "Saving..." : "Save Changes"}

</button>



</motion.form>

</div>

  );

}



/* INPUT COMPONENT */

function Input({label,value,onChange,disabled=false}:any){

return(

<div className="flex flex-col gap-1">

<label className="text-sm font-semibold">

{label}

</label>

<input
value={value}
disabled={disabled}
onChange={(e)=>onChange?.(e.target.value)}
className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#F4B400] outline-none"
/>

</div>

);

}