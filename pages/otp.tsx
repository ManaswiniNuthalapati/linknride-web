import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    if (!window.confirmationResult) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    setVerifying(true);

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // ⭐ Only create user if it does not exist
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          phone: user.phoneNumber,
          role: null,
          profileCompleted: false,
          createdAt: serverTimestamp(),
        });
      }

      // Save login locally
      localStorage.setItem("linknride_uid", user.uid);
      localStorage.setItem("linknride_phone", user.phoneNumber || "");

      // ⭐ Redirect based on existing role
      const existingUser = await getDoc(userRef);

      if (existingUser.exists()) {
        const data: any = existingUser.data();

        if (data.role) {
          router.push(`/${data.role}/dashboard`);
        } else {
          router.push("/role-select");
        }
      } else {
        router.push("/role-select");
      }

    } catch (error) {
      console.error(error);
      alert("❌ Invalid OTP. Try again.");
    }

    setVerifying(false);
  };

  return (
    <Layout title="Verify OTP">

      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm bg-white p-10 rounded-2xl shadow-xl border-2 border-gray-200"
        >

          <h1 className="text-3xl font-extrabold text-center mb-2">
            <span className="text-black">Verify </span>
            <span className="text-[#F4B400]">OTP</span>
          </h1>

          <p className="text-sm text-gray-600 text-center mb-6">
            Enter the 6-digit OTP sent to your phone
          </p>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full border-2 border-gray-300 focus:border-[#F4B400] outline-none px-4 py-4 rounded-xl text-center tracking-[10px] text-2xl font-bold"
            placeholder="••••••"
          />

          <button
            onClick={handleVerify}
            disabled={verifying}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition ${
              verifying
                ? "bg-gray-400 text-white"
                : "bg-[#F4B400] hover:bg-[#e0a800] text-black"
            }`}
          >
            {verifying ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Didn’t receive OTP?{" "}
            <span className="text-[#F4B400] font-semibold cursor-pointer">
              Resend
            </span>
          </p>

        </motion.div>
      </div>

    </Layout>
  );
}