import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
      if (!isVisible) setIsVisible(true);
    };

    const mouseEnter = () => setIsVisible(true);
    const mouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", mouseMove);
    document.body.addEventListener("mouseenter", mouseEnter);
    document.body.addEventListener("mouseleave", mouseLeave);

    // Track hover on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      // Tag names or specific classes
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      document.body.removeEventListener("mouseenter", mouseEnter);
      document.body.removeEventListener("mouseleave", mouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible]);

  // Handle touch devices (no cursor)
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null; 
  }

  const variants = {
    default: {
      x: mousePosition.x - 32, // Center the 64px wide orb
      y: mousePosition.y - 32,
      scale: 1,
      opacity: isVisible ? 1 : 0
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      scale: 1.5,
      opacity: isVisible ? 1 : 0,
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-16 h-16 rounded-full pointer-events-none z-[9999] blur-xl"
      style={{
        backgroundColor: "rgba(59, 130, 246, 0.4)", // Soft blue glow
        willChange: "transform",
      }}
      variants={variants}
      animate={isHovered ? "hover" : "default"}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.5
      }}
    />
  );
};

export default CustomCursor;
