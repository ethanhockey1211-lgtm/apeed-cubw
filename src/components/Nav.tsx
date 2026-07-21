import { Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { sections } from "../data/sections";
import { accents } from "../lib/accents";
import { useProgress } from "../lib/progress";

const navItems = sections.map((s) => ({
  to: `/${s.id}`,
  label: s.name,
  accent: s.accent,
  ids: s.cases.map((c) => c.id),
}));

export default function Nav() {
  const { countLearned } = useProgress();
  const location = useLocation();

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="CubeFlow home">
            <Logo />
            <span className="font-display text-lg font-bold tracking-tight">
              Cube<span className="text-cube-yellow">Flow</span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Main">
            <NavLink
              to="/learn"
              className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/learn") ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              Learn
              {location.pathname.startsWith("/learn") && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-cube-green"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </NavLink>
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.to);
              const learned = countLearned(item.ids);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                  {item.ids.length > 0 && learned > 0 && (
                    <span className={`ml-1.5 text-[10px] font-semibold tabular-nums ${accents[item.accent].text}`}>
                      {learned}/{item.ids.length}
                    </span>
                  )}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className={`absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full ${accents[item.accent].bg}`}
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </NavLink>
              );
            })}
            <NavLink
              to="/puzzles"
              className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/puzzles") ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              Puzzles
              {location.pathname.startsWith("/puzzles") && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-cube-orange"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </NavLink>
            <NavLink
              to="/solver"
              className={`relative rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/solver") ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              Solver
              {location.pathname.startsWith("/solver") && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-cube-red"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </NavLink>
          </nav>

          <div className="ml-auto md:ml-0">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      >
        <div className="grid grid-cols-7">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold ${isActive ? "text-ink" : "text-faint"}`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
            </svg>
            Home
          </NavLink>
          <NavLink
            to="/learn"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold ${isActive ? "text-cube-green" : "text-faint"}`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3 2 8l10 5 10-5-10-5z" />
              <path d="M5 10.5V16c0 1.5 3 3 7 3s7-1.5 7-3v-5.5" />
            </svg>
            Learn
          </NavLink>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold ${
                  isActive ? accents[item.accent].text : "text-faint"
                }`
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
                <rect x="4" y="4" width="16" height="16" rx="2.5" />
                <path d="M4 9.33h16M4 14.66h16M9.33 4v16M14.66 4v16" strokeWidth="1.4" />
              </svg>
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/puzzles"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold ${
                isActive ? "text-cube-orange" : "text-faint"
              }`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
              <path d="M12 2 3 7v10l9 5 9-5V7l-9-5z" />
              <path d="M3 7l9 5 9-5M12 12v10" />
            </svg>
            More
          </NavLink>
        </div>
      </nav>
    </>
  );
}
