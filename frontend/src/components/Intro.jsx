import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Intro() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem("intro");
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem("intro", "1");
      } catch (e) {}
    }, 2300);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
        >
          <div className="intro-logo">
            {"AURELLE".split("").map((c, i) => (
              <motion.span
                key={i}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              >
                {c}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            Maison de Parfum
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
