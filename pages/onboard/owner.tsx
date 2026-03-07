import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../firebaseConfig";

type Vehicle = {
  vehicleNumber: string;
  rcNumber: string;
  vehicleType: string;
  capacity: string;
};

export default function OwnerOnboard() {

  const router = useRouter();

  const [fullName,setFullName] = useState("");
  const [phone,setPhone] = useState("");
  const [email,setEmail] = useState("");
  const [address,setAddress] = useState("");
  const [city,setCity] = useState("");
  const [stateVal,setStateVal] = useState("");
  const [pincode,setPincode] = useState("");

  const [vehicles,setVehicles] = useState<Vehicle[]>([
    {vehicleNumber:"",rcNumber:"",vehicleType:"",capacity:""}
  ]);

  const [aadharFile,setAadharFile] = useState<File | null>(null);
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState<string | null>(null);

  /* LOAD PHONE */

  useEffect(()=>{
    const storedPhone = localStorage.getItem("linknride_phone");
    if(storedPhone) setPhone(storedPhone);
  },[]);

  /* PINCODE NUMBERS ONLY */

  const handlePincodeChange = (value:string)=>{
    const numbersOnly = value.replace(/\D/g,"");
    setPincode(numbersOnly);
  };

  /* AUTO CITY + STATE */

  useEffect(()=>{

    const fetchLocation = async ()=>{

      if(pincode.length !== 6) return;

      try{

        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();

        if(data[0].Status === "Success"){
          setCity(data[0].PostOffice[0].District);
          setStateVal(data[0].PostOffice[0].State);
        }else{
          setCity("");
          setStateVal("");
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

  /* AADHAAR */

  const handleAadharFile = (e:ChangeEvent<HTMLInputElement>)=>{
    setAadharFile(e.target.files?.[0] || null);
  };

  const uploadAadhar = async(uid:string)=>{

    if(!aadharFile) return null;

    const fileRef = ref(
      storage,
      `owners/${uid}/aadhar/${Date.now()}_${aadharFile.name}`
    );

    await uploadBytes(fileRef,aadharFile);

    return await getDownloadURL(fileRef);

  };

  /* VALIDATION */
const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;
  const validateForm = ()=>{

    if(!fullName.trim()) return "Full Name is required";

    if(!address.trim()) return "Address is required";

    if(pincode.length !== 6) return "Valid pincode required";

    if(!city || !stateVal) return "Invalid pincode";

    // ⭐ VEHICLE NUMBER FORMAT REGEX
    const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

    for(const v of vehicles){

      if(
        v.vehicleNumber ||
        v.vehicleType ||
        v.capacity ||
        v.rcNumber
      ){

        if(!v.vehicleNumber)
          return "Vehicle number required";

        if(!vehicleRegex.test(v.vehicleNumber))
          return "Vehicle number must be like TS01AB3456";

        if(!v.vehicleType)
          return "Vehicle type required";

        if(v.rcNumber && !vehicleRegex.test(v.rcNumber))
          return "RC number must be like TS01AB3456";

      }

    }

    return null;

  };

  /* SUBMIT */

  const handleSubmit = async(e:FormEvent)=>{

    e.preventDefault();

    const err = validateForm();

    if(err){
      setError(err);
      return;
    }

    setSaving(true);

    try{

      let uid =
        localStorage.getItem("linknride_uid") ||
        auth.currentUser?.uid;

      if(!uid) throw new Error("Not authenticated");

      const aadharUrl = await uploadAadhar(uid);

      await setDoc(
        doc(db,"owners",uid),
        {
          fullName,
          phone,
          email,
          address,
          city,
          state:stateVal,
          pincode,

          vehicles:vehicles.map(v=>({
            ...v,
            capacity:Number(v.capacity)
          })),

          aadharUrl,

          role:"owner",
          profileCompleted:true,
          createdAt:serverTimestamp()
        },
        {merge:true}
      );

      alert("Saved successfully");

      router.push("/owner/dashboard");

    }catch(err){

      console.error(err);

      setError("Failed to save");

    }finally{

      setSaving(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#FAFAFA] flex justify-center items-center px-4 py-10">

      <motion.form
        onSubmit={handleSubmit}
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className="bg-white w-full max-w-5xl rounded-2xl shadow-xl p-10 border"
      >

        <h2 className="text-3xl font-extrabold text-black text-center mb-10">
          Owner Registration
        </h2>

        {/* BASIC DETAILS */}

        <div className="grid md:grid-cols-2 gap-6">

          <Input label="Full Name" value={fullName} onChange={setFullName} />

          <Input label="Phone" value={phone} disabled />

          <Input label="Email" value={email} onChange={setEmail} />

          <Input label="Pincode" value={pincode} onChange={handlePincodeChange} />

          <Input label="City" value={city} disabled />

          <Input label="State" value={stateVal} disabled />

          <Input label="Address" value={address} onChange={setAddress} />

        </div>

        {/* VEHICLES */}

        <div className="mt-10">

          <div className="flex justify-between mb-4">

            <h3 className="text-lg font-bold text-black">
              Vehicle Details
            </h3>

            <button
              type="button"
              onClick={addVehicle}
              className="btn-yellow"
            >
              <FaPlus/> Add Vehicle
            </button>

          </div>

          {vehicles.map((v,i)=>(
            <div
              key={i}
              className="grid md:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-xl mb-4 border"
            >

              {/* ⭐ AUTO UPPERCASE VEHICLE NUMBER */}

              <div>
  <Input
    label="Vehicle No"
    value={v.vehicleNumber}
    onChange={(val)=>{
      const upper = val.toUpperCase();
      handleVehicleChange(i,"vehicleNumber",upper);

      if(upper.length >= 10 && !vehicleRegex.test(upper)){
        setError("Vehicle number must be like TS01AB3456");
      }else{
        setError(null);
      }
    }}
  />
</div>

              {/* ⭐ AUTO UPPERCASE RC NUMBER */}

              <div>
  <Input
    label="RC No"
    value={v.rcNumber}
    onChange={(val)=>{
      const upper = val.toUpperCase();
      handleVehicleChange(i,"rcNumber",upper);

      if(upper && !vehicleRegex.test(upper)){
        setError("RC number must be like TS01AB3456");
      }else{
        setError(null);
      }
    }}
  />
</div>
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

        {/* AADHAAR */}

        <div className="mt-6">

          <label className="font-semibold text-black">
            Upload Aadhaar (optional)
          </label>

          <br/>

          <label className="btn-yellow cursor-pointer mt-2 inline-flex gap-2">

            <FaUpload/> Choose File

            <input
              type="file"
              hidden
              onChange={handleAadharFile}
            />

          </label>

          <p className="text-sm mt-2">{aadharFile?.name}</p>

        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="btn-yellow w-full mt-8 py-3"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </button>

      </motion.form>

      <style jsx>{`
        .btn-yellow{
          background:#F4B400;
          color:black;
          padding:10px 16px;
          border-radius:10px;
          font-weight:600;
          display:flex;
          align-items:center;
          gap:6px;
          justify-content:center;
        }
      `}</style>

    </div>

  );
}

/* INPUT */

function Input({label,value,onChange,disabled=false}:any){

  return(

    <div className="flex flex-col gap-1">

      <label className="text-sm font-semibold text-black">
        {label}
      </label>

      <input
        value={value}
        disabled={disabled}
        onChange={(e)=>onChange?.(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-black font-medium focus:border-[#F4B400] outline-none"
      />

    </div>

  );

}