import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebaseConfig";

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [profileData, setProfileData] = useState({
    fullName: "", email: "", aadhar: "", address: "",
    shopName: "", gst: "", photoURL: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = localStorage.getItem("linknride_uid");
      if (!uid) return;
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        setProfileData({
          fullName: data?.profile?.fullName || "",
          email: data?.profile?.email || "",
          aadhar: data?.profile?.aadhar || "",
          address: data?.profile?.address || "",
          shopName: data?.profile?.shopName || "",
          gst: data?.profile?.gst || "",
          photoURL: data?.profile?.photoURL || "",
        });
        setPreview(data?.profile?.photoURL || null);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e:any) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handleFileChange = (e:any) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uid = localStorage.getItem("linknride_uid");
      if (!uid) return;

      let uploadedPhotoURL = profileData.photoURL;
      if (file) {
        const storageRef = ref(storage, `profile_photos/${uid}`);
        await uploadBytes(storageRef, file);
        uploadedPhotoURL = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, "users", uid), {
        "profile.fullName": profileData.fullName,
        "profile.email": profileData.email,
        "profile.aadhar": profileData.aadhar,
        "profile.address": profileData.address,
        "profile.shopName": profileData.shopName,
        "profile.gst": profileData.gst,
        "profile.photoURL": uploadedPhotoURL,
        updatedAt: serverTimestamp(),
      });

      alert("Profile updated successfully!");
      router.push("/customer/profile");
    } catch {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6F8]">

      {/* HEADER */}
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between">
        <h1 className="text-2xl font-bold text-black">Edit Profile</h1>
        <button
          onClick={() => router.push("/customer/dashboard")}
          className="text-black font-semibold hover:underline">
          ← Back to Dashboard
        </button>
      </header>

      {/* FORM */}
      <motion.form onSubmit={handleSave}
        className="flex-grow px-6 py-16 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-sm rounded-2xl p-10 border">

          <h2 className="text-2xl font-bold text-center mb-8">
            Update Your Profile
          </h2>

          {/* PHOTO */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <img src={preview || "/default-avatar.png"}
                className="w-28 h-28 rounded-full border-2 border-yellow-400 object-cover"/>
              <label htmlFor="file-upload"
                className="absolute bottom-0 right-0 bg-yellow-400 text-black rounded-full p-2 cursor-pointer hover:bg-yellow-500">
                📷
              </label>
              <input id="file-upload" type="file" className="hidden"
                accept="image/*" onChange={handleFileChange}/>
            </div>
            <p className="text-sm text-gray-500 mt-2">Click icon to change photo</p>
          </div>

          {/* INPUTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["fullName","email","aadhar","address","shopName","gst"].map((field)=>(
              <div key={field}>
                <label className="block font-medium mb-1 capitalize">
                  {field==="gst"?"GST Number":field==="aadhar"?"Aadhar Number":field}
                </label>
                <input
                  name={field}
                  value={(profileData as any)[field]}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <button disabled={loading}
            className={`mt-10 w-full py-3 font-semibold rounded-xl ${
              loading ? "bg-gray-400" :
              "bg-yellow-400 hover:bg-yellow-500 text-black"
            }`}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.form>

      <footer className="bg-white border-t text-center text-gray-500 text-sm py-4">
        © {new Date().getFullYear()} LinknRide. All rights reserved.
      </footer>
    </div>
  );
}
