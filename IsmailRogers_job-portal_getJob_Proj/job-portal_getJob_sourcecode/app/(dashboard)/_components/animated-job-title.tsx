"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AnimatedJobTitle = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = ["amazing", "exciting", "rewarding", "fulfilling", "inspiring"];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles.length]);

  return (
    <div className="py-6 px-4 space-y-24">
      <h2 className="text-2xl font-bold tracking-wide text-neutral-600">
        Find your{" "}
        <span className="text-spektr-cyan-50">
          <span className="relative inline-block overflow-hidden">
            <motion.span
              key={titles[titleNumber]} // Ensures animation works with changing titles
              className="absolute font-semibold"
              initial={{ opacity: 0, y: 50 }} // Initial state for transition
              animate={{ opacity: 1, y: 0 }} // Final state for transition
              exit={{ opacity: 0, y: -50 }} // Exit state for transition
              transition={{ type: "spring", stiffness: 100, damping: 25 }} // Smooth transition
            >
              {titles[titleNumber]}
            </motion.span>
          </span>
        </span>{" "}
        job now
      </h2>
    </div>
  );
};

export default AnimatedJobTitle;
