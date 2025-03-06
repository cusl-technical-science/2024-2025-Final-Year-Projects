"use client";

import { motion } from "framer-motion";
import Flag from "react-world-flags";

const IntroM = () => {
  return (
    <motion.div
      className="mt-2 text-lg flex items-center gap-2"
      animate={{
        x: [0, -10, 10, 0],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <p>
        Connecting job seekers with top employers in
        <Flag code="SL" className="inline-block w-6 h-6 ml-2" />
      </p>
    </motion.div>
  );
};

export default IntroM;
