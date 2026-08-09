import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">

      <div className="max-w-7xl mx-auto px-8 py-24">

        <h1 className="text-6xl font-bold leading-tight">

          Report Road Damage

          <br />

          Keep Your City Safe

        </h1>

        <p className="mt-6 text-xl max-w-2xl">

          Report potholes, broken roads, cracks, waterlogging,
          damaged street lights and other road issues.

        </p>

        <div className="mt-10 flex gap-6">

          <Link
            to="/report"
            className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100"
          >
            Report Damage
          </Link>

          <Link
            to="/my-reports"
            className="border border-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-700"
          >
            View Reports
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Hero;