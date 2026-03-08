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
  FaUserCircle,
  FaBars
} from "react-icons/fa";

import Image from "next/image";

/* VEHICLE NUMBER VALIDATION */

const isValidVehicleNumber = (num: string) => {
  return /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(num.toUpperCase());
};

export default function PostVehicle() {

  const router = useRouter();

  const [sidebarOpen,setSidebarOpen] = useState(false);
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

<div className="min-h-screen bg-[#FAFAFA] text-[#111]">

{/* SIDEBAR */}

<div
className={`fixed top-0 left-0 h-full w-64 bg-[#0B0B0B] text-white transform ${
sidebarOpen ? "translate-x-0" : "-translate-x-full"
} transition-transform duration-300 z-50`}
>

<div className="py-6 px-5">

<h2 className="text-xl font-bold mb-8">
<span>LINK</span>
<span className="text-[#F4B400]">N</span>
<span>RIDE</span>
</h2>

<nav className="flex flex-col gap-2 text-sm">

<SidebarBtn icon={<FaHome/>} text="Dashboard" route="/owner/dashboard" router={router}/>
<SidebarBtn icon={<FaUserTie/>} text="Hire Drivers" route="/owner/hire-drivers" router={router}/>
<SidebarBtn icon={<FaSyncAlt/>} text="Active Requests" route="/owner/active-requests" router={router}/>
<SidebarBtn icon={<FaRoute/>} text="Ongoing Trips" route="/owner/ongoing-trips" router={router}/>
<SidebarBtn icon={<FaHistory/>} text="Trip History" route="/owner/trip-history" router={router}/>
<SidebarBtn icon={<FaUser/>} text="Profile" route="/owner/profile" router={router}/>
<SidebarBtn icon={<FaBell/>} text="Notifications" route="/owner/notifications" router={router}/>

</nav>

</div>

</div>

{/* OVERLAY */}

{sidebarOpen && (

<div
className="fixed inset-0 bg-black/40 z-40"
onClick={()=>setSidebarOpen(false)}
></div>

)}

{/* HEADER */}

<header className="bg-white border-b px-8 py-4 flex justify-between items-center">

<div className="flex items-center gap-4">

<button
onClick={()=>setSidebarOpen(true)}
className="text-2xl"
>
<FaBars/>
</button>

<div
onClick={()=>router.push("/owner/dashboard")}
className="flex items-center gap-3 cursor-pointer"
>

<Image
src="/logo.jpg"
alt="logo"
width={36}
height={36}
className="rounded-full"
/>

<h1 className="text-xl font-bold">
LINK<span className="text-[#F4B400]">N</span>RIDE
</h1>

</div>

</div>


{/* USER MENU */}

<div className="relative">

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="flex items-center gap-2"
>

<FaUserCircle className="text-3xl text-[#F4B400]" />


</button>

{menuOpen &&(

<div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">

<button
onClick={()=>router.push("/owner/profile")}
className="dropdown"
>
View Profile
</button>

<button
onClick={()=>{
localStorage.clear();
router.push("/login");
}}
className="dropdown text-red-600"
>
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
className="px-8 py-12"
>

<div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-8">

<h2 className="text-2xl font-bold text-center mb-6">
Add Vehicle Availability
</h2>

<form onSubmit={handleSubmit}>

<div className="grid md:grid-cols-2 gap-6">

<Input label="Vehicle Number *" name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange}/>
<Select label="Vehicle Type" name="vehicleType" value={form.vehicleType} onChange={handleChange}/>
<Input label="Capacity (tons)" name="capacity" value={form.capacity} onChange={handleChange}/>
<Input label="Pickup Location *" name="pickupLocation" value={form.pickupLocation} onChange={handleChange}/>
<Input label="Drop Location *" name="dropLocation" value={form.dropLocation} onChange={handleChange}/>
<Input type="date" label="Available Date *" name="availableDate" value={form.availableDate} onChange={handleChange}/>
<Input type="time" label="Available Time" name="availableTime" value={form.availableTime} onChange={handleChange}/>

</div>

{error && <p className="text-red-600 mt-4">{error}</p>}

<button
type="submit"
className="mt-8 w-full border-2 border-[#F4B400] bg-white text-black py-3 rounded-xl font-semibold hover:bg-[#EAD7A1] transition duration-200"
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

<style jsx>{`

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


/* SIDEBAR BUTTON */

function SidebarBtn({icon,text,route,router}:any){

return(

<button
onClick={()=>router.push(route)}
className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F4B40020] hover:text-[#F4B400] transition"
>
{icon} {text}
</button>

);

}


/* INPUT */

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