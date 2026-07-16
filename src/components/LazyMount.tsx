import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mounts children only when the wrapper approaches the viewport, and unmounts
 * them again once it scrolls far away. Keeps the number of live WebGL
 * contexts small on pages with dozens of twisty players.
 */
export default function LazyMount({
  children,
  placeholder,
  className = "",
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const enter = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "250px 0px" },
    );
    const exit = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setVisible(false);
      },
      { rootMargin: "1200px 0px" },
    );
    enter.observe(el);
    exit.observe(el);
    return () => {
      enter.disconnect();
      exit.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible
        ? children
        : (placeholder ?? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-surface-2" />
            </div>
          ))}
    </div>
  );
}
