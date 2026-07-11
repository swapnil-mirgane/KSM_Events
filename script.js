/* Dropdown + mobile nav + smooth scroll + reveal animations */

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("navLinks");
const dropdownWrap = document.getElementById("servicesDropdown");

function setActiveFromHash() {
  const links = document.querySelectorAll(".nav-link");
  const hash = window.location.hash || "#home";
  links.forEach((a) => {
    const href = a.getAttribute("href");
    if (href === hash) a.classList.add("active");
    else a.classList.remove("active");
  });
}

function closeDropdown() {
  if (!dropdownWrap) return;
  dropdownWrap.classList.remove("open");
  const btn = dropdownWrap.querySelector(".dropdown-btn");
  if (btn) btn.setAttribute("aria-expanded", "false");
}

function openDropdown() {
  if (!dropdownWrap) return;
  dropdownWrap.classList.add("open");
  const btn = dropdownWrap.querySelector(".dropdown-btn");
  if (btn) btn.setAttribute("aria-expanded", "true");
}

function toggleDropdown() {
  if (!dropdownWrap) return;
  if (dropdownWrap.classList.contains("open")) closeDropdown();
  else openDropdown();
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("open");
    navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    closeDropdown();
  });
}

if (dropdownWrap) {
  const btn = dropdownWrap.querySelector(".dropdown-btn");
  btn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  const items = dropdownWrap.querySelectorAll(".dropdown-item");
  const featureTitle = document.getElementById("featureTitle");
  const featureDesc = document.getElementById("featureDesc");
  const contactSelect = document.getElementById("eventTypeSelect");

  const featureMap = {
    corporate: {
      title: "Featured: Corporate Event",
      desc: "Professional stage setups, brand branding, AV support, and seamless run-of-show.",
    },
    function: {
      title: "Featured: Function Event",
      desc: "Decor, guest management, and coordination for weddings, anniversaries, and award nights.",
    },
    party: {
      title: "Featured: Party Event",
      desc: "Lighting, sound, entertainment, and DJ/emcee support with maximum energy.",
    },
  };

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const key = item.getAttribute("data-service");
      const data = featureMap[key];
      if (data && featureTitle && featureDesc) {
        featureTitle.textContent = data.title;
        featureDesc.textContent = data.desc;
      }
      if (contactSelect) contactSelect.value = key;
      closeDropdown();

      // Highlight by brief scroll into view
      const card = document.querySelector(`[data-service-card="${key}"]`);
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

// Click outside closes dropdown
window.addEventListener("click", (e) => {
  if (!dropdownWrap) return;
  const clickedInside = dropdownWrap.contains(e.target);
  if (!clickedInside) closeDropdown();
});

// Smooth scroll for nav links
function smoothScrollTo(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const hash = a.getAttribute("href");
  if (!hash || hash === "#") return;
  e.preventDefault();
  history.pushState(null, "", hash);
  setActiveFromHash();
  smoothScrollTo(hash);
});

// Buttons that jump to contact
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-jump]");
  if (!btn) return;
  const jump = btn.getAttribute("data-jump");
  if (jump) smoothScrollTo(jump);
});

// Reveal on scroll
const revealEls = Array.from(document.querySelectorAll(".reveal"));
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in-view"));
}

// Active link on load/hash changes
setActiveFromHash();
window.addEventListener("hashchange", setActiveFromHash);

// Cursor-follow mascot movement
const mascot = document.getElementById("mascot");
if (mascot) {
  mascot.addEventListener("mousemove", (e) => {
    const rect = mascot.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    const dx = (x - 0.5) * 10; // px
    const dy = (y - 0.5) * 10; // px
    mascot.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${dx * 0.15}deg)`;
  });

  mascot.addEventListener("mouseleave", () => {
    mascot.style.transform = "translate3d(0,0,0) rotate(0deg)";
  });
}

// Service request popup
const popupOverlay = document.getElementById("popupOverlay");
const popupFrame = document.getElementById("popupFrame");
const popupCloseBtn = document.getElementById("popupCloseBtn");

function openPopup(service) {
  if (!popupOverlay || !popupFrame) return;
  const url = `popup.html?service=${encodeURIComponent(service || "")}`;
  popupFrame.src = url;
  popupOverlay.classList.add("open");
  popupOverlay.setAttribute("aria-hidden", "false");
}

function closePopup() {
  if (!popupOverlay || !popupFrame) return;
  popupOverlay.classList.remove("open");
  popupOverlay.setAttribute("aria-hidden", "true");
  popupFrame.src = "about:blank";
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-service-request]");
  if (!btn) return;
  const service = btn.getAttribute("data-service-request");
  openPopup(service);
});

if (popupCloseBtn) {
  popupCloseBtn.addEventListener("click", closePopup);
}

window.addEventListener("click", (e) => {
  if (!popupOverlay) return;
  if (popupOverlay.classList.contains("open") && e.target === popupOverlay) {
    closePopup();
  }
});

window.addEventListener("message", (e) => {
  const msg = e.data;
  if (!msg || typeof msg !== "object") return;
  if (msg.type === "close-popup") closePopup();
});
