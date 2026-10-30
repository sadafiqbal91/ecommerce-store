import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import api from "../api";
import { money } from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { VIDEOS } from "../videoAssets";
import Marquee from "../components/Marquee";
import ScrollStory from "../components/ScrollStory";

const headline = "Scent is the memory you wear".split(" ");

const fragranceStories = {
  "Midnight Oud": {
    story: "A velvet night opens slowly into warmth and quiet wonder.",
    notes: { top: "Saffron", heart: "Rose", base: "Oud" },
  },
  "Rose Eclat": {
    story: "A luminous rose catches the last light of a garden at dusk.",
    notes: { top: "Bergamot", heart: "Damask rose", base: "White musk" },
  },
  "Velvet Amber": {
    story: "Golden amber lingers like a fireside secret.",
    notes: { top: "Mandarin", heart: "Jasmine", base: "Amber" },
  },
  "Citrus Breeze": {
    story: "Bright citrus drifts in on the first breath of morning.",
    notes: { top: "Lemon", heart: "Neroli", base: "Cedar" },
  },
  "Jasmine Dream": {
    story: "Night-blooming jasmine turns a passing moment into a dream.",
    notes: { top: "Pear", heart: "Jasmine", base: "Sandalwood" },
  },
  "Black Leather": {
    story: "Polished leather and dark woods leave a confident trace.",
    notes: { top: "Black pepper", heart: "Leather", base: "Vetiver" },
  },
  "Silk Musk": {
    story: "Soft musk settles on the skin like a whispered promise.",
    notes: { top: "Aldehydes", heart: "Iris", base: "Musk" },
  },
  "Saffron Nights": {
    story: "Spiced saffron glows beneath a deep, starless sky.",
    notes: { top: "Saffron", heart: "Incense", base: "Patchouli" },
  },
  "Cherry Blossom": {
    story: "Delicate blossoms scatter sweetness through a spring breeze.",
    notes: { top: "Cherry", heart: "Peony", base: "Vanilla" },
  },
  "Ocean Storm": {
    story: "Salt air and deep water rise with the promise of a storm.",
    notes: { top: "Sea salt", heart: "Cypress", base: "Ambergris" },
  },
  "Sandal Royale": {
    story: "Creamy sandalwood unfolds with the calm of a royal hall.",
    notes: { top: "Cardamom", heart: "Sandalwood", base: "Benzoin" },
  },
  "Vanilla Noir": {
    story: "Dark vanilla wraps its sweetness in a veil of smoke.",
    notes: { top: "Pink pepper", heart: "Vanilla", base: "Tonka bean" },
  },
};

