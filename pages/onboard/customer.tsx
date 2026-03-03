// web/pages/onboard/customer.tsx
import { useRouter } from "next/router";
import { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function CustomerOnboard() {
  const router = useRouter();
  const uid =
    typeof window !== "undefined"
      ? localStorage.getItem("linknride_uid")
      : null;

  const phone =
    typeof window !== "undefined"
      ? localStorage.getItem("linknride_phone") || ""
      : "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    aadhaar: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    shopName: "",
    gst: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePincode = async (value: string) => {
    if (!/^\d*$/.test(value)) return;
    handleChange("pincode", value);

    if (value.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();

        if (data[0]?.Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          handleChange("city", postOffice.District);
          handleChange("state", postOffice.State);
          setError("");
        } else {
          setError("Invalid pincode");
          handleChange("city", "");
          handleChange("state", "");
        }
      } catch {
        setError("Failed to fetch pincode details");
      }
    } else {
      handleChange("city", "");
      handleChange("state", "");
    }
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.address.trim()) return "Address is required";
    if (!/^\d{6}$/.test(form.pincode)) return "Pincode must be 6 digits";
    if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar))
      return "Aadhaar must be 12 digits";
    if (!form.city || !form.state) return "Invalid pincode";
    return "";
  };

  const handleSubmit = async () => {
    if (!uid) return alert("Please login again");

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    try {
      setLoading(true);
      await updateDoc(doc(db, "users", uid), {
        profile: { ...form, phone, aadhaar: form.aadhaar || null },
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      });

      alert("Profile saved successfully!");
      router.push("/customer/dashboard");
    } catch (e) {
      console.error(e);
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-16 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10">

        {/* HEADING */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Add Your Business Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input placeholder="Full Name *" maxLength={50}
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="input" />

          <input value={phone} disabled className="input bg-gray-100" />

          <input placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="input" />

          <input placeholder="Aadhaar Number (optional)"
            value={form.aadhaar}
            maxLength={12}
            onChange={(e)=>handleChange("aadhaar", e.target.value.replace(/\D/g,""))}
            className="input" />

          <input placeholder="Pincode *"
            value={form.pincode}
            maxLength={6}
            onChange={(e)=>handlePincode(e.target.value)}
            className="input" />

          <input placeholder="City" value={form.city} readOnly className="input bg-gray-100"/>
          <input placeholder="State" value={form.state} readOnly className="input bg-gray-100"/>

          <input placeholder="Shop Name (optional)"
            value={form.shopName}
            onChange={(e)=>handleChange("shopName", e.target.value)}
            className="input" />

          <input placeholder="GST Number (optional)"
            value={form.gst}
            onChange={(e)=>handleChange("gst", e.target.value)}
            className="input" />

          <input placeholder="Address *"
            value={form.address}
            onChange={(e)=>handleChange("address", e.target.value)}
            className="input md:col-span-2" />
        </div>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        {/* BUTTON → YELLOW */}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="mt-10 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-xl font-semibold transition"
        >
          {loading ? "Saving..." : "Complete Registration"}
        </button>
      </div>

      {/* INPUT STYLE → YELLOW FOCUS */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          outline: none;
          transition: 0.2s;
        }
        .input:focus {
          border-color: #facc15;
          box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.35);
        }
      `}</style>
    </div>
  );
}
