// ── Nav scroll effect
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile hamburger
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('main-nav');
hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close nav on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ── Hide mobile CTA when contact section visible
const mobileCta = document.getElementById('mobile-cta');
const contactSection = document.getElementById('contact');
if (mobileCta && contactSection && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    mobileCta.style.opacity = entries[0].isIntersecting ? '0' : '1';
    mobileCta.style.pointerEvents = entries[0].isIntersecting ? 'none' : 'auto';
  }, { threshold: 0.1 });
  obs.observe(contactSection);
}

// ── Contact form
const form = document.getElementById('repair-form');
const successMsg = document.getElementById('form-success');
const errorMsg   = document.getElementById('form-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Basic client-side validation
  const name  = form.name.value.trim();
  const phone = form.phone.value.trim();
  const issue = form.issue.value.trim();

  if (!name || !phone || !issue) {
    highlightEmpty(form);
    return;
  }

  const submitBtn = form.querySelector('[type="submit"]');
  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;

  // Since there's no backend yet, we simulate a successful submission
  // and open a mailto as a fallback so the message actually reaches David.
  try {
    const rvType  = form['rv-type'].value;
    const subject = encodeURIComponent(`RV Repair Request — ${name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nRV Type: ${rvType || 'Not specified'}\n\nIssue:\n${issue}`
    );
    window.location.href = `mailto:camdenholton23@gmail.com?subject=${subject}&body=${body}`;

    successMsg.hidden = false;
    errorMsg.hidden   = true;
    form.reset();
  } catch {
    errorMsg.hidden   = false;
    successMsg.hidden = true;
  } finally {
    submitBtn.textContent = 'Send Request';
    submitBtn.disabled = false;
  }
});

function highlightEmpty(f) {
  ['name', 'phone', 'issue'].forEach(field => {
    const el = f[field];
    if (!el.value.trim()) {
      el.style.borderColor = '#E05050';
      el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
    }
  });
}

// ── Subtle entrance animations
if ('IntersectionObserver' in window) {
  const targets = document.querySelectorAll(
    '.service-card, .testimonial-card, .trust-item, .badge, .contact-method'
  );
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .45s ease, transform .45s ease';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
}
