import { motion, Variants } from "framer-motion";
import { useRouter } from "next/router";
import { User, Truck, UserCircle2, ArrowRight } from "lucide-react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function RoleSelect() {
  const router = useRouter();

  const uid =
    typeof window !== "undefined"
      ? localStorage.getItem("linknride_uid")
      : null;

  const roles = [
    {
      id: "customer",
      title: "Customer",
      icon: User,
      desc: "Post loads and find reliable transport for your goods",
      points: ["Post unlimited loads", "Track shipments", "Manage payments"],
    },
    {
      id: "owner",
      title: "Vehicle Owner",
      icon: Truck,
      desc: "Register your fleet and find loads for your vehicles",
      points: ["Add multiple vehicles", "Accept load requests", "Manage drivers"],
    },
    {
      id: "driver",
      title: "Driver",
      icon: UserCircle2,
      desc: "Find driving opportunities with verified fleet owners",
      points: ["Browse available jobs", "Track earnings", "Build your profile"],
    },
  ];

  const chooseRole = async (roleId: string) => {
    if (!uid) {
      router.push("/login");
      return;
    }

    try {
      // Save role in Firestore
      await updateDoc(doc(db, "users", uid), { role: roleId });

      // ⭐ Save role locally so auto-login works
      localStorage.setItem("linknride_role", roleId);

      // Check if profile already completed
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data: any = docSnap.data();

        if (data.profileCompleted) {
          // Go directly to dashboard
          router.push(`/${roleId}/dashboard`);
        } else {
          // Continue onboarding
          router.push(`/onboard/${roleId}`);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Failed to set role");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">

      {/* HEADER */}
      <header className="bg-[#0B0B0B] px-10 py-4 flex justify-between items-center">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Image
            src="/logo.jpg"
            alt="logo"
            width={45}
            height={45}
            className="rounded-full"
          />
          <h1 className="text-2xl font-extrabold tracking-wider">
            <span className="text-white">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-white">RIDE</span>
          </h1>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-grow py-20 px-6">

        <div className="text-center mb-14">
          <p className="inline-block bg-[#FFF3CC] text-[#B8860B] px-4 py-1 rounded-full text-sm mb-4">
            Choose Your Role
          </p>

          <h1 className="text-4xl font-bold mb-3">
            How will you use LinknRide?
          </h1>

          <p className="text-gray-600">
            Select your primary role. You can always switch roles later.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8"
        >
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <motion.div
                key={role.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                onClick={() => chooseRole(role.id)}
                className="group bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition cursor-pointer relative"
              >
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-[#F4B400] transition">
                  <Icon className="w-7 h-7 text-gray-700 group-hover:text-black" />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">{role.title}</h2>
                  <ArrowRight className="text-gray-400 group-hover:text-[#F4B400]" />
                </div>

                <p className="text-gray-600 text-sm mb-4">{role.desc}</p>

                <ul className="space-y-2 text-sm text-gray-600">
                  {role.points.map((p, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#F4B400] rounded-full"></span>
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#F4B400] transition pointer-events-none"></div>
              </motion.div>
            );
          })}
        </motion.div>

        <p className="text-center mt-12 text-gray-600">
          Need help choosing?{" "}
          <span className="text-[#F4B400] font-semibold cursor-pointer">
            Learn more about roles
          </span>
        </p>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#0B0B0B] text-white text-center py-4">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#F4B400] font-semibold">LinknRide</span>
      </footer>

    </div>
  );
}