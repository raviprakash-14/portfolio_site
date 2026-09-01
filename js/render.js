/* =============================================================
   RENDER
   -------------------------------------------------------------
   Turns js/data.js into DOM. Keeping this separate from ui.js
   means content changes never require touching behaviour, and
   behaviour changes never require touching content.
   ============================================================= */

(function () {
  'use strict';

  var data = window.PORTFOLIO_DATA;
  if (!data) return;

  /* Escape anything that ends up inside an HTML template so a stray
     angle bracket in the content file can never break the markup. */
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* Only accept absolute http(s) URLs. A null, an empty string or
     anything odd means the button simply is not rendered. */
  function safeUrl(url) {
    if (typeof url !== 'string') return null;
    var trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return null;
    return trimmed;
  }

  /* ---------- PROJECTS ---------- */
  function renderProjects() {
    var grid = document.getElementById('projects-grid');
    if (!grid || !Array.isArray(data.projects)) return;

    var html = data.projects.map(function (p) {
      var live = safeUrl(p.liveUrl);
      var repo = safeUrl(p.githubUrl);

      var media = p.image
        ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + ' project preview" loading="lazy" decoding="async"/>'
        : '<span class="project-monogram" aria-hidden="true">' + esc(p.icon || '') + '</span>';

      var tags = (p.tech || []).map(function (t) {
        return '<li class="ptag">' + esc(t) + '</li>';
      }).join('');

      var actions = '';
      if (live) {
        actions += '<a class="project-btn" href="' + esc(live) + '" target="_blank" rel="noopener noreferrer">' +
          'Live Demo<span class="visually-hidden"> for ' + esc(p.name) + ' (opens in a new tab)</span>' +
          '<span aria-hidden="true">&#8599;</span></a>';
      }
      if (repo) {
        actions += '<a class="project-btn ghost" href="' + esc(repo) + '" target="_blank" rel="noopener noreferrer">' +
          'GitHub<span class="visually-hidden"> repository for ' + esc(p.name) + ' (opens in a new tab)</span>' +
          '<span aria-hidden="true">&#8599;</span></a>';
      }

      return '' +
        '<article class="project-card reveal" id="project-' + esc(p.id) + '">' +
          '<div class="project-media">' +
            media +
            (p.status ? '<span class="project-status" data-status="' + esc(p.status) + '">' + esc(p.status) + '</span>' : '') +
          '</div>' +
          '<div class="project-body">' +
            '<p class="project-category">' + esc(p.category) + '</p>' +
            '<h3 class="project-title">' + esc(p.name) + '</h3>' +
            '<p class="project-role">' + esc(p.role) + '</p>' +
            '<p class="project-desc">' + esc(p.description) + '</p>' +
            (tags ? '<ul class="project-tags" aria-label="Technologies used">' + tags + '</ul>' : '') +
            (actions ? '<div class="project-actions">' + actions + '</div>' : '') +
          '</div>' +
        '</article>';
    }).join('');

    grid.innerHTML = html;
  }

  /* ---------- SKILLS ---------- */
  function renderSkills() {
    var wrap = document.getElementById('skills-constellation');
    if (!wrap || !Array.isArray(data.skills)) return;

    wrap.innerHTML = data.skills.map(function (s, i) {
      /* Stagger the float so the nodes never move in lockstep. */
      var delay = (i % 6) * 0.4;
      return '<li class="skill-node" data-group="' + esc(s.group || 'ai') + '" ' +
        'style="animation-delay:' + delay + 's" tabindex="0">' + esc(s.name) + '</li>';
    }).join('');
  }

  /* ---------- JOURNEY ---------- */
  function renderJourney() {
    var wrap = document.getElementById('timeline');
    if (!wrap || !Array.isArray(data.journey)) return;

    wrap.innerHTML = data.journey.map(function (j) {
      return '' +
        '<li class="timeline-item">' +
          '<span class="timeline-dot' + (j.active ? ' active' : '') + '" aria-hidden="true"></span>' +
          '<p class="timeline-year">' + esc(j.year) + '</p>' +
          '<h3 class="timeline-title">' + esc(j.title) + '</h3>' +
          '<p class="timeline-desc">' + esc(j.description) + '</p>' +
        '</li>';
    }).join('');
  }

  renderProjects();
  renderSkills();
  renderJourney();

  /* Let ui.js know the dynamic nodes exist so it can attach
     observers and tilt handlers to them. */
  document.dispatchEvent(new CustomEvent('portfolio:rendered'));
})();
