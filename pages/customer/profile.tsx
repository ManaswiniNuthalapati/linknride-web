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
      <div className="min-h-screen flex items-center justify-center text-[#0F3F66] text-lg font-semibold">
        Loading profile...
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p className="text-xl">⚠️ No profile data found.</p>
        <button
          onClick={() => router.push("/customer/edit-profile")}
          className="mt-4 bg-[#0F3F66] text-white px-6 py-2 rounded-xl hover:bg-[#0c3454]"
        >
          Create / Update Profile
        </button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-surface-light text-gray-800">

      {/* HEADER */}
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0F3F66] tracking-wide">
          My Profile
        </h1>
        <button
          onClick={() => router.push("/customer/dashboard")}
          className="text-[#0F3F66] font-medium hover:underline"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-grow px-6 py-16 flex justify-center"
      >
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-10 border border-gray-100">

          {/* PROFILE HEADER */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={profile.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-2 border-[#0F3F66] shadow-md object-cover"
            />
            <h2 className="text-2xl font-semibold text-[#0F3F66] mt-4">
              {profile.fullName || "Unnamed User"}
            </h2>
            <p className="text-gray-600 text-sm">
              {profile.email || "No email provided"}
            </p>
          </div>

          {/* PROFILE DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[
              { label: "Aadhar Number", value: profile.aadhar },
              { label: "Address", value: profile.address },
              { label: "Shop Name", value: profile.shopName },
              { label: "GST Number", value: profile.gst },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <p className="text-gray-500 text-sm">{item.label}</p>
                <p className="text-gray-800 font-medium mt-1">
                  {item.value || "—"}
                </p>
              </div>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <button
              onClick={() => router.push("/customer/edit-profile")}
              className="bg-[#0F3F66] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#0c3454] transition shadow"
            >
              ✏️ Edit Profile
            </button>

            <button
              onClick={() => router.push("/customer/dashboard")}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition shadow"
            >
              ← Back
            </button>
          </div>

        </div>
      </motion.div>

      {/* FOOTER */}
      <footer className="bg-[#0F3F66] text-white text-center text-sm py-4">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">LinknRide</span>. All rights reserved.
      </footer>
    </div>
  );
}
