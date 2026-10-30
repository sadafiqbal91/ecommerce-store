import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import PageWrap from "./components/PageWrap";
import ProtectedRoute from "./components/ProtectedRoute";
import Intro from "./components/Intro";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

gsap.registerPlugin(ScrollTrigger);

const NotFound = () => (
  <div className="center-page">
    <div>
      <h2 className="title">Page not found</h2>
      <Link to="/" className="btn btn-ghost">Back home</Link>
    </div>
  </div>
);

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    const updateScrollTrigger = () => ScrollTrigger.update();
    const raf = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(raf);
    return () => {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Intro />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <CartDrawer />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrap><Home /></PageWrap>} />
          <Route path="/login" element={<PageWrap><Auth mode="login" /></PageWrap>} />
          <Route path="/register" element={<PageWrap><Auth mode="register" /></PageWrap>} />
          <Route path="/shop" element={<PageWrap><Shop /></PageWrap>} />
          <Route path="/product/:id" element={<PageWrap><ProductDetails /></PageWrap>} />
          <Route path="/checkout" element={<ProtectedRoute><PageWrap><Checkout /></PageWrap></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><PageWrap><Orders /></PageWrap></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><PageWrap><Admin /></PageWrap></ProtectedRoute>} />
          <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
