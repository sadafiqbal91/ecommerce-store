import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCart } from "../context/CartContext";
import { VIDEOS } from "../videoAssets";

export const money = (n) => "Rs " + Number(n).toLocaleString();

export default function ProductCard({ p, index = 0 }) {
  const { add } = useCart();
  const [broken, setBroken] = useState(false);
  const [hover, setHover] = useState(false);
  const videoRef = useRef(null);
  const videoSrc = VIDEOS[p.name];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onEnter = () => {
    if (!videoSrc) return;
    setHover(true);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setHover(false);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hover) {
      try { v.currentTime = 0; } catch (e) {}
      const pr = v.play();
      if (pr && pr.catch) pr.catch(() => {});
    } else {
      v.pause();
    }
  }, [hover]);

  return (
    <motion.div
      className="card"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -8 }}
    >
      <Link to={"/product/" + p._id} className="card-img" style={{ position: "relative", overflow: "hidden" }}>
        {p.image && !broken ? (
          <img src={p.image} alt={p.name} onError={() => setBroken(true)} />
        ) : (
          <span className="ph">{p.name.charAt(0)}</span>
        )}
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            loop
            playsInline
            preload="auto"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: hover ? 1 : 0,
              transition: "opacity 0.35s ease",
              pointerEvents: "none",
            }}
          />
        )}
      </Link>
      <div className="card-body">
        <div className="card-brand">{p.brand}</div>
        <div className="card-name">{p.name}</div>
        <div className="card-row">
          <span className="price">{money(p.price)}</span>
          {p.stock > 0 ? (
            <button className="btn btn-sm" onClick={() => add(p)}>Add</button>
          ) : (
            <span className="card-brand">Sold out</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
