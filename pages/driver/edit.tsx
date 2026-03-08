import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebaseConfig";
import Image from "next/image";

export default function EditDriverProfile() {

const router = useRouter();
const [loading,setLoading]=useState(true);
const [saving,setSaving]=useState(false);

const [form,setForm]=useState({
fullName:"",
email:"",
aadhar:"",
address:"",
experience:"",
age:"",
city:"",
preferredVehicle:""
});

const [photoFile,setPhotoFile]=useState<File|null>(null);
const [photoPreview,setPhotoPreview]=useState<string|null>(null);

useEffect(()=>{

const uid=localStorage.getItem("linknride_uid");

if(!uid){
router.push("/login");
return;
}

const fetchDriver=async()=>{

const snap=await getDoc(doc(db,"drivers",uid));

if(snap.exists()){

const d:any=snap.data();

setForm({
fullName:d.fullName||"",
email:d.email||"",
aadhar:d.aadhar||"",
address:d.address||"",
experience:d.experience?.toString()||"",
age:d.age?.toString()||"",
city:d.city||"",
preferredVehicle:d.preferredVehicle||""
});

if(d.photoUrl) setPhotoPreview(d.photoUrl);

}

setLoading(false);

};

fetchDriver();

},[router]);

const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handlePhotoChange=(e:ChangeEvent<HTMLInputElement>)=>{

const file=e.target.files?.[0]||null;
setPhotoFile(file);

if(file){
setPhotoPreview(URL.createObjectURL(file));
}

};

const uploadPhoto=async(uid:string)=>{

if(!photoFile) return null;

const storageRef=ref(storage,`drivers/${uid}/profile.jpg`);

await uploadBytes(storageRef,photoFile);

return await getDownloadURL(storageRef);

};

const handleSubmit=async(e:FormEvent)=>{

e.preventDefault();

const uid=localStorage.getItem("linknride_uid");

if(!uid) return;

try{

setSaving(true);

let photoUrl:string|null=null;

if(photoFile){
photoUrl=await uploadPhoto(uid);
}

await updateDoc(doc(db,"drivers",uid),{

fullName:form.fullName,
email:form.email,
aadhar:form.aadhar,
address:form.address,
experience:Number(form.experience),
age:Number(form.age),
city:form.city,
preferredVehicle:form.preferredVehicle,
...(photoUrl?{photoUrl}:{}),
updatedAt:new Date()

});

alert("Profile updated successfully");

router.push("/driver/profile");

}catch(err){

console.error(err);
alert("Failed to update profile");

}finally{

setSaving(false);

}

};

if(loading){
return(
<div className="min-h-screen flex items-center justify-center">
Loading...
</div>
);
}

return(

<div className="min-h-screen bg-[#FAFAFA]">

{/* HEADER */}

<header className="bg-[#0B0B0B] text-white px-8 py-4 flex justify-between items-center">

<h1 className="text-xl font-bold">
Driver <span className="text-[#F4B400]">Profile</span>
</h1>

<button
onClick={()=>router.push("/driver/dashboard")}
className="text-[#F4B400] font-semibold"
>
← Back to Dashboard
</button>

</header>

<div className="flex justify-center py-16 px-4">

<form
onSubmit={handleSubmit}
className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-10"
>

<h2 className="text-xl font-semibold text-center mb-8">
Update Your Profile
</h2>

{/* PHOTO */}

<div className="flex flex-col items-center mb-10">

<div className="relative">

{photoPreview?(
<Image
src={photoPreview}
alt="Profile"
width={120}
height={120}
className="rounded-full object-cover border-4 border-[#F4B400]"
/>
):(

<div className="w-[120px] h-[120px] rounded-full border-4 border-[#F4B400] flex items-center justify-center text-gray-400">
No Photo
</div>

)}

<label className="absolute bottom-0 right-0 bg-[#F4B400] text-black p-2 rounded-full cursor-pointer">

📷

<input
type="file"
accept="image/*"
className="hidden"
onChange={handlePhotoChange}
/>

</label>

</div>

<p className="text-sm text-gray-500 mt-2">
Click icon to change photo
</p>

</div>

{/* FORM */}

<div className="grid md:grid-cols-2 gap-6">

<Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange}/>
<Input label="Email" name="email" value={form.email} onChange={handleChange}/>
<Input label="Aadhaar Number" name="aadhar" value={form.aadhar} onChange={handleChange}/>
<Input label="Address" name="address" value={form.address} onChange={handleChange}/>
<Input label="Age" name="age" value={form.age} onChange={handleChange}/>
<Input label="Experience (years)" name="experience" value={form.experience} onChange={handleChange}/>
<Input label="City" name="city" value={form.city} onChange={handleChange}/>
<Input label="Preferred Vehicle" name="preferredVehicle" value={form.preferredVehicle} onChange={handleChange}/>

</div>

{/* BUTTONS */}

<div className="flex justify-center gap-4 mt-10">

<button
type="submit"
disabled={saving}
className="bg-[#F4B400] hover:bg-[#e0a800] text-black px-6 py-3 rounded-lg font-semibold"
>
{saving?"Saving...":"Save Changes"}
</button>

<button
              onClick={() => router.push("/driver/profile")}
              className="px-8 py-3 border-2 border-[#F4B400] text-[#F4B400] font-semibold rounded-xl hover:bg-[#FFF3CC]"
            >
              Cancel
            </button>
            </div>

</form>

</div>

</div>

);
}

function Input({label,name,value,onChange}:any){

return(

<div>

<label className="font-semibold block mb-1">
{label}
</label>

<input
name={name}
value={value}
onChange={onChange}
className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#F4B400] focus:outline-none"
/>

</div>

);

}