
'use strict';

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const THEME_KEY = 'maheck-theme';
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
  document.body.classList.toggle('theme-dark', theme === 'dark');
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

const storedTheme = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initTheme = storedTheme || (prefersDark ? 'dark' : 'light');
applyTheme(initTheme);

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.contains('theme-dark');
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

const siteHeader = document.getElementById('site-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  siteHeader?.classList.toggle('scrolled', y > 20);
  lastScroll = y;
}, { passive: true });

const navToggle = document.getElementById('nav-toggle');
const nav = document.getElementById('nav');

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.contains('open');
  nav.classList.toggle('open', !isOpen);
  navToggle.setAttribute('aria-expanded', String(!isOpen));
});


document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});


document.addEventListener('click', e => {
  if (nav.classList.contains('open') &&
      !nav.contains(e.target) &&
      !navToggle?.contains(e.target)) {
    nav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});


const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => navObserver.observe(s));


const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    
    filterBtns.forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-pressed', String(b === btn));
    });

    
    projectCards.forEach(card => {
      const cat = card.dataset.category;
      const show = filter === 'all' || cat === filter;

      if (show) {
        card.classList.remove('hidden');
        // Animate in
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = 'card-appear .4s var(--ease-out) forwards';
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* Keyframe injected via JS to keep CSS clean */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes card-appear {
  from { opacity: 0; transform: translateY(16px) scale(.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
`;
document.head.appendChild(styleSheet);

/* ============================================================
   8. CASE STUDY MODAL
   ============================================================ */
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');

const caseStudies = {
    'visa-tool': {
    title: 'Tourist Visa & Document Checklist Explorer',
    category: 'Web App',
    summary: 'An interactive world map of visa requirements by passport nationality, paired with in-depth document checklists for the corridors I know from real immigration-consulting work.',
    highlights: [
      'Interactive world map covering ~199 countries, built on open, MIT-licensed passport-visa requirement data',
      'Color-coded by requirement type: visa-free, eVisa/ETA, visa on arrival, or visa required, with visa-free day limits shown where known',
      'Deep, sourced, dated document checklists for the corridors I know firsthand: India, Pakistan, Philippines, Nepal, Sri Lanka, Bangladesh, and African nationalities applying to Europe, the UK, USA, Canada, Australia, and New Zealand',
      'A general checklist template plus a link to the official government source for every other corridor, so the tool is honest about where its depth actually comes from',
    ],
    tech: 'JavaScript · Open passport-visa dataset · SVG world map · Document rules engine',
  },
    'cro-analyzer': {
    title: 'Location Aware SEO & Brand Visibility Analyzer',
    category: 'Marketing / Web',
    summary: 'Enter a URL and target country to get a real technical SEO score, location specific recommendations, and a plain English action plan, powered by Google\'s own audit data rather than guesswork.',
    highlights: [
      'Technical SEO and performance scoring powered by Google\'s official PageSpeed Insights API with real Lighthouse data, translated into plain English',
      'Location-aware checks: hreflang setup, local business schema, and priorities that shift based on the selected target country',
      'Detectable brand/social signals: Open Graph and Twitter Card tags, Meta Pixel presence, WhatsApp click-to-chat, linked social profiles',
      'A "recommended next steps" playbook featuring practical marketing guidance such as, when Click-to-WhatsApp ads tend to outperform lead forms, clearly labeled as expert advice rather than automated analysis',
    ],
    tech: 'JavaScript · Google PageSpeed Insights API · Serverless function · HTML parsing',
  },
    'phish-guard': {
    title: 'Phishing Header Inspector',
    category: 'Security',
    summary: 'Paste in a suspicious email\'s raw headers and get a plain English breakdown of whether it\'s legitimate. Built for freshers and job seekers who are frequent targets of fake offer letters and recruiter impersonation scams.',
    highlights: [
      'Parses raw email headers to check SPF, DKIM, and DMARC results, the same technical signals real email security tools use to catch spoofed senders',
      'Flags common fake recruiter red flags: sender domain that mimics but doesn\'t match the real company, suspicious reply to addresses, and redirect chains hidden behind "Apply Now" style links',
      'Explains every flag in plain language instead of raw pass/fail codes, so someone without a security background can actually understand why an email looks suspicious',
      'Built with jobseekers specifically in mind, the #1 real-world use case for phishing email inspection among freshers is fake offer letters and fee upfront job scams, not just generic spam',
    ],
    tech: 'Python · Email header parsing · SPF/DKIM/DMARC validation · IT fundamentals',
  },
    'job-tracker': {
    title: 'Job Application Tracker',
    category: 'Web App',
    summary: 'A Kanban style application tracker I actually intend to use for my own job search, with automatic resume-to-job-description skill matching and a no-login demo mode for recruiters to try.',
    highlights: [
      'Drag &amp; drop Kanban board (Wishlist → Applied → Interview → Offer → Rejected), built in React',
      'Upload a resume once, PDF or Word, parsed entirely in the browser via pdf.js and mammoth.js and every job description pasted in afterward is scored against it instantly',
      'Skill match scoring shows exactly which required skills were found and which are missing, rather than a mystery percentage',
      'Real accounts with Firebase Auth + Firestore sync my actual applications across devices; a separate "Try Demo" mode loads sample data with no login required, so recruiters can explore without touching real data',
    ],
    tech: 'React · Firebase (Auth + Firestore) · pdf.js · mammoth.js · @hello-pangea/dnd',
  },
  'nova-ui': {
    title: 'Nova UI Library',
    category: 'Frontend Development',
    summary: 'A production-ready component library built for scale — accessible, themeable, and thoroughly documented.',
    highlights: [
      'Designed and built 40+ reusable components from scratch',
      'Implemented WCAG 2.1 AA accessibility across all components',
      'Reduced development time for new features by 60%',
      'Shipped with full Storybook docs and design tokens',
    ],
    stats: [
      { val: '40+', label: 'Components' },
      { val: 'WCAG AA', label: 'Compliance' },
      { val: '60%', label: 'Faster Dev' },
    ],
    tech: 'HTML · CSS Custom Properties · Vanilla JS · ARIA · Storybook',
  },
  'growthhub': {
    title: 'GrowthHub Analytics',
    category: 'Web Application',
    summary: 'A real-time analytics dashboard helping e-commerce teams make faster, data-driven decisions.',
    highlights: [
      'Built live data visualizations with D3 and WebSockets',
      'Reduced dashboard load time from 4.2s to 0.8s',
      'Implemented role-based access control for 3 user tiers',
      'Integrated with GA4, Shopify, and Stripe APIs',
    ],
    stats: [
      { val: '0.8s', label: 'Load Time' },
      { val: '5×', label: 'Faster' },
      { val: '3', label: 'API Integrations' },
    ],
    tech: 'React · D3 · WebSockets · Node.js · PostgreSQL',
  },
  'revboost': {
    title: 'RevBoost Campaigns',
    category: 'Digital Marketing',
    summary: 'An end-to-end SEO and CRO strategy that tripled organic search visibility for a B2B SaaS client.',
    highlights: [
      'Grew organic traffic by 120% in just 3 months',
      'Improved homepage conversion rate by 38%',
      'Implemented structured data for 50+ product pages',
      'Created a 12-month content calendar from keyword research',
    ],
    stats: [
      { val: '+120%', label: 'Organic Traffic' },
      { val: '+38%', label: 'Conversions' },
      { val: '3 mo', label: 'Timeline' },
    ],
    tech: 'SEO · Google Analytics 4 · Ahrefs · Hotjar · A/B Testing',
  },
  'nebula': {
    title: 'Nebula Animations',
    category: 'Frontend Development',
    summary: 'A motion-first creative portfolio showcasing GPU-accelerated animations with zero layout jank.',
    highlights: [
      'Built 3D parallax effects using CSS transforms and perspective',
      'All animations run at 60fps with will-change compositing',
      'Custom WebGL particle system with 5,000+ particles',
      'Reduced motion mode for accessibility compliance',
    ],
    stats: [
      { val: '60fps', label: 'Performance' },
      { val: '5k+', label: 'Particles' },
      { val: '100', label: 'Perf Score' },
    ],
    tech: 'CSS Animations · WebGL · Three.js · GSAP · Intersection Observer',
  },
};

function openModal(projectId) {
  const data = caseStudies[projectId];
  if (!data || !modal || !modalBody) return;

  const statsHtml = (data.stats || []).map(s => `
    <div class="modal-stat">
      <span class="stat-val">${s.val}</span>
      <span class="stat-label">${s.label}</span>
    </div>
  `).join('');

  const highlightsHtml = (data.highlights || []).map(h => `<li>${h}</li>`).join('');

  modalBody.innerHTML = `
    <span class="modal-cat">${data.category}</span>
    <h2 id="modal-title">${data.title}</h2>
    <p>${data.summary}</p>
    <div class="modal-stat-row">${statsHtml}</div>
    <h3 style="font-family:var(--font-display);font-weight:600;font-size:1rem;margin-bottom:12px;color:var(--fg)">Key outcomes</h3>
    <ul>${highlightsHtml}</ul>
    <p style="margin-top:20px"><strong style="font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--fg-muted)">Tech stack</strong><br>${data.tech}</p>
  `;

  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Open via case study buttons
document.querySelectorAll('.view-case').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.project));
});

// Close via button and backdrop
modalClose?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') {
    closeModal();
  }
});

/* ============================================================
   9. CONTACT FORM — validation + real submission via Web3Forms
   ============================================================ */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

// Web3Forms access key. This is meant to be public/visible in
// frontend code (that's how Web3Forms works) — it's not a secret,
// just an identifier for where submissions get routed.
const WEB3FORMS_ACCESS_KEY = '914375d6-a5f6-46f2-ad78-49aca0b8e097';

function validateField(input) {
  const errorEl = document.getElementById(`${input.id}-error`);
  let msg = '';

  if (input.required && !input.value.trim()) {
    msg = 'This field is required.';
  } else if (input.type === 'email' && input.value.trim()) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(input.value.trim())) msg = 'Please enter a valid email address.';
  }

  input.classList.toggle('error', !!msg);
  if (errorEl) errorEl.textContent = msg;
  return !msg;
}

// Live validation on blur
contactForm?.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('blur', () => validateField(input));
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) validateField(input);
  });
});

contactForm?.addEventListener('submit', async e => {
  e.preventDefault();

  // Validate all fields
  const inputs = [...contactForm.querySelectorAll('input, textarea')];
  const valid = inputs.map(validateField).every(Boolean);
  if (!valid) return;

  // Loading state
  submitBtn?.classList.add('loading');
  submitBtn.disabled = true;
  if (formStatus) { formStatus.textContent = ''; formStatus.className = 'form-status'; }

  try {
    // Build the submission from the form's own fields (name, email,
    // message — matched by each input's "name" attribute), then add
    // the access key and a readable subject line.
    const formData = new FormData(contactForm);
    formData.append('access_key', WEB3FORMS_ACCESS_KEY);
    formData.append('subject', `New portfolio message from ${formData.get('name')}`);

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Submission failed.');
    }

    // Success
    contactForm.reset();
    inputs.forEach(i => { i.classList.remove('error'); });

    if (formStatus) {
      formStatus.textContent = '✓ Message sent! I\'ll get back to you within one business day.';
      formStatus.className = 'form-status success';
    }
  } catch (err) {
    // Real failure (network issue, bad key, etc.) — tell the visitor
    // honestly instead of pretending it worked.
    if (formStatus) {
      formStatus.textContent = 'Something went wrong sending that — please email me directly instead.';
      formStatus.className = 'form-status error-msg';
    }
  } finally {
    submitBtn?.classList.remove('loading');
    submitBtn.disabled = false;
  }

  // Clear status after 6s
  setTimeout(() => {
    if (formStatus) { formStatus.textContent = ''; formStatus.className = 'form-status'; }
  }, 6000);
});

/* ============================================================
   10. SMOOTH SCROLL POLYFILL (for older Safari)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});