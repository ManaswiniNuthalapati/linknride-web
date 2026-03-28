import { useRouter } from "next/router";
import { FaPhoneAlt, FaWhatsapp, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6F8]">

      {/* HEADER */}
      <header className="bg-white border-b px-10 py-4 flex justify-between items-center">
        <div
          onClick={() => router.push("/owner/dashboard")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Image src="/logo.jpg" alt="logo" width={45} height={45} className="rounded-full"/>
          <h1 className="text-2xl font-extrabold">
            <span>LINK</span>
            <span className="text-[#F4B400]">N</span>
            <span>RIDE</span>
          </h1>
        </div>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#F4B400] font-semibold hover:underline"
        >
          <FaArrowLeft /> Back
        </button>
      </header>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow px-6 py-12"
      >

        <div className="max-w-5xl mx-auto">

          {/* TITLE */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Help & Support</h2>
            <p className="text-gray-600 mt-2">
              Need help? Our support team is available 24/7
            </p>
          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-8">

            <SupportCard
              icon={<FaPhoneAlt />}
              title="Call Us"
              value="+91 9014572504"
              action="tel:9014572504"
              btnText="Call Now"
            />

            <SupportCard
              icon={<FaWhatsapp />}
              title="WhatsApp"
              value="Instant chat support"
              action="https://wa.me/919014572504"
              btnText="Chat Now"
            />

            <SupportCard
              icon={<FaEnvelope />}
              title="Email"
              value="linknride1@gmail.com"
              action="mailto:linknride1@gmail.com"
              btnText="Send Email"
            />

          </div>

          {/* FAQ */}
          <div className="mt-16">

            <h3 className="text-2xl font-bold mb-6 text-center">
              Frequently Asked Questions
            </h3>

            <div className="space-y-4 max-w-3xl mx-auto">

              {[
                "How do I post my availability?",
                "How do owners contact me?",
                "How do I update my profile?",
                "How do I track my jobs?"
              ].map((q, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
                >
                  {q}
                </div>
              ))}

            </div>

          </div>

        </div>

      </motion.div>

      {/* FOOTER */}
      <footer className="bg-[#0B0B0B] text-white text-center py-4">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#F4B400] font-semibold">LinknRide</span>
      </footer>
    </div>
  );
}


/* UPDATED CARD */
function SupportCard({ icon, title, value, action, btnText }: any) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="
        bg-white
        rounded-2xl
        p-8
        border border-gray-200
        shadow-sm
        hover:border-[#F4B400]
        hover:shadow-[0_8px_30px_rgba(250,204,21,0.25)]
        text-center
        flex flex-col items-center
      "
    >

      {/* ICON */}
      <div className="w-14 h-14 flex items-center justify-center bg-yellow-100 text-[#F4B400] text-2xl rounded-full mb-4">
        {icon}
      </div>

      {/* TITLE */}
      <h4 className="text-lg font-semibold">{title}</h4>

      {/* VALUE */}
      <p className="text-gray-600 mt-1 mb-5">{value}</p>

      {/* BUTTON */}
      <a href={action} target="_blank">
        <button className="
          px-5 py-2
          bg-[#F4B400]
          text-black
          rounded-lg
          font-semibold
          hover:scale-105
          transition
        ">
          {btnText}
        </button>
      </a>

    </motion.div>
  );
}