import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import {
  FaHome,
  FaUserTie,
  FaSyncAlt,
  FaRoute,
  FaHistory,
  FaUser,
  FaBell,
  FaIdBadge,
  FaUserCircle
} from "react-icons/fa";

import Image from "next/image";

/* VEHICLE NUMBER VALIDATION */
const isValidVehicleNumber = (num: string) => {
  return /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(num.toUpperCase());
};

export default function PostVehicle() {

  const router = useRouter();
  const [menuOpen,setMenuOpen] = useState(false);

  const [form,setForm] = useState({
    vehicleNumber:"",
    vehicleType:"",
    capacity:"",
    pickupLocation:"",
    dropLocation:"",
    availableDate:"",
    availableTime:""
  });

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [vehicleValid,setVehicleValid] = useState(true);

  const handleChange = (e:any)=>{
    const {name,value} = e.target;

    setForm({...form,[name]:value});

    if(name === "vehicleNumber"){
      setVehicleValid(isValidVehicleNumber(value));
    }
  };

  const handleSubmit = async(e:FormEvent)=>{

    e.preventDefault();

    setError("");
    setLoading(true);

    try{

      const uid = localStorage.getItem("linknride_uid");

      if(!uid) throw new Error("User not authenticated");

      if(
        !form.vehicleNumber ||
        !form.pickupLocation ||
        !form.dropLocation ||
        !form.availableDate
      ){
        throw new Error("Please fill required fields");
      }

      if(!vehicleValid) throw new Error("Invalid vehicle number");

      await addDoc(collection(db,"vehicles"),{
        ownerId:uid,
        vehicleNumber:form.vehicleNumber.toUpperCase(),
        vehicleType:form.vehicleType,
        capacity:form.capacity,
        pickupLocation:form.pickupLocation,
        dropLocation:form.dropLocation,
        availableDate:form.availableDate,
        availableTime:form.availableTime,
        status:"available",
        postedAt:serverTimestamp()
      });

      alert("Vehicle posted successfully");

      router.push("/owner/dashboard");

    }catch(err:any){

      setError(err.message);

    }finally{

      setLoading(false);

    }

  };

  return(

<div className="min-h-screen flex bg-[#FAFAFA] text-[#111]">

{/* SIDEBAR */}

<aside className="w-64 bg-[#0B0B0B] text-white flex flex-col py-6 px-4">

<div className="mb-8">
<h2 className="text-xl font-bold">
<span className="text-white">LINK</span>
<span className="text-[#F4B400]">N</span>
<span className="text-white">RIDE</span>
</h2>
<p className="text-sm text-gray-400">Owner Panel</p>
</div>

<nav className="flex flex-col gap-2 text-sm">

<button onClick={()=>router.push("/owner/dashboard")}
className="nav-btn">
<FaHome/> Dashboard
</button>

<button onClick={()=>router.push("/owner/hire-drivers")}
className="nav-btn">
<FaUserTie/> Hire Drivers
</button>

<button onClick={()=>router.push("/owner/active-requests")}
className="nav-btn">
<FaSyncAlt/> Active Requests
</button>

<button onClick={()=>router.push("/owner/ongoing-trips")}
className="nav-btn">
<FaRoute/> Ongoing Trips
</button>

<button onClick={()=>router.push("/owner/trip-history")}
className="nav-btn">
<FaHistory/> Trip History
</button>

<button onClick={()=>router.push("/owner/profile")}
className="nav-btn">
<FaUser/> Profile
</button>

<button onClick={()=>router.push("/owner/notifications")}
className="nav-btn">
<FaBell/> Notifications
</button>

</nav>

</aside>


{/* MAIN AREA */}

<div className="flex-1 flex flex-col">


{/* HEADER */}

<header className="bg-white border-b px-10 py-4 flex justify-between items-center">

<div onClick={()=>router.push("/owner/dashboard")}
className="flex items-center gap-3 cursor-pointer">

<Image
src="/logo.jpg"
alt="logo"
width={36}
height={36}
className="rounded-full"
/>

<h1 className="text-xl font-bold text-black">
LINK<span className="text-[#F4B400]">N</span>RIDE
</h1>

</div>


<div className="relative">

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="flex items-center gap-2">

<FaUserCircle className="text-3xl text-black"/>
<span className="text-sm">Owner ▾</span>

</button>

{menuOpen &&(

<div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">

<button
onClick={()=>router.push("/owner/profile")}
className="dropdown">
View Profile
</button>

<button
onClick={()=>{
localStorage.clear();
router.push("/login");
}}
className="dropdown text-red-600">
Logout
</button>

</div>

)}

</div>

</header>


{/* FORM */}

<motion.section
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="flex-grow px-10 py-12"
>

<div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-8">

<h2 className="text-2xl font-bold text-center mb-6">
Add Vehicle Availability
</h2>

<form onSubmit={handleSubmit}>

<div className="grid md:grid-cols-2 gap-6">

<Input
label="Vehicle Number *"
name="vehicleNumber"
value={form.vehicleNumber}
onChange={handleChange}
/>

<Select
label="Vehicle Type"
name="vehicleType"
value={form.vehicleType}
onChange={handleChange}
/>

<Input
label="Capacity (tons)"
name="capacity"
value={form.capacity}
onChange={handleChange}
/>

<Input
label="Pickup Location *"
name="pickupLocation"
value={form.pickupLocation}
onChange={handleChange}
/>

<Input
label="Drop Location *"
name="dropLocation"
value={form.dropLocation}
onChange={handleChange}
/>

<Input
type="date"
label="Available Date *"
name="availableDate"
value={form.availableDate}
onChange={handleChange}
/>

<Input
type="time"
label="Available Time"
name="availableTime"
value={form.availableTime}
onChange={handleChange}
/>

</div>

{error && <p className="text-red-600 mt-4">{error}</p>}

<button
type="submit"
className="mt-8 w-full bg-[#F4B400] hover:bg-[#e0a800] text-black py-3 rounded-xl font-semibold"
>
{loading ? "Posting..." : "Post Vehicle"}
</button>

</form>

</div>

</motion.section>


{/* FOOTER */}

<footer className="bg-[#0B0B0B] text-white text-center text-sm py-4">
© {new Date().getFullYear()} LinknRide
</footer>

</div>

<style jsx>{`

.nav-btn{
display:flex;
gap:10px;
align-items:center;
padding:12px;
border-radius:8px;
color:#ccc;
}

.nav-btn:hover{
background:#F4B40020;
color:#F4B400;
}

.dropdown{
display:block;
width:100%;
padding:10px 16px;
text-align:left;
}

.dropdown:hover{
background:#f3f3f3;
}

`}</style>

</div>
);
}

/* INPUT COMPONENT */

function Input({label,name,value,onChange,type="text"}:any){
return(
<div>
<label className="block mb-2 font-medium">{label}</label>
<input
type={type}
name={name}
value={value}
onChange={onChange}
className="w-full border rounded-lg px-4 py-2 focus:border-[#F4B400] outline-none"
/>
</div>
);
}

/* SELECT */

function Select({label,name,value,onChange}:any){
return(
<div>
<label className="block mb-2 font-medium">{label}</label>
<select
name={name}
value={value}
onChange={onChange}
className="w-full border rounded-lg px-4 py-2 focus:border-[#F4B400]"
>
<option value="">Select Type</option>
<option>Truck</option>
<option>Mini Truck</option>
<option>Tempo</option>
<option>Pickup</option>
<option>Container</option>
</select>
</div>
);
}