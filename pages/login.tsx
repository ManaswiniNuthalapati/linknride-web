import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../firebaseConfig";

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleLogin = async () => {
    if (!phone.match(/^\d{10}$/)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (!agree) {
      alert("You must accept Terms & Conditions");
      return;
    }

    setLoading(true);

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          { size: "invisible" }
        );
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmationResult;
      router.push("/otp");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT GREEN PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#124d2e] to-[#0b3a22] text-white p-14 flex-col justify-between">

        <div>
          <h1 className="text-3xl font-bold mb-12">LinknRide</h1>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Join India's Fastest Growing Logistics Network
          </h2>

          <p className="text-gray-200 mb-8">
            Connect with thousands of verified transporters, fleet owners,
            and drivers. Start moving your goods smarter today.
          </p>

          <ul className="space-y-4 text-sm">
            <li>🟡 10,000+ registered vehicles</li>
            <li>🟡 Real-time tracking</li>
            <li>🟡 Secure payments</li>
          </ul>
        </div>

        <p className="text-sm text-gray-300">
          © 2026 LinknRide. All rights reserved.
        </p>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center px-6">

        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">

          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-center mb-6">
            Enter your phone number to continue
          </p>

          {/* PHONE INPUT */}
          <label className="text-sm text-gray-600">Phone Number</label>
          <div className="flex border rounded-lg overflow-hidden mt-2 mb-5">
            <span className="px-3 bg-gray-100 flex items-center text-gray-500">
              +91
            </span>
            <input
              type="tel"
              placeholder="Enter 10 digit number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-4 py-3 outline-none"
            />
          </div>

          {/* TERMS CHECKBOX */}
          <div className="flex items-start gap-2 mb-6 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <label className="text-gray-600 leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-green-700 font-semibold hover:underline">
                Terms & Conditions
              </Link>{" "}
              
              
            </label>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 text-black"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP →"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            New to LinknRide?{" "}
            <span className="text-green-700 font-semibold cursor-pointer">
              Create Account
            </span>
          </p>

          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
}
