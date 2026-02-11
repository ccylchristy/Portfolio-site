// Work Modal Script
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("workModal");
  if (!overlay) return;

  const modal = overlay.querySelector(".work-modal");
  const img = overlay.querySelector(".work-modal-img");
  const title = overlay.querySelector(".work-modal-title");
  const caption = overlay.querySelector(".work-modal-caption");
  const counter = overlay.querySelector(".work-modal-counter");
  const prevBtn = overlay.querySelector(".work-modal-arrow.prev");
  const nextBtn = overlay.querySelector(".work-modal-arrow.next");
  
  let slides = [];
  let index = 0;

  function openWork(){
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeWork(){
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function render(){
    if (!slides.length) return;

    const s = slides[index];
    img.src = s.src || "";
    img.alt = s.name || title.textContent || "";

    // Project name under image (left)
    // If you want per-slide names, use s.name; otherwise use the card title.
    title.textContent = s.name || title.textContent || "";

    caption.textContent = s.caption || "";

    counter.textContent = `${index + 1} / ${slides.length}`;

    prevBtn.disabled = (index === 0);
    nextBtn.disabled = (index === slides.length - 1);
  }

  function prev(){
    if (index > 0) { index--; render(); }
  }

  function next(){
    if (index < slides.length - 1) { index++; render(); }
  }

  // Open from cards
  document.querySelectorAll("[data-work-open]").forEach(card => {
    card.addEventListener("click", () => {
      const raw = card.getAttribute("data-images") || "[]";
      const cardTitle = card.getAttribute("data-title") || "Project";

      try {
        slides = JSON.parse(raw);
      } catch (e) {
        console.error("Invalid JSON in data-images:", raw);
        slides = [];
      }

      // fallback: if slides missing, create one from data-src/data-caption if present
      if (!slides.length) {
        slides = [{
          src: card.dataset.src || "",
          name: cardTitle,
          caption: card.dataset.caption || ""
        }];
      }

      index = 0;

      // If slides don't include per-slide name, default name to card title
      slides = slides.map(s => ({
        src: s.src,
        name: s.name || cardTitle,
        caption: s.caption || ""
      }));

      // Set initial title from first slide
      title.textContent = slides[0].name || cardTitle;

      render();
      openWork();
    });

    // keyboard open (Enter)
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") card.click();
    });
  });

  // Buttons
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeWork();});

  // Keyboard controls (only when open)
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("is-open")) return;

    if (e.key === "Escape") closeWork();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
});

// Experience Modal Script
const openTriggers = document.querySelectorAll("[data-modal-open]");

function openModal(id){
  const overlay = document.getElementById(id);
  if(!overlay) return;

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // prevent background scroll
}

function closeModal(overlay){
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Click on card opens modal
openTriggers.forEach(card => {
  card.addEventListener("click", () => openModal(card.dataset.modalOpen));

  // Keyboard support (Enter/Space)
  card.addEventListener("keydown", (e) => {
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      openModal(card.dataset.modalOpen);
    }
  });
});

// Click outside modal closes it
document.addEventListener("click", (e) => {
  const overlay = e.target.classList && e.target.classList.contains("modal-overlay") ? e.target : null;
  if(overlay && overlay.classList.contains("is-open")){
    closeModal(overlay);
  }
});

// ESC closes current modal
document.addEventListener("keydown", (e) => {
  if(e.key !== "Escape") return;
  const openOverlay = document.querySelector(".modal-overlay.is-open");
  if(openOverlay) closeModal(openOverlay);
});

// Reveal on Scroll Script
document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(".reveal-on-scroll");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("is-visible");
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px"
  });

  targets.forEach(el => observer.observe(el));
});

// -----------------------------
// Work modal: click-to-zoom + focus zoom + reset on navigation
// -----------------------------
(function () {
  const SELECTORS = {
    stage: '.work-modal-stage',
    img: '.work-modal-img',
    prevBtn: '.work-modal-arrow.prev',
    nextBtn: '.work-modal-arrow.next',
  };

  function getStages() {
    return Array.from(document.querySelectorAll(SELECTORS.stage));
  }

  function resetZoom(stage) {
    if (!stage) return;
    stage.classList.remove('is-zoomed');
    const img = stage.querySelector(SELECTORS.img);
    if (img) img.style.transformOrigin = ''; // back to CSS default (center)
  }

  function resetZoomAll() {
    getStages().forEach(resetZoom);
  }

  function setTransformOriginFromCursor(stage, event) {
    const img = stage.querySelector(SELECTORS.img);
    if (!img) return;

    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    img.style.transformOrigin = `${x}% ${y}%`;
  }

  function initWorkModalZoom() {
    const stages = getStages();
    if (!stages.length) return;

    // Toggle zoom on click
    stages.forEach((stage) => {
      stage.addEventListener('click', () => {
        const zoomed = stage.classList.toggle('is-zoomed');
        if (!zoomed) resetZoom(stage);
      });

      // Option C: focus zoom (only while zoomed)
      stage.addEventListener('mousemove', (e) => {
        if (!stage.classList.contains('is-zoomed')) return;
        setTransformOriginFromCursor(stage, e);
      });

      stage.addEventListener('mouseleave', () => {
        if (!stage.classList.contains('is-zoomed')) return;
        const img = stage.querySelector(SELECTORS.img);
        if (img) img.style.transformOrigin = '50% 50%';
      });
    });

    // Stop arrow clicks from toggling zoom
    document.querySelectorAll(`${SELECTORS.prevBtn}, ${SELECTORS.nextBtn}`).forEach((btn) => {
      btn.addEventListener('click', (e) => e.stopPropagation());
    });

    // Option A: reset zoom when navigating
    const prev = document.querySelector(SELECTORS.prevBtn);
    const next = document.querySelector(SELECTORS.nextBtn);
    if (prev) prev.addEventListener('click', resetZoomAll);
    if (next) next.addEventListener('click', resetZoomAll);
  }

  // Safe init regardless of where script is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkModalZoom);
  } else {
    initWorkModalZoom();
  }
})();
