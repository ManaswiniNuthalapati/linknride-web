import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function CustomerProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const uid = localStorage.getItem("linknride_uid");
        if (!uid) return;

        const docRef = doc(db, "users", uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setProfile(snap.data()?.profile || {});
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading profile...
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p className="text-xl">No profile data found</p>

        <button
          onClick={() => router.push("/customer/edit-profile")}
          className="mt-6 bg-[#F4B400] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#e0a800]"
        >
          Create Profile
        </button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">

      {/* HEADER */}
      <header className="bg-black text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <span>LINK</span>
          <span className="text-[#F4B400]">N</span>
          <span>RIDE</span>
        </h1>

        <button
          onClick={() => router.push("/customer/dashboard")}
          className="text-sm hover:text-[#F4B400]"
        >
          Back to Dashboard
        </button>
      </header>

      {/* PROFILE */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow flex justify-center items-center px-6 py-12"
      >
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-10">

          {/* PHOTO */}
          <div className="flex flex-col items-center mb-10">
            <img
              src={profile.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#F4B400]"
            />

            <h2 className="text-2xl font-bold mt-4">
              {profile.fullName || "Customer"}
            </h2>

            <p className="text-gray-500 text-sm">
              {profile.email || "No email provided"}
            </p>
          </div>

          {/* DETAILS */}
          <div className="grid md:grid-cols-2 gap-6">

            <ProfileField label="Aadhar Number" value={profile.aadhar} />
            <ProfileField label="Address" value={profile.address} />
            <ProfileField label="Shop Name" value={profile.shopName} />
            <ProfileField label="GST Number" value={profile.gst} />

          </div>

          {/* ACTIONS */}
          <div className="flex justify-center gap-4 mt-10">

            <button
              onClick={() => router.push("/customer/edit-profile")}
              className="bg-[#F4B400] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#e0a800]"
            >
              Edit Profile
            </button>

            <button
              onClick={() => router.push("/customer/dashboard")}
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100"
            >
              Back
            </button>

          </div>
        </div>
      </motion.div>

      {/* FOOTER */}
      <footer className="bg-black text-white text-center py-3 text-sm">
        © {new Date().getFullYear()} LinknRide
      </footer>

    </div>
  );
}

/* PROFILE FIELD */
function ProfileField({ label, value }: any) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-semibold mt-1">{value || "—"}</p>
    </div>
  );
}