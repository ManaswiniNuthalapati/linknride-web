import { useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import {
  FiShield,
  FiEye,
  FiRefreshCcw,
  FiZap,
  FiHeadphones,
  FiTruck,
  FiUsers,
  FiSearch,
} from "react-icons/fi";

export default function Home() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <Layout title="LinknRide - Smart Logistics Platform">

      {/* ================= HERO (TRUCK BACKGROUND) ================= */}
      <section className="relative h-[560px] flex items-center overflow-hidden">

        {/* REAL TRUCK IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?q=80&w=2000')",
          }}
        />

        {/* DARK OVERLAY FOR BLENDING */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/70"></div>

        {/* CONTENT */}
        <div className="relative max-w-7xl mx-auto px-6 text-white">
          <h1 className="text-5xl font-extrabold leading-tight">
            Smart Logistics.{" "}
            <span className="text-yellow-400">Faster Transport.</span>
            <br />
            Trusted Network.
          </h1>

          <p className="mt-5 text-lg max-w-xl text-white/90">
            Connecting customers, vehicle owners, and drivers on one powerful
            platform — making logistics simple and transparent.
          </p>

          <div className="mt-8 flex gap-4 flex-wrap">
            <Link
              href="/login"
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-semibold transition"
            >
              Get Started →
            </Link>

            <a
              href="#services"
              className="border border-white hover:bg-white hover:text-black px-6 py-3 rounded-lg transition"
            >
              Explore Services
            </a>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-10 bg-white text-center">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-3xl font-bold text-black">10K+</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-black">50K+</h3>
            <p className="text-gray-600">Loads Delivered</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-black">5K+</h3>
            <p className="text-gray-600">Vehicles Listed</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-black">98%</h3>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-4 text-black">Our Services</h2>
        <p className="text-gray-600 mb-12">
          Everything you need to move goods efficiently across the country.
        </p>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FiTruck size={28} />,
              title: "Post Loads",
              desc: "List your cargo and connect with verified transporters instantly.",
            },
            {
              icon: <FiSearch size={28} />,
              title: "Find Vehicles",
              desc: "Browse available trucks and trailers matching your needs.",
            },
            {
              icon: <FiUsers size={28} />,
              title: "Hire Drivers",
              desc: "Access a network of experienced, verified drivers.",
            },
          ].map((s, i) => (
            <div
              key={i}
              onClick={() => setActiveCard(i)}
              className={`cursor-pointer bg-white p-8 rounded-2xl transition-all duration-300 ${
                activeCard === i
                  ? "border-2 border-yellow-400 shadow-xl scale-105"
                  : "border border-transparent hover:shadow-lg"
              }`}
            >
              <div className="bg-yellow-100 w-14 h-14 flex items-center justify-center rounded-xl mx-auto mb-5 text-yellow-500">
                {s.icon}
              </div>

              <h3 className="font-semibold text-xl mb-2 text-black">
                {s.title}
              </h3>

              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="py-20 bg-black text-white text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose LinknRide?</h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10">
          {[
            [FiShield, "Verified Drivers & Fleet Owners", "Identity verified"],
            [FiEye, "Live Trip Visibility", "Track loads in real-time"],
            [FiRefreshCcw, "Return Trip Optimization", "Reduce empty runs"],
            [FiZap, "Instant Booking", "Hire drivers quickly"],
            [FiHeadphones, "24/7 Support", "Dedicated assistance"],
          ].map(([Icon, title, desc]: any, i) => (
            <div key={i}>
              <div className="bg-yellow-400 text-black w-14 h-14 flex items-center justify-center rounded-full mx-auto mb-4">
                <Icon size={24} />
              </div>
              <h4 className="font-semibold mb-1">{title}</h4>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-yellow-400 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-black">
          Ready to Transform Your Logistics?
        </h2>

        <Link
          href="/login"
          className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Get Started Today →
        </Link>
      </section>

    </Layout>
  );
}