function FeaturedCard({ product, index, active, hasActiveCard, isTouchLayout, onToggle, onHover }) {
  const { add } = useCart();
  const videoRef = useRef(null);
  const [broken, setBroken] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoSrc = VIDEOS[product.name];
  const story = fragranceStories[product.name];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      setVideoPlaying(false);
      video.currentTime = 0;
      const playback = video.play();
      if (playback) playback.catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      setVideoPlaying(false);
    }
  }, [active]);

  const toggleFromKeyboard = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle(product._id);
    } else if (event.key === "Escape") {
      onToggle(null);
    }
  };

  return (
    <motion.article
      className={`featured-card${active ? " expanded" : ""}`}
      role="group"
      aria-label={`${product.brand} ${product.name}`}
      aria-expanded={active}
      tabIndex={0}
      onKeyDown={toggleFromKeyboard}
      onClick={(event) => {
        if (isTouchLayout && !event.target.closest("a, button")) onToggle(product._id);
      }}
      onMouseEnter={() => {
        if (!isTouchLayout) onHover(product._id);
      }}
      onMouseLeave={() => {
        if (!isTouchLayout) onHover(null);
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      animate={{
        ...(isTouchLayout
          ? { height: active ? "auto" : 155 }
          : { flexGrow: active ? 4.4 : 1 }),
        opacity: active || !hasActiveCard ? 1 : 0.45,
        filter: active || !hasActiveCard ? "blur(0px)" : "blur(2px)",
      }}
      transition={{
        flexGrow: { type: "spring", stiffness: 200, damping: 28 },
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.35 },
        filter: { duration: 0.35 },
        default: { duration: 0.5, delay: index * 0.08 },
      }}
      whileFocus={{ borderColor: "var(--gold)" }}
      aria-describedby={active ? `featured-story-${product._id}` : undefined}
      style={{ transition: "border-color 0.3s" }}
    >
      <div className={`featured-card-visual${videoPlaying ? " video-playing" : ""}`}>
        {product.image && !broken ? (
          <img
            className="featured-card-bottle"
            src={product.image}
            alt={product.name}
            onError={() => setBroken(true)}
          />
        ) : (
          <span className="featured-card-placeholder" aria-hidden="true">{product.name.charAt(0)}</span>
        )}
        {videoSrc && (
          <video
            ref={videoRef}
            className="featured-card-video"
            src={videoSrc}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            onPlaying={() => setVideoPlaying(true)}
          />
        )}
        {!active && <div className="featured-card-shade" />}
      </div>

      <div className="featured-card-collapsed">
        <span className="featured-card-brand">{product.brand}</span>
        <h3>{product.name}</h3>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            id={`featured-story-${product._id}`}
            className="featured-card-content"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="featured-card-brand">{product.brand}</p>
            <h3>{product.name}</h3>
            <p className="featured-card-price">{money(product.price)}</p>
            <p className="featured-card-story">{story?.story || product.description}</p>
            {story && (
              <dl className="featured-card-notes">
                {Object.entries(story.notes).map(([noteType, note]) => (
                  <div key={noteType}>
                    <dt>{noteType}</dt>
                    <dd>{note}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="featured-card-actions">
              {product.stock > 0 ? (
                <button className="btn btn-sm" onClick={() => add(product)}>Add to cart</button>
              ) : (
                <button className="btn btn-sm" disabled>Sold out</button>
              )}
              <Link className="btn btn-sm btn-ghost" to={`/product/${product._id}`}>View details</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Home() {
  const ref = useRef(null);
  const [featured, setFeatured] = useState([]);
  const [videoOk, setVideoOk] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isTouchLayout, setIsTouchLayout] = useState(() =>
    window.matchMedia("(max-width: 1024px), (hover: none)").matches
  );
  const activeCard = isTouchLayout ? selectedCard : hoveredCard || selectedCard;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1024px), (hover: none)");
    const updateLayout = () => setIsTouchLayout(media.matches);
    media.addEventListener("change", updateLayout);
    return () => media.removeEventListener("change", updateLayout);
  }, []);

  useEffect(() => {
    api.get("/products?featured=true&limit=4").then((r) => setFeatured(r.data.products)).catch(() => {});
  }, []);

  const reveal = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.9, ease: "easeOut" },
  };

  return (
    <>
      <section className="hero" ref={ref}>
        <div className="hero-inner container">
          <motion.div className="hero-content" style={{ y: textY, opacity: fade }}>
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 1 }}
            >
              Aurelle Maison de Parfum
            </motion.p>
            <h1>
              {headline.map((w, i) => (
                <motion.span
                  key={i}
                  className="word"
                  initial={{ y: 70, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {w}&nbsp;
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
            >
              Rare oud, soft musk and midnight rose. Crafted to be remembered.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
              <Link to="/shop" className="btn">Explore Collection</Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="hero-visual"
            style={{ y: mediaY }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="hero-video-frame">
              {videoOk ? (
                <video
                  src="/videos/hero.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onError={() => setVideoOk(false)}
                />
              ) : (
                <div className="hero-video-placeholder" role="img" aria-label="Perfume video unavailable" />
              )}
            </div>
          </motion.div>
        </div>
        <div className="scroll-hint">Scroll</div>
      </section>

      <ScrollStory />

      <Marquee />

      <section className="section">
        <div className="container story">
          <motion.p className="eyebrow" {...reveal}>Our Story</motion.p>
          <motion.p className="big" {...reveal}>
            Every bottle begins with a <span>single note</span>.
          </motion.p>
          <motion.p className="big" {...reveal} transition={{ ...reveal.transition, delay: 0.15 }}>
            We blend it with patience, <span>until it feels like a memory</span>.
          </motion.p>
          <motion.p className="big" {...reveal} transition={{ ...reveal.transition, delay: 0.3 }}>
            Then we hand it to you, <span>to make your own</span>.
          </motion.p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div {...reveal} style={{ marginBottom: 40 }}>
            <p className="eyebrow">Signature</p>
            <h2 className="title">Featured Fragrances</h2>
          </motion.div>
          <div className="featured-cards">
            {featured.map((p, i) => (
              <FeaturedCard
                key={p._id}
                product={p}
                index={i}
                active={activeCard === p._id}
                hasActiveCard={activeCard !== null}
                isTouchLayout={isTouchLayout}
                onToggle={(id) => setSelectedCard((current) => current === id ? null : id)}
                onHover={setHoveredCard}
              />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <Link to="/shop" className="btn btn-ghost">View All</Link>
          </div>
        </div>
      </section>

      <footer className="footer">© 2026 Aurelle. Crafted for the Devixo internship project.</footer>
    </>
  );
}
