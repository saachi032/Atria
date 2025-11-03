import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RED = "#E11D48";

const supportTeam = [
  { name: "Sai Abhishek", email: "saik@email.com" },
  { name: "Sahil Shah", email: "ssahil@email.com" },
  { name: "Saachi Mishra", email: "saachi@email.com" },
];

function BloodDropSVG({ size = 54 }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 54 70">
      <path
        d="M27 8 C32 37,54 48,27 66 C0 48,22 37,27 8 Z"
        fill={RED}
        style={{ filter: "drop-shadow(0px 10px 20px #e11d48ad)" }}
      />
    </svg>
  );
}
function BloodSplashSVG({ size = 75 }) {
  return (
    <svg width={size} height={size*0.6} viewBox="0 0 75 45" aria-label="Blood Splash">
      <ellipse cx="38" cy="35" rx="26" ry="5" fill="#fde68a" opacity="0.2"/>
      <ellipse cx="38" cy="27" rx="36" ry="11" fill={RED} opacity="0.9"/>
    </svg>
  );
}

export default function SupportPage() {
  const [revealed, setRevealed] = useState(-1);

  // Start drop cascade, evenly by index
  const handleDrop = idx => setTimeout(() => setRevealed(r => (r < idx ? idx : r)), 640);

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "linear-gradient(145deg, #ffe4e6 0%, #fff1f2 66%, #fff 100%)",
        fontFamily: "inherit",
        margin: 0,
        padding: 0,
        overflowX: "hidden"
      }}
    >
      <section className="flex flex-col items-center justify-center w-full min-h-screen">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-center tracking-tight"
          style={{
            color: RED,
            marginTop: "3rem",
            marginBottom: "4rem",
            fontFamily: "inherit",
            letterSpacing: "-0.04em"
          }}
          initial={{ y: 32, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.48, ease: [0.42, 0, 0.58, 1] }}
        >
          Meet Your Blood Support Team!
        </motion.h1>
        <div className="w-full flex flex-row justify-center items-end gap-6 md:gap-14 px-4 md:px-0 mb-8" style={{maxWidth: 1200}}>
          {supportTeam.map((member, idx) => (
            <div key={member.name} className="relative flex flex-col items-center min-w-[180px] md:min-w-[235px] min-h-[180px] md:min-h-[220px]">
              <AnimatePresence>
                {/* DROP & SPLASH */}
                {revealed < idx && (
                  <motion.div
                    initial={{ y: -70, opacity: 0, scale: 0.93 }}
                    animate={{ y: 66, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 1.13,
                      delay: idx * 1.03,
                      ease: [0.42, 0, 0.58, 1]
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      transform: "translateX(-50%)",
                      zIndex: 2,
                      width: "54px"
                    }}
                    onAnimationComplete={() => handleDrop(idx)}
                  >
                    <BloodDropSVG size={54} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.56, y: -7 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.33, delay: 0.33 }}
                      style={{
                        position: 'absolute',
                        left: "-10px",
                        top: "38px",
                        zIndex: 2
                      }}
                    >
                      <BloodSplashSVG size={72} />
                    </motion.div>
                  </motion.div>
                )}
                {/* CARD REVEAL */}
                {revealed >= idx && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.89, y: 33 }}
                    animate={{ opacity: 1, scale: 1.04, y: 22 }}
                    transition={{ duration: 0.37, delay: 0.09, ease: [0.65,0,0.35,1] }}
                    style={{
                      position: 'relative',
                      boxShadow: "0 7px 32px #e11d4846",
                      willChange: "transform"
                    }}
                    className="bg-white/80 rounded-xl shadow-lg py-8 px-7 text-center border-[2.2px] border-[#e11d48] mb-2 flex flex-col items-center min-w-[180px] md:min-w-[245px]"
                  >
                    <div
                      className="font-bold text-xl md:text-2xl mb-1"
                      style={{
                        color: RED,
                        fontFamily: "inherit",
                        letterSpacing: "-0.02em",
                        fontWeight: 800,
                        lineHeight: 1.12,
                        textShadow: "0 3px 10px #e11d4823",
                        display: "block"
                      }}
                    >
                      {member.name}
                    </div>
                    <div className="text-gray-700 text-base mb-2 font-medium" style={{ fontFamily: "inherit" }}>
                      {member.email}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
