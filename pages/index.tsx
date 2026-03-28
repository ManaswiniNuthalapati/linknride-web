import React from "react";
import { Package, Truck, ShieldCheck, MapPin, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LinknRide() {
  return (
    <div className="font-sans text-gray-800">

      {/* ================= HERO ================= */}
      <section className="relative text-white overflow-hidden">

  {/* BACKGROUND IMAGE */}
  <img
    src="/truck.png"
    className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
    alt="truck"
  />

  {/* CONTENT */}
  <motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="relative z-10 max-w-7xl mx-auto px-6 py-24">
    {/* ✅ FIXED POSITION (NOW VISIBLE) */}
   <div className="flex items-center gap-4 mb-8">

  {/* LOGO (slightly bigger) */}
  <img
    src="/logo_final.png"
    alt="logo"
    className="w-16 h-16 md:w-20 md:h-20 object-contain"
  />

  {/* BRAND NAME (BIG + HIGHLIGHTED) */}
  <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-400 tracking-wide">
    LinknRide
  </h2>

</div>
    {/* MAIN TEXT */}
    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
      Smart Logistics.<br />
      <span className="text-yellow-400">Faster Transport.</span><br />
      Trusted Network.
    </h1>

    <p className="mt-6 text-lg max-w-xl text-gray-100">
      Connect with verified truck owners and drivers instantly.
      Post loads, find vehicles, and track deliveries in real-time.
    </p>

    <div className="mt-6 flex gap-4">
      <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold">
        Post a Load
      </button>
      <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold">
        Find a Truck
      </button>
    </div>

    <div className="mt-10 flex gap-6 text-sm text-gray-200">
      <span>✔ Verified Drivers</span>
      <span>✔ Real-Time Tracking</span>
      <span>✔ Secure Payments</span>
    </div>

  </motion.div>
</section>
      {/* ================= STATS ================= */}
      <div className="bg-white shadow-xl rounded-xl max-w-5xl mx-auto -mt-16 grid grid-cols-2 md:grid-cols-4 text-center py-6 z-10 relative">
        <div>
          <h2 className="text-2xl font-bold">10K+</h2>
          <p>Active Users</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">50K+</h2>
          <p>Loads Delivered</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">5K+</h2>
          <p>Vehicles Listed</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold">98%</h2>
          <p>Satisfaction Rate</p>
        </div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative py-20 text-center min-h-[500px]">

        {/* Background */}
        <img
          src="/clim.png"
          alt="bg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* FIXED OVERLAY */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-12">
            How LinknRide Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">

  {/* CARD 1 */}
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
    <Package className="text-yellow-400 w-10 h-10 mx-auto mb-4" />
    <h3 className="font-semibold text-lg">Post Your Load</h3>
    <p className="text-sm mt-2 text-gray-600">
      List your cargo and connect instantly with verified transporters.
    </p>
  </div>

  {/* CARD 2 */}
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
    <Truck className="text-yellow-400 w-10 h-10 mx-auto mb-4" />
    <h3 className="font-semibold text-lg">Get Matched with Vehicles</h3>
    <p className="text-sm mt-2 text-gray-600">
      Find available trucks and transporters instantly.
    </p>
  </div>

  {/* CARD 3 */}
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
    <MapPin className="text-yellow-400 w-10 h-10 mx-auto mb-4" />
    <h3 className="font-semibold text-lg">Track Your Shipment</h3>
    <p className="text-sm mt-2 text-gray-600">
      Monitor your load in real-time with live tracking.
    </p>
  </div>

</div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-12">Our Services</h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
            <img src="/truck1.png" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="font-semibold text-lg">Post Loads</h3>
              <p className="text-sm mt-2">
                List your cargo and connect with transporters instantly.
              </p>
              <button className="mt-4 bg-yellow-400 px-4 py-2 rounded-lg font-semibold">
                Learn More
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
            <img src="/truck2.png" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="font-semibold text-lg">Find Vehicles</h3>
              <p className="text-sm mt-2">
                Browse available trucks matching your requirements.
              </p>
              <button className="mt-4 bg-yellow-400 px-4 py-2 rounded-lg font-semibold">
                Learn More
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
            <img src="/truck3.png" className="h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="font-semibold text-lg">Hire Drivers</h3>
              <p className="text-sm mt-2">
                Access verified and experienced drivers easily.
              </p>
              <button className="mt-4 bg-yellow-400 px-4 py-2 rounded-lg font-semibold">
                Learn More
              </button>
            </div>
          </div>

        </div>
      </section>

  <section
  className="py-28 text-white"
  style={{
    backgroundImage: "url('/road.png')",  // ✅ correct file name
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <div className="max-w-6xl mx-auto px-6 flex">

  <div className="max-w-lg">

    <h2 className="text-4xl md:text-5xl font-bold mb-10">
      Why Choose <span className="text-yellow-400">LinknRide?</span>
    </h2>

    <ul className="space-y-6 text-lg md:text-xl text-white">

      <li className="flex items-start gap-4">
        <Truck className="text-yellow-400 w-6 h-6 mt-1" />
        Instant load matching with available trucks
      </li>

      <li className="flex items-start gap-4">
        <ShieldCheck className="text-yellow-400 w-6 h-6 mt-1" />
        Verified drivers and transporters
      </li>

      <li className="flex items-start gap-4">
        <MapPin className="text-yellow-400 w-6 h-6 mt-1" />
        Real-time shipment tracking
      </li>

      <li className="flex items-start gap-4">
        <Zap className="text-yellow-400 w-6 h-6 mt-1" />
        Fast and secure payments
      </li>

    </ul>

  </div>

</div>
</section>

      {/* ================= CTA ================= */}
      <section className="relative py-20 text-center">

        <div className="relative">
          <h2 className="text-2xl font-bold mb-6">
            Ready to Transform Your Logistics?
          </h2>

          <button className="bg-yellow-400 px-8 py-3 rounded-lg font-semibold hover:scale-105 transition">
            Get Started Today →
          </button>
        </div>
      </section>

    </div>
  );
}