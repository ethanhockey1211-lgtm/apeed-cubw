import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./components/Nav";
import Landing from "./pages/Landing";
import CrossPage from "./pages/CrossPage";
import SectionPage from "./pages/SectionPage";
import LearnPage from "./pages/LearnPage";
import NotationPage from "./pages/NotationPage";
import F2LBasicsPage from "./pages/F2LBasicsPage";
import TwoLookOllPage from "./pages/TwoLookOllPage";
import TwoLookPllPage from "./pages/TwoLookPllPage";
import PuzzlesPage from "./pages/PuzzlesPage";
import SolverPage from "./pages/SolverPage";
import TwoByTwoPage from "./pages/TwoByTwoPage";
import FourByFourPage from "./pages/FourByFourPage";
import FourMethodPage from "./pages/FourMethodPage";
import PyraminxPage from "./pages/PyraminxPage";
import MegaminxPage from "./pages/MegaminxPage";
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
          <Route path="/learn" element={<Page><LearnPage /></Page>} />
          <Route path="/learn/notation" element={<Page><NotationPage /></Page>} />
          <Route path="/learn/f2l-basics" element={<Page><F2LBasicsPage /></Page>} />
          <Route path="/learn/2-look-oll" element={<Page><TwoLookOllPage /></Page>} />
          <Route path="/learn/2-look-pll" element={<Page><TwoLookPllPage /></Page>} />
          <Route path="/puzzles" element={<Page><PuzzlesPage /></Page>} />
          <Route path="/solver" element={<Page><SolverPage /></Page>} />
          <Route path="/puzzles/2x2" element={<Page><TwoByTwoPage /></Page>} />
          <Route path="/puzzles/4x4" element={<Page><FourByFourPage /></Page>} />
          <Route path="/puzzles/4x4/method" element={<Page><FourMethodPage /></Page>} />
          <Route path="/puzzles/pyraminx" element={<Page><PyraminxPage /></Page>} />
          <Route path="/puzzles/megaminx" element={<Page><MegaminxPage /></Page>} />
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
