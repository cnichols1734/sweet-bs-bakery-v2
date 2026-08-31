document.documentElement.classList.add("js");

(() => {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
  );

  nodes.forEach((el) => io.observe(el));

  // Safety: if anything never intersects (print, odd viewports), reveal soon
  window.setTimeout(() => {
    nodes.forEach((el) => el.classList.add("in"));
  }, 2500);
})();
