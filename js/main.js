/* =========================================
   NIRMAXIS — Main JavaScript
========================================= */

// ── SAFETY: Force close modal on page load (prevents stuck-open overlay bug)
(function () {
  var o = document.getElementById('svcOverlay');
  if (o) o.classList.remove('open');
  document.body.style.overflow = '';
})();

document.addEventListener("DOMContentLoaded", () => {

  // ── Safety: ensure modal closed on DOM ready ──────────────────────────────
  var overlay = document.getElementById('svcOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';

  // ── EmailJS ──────────────────────────────────────────────────────────────
  if (typeof emailjs !== 'undefined') {
    emailjs.init("7zGXjkO4cJHXOjwfk");
  }

  // ── Header scroll ─────────────────────────────────────────────────────────
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  // ── HAMBURGER — Mobile nav toggle ─────────────────────────────────────────
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a[href^='#']").forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // ── Mobile: Services outer accordion ──────────────────────────────────────
  const mobileServicesTrigger = document.getElementById("mobileServicesTrigger");
  const mobileServicesAccordion = document.getElementById("mobileServicesAccordion");

  if (mobileServicesTrigger && mobileServicesAccordion) {
    mobileServicesTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = mobileServicesAccordion.classList.toggle("open");
      mobileServicesTrigger.classList.toggle("open", isOpen);
      mobileServicesTrigger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // ── Mobile: Per-category accordions ────────────────────────────────────────
  document.querySelectorAll(".mob-cat-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const items = btn.nextElementSibling;
      if (!items) return;
      const isOpen = items.classList.toggle("open");
      btn.classList.toggle("open", isOpen);
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });

  // ── DESKTOP MEGA MENU ─────────────────────────────────────────────────────
  const megaWrapper = document.getElementById("megaWrapper");
  const megaTrigger = document.getElementById("megaTrigger");
  const megaPanel = document.getElementById("megaPanel");

  if (megaWrapper && megaTrigger && megaPanel) {

    function positionPanel() {
      const rect = megaTrigger.getBoundingClientRect();
      megaPanel.style.top = (rect.bottom + 8) + "px";
    }

    function openMega() {
      megaPanel.classList.add("menu-open");
      megaTrigger.setAttribute("aria-expanded", "true");
      megaTrigger.classList.add("active");
    }
    function closeMega() {
      megaPanel.classList.remove("menu-open");
      megaTrigger.setAttribute("aria-expanded", "false");
      megaTrigger.classList.remove("active");
    }

    window._closeMegaPanel = closeMega;

    megaPanel.querySelectorAll("a[onclick]").forEach(link => {
      link.addEventListener("click", () => closeMega());
    });

    positionPanel();
    window.addEventListener("resize", positionPanel);

    megaTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      megaPanel.classList.contains("menu-open") ? closeMega() : openMega();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && megaPanel.classList.contains("menu-open")) {
        closeMega(); megaTrigger.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!megaPanel.classList.contains("menu-open")) return;
      if (!megaWrapper.contains(e.target) && !megaPanel.contains(e.target)) {
        closeMega();
      }
    });

    // Tab switching
    const allTabs = document.querySelectorAll(".mega-tab");
    const allPanes = document.querySelectorAll(".mega-pane");

    allTabs.forEach(tab => {
      tab.addEventListener("mouseenter", () => activateTab(tab));
      tab.addEventListener("focus", () => activateTab(tab));
      tab.addEventListener("click", () => activateTab(tab));
    });

    function activateTab(tab) {
      allTabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      allPanes.forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      const pane = document.getElementById("pane-" + tab.dataset.tab);
      if (pane) pane.classList.add("active");
    }
  }

  // ── Floating action panel ─────────────────────────────────────────────────
  const floatToggle = document.getElementById("floatToggle");
  const floatActions = document.getElementById("floatActions");

  if (floatToggle && floatActions) {
    floatToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      floatActions.classList.toggle("open");
      floatToggle.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!floatActions.classList.contains("open")) return;
      if (!floatToggle.contains(e.target) && !floatActions.contains(e.target)) {
        floatActions.classList.remove("open");
        floatToggle.classList.remove("active");
      }
    });
  }

  // ── Counter animation ─────────────────────────────────────────────────────
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute("data-target");
        let count = 0;
        const inc = target / 80;
        const update = () => {
          count += inc;
          if (count < target) { el.innerText = Math.ceil(count); requestAnimationFrame(update); }
          else { el.innerText = target; }
        };
        update();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ── Scroll reveal ─────────────────────────────────────────────────────────
  // NOTE: service-card intentionally excluded — keeps them always clickable
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll(".testi-card, .plan-card, .step-item").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    revealObserver.observe(el);
  });

  // ── Active nav link on scroll ─────────────────────────────────────────────
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute("id"); });
    navLinks.forEach(link => {
      link.classList.remove("active-link");
      if (link.getAttribute("href") === `#${current}`) link.classList.add("active-link");
    });
  });

  // ── Min date for booking ──────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];
  document.querySelectorAll('input[type="date"]').forEach(inp => inp.min = today);

  // ── Booking form ──────────────────────────────────────────────────────────
  const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbymDTJB31OtGzLabSEklaIKXVjpOsFSskdYNaCuRMPW5Xo-mmcS2I296-uGBbBxR_P50g/exec";

  const bookingForm = document.getElementById("bookingForm");
  const formSuccess = document.getElementById("formSuccess");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        patient_name: document.getElementById("fname")?.value,
        phone: document.getElementById("fphone")?.value,
        email: document.getElementById("femail")?.value,
        address: document.getElementById("faddress")?.value,
        area: document.getElementById("farea")?.value,
        service: document.getElementById("fservice")?.value,
        date: document.getElementById("fdate")?.value,
        time: document.getElementById("ftime")?.value,
        description: document.getElementById("fdesc")?.value
      };
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      const sheetsPromise = fetch(SHEETS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          mode: "no-cors"
        }).catch(() => { });

      const emailPromise = (typeof emailjs !== "undefined")
        ? Promise.all([
          emailjs.send("service_839zf7p", "template_zowqljd", data),
          emailjs.send("service_839zf7p", "template_i38zwx9", data)
        ]).catch(() => { })
        : Promise.resolve();

      if (typeof gtag === "function") {
        gtag("event", "appointment_booked", {
          event_category: "Booking",
          event_label: data.service,
          service_type: data.service,
          booking_area: data.area
        });
      }

      Promise.all([sheetsPromise, emailPromise]).then(showSuccess);

      function showSuccess() {
        bookingForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Confirm Appointment →";
        if (formSuccess) {
          formSuccess.classList.add("show");
          setTimeout(() => formSuccess.classList.remove("show"), 5000);
        }
      }
    });
  }

  // ── Smooth scroll ─────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") { e.preventDefault(); return; }
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });

  // ── Parallax hero ─────────────────────────────────────────────────────────
  window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero");
    if (hero) {
      const shapes = hero.querySelector(".hero-bg-shapes");
      if (shapes) shapes.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    }
  });

  // ── Service card delegation ────────────────────────────────────────────────
  document.querySelectorAll('.service-card[data-service]').forEach(card => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      const key = card.dataset.service;
      if (key) openService(key);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        const key = card.dataset.service;
        if (key) openService(key);
      }
    });
  });

  // ── Home visit card ────────────────────────────────────────────────────────
  const homeVisitCard = document.querySelector('.service-card.home-visit-card');
  if (homeVisitCard) {
    homeVisitCard.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

}); // ── End DOMContentLoaded ─────────────────────────────────────────────────


