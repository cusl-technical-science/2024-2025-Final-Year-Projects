"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const MotionHeading = () => {
  return (
    <motion.div
      className="text-2xl font-bold mb-0 text-center flex items-center justify-center gap-2"
      animate={{
        opacity: [0.9, 1, 0.9],
        scale: [1, 1.05, 1],
        color: ["#06b6d4", "#facc15", "#f43f5e", "#06b6d4"], // Cyan → Yellow → Red → Cyan
        textShadow: [
          "0px 0px 8px rgba(6, 182, 212, 0.8)",  // Cyan glow
          "0px 0px 12px rgba(250, 204, 21, 0.9)", // Yellow glow
          "0px 0px 15px rgba(244, 63, 94, 1)",   // Red glow
          "0px 0px 8px rgba(6, 182, 212, 0.8)",  // Back to Cyan glow
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{
        scale: 1.1,
        textShadow: "0px 0px 20px rgba(255, 255, 255, 1)", // Extra glow on hover
      }}
    >
      <MessageSquare className="w-6 h-6 text-gray-700" />
      <span>What People Are Saying!</span>
    </motion.div>
  );
};

export default MotionHeading;
