"use client"

import { useEffect, useState } from "react"

export default function AboutBloodDonation() {
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll('[id^="section-"]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <main className="bg-gradient-to-br from-red-50 via-white to-red-100 min-h-screen pt-8 max-w-5xl mx-auto px-4 sm:px-8 space-y-16 mt-24">
      {/* Main Heading */}
      <section
        id="section-hero"
        className={`text-center mb-10 transition-all duration-1000 ${
          isVisible["section-hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-red-600 drop-shadow mb-4 tracking-tight hover:scale-105 transition-transform duration-300 cursor-default">
          About Us
        </h1>
        <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto hover:text-red-500 transition-colors duration-300">
          Atria – Every Drop Counts. Every Life Matters.
        </p>
      </section>

      {/* Mission Statement */}
      <section
        id="section-mission"
        className={`bg-white/90 rounded-3xl shadow-xl border border-red-100 px-8 py-10 sm:p-14 flex flex-col items-center gap-6 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group ${
          isVisible["section-mission"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-2xl font-semibold text-gray-800 group-hover:text-red-600 transition-colors duration-300">
            At <span className="text-red-600 font-bold group-hover:animate-pulse">Atria</span>, we believe that every
            drop of blood has the power to save a life.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
            Our mission is simple yet powerful – to connect those in urgent need of blood with generous donors, creating
            a reliable and compassionate community of life-savers.
          </p>
        </div>
      </section>

      {/* Why Atria */}
      <section
        id="section-why"
        className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 bg-gradient-to-r from-red-100 via-white to-red-50 p-8 rounded-3xl border border-gray-100 shadow hover:shadow-lg transition-all duration-500 group ${
          isVisible["section-why"] ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        }`}
      >
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <svg
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 48 48"
              className="text-white group-hover:scale-110 transition-transform duration-300"
            >
              <ellipse cx="24" cy="24" rx="20" ry="20" fill="currentColor" opacity="0.2" />
              <path
                d="M24 10C24 10 13 23 13 30C13 35.5228 17.4772 40 23 40C28.5228 40 33 35.5228 33 30C33 23 24 10 24 10Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="currentColor"
                fillOpacity="0.8"
              />
            </svg>
          </div>
        </div>
        <div className="group-hover:translate-x-2 transition-transform duration-300">
          <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-2 group-hover:text-red-700 transition-colors duration-300">
            Why Atria?
          </h2>
          <p className="text-gray-700 text-lg group-hover:text-gray-800 transition-colors duration-300">
            Named after the heart's main chambers,{" "}
            <b className="group-hover:text-red-600 transition-colors duration-300">Atria</b> symbolizes life, care, and
            connection. Just like the atria pump blood to sustain life, our platform ensures that blood reaches those
            who need it most, on time.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section
        id="section-what"
        className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-10 space-y-8 hover:shadow-xl transition-shadow duration-500 ${
          isVisible["section-what"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-red-600 mb-4 hover:scale-105 transition-transform duration-300 cursor-default">
          What We Do
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center group hover:bg-red-50 p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
            <span className="text-4xl mb-2 group-hover:animate-bounce transition-all duration-300">🩸</span>
            <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-red-600 transition-colors duration-300">
              For Donors
            </h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              Atria makes it easy for you to register as a blood donor, track donation opportunities, and make a
              meaningful difference whenever someone needs help.
            </p>
          </div>
          <div className="flex flex-col items-center text-center group hover:bg-red-50 p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
            <span
              className="text-4xl mb-2 group-hover:animate-bounce transition-all duration-300"
              style={{ animationDelay: "0.1s" }}
            >
              🏥
            </span>
            <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-red-600 transition-colors duration-300">
              For Hospitals & Patients
            </h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              We provide a seamless system to raise blood requests, manage availability, and connect with verified
              donors in real-time.
            </p>
          </div>
          <div className="flex flex-col items-center text-center group hover:bg-red-50 p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
            <span
              className="text-4xl mb-2 group-hover:animate-bounce transition-all duration-300"
              style={{ animationDelay: "0.2s" }}
            >
              🤝
            </span>
            <h3 className="text-xl font-semibold text-gray-800 mb-1 group-hover:text-red-600 transition-colors duration-300">
              For Communities
            </h3>
            <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              Atria spreads awareness about the importance of regular blood donation, helping build a culture of giving
              and responsibility.
            </p>
          </div>
        </div>
      </section>

      {/* Vision and Mission */}
      <section
        id="section-vision"
        className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 ${
          isVisible["section-vision"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-gradient-to-br from-red-100 to-white rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
          <h3 className="text-xl font-bold text-red-600 mb-2 group-hover:text-red-700 transition-colors duration-300">
            Our Vision
          </h3>
          <p className="text-gray-700 text-lg group-hover:text-gray-800 transition-colors duration-300">
            A world where no life is lost due to the shortage of blood.
          </p>
        </div>
        <div className="bg-gradient-to-br from-white to-red-100 rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
          <h3 className="text-xl font-bold text-red-600 mb-2 group-hover:text-red-700 transition-colors duration-300">
            Our Mission
          </h3>
          <p className="text-gray-700 text-lg group-hover:text-gray-800 transition-colors duration-300">
            To create a safe, transparent, and efficient blood donation network that empowers donors, supports
            hospitals, and saves lives every single day.
          </p>
        </div>
      </section>

      {/* Join Us */}
      <section
        id="section-join"
        className={`bg-white rounded-3xl shadow-lg border border-red-200 p-10 text-center flex flex-col items-center space-y-6 hover:shadow-2xl transition-all duration-500 group ${
          isVisible["section-join"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-red-500/90 inline-block rounded-full px-7 py-2 mb-3 shadow-lg group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300 cursor-pointer">
          <span className="text-white text-2xl font-bold tracking-wide">Join Us</span>
        </div>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto group-hover:text-gray-800 transition-colors duration-300">
          Whether you're a donor, a volunteer, or a supporter, you are the heartbeat of{" "}
          <span className="text-red-600 font-semibold group-hover:animate-pulse">Atria</span>.
          <br />
          Together, we can make sure that when someone needs blood, hope is never out of reach.
        </p>
        <div className="flex justify-center mt-4">
          <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-6 py-3 rounded-full text-red-600 font-semibold shadow hover:bg-red-100 hover:border-red-300 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <svg
              fill="none"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              className="w-6 h-6 text-red-500 group-hover:animate-pulse"
            >
              <path
                d="M12 2C12 2 4 11.5 4 16C4 19.3137 7.13401 22 12 22C16.866 22 20 19.3137 20 16C20 11.5 12 2 12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="currentColor"
                fillOpacity=".8"
              />
            </svg>
            <span>Every Drop Counts. Every Life Matters.</span>
          </span>
        </div>
      </section>
    </main>
    // <Footer />
  )
}
