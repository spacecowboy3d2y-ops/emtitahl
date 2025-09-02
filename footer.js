// footer.js — robust partial loader with fallback (works even on file://)
document.addEventListener('DOMContentLoaded', async () => {
  const mount = document.getElementById('site-footer');
  if (!mount) return;

  // 1) Optional per-page override: <script data-footer-src="partials/footer.html" …>
  const thisScript = [...document.scripts].slice(-1)[0];
  const explicitSrc = thisScript?.dataset?.footerSrc;

  // 2) Try common relative paths automatically
  const candidates = explicitSrc ? [explicitSrc] : [
    'partials/footer.html',        // root page (index.html at site root)
    './partials/footer.html',      // sometimes needed depending on server
    '../partials/footer.html',     // if the page lives in a subfolder
    '/partials/footer.html'        // absolute from domain root (e.g. Netlify)
  ];

  const FALLBACK_HTML = `
<footer class="footer">
  <div class="container foot-top">
    <div>
      <h4 class="foot-title">Content</h4>
      <ul class="foot-links">
        <li><a href="services.html">Popular Services</a></li>
        <li><a href="environmental.html">Environmental</a></li>
        <li><a href="blog.html">Pest Guides</a></li>
      </ul>
    </div>
    <div>
      <h4 class="foot-title">Information</h4>
      <ul class="foot-links">
        <li><a href="about.html">About</a></li>
        <li><a href="services.html">Our Services</a></li>
        <li><a href="contact.html">Client Support</a></li>
      </ul>
    </div>
    <div>
      <h4 class="foot-title">Connect</h4>
      <ul class="foot-links">
        <li><a href="mailto:info@emtithaal.com">info@emtithaal.com</a></li>
        <li><a href="https://wa.me/966559906886" target="_blank" rel="noopener">WhatsApp</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-bottom">
    <div class="container bottom-inner">
      <div><img class="bottom-logo" src="images-/logo-01.png" alt="Emtithal"></div>
      <div>&copy; 2025 Emtithal Pest Control. Developed by
        <a href="mailto:ismailderia123@gmail.com">Ismail Deria</a>
      </div>
      <div><a class="btn btn-primary" href="contact.html#contactForm">Get Started</a></div>
    </div>
  </div>
</footer>`.trim();

  async function tryFetch(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.text();
  }

  try {
    let html, lastErr;
    for (const url of candidates) {
      try { html = await tryFetch(url); break; }
      catch (e) { lastErr = e; }
    }
    mount.innerHTML = html || FALLBACK_HTML; // use fallback if all attempts fail
    if (!html) console.warn('Footer loaded from fallback. Reason:', lastErr);
  } catch (e) {
    console.warn('Footer include failed. Rendering fallback.', e);
    mount.innerHTML = FALLBACK_HTML;
  }
});
