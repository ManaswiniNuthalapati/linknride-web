import { useRouter } from "next/router";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">

      {/* HEADER */}
      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
        <div
          onClick={() => router.push("/driver/dashboard")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Image src="/logo.jpg" alt="logo" width={45} height={45} className="rounded-full"/>
          <h1 className="text-2xl font-extrabold">
            <span className="text-black">LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span className="text-black">RIDE</span>
          </h1>
        </div>

        <button
          onClick={() => router.back()}
          className="text-[#F4B400] font-semibold flex items-center gap-2"
        >
          <FaArrowLeft /> Back
        </button>
      </header>

      {/* CONTENT */}
      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className="flex-grow flex items-center justify-center px-6"
      >
        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-10 text-center border-2 border-gray-200">

          <h2 className="text-3xl font-bold mb-3">
            Help & Support
          </h2>

          <p className="text-gray-600 mb-10">
            Need help? Our support team is here for you 24/7 🚚
          </p>

          {/* HELPLINE CARD */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* PHONE */}
            <SupportCard
              icon={<FaPhoneAlt />}
              title="Call Us"
              value="+91 7032372504"
              action="tel:7032372504"
              btnText="Call Now"
            />

            {/* WHATSAPP */}
            <SupportCard
              icon={<FaWhatsapp />}
              title="WhatsApp"
              value="Chat with support"
              action="https://wa.me/917032372504"
              btnText="Open WhatsApp"
            />

            {/* EMAIL */}
            <SupportCard
              icon={<FaEnvelope />}
              title="Email"
              value="support@linknride.com"
              action="mailto:support@linknride.com"
              btnText="Send Email"
            />

          </div>

          {/* FAQ */}
          <div className="mt-12 text-left">
            <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>

            <ul className="space-y-3 text-gray-700">
              <li>• How do I post my availability?</li>
              <li>• How do owners contact me?</li>
              <li>• How do I update my profile?</li>
              <li>• How do I track my jobs?</li>
            </ul>
          </div>

        </div>
      </motion.div>

      {/* FOOTER */}
      <footer className="bg-[#0B0B0B] text-white text-center py-4">
        © {new Date().getFullYear()} <span className="text-[#F4B400]">LinknRide</span>
      </footer>
    </div>
  );
}

/* SUPPORT CARD COMPONENT */
function SupportCard({ icon, title, value, action, btnText }: any) {
  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center hover:border-[#F4B400] transition">
      <div className="text-3xl text-[#F4B400] mb-3">{icon}</div>
      <h4 className="font-bold">{title}</h4>
      <p className="text-gray-600 mb-4">{value}</p>

      <a href={action} target="_blank">
        <button className="bg-[#F4B400] hover:bg-[#e0a800] text-black px-4 py-2 rounded-lg font-semibold">
          {btnText}
        </button>
      </a>
    </div>
  );
}