/* ===== SERVICE MODAL DATA ===== */
const serviceData = {
  neuro: {
    emoji: "🧠",
    title: "Neurological Physiotherapy",
    intro: "Regain mobility, independence and quality of life with specialized neuro-rehabilitation care delivered at your home across Ahmedabad.",
    sections: [
      {
        heading: "Conditions We Treat",
        items: [
          "Stroke — Hemiplegia / Hemiparesis",
          "Parkinson's Disease",
          "Degenerative Diseases",
          "Traumatic Brain Injuries",
          "Spinal Cord Injuries",
          "Multiple Sclerosis — Ataxia",
          "Bell's Palsy",
          "Guillain-Barre Syndrome",
          "Peripheral Neuropathy",
          "Nerve Injury / Brachial Plexus",
          "Nerve Entrapment Repair"
        ]
      },
      {
        heading: "Treatment Techniques",
        items: [
          "Bobath / NDT Therapy",
          "Task-specific Functional Training",
          "Gait Re-education",
          "Balance and Coordination Exercises",
          "Strength and Motor Control Training",
          "Electrical Stimulation (TENS/NMES)"
        ]
      },
      {
        heading: "Benefits",
        items: [
          "Improved Mobility and Walking",
          "Enhanced Balance and Fall Prevention",
          "Reduced Muscle Stiffness",
          "Better Coordination",
          "Increased Daily Independence",
          "Improved Strength and Endurance"
        ]
      }
    ],
    note: "For neurological patients, home-based treatment allows exercises to be practiced in the exact spaces where the patient needs to function — maximizing real-world recovery outcomes."
  },

  ortho: {
    emoji: "🦴",
    title: "Orthopaedic and Musculoskeletal Physiotherapy",
    intro: "Restore mobility, relieve chronic pain and recover from musculoskeletal conditions with advanced orthopaedic physiotherapy at home.",
    sections: [
      {
        heading: "Back and Neck Conditions",
        items: [
          "Chronic Back Pain — Sciatica",
          "Herniated / Slipped Disc",
          "Tech Neck — Cervical Pain",
          "Radiculopathy",
          "Spondylitis / Spondylosis",
          "Mechanical Back Pain"
        ]
      },
      {
        heading: "Joint and Arthritis Conditions",
        items: [
          "Osteoarthritis (OA) — Knee",
          "Rheumatoid Arthritis",
          "Gout",
          "Frozen Shoulder — Adhesive Capsulitis",
          "Iliopsoas Bursitis"
        ]
      },
      {
        heading: "Muscular and Soft Tissue",
        items: [
          "Fibromyalgia",
          "Tendonitis and Muscle Strains",
          "Polymyositis — Muscle Atrophy",
          "DOMS — Delayed Onset Muscle Soreness",
          "Hamstring Strain",
          "Posture Correction"
        ]
      }
    ],
    note: "Our orthopaedic physiotherapy approach combines hands-on manual therapy with progressive exercise programs tailored to your specific condition, age and lifestyle goals."
  },

  sports: {
    emoji: "🏃",
    title: "Sports Physiotherapy",
    intro: "Recover faster from sports injuries and return to peak performance with expert sports physiotherapy at your home in Ahmedabad.",
    sections: [
      {
        heading: "Injuries We Treat",
        items: [
          "ACL / MCL / PCL Ligament Injuries",
          "Meniscus Injuries",
          "Rotator Cuff Injury / Tear",
          "Shoulder Dislocation",
          "Tennis Elbow",
          "Golfer's Elbow",
          "Ankle Sprain",
          "Achilles Tendon Injury",
          "Labral Tear — Hip / Shoulder"
        ]
      },
      {
        heading: "Treatment Approach",
        items: [
          "Pain Management",
          "Biomechanical Analysis",
          "Sport-specific Exercise Programs",
          "Manual Therapy and Sports Massage",
          "Proprioception and Balance Training",
          "Return-to-Sport Progression"
        ]
      },
      {
        heading: "Benefits",
        items: [
          "Faster Injury Recovery",
          "Reduced Re-injury Risk",
          "Improved Sports Performance",
          "Better Body Mechanics",
          "Stronger Supporting Muscles",
          "Safe Return to Sport"
        ]
      }
    ],
    note: "Our sports physiotherapy programs are designed for athletes of all levels — from recreational runners to competitive sportspeople — with individualized return-to-sport timelines."
  },

  pediatric: {
    emoji: "👶",
    title: "Paediatric Physiotherapy — Specialized Care",
    intro: "Gentle, specialized physiotherapy helping children achieve their full physical potential through engaging, child-friendly home visit sessions.",
    sections: [
      {
        heading: "Conditions We Support",
        items: [
          "Cerebral Palsy",
          "Developmental Delays",
          "Down Syndrome",
          "Congenital Torticollis — Neck Stiffness",
          "TEV — Club Foot",
          "Erb's Palsy",
          "Gait Abnormalities",
          "Muscular Dystrophy",
          "Spina Bifida"
        ]
      },
      {
        heading: "Treatment Approach",
        items: [
          "Play-based Therapy Techniques",
          "Gross Motor Skill Development",
          "Fine Motor Skill Training",
          "Balance and Coordination Exercises",
          "Muscle Strengthening Programs",
          "Postural Correction"
        ]
      },
      {
        heading: "Benefits of Early Intervention",
        items: [
          "Improved Motor Development",
          "Better Balance and Coordination",
          "Increased Strength and Flexibility",
          "Boosted Confidence and Independence",
          "Family Involvement in Recovery",
          "Healthy Physical Development"
        ]
      }
    ],
    note: "Early physiotherapy intervention during childhood yields the best long-term outcomes. Our paediatric specialist creates fun, motivating sessions that children actually enjoy."
  },

  geriatric: {
    emoji: "🧓",
    title: "Geriatric Care",
    intro: "Keeping seniors mobile, safe and independent with specialized home physiotherapy tailored for older adults across Ahmedabad.",
    sections: [
      {
        heading: "Conditions We Manage",
        items: [
          "Fall Prevention and Risk Assessment",
          "Osteoporosis Management",
          "Balance and Gait Problems",
          "Age-related Muscle Weakness — Sarcopenia",
          "Arthritis and Joint Stiffness",
          "Post-fracture Rehabilitation",
          "Parkinson's Disease in Elderly",
          "Post-hospitalization Deconditioning"
        ]
      },
      {
        heading: "Treatment Approach",
        items: [
          "Strength and Resistance Training",
          "Balance and Proprioception Exercises",
          "Walking Aid Training",
          "Home Safety Assessment",
          "Pain Management Techniques",
          "Functional Independence Training"
        ]
      }
    ],
    note: "Physiotherapy at home is especially beneficial for elderly patients — no travel stress, exercises practiced in familiar surroundings, and family can participate actively in recovery."
  },

  womens: {
    emoji: "🌸",
    title: "Women's Health Physiotherapy",
    intro: "Specialized physiotherapy addressing the unique health needs of women at every life stage — from prenatal care to postnatal recovery and beyond.",
    sections: [
      {
        heading: "Conditions We Treat",
        items: [
          "Pelvic Floor Dysfunction",
          "Urinary Incontinence — Stress and Urge",
          "Prenatal Physiotherapy and Preparation",
          "Postnatal Recovery and Diastasis Recti",
          "Post C-section Rehabilitation",
          "Pelvic Girdle Pain (SPD)",
          "Prolapse Management",
          "Menopausal Musculoskeletal Changes"
        ]
      },
      {
        heading: "Treatment Approach",
        items: [
          "Pelvic Floor Assessment and Retraining",
          "Core Stabilization Exercises",
          "Breathing and Relaxation Techniques",
          "Posture Correction for Pregnancy",
          "Manual Therapy for Pelvic Pain",
          "Education on Safe Return to Activity"
        ]
      }
    ],
    note: "All sessions are conducted with full privacy and sensitivity. Our physiotherapist ensures you feel completely comfortable throughout your care."
  },

  postsurgery: {
    emoji: "💊",
    title: "Post Surgery Rehabilitation",
    intro: "Optimize your post-operative recovery with personalized rehabilitation programs designed for your specific surgery and goals.",
    sections: [
      {
        heading: "Surgeries We Rehabilitate",
        items: [
          "Total Knee Replacement (TKR)",
          "Total Hip Replacement (THR)",
          "ACL / PCL Reconstruction",
          "Spinal Surgeries — Discectomy / Fusion",
          "Rotator Cuff Repair",
          "Fracture Fixations (ORIF)",
          "Arthroscopic Procedures",
          "Tendon Repair Surgery"
        ]
      },
      {
        heading: "Recovery Approach",
        items: [
          "Pain and Swelling Management",
          "Range of Motion Restoration",
          "Progressive Strengthening",
          "Gait and Balance Training",
          "Scar Tissue Management",
          "Gradual Return to Daily Activities"
        ]
      },
      {
        heading: "Why Home Rehab After Surgery?",
        items: [
          "No Travel Fatigue Post-op",
          "Exercises in Your Own Environment",
          "Family Can Assist and Observe",
          "Reduced Infection Risk",
          "Flexible Scheduling",
          "Comfort Equals Better Recovery"
        ]
      }
    ],
    note: "Post-surgical physiotherapy is crucial for a full and timely recovery. Starting rehabilitation at the right time under expert guidance prevents complications and restores function faster."
  }
};


