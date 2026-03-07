import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../firebaseConfig";
import { FaUpload } from "react-icons/fa";
import Image from "next/image";

export default function DriverOnboard() {
  const router = useRouter();
  const uid =
    typeof window !== "undefined" ? localStorage.getItem("linknride_uid") : null;

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    city: "",
    age: "",
    experience: "",
    preferredVehicle: "",
    address: "",
    licenseExpiry: "",
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [aadharPreview, setAadharPreview] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);

  useEffect(() => {
    const storedPhone = localStorage.getItem("linknride_phone") || "";
    if (storedPhone) setForm((prev) => ({ ...prev, phone: storedPhone }));
  }, []);

  const handleChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* 📍 PINCODE → CITY */
  const fetchCityFromPincode = async (pincode: string) => {
    if (pincode.length !== 6) return;
    try {
      setPincodeLoading(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();

      if (data[0].Status === "Success") {
        const cityName = data[0].PostOffice[0].District;
        setForm((prev) => ({ ...prev, city: cityName }));
      } else alert("Invalid Pincode");
    } catch {
      alert("Failed to fetch city");
    } finally {
      setPincodeLoading(false);
    }
  };

  const uploadFile = async (userId: string, file: File, folder: string) => {
    const storageRef = ref(storage, `${folder}/${userId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async () => {
    const userId = uid || auth.currentUser?.uid;
    if (!userId) return alert("Please login again");

    try {
      setSaving(true);

      let aadharUrl = null;
      let licenseUrl = null;

      if (aadharFile) aadharUrl = await uploadFile(userId, aadharFile, "drivers/aadhar");
      if (licenseFile) licenseUrl = await uploadFile(userId, licenseFile, "drivers/license");

      await setDoc(doc(db, "drivers", userId), {
        ...form,
        age: Number(form.age),
        experience: Number(form.experience),
        aadharUrl,
        licenseUrl,
        role: "driver",
        createdAt: serverTimestamp(),
      });

      alert("Profile saved!");
      router.push("/driver/dashboard");
    } catch {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">

      {/* HEADER */}
      <header className="bg-[#0B0B0B] px-8 py-4 flex justify-between items-center">
        <div onClick={()=>router.push("/")} className="flex items-center gap-3 cursor-pointer">
          <Image src="/logo.jpg" alt="logo" width={40} height={40} className="rounded-full"/>
          <h1 className="text-2xl font-bold">
            <span className="text-white">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-white">RIDE</span>
          </h1>
        </div>
        <button onClick={()=>router.back()} className="text-[#F4B400] font-semibold">← Back</button>
      </header>

      <div className="flex justify-center py-16 px-4 flex-grow">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-10">

          <h1 className="text-3xl font-bold text-center mb-10">Driver Registration</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Full Name" value={form.fullName} onChange={(v)=>handleChange("fullName",v)}/>

            {/* PINCODE */}
            <div>
              <label className="font-semibold">Pincode</label>
              <input value={form.pincode} maxLength={6}
                onChange={(e)=>{
                  const value=e.target.value.replace(/\D/g,"");
                  handleChange("pincode",value);
                  if(value.length===6) fetchCityFromPincode(value);
                }}
                className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#F4B400]" />
              {pincodeLoading && <p className="text-xs text-gray-500 mt-1">Fetching city...</p>}
            </div>

            <div>
              <label className="font-semibold">City</label>
              <input value={form.city} readOnly className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100"/>
            </div>

            {/* AGE */}
<div>
  <label className="font-semibold">Age</label>
  <input
    value={form.age}
    maxLength={2}
    onChange={(e)=>{
      const val = e.target.value.replace(/\D/g,"");
      if(val.length<=2) handleChange("age",val);
    }}
    className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#F4B400]"
  />
</div>

{/* EXPERIENCE */}
<div>
  <label className="font-semibold">Experience (years)</label>
  <input
    value={form.experience}
    maxLength={2}
    onChange={(e)=>{
      const val = e.target.value.replace(/\D/g,"");
      if(val.length<=2) handleChange("experience",val);
    }}
    className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#F4B400]"
  />
</div>
            <Input label="Address" value={form.address} onChange={(v)=>handleChange("address",v)}/>
          </div>

          {/* UPLOADS */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <FileUpload label="Upload Aadhaar" fileSetter={setAadharFile} preview={aadharPreview} setPreview={setAadharPreview}/>
            <FileUpload label="Upload License" fileSetter={setLicenseFile} preview={licensePreview} setPreview={setLicensePreview}/>
          </div>

          <button onClick={handleSubmit}
            className="w-full mt-10 bg-[#F4B400] hover:bg-[#e0a800] text-black py-4 rounded-xl font-bold">
            {saving ? "Saving..." : "Complete Registration"}
          </button>
        </div>
      </div>

      <footer className="bg-[#0B0B0B] text-white text-center py-4">
        © {new Date().getFullYear()} <span className="text-[#F4B400]">LinknRide</span>
      </footer>
    </div>
  );
}

/* INPUT */
function Input({label,value,onChange}:any){
  return(
    <div>
      <label className="font-semibold">{label}</label>
      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full mt-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#F4B400]"
      />
    </div>
  );
}
/* FILE UPLOAD */
function FileUpload({label,fileSetter,preview,setPreview}:any){
  return(
    <div>
      <label className="font-semibold">{label}</label>
      <label className="flex items-center gap-2 bg-[#F4B400] text-black px-4 py-3 rounded-lg cursor-pointer mt-2">
        <FaUpload/> Upload Image
        <input type="file" accept="image/*" hidden
          onChange={(e)=>{
            const file=e.target.files?.[0];
            if(!file) return;
            fileSetter(file);
            setPreview(URL.createObjectURL(file));
          }}/>
      </label>
      {preview && <img src={preview} className="mt-3 rounded-lg"/>}
    </div>
  );
}