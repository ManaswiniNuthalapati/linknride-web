import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Image from "next/image";

type Driver = {
  fullName?: string;
  email?: string;
  aadhar?: string;
  address?: string;
  experience?: number;
  age?: number;
  city?: string;
  preferredVehicle?: string;
  photoUrl?: string;
};

export default function DriverProfile() {
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("linknride_uid");
    if (!uid) {
      router.push("/login");
      return;
    }

    const fetchDriver = async () => {
      const snap = await getDoc(doc(db, "drivers", uid));
      if (snap.exists()) setDriver(snap.data() as Driver);
      else router.push("/onboard/driver");
      setLoading(false);
    };

    fetchDriver();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!driver) return <div className="min-h-screen flex items-center justify-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* HEADER */}
      <header className="bg-[#0B0B0B] px-10 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold">
          <span className="text-white">Driver </span>
          <span className="text-[#F4B400]">Profile</span>
        </h1>

        <button
          onClick={() => router.push("/driver/dashboard")}
          className="text-[#F4B400] font-semibold"
        >
          ← Back to Dashboard
        </button>
      </header>

      <div className="flex justify-center py-12 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10 border">

          {/* PHOTO */}
          <div className="flex flex-col items-center mb-10">
            {driver.photoUrl ? (
              <Image src={driver.photoUrl} alt="Profile" width={120} height={120}
                className="rounded-full object-cover border-4 border-[#F4B400]" />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full border-4 border-[#F4B400]
                              flex items-center justify-center text-gray-400">
                No Photo
              </div>
            )}

            <h2 className="mt-4 text-2xl font-bold text-black">
              {driver.fullName || "Driver"}
            </h2>
          </div>

          {/* DETAILS */}
          <div className="grid md:grid-cols-2 gap-6">
            <ProfileItem label="Full Name" value={driver.fullName} />
            <ProfileItem label="Email" value={driver.email} />
            <ProfileItem label="Aadhaar Number" value={driver.aadhar} />
            <ProfileItem label="Address" value={driver.address} />
            <ProfileItem label="Age" value={driver.age?.toString()} />
            <ProfileItem label="Experience (years)" value={driver.experience?.toString()} />
            <ProfileItem label="City" value={driver.city} />
            <ProfileItem label="Preferred Vehicle" value={driver.preferredVehicle} />
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-10 flex gap-4 justify-center">
            <button
              onClick={() => router.push("/driver/edit-profile")}
              className="px-8 py-3 bg-[#F4B400] text-black font-semibold rounded-xl hover:bg-[#e0a800]"
            >
              Edit Profile
            </button>

            <button
              onClick={() => router.push("/driver/dashboard")}
              className="px-8 py-3 border-2 border-[#F4B400] text-[#F4B400] font-semibold rounded-xl hover:bg-[#FFF3CC]"
            >
              Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* PROFILE ITEM */
function ProfileItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-black mb-1">{label}</p>
      <div className="px-4 py-3 border-2 border-gray-200 rounded-lg bg-[#FAFAFA] text-black font-medium">
        {value || "-"}
      </div>
    </div>
  );
}