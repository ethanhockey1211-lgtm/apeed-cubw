import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./components/Nav";
import Landing from "./pages/Landing";
import CrossPage from "./pages/CrossPage";
import SectionPage from "./pages/SectionPage";
import { sectionById } from "./data/sections";

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className="pb-24 md:pb-10"
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <Nav />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Landing /></Page>} />
          <Route path="/cross" element={<Page><CrossPage /></Page>} />
          <Route path="/f2l" element={<Page><SectionPage section={sectionById.f2l} /></Page>} />
          <Route path="/oll" element={<Page><SectionPage section={sectionById.oll} /></Page>} />
          <Route path="/pll" element={<Page><SectionPage section={sectionById.pll} /></Page>} />
          <Route path="*" element={<Page><Landing /></Page>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