/* ===== SERVICE MODAL — OPEN / CLOSE ===== */
function openService(key) {
  const data = serviceData[key];
  if (!data) return;

  // Close mega panel if open
  if (typeof window._closeMegaPanel === "function") window._closeMegaPanel();

  const sectionsHTML = data.sections.map(sec => `
    <h3>${sec.heading}</h3>
    <ul>${sec.items.map(i => `<li>${i}</li>`).join("")}</ul>
  `).join("");

  document.getElementById("svcBody").innerHTML = `
    <div class="svc-modal-hero">
      <button class="svc-close" onclick="closeServiceBtn()" aria-label="Close">
        <i class="fas fa-times"></i>
      </button>
      <span class="svc-emoji">${data.emoji}</span>
      <h2>${data.title}</h2>
      <p>${data.intro}</p>
    </div>
    <div class="svc-modal-content">
      ${sectionsHTML}
      <p class="svc-note">${data.note}</p>
      <div class="svc-book-row">
        <a href="javascript:void(0)" onclick="closeServiceBtn(); setTimeout(function(){ var el=document.getElementById('contact'); if(el){el.scrollIntoView({behavior:'smooth',block:'start'});} }, 350);" class="btn-primary">Book Home Visit</a>
        <a href="https://wa.me/918488051503" target="_blank" class="btn-primary btn-whatsapp">
          <i class="fab fa-whatsapp"></i> WhatsApp Us
        </a>
      </div>
    </div>
  `;

  document.getElementById("svcOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  document.getElementById("svcModal").scrollTop = 0;
}

function closeServiceBtn() {
  document.getElementById("svcOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function closeService(e) {
  if (e.target === document.getElementById("svcOverlay")) closeServiceBtn();
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeServiceBtn();
});