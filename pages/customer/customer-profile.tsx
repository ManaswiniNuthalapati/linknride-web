import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function CustomerProfile() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    aadhar: "",
    address: "",
    shopName: "",
    gst: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

  const handleSave = async () => {
    const { fullName, email, aadhar, address, shopName, gst } = formData;

    if (!fullName || !address) {
      alert("Please fill in all required fields (Full Name, Address).");
      return;
    }

    setLoading(true);
    try {
      const uid = localStorage.getItem("linknride_uid");
      if (!uid) {
        alert("User not found. Please login again.");
        router.push("/login");
        return;
      }

      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        role: "customer",
        profileCompleted: true,
        profile: {
          fullName,
          email,
          aadhar,
          address,
          shopName,
          gst,
        },
        updatedAt: serverTimestamp(),
      });

      alert("✅ Profile saved successfully!");
      router.push("/customer/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("❌ Failed to save profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Complete Customer Profile">
      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="
    w-full max-w-3xl
    bg-[#1e6f7a]
    rounded-2xl
    shadow-xl
    p-10
    text-white
  "
>
  {/* TITLE */}
  <h2 className="text-2xl font-bold text-center mb-1">
    Customer Profile
  </h2>
  <p className="text-center text-sm opacity-90 mb-8">
    Tell us a bit about yourself
  </p>

  {/* FORM GRID */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Full Name */}
    <div>
      <label className="text-sm font-semibold">
        Full Name *
      </label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Enter full name"
        className="mt-2 w-full rounded-lg p-3 text-gray-800 focus:outline-none"
      />
    </div>

    {/* Mobile Number (UI only) */}
    <div>
      <label className="text-sm font-semibold">
        Mobile Number *
      </label>
      <input
        type="text"
        placeholder="Enter mobile number"
        className="mt-2 w-full rounded-lg p-3 text-gray-800 focus:outline-none"
      />
    </div>

    {/* Email */}
    <div>
      <label className="text-sm font-semibold">
        Email (Optional)
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter email"
        className="mt-2 w-full rounded-lg p-3 text-gray-800 focus:outline-none"
      />
    </div>

    {/* Aadhaar */}
    <div>
      <label className="text-sm font-semibold">
        Aadhaar Number *
      </label>
      <input
        type="text"
        name="aadhar"
        value={formData.aadhar}
        onChange={handleChange}
        placeholder="XXXX XXXX XXXX"
        className="mt-2 w-full rounded-lg p-3 text-gray-800 focus:outline-none"
      />
    </div>
  </div>

  {/* ADDRESS */}
  <div className="mt-6">
    <label className="text-sm font-semibold">
      Address *
    </label>
    <textarea
      name="address"
      value={formData.address}
      onChange={handleChange}
      placeholder="Enter full address"
      rows={3}
      className="mt-2 w-full rounded-lg p-3 text-gray-800 focus:outline-none"
    />
  </div>

  {/* SHOP & GST */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    <div>
      <label className="text-sm font-semibold">
        Shop Name (Optional)
      </label>
      <input
        type="text"
        name="shopName"
        value={formData.shopName}
        onChange={handleChange}
        placeholder="Shop name"
        className="mt-2 w-full rounded-lg p-3 text-gray-800 focus:outline-none"
      />
    </div>

    <div>
      <label className="text-sm font-semibold">
        GST Number (Optional)
      </label>
      <input
        type="text"
        name="gst"
        value={formData.gst}
        onChange={handleChange}
        placeholder="GST number"
        className="mt-2 w-full rounded-lg p-3 text-gray-800 focus:outline-none"
      />
    </div>
  </div>

  {/* BUTTON */}
  <div className="flex justify-center mt-10">
    <button
      onClick={handleSave}
      disabled={loading}
      className="
        bg-white
        text-[#0F3F66]
        font-semibold
        px-10
        py-3
        rounded-lg
        shadow-md
        hover:bg-gray-100
        transition
      "
    >
      {loading ? "Saving..." : "Save & Continue"}
    </button>
  </div>
</motion.div>

    </Layout>
  );
}