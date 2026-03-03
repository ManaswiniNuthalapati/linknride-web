import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow">

        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          LinknRide Terms & Conditions
        </h1>

        <p className="text-gray-600 mb-8">
          Last updated: 2026
        </p>

        {/* INTRO */}
        <section className="space-y-4 text-gray-700">
          <p>
            Welcome to <b>LinknRide</b>. By accessing or using our platform,
            you agree to comply with and be bound by the following Terms and
            Conditions. Please read them carefully before using our services.
          </p>
          <p>
            LinknRide is a logistics platform that connects customers,
            vehicle owners, and drivers for transportation services.
          </p>
        </section>

        {/* SECTION 1 */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">1. Eligibility</h2>
          <p className="text-gray-700">
            By using LinknRide, you confirm that:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700">
            <li>You are at least 18 years old.</li>
            <li>You provide accurate and truthful information.</li>
            <li>You agree to follow all applicable laws and regulations.</li>
          </ul>
        </section>

        {/* SECTION 2 */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">
            2. Role of LinknRide Platform
          </h2>
          <p className="text-gray-700">
            LinknRide acts as a facilitator that connects:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700">
            <li>Customers who need transportation services</li>
            <li>Vehicle owners who provide vehicles</li>
            <li>Drivers who offer driving services</li>
          </ul>

          <p className="mt-4 text-gray-700">
            LinknRide does not directly provide transportation services and is
            not responsible for disputes between users.
          </p>
        </section>

        {/* SECTION 3 */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            <li>Provide valid documents for verification.</li>
            <li>Maintain professionalism and respectful communication.</li>
            <li>Ensure goods transported comply with legal regulations.</li>
            <li>Do not misuse the platform for illegal activities.</li>
          </ul>
        </section>

        {/* SECTION 4 */}
<section className="mt-10">
  <h2 className="text-2xl font-semibold mb-3">4. Payments, Commission & Transactions</h2>

  <p className="text-gray-700">
    LinknRide acts as a facilitator between Customers, Vehicle Owners, and Drivers.
    The platform may charge a small service commission for successfully completed trips.
  </p>

  <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">
    <li>
      A platform commission will be applied on completed bookings or trips.
    </li>
    <li>
      Commission percentage will change based on business needs and will be
      updated within the platform when applicable.
    </li>
    <li>
      Payments and final pricing agreements are primarily handled between users.
    </li>
    <li>
      LinknRide is not responsible for payment disputes between users.
    </li>
  </ul>

  <p className="mt-4 text-gray-700">
    By using LinknRide, you agree to the applicable service charges and
    commissions of the platform.
  </p>
</section>


        {/* SECTION 5 */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">5. Account Suspension</h2>
          <p className="text-gray-700">
            LinknRide reserves the right to suspend or terminate accounts that:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700">
            <li>Provide false information</li>
            <li>Violate platform rules</li>
            <li>Engage in fraudulent or harmful behavior</li>
          </ul>
        </section>

        {/* SECTION 6 */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
          <p className="text-gray-700">
            LinknRide is not liable for:
          </p>
          <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700">
            <li>Delays in transportation</li>
            <li>Damage or loss of goods</li>
            <li>Disputes between customers, owners, or drivers</li>
          </ul>
        </section>

        {/* SECTION 7 */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">7. Updates to Terms</h2>
          <p className="text-gray-700">
            We may update these Terms & Conditions from time to time.
            Continued use of the platform means you accept the updated terms.
          </p>
        </section>

        {/* CONTACT */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
          <p className="text-gray-700">
            For any questions regarding these terms, contact:
          </p>
          <p className="mt-2 font-semibold text-green-700">
            support@linknride.com
          </p>
        </section>

        {/* BACK BUTTON */}
        <div className="mt-12">
          <Link
            href="/login"
            className="text-green-700 font-semibold hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
