import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [big, setBig] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 180, damping: 22 });
  const ry = useSpring(y, { stiffness: 180, damping: 22 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    let cur = null;
    const reset = (el) => {
      if (el) el.style.transform = "";
    };

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target.closest && e.target.closest("a,button,.card,input,select");
      setBig(!!t);

      const b = e.target.closest && e.target.closest(".btn:not(:disabled)");
      if (cur && cur !== b) {
        reset(cur);
        cur = null;
      }
      if (b) {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
        b.style.transform = "translate(" + dx + "px," + dy + "px)";
        cur = b;
      }
    };

    const leave = () => {
      reset(cur);
      cur = null;
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <motion.div className="cursor-ring" style={{ x: rx, y: ry }} animate={{ scale: big ? 1.8 : 1 }} />
      <motion.div className="cursor-dot" style={{ x, y }} />
    </>
  );
}
