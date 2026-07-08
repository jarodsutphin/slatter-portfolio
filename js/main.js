(function () {
  var grid = document.getElementById('projects-grid');
  if (!grid) return;

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  function initFilter() {
    var filters = document.querySelectorAll('.filter');
    var items   = Array.from(grid.querySelectorAll('.grid-item'));
    if (!filters.length) return;
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.dataset.filter;
        items.forEach(function (item) {
          if (cat === 'all' || item.dataset.category === cat) {
            item.removeAttribute('hidden');
          } else {
            item.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  function renderGrid(projects) {
    grid.innerHTML = projects.map(function (p) {
      return '<a class="grid-item" href="work/project.html?slug=' + esc(p.slug) +
        '" data-category="' + esc(p.category) + '">' +
        '<div class="grid-image">' +
        (p.grid_image_url
          ? '<img src="' + esc(p.grid_image_url) + '" alt="' + esc(p.client) + ' — ' + esc(p.project_name) + '" loading="lazy">'
          : '') +
        '<span class="grid-tag">' + esc(cap(p.category)) + '</span>' +
        '</div>' +
        '<p class="grid-title">' + esc(p.client) + '</p>' +
        '</a>';
    }).join('');
    initFilter();
  }

  if (!window.db) {
    grid.innerHTML = '<p style="grid-column:1/-1;font-family:\'IBM Plex Mono\',monospace;font-size:13px;color:#e37c5d">Supabase not configured — fill in js/supabase-config.js.</p>';
    return;
  }

  window.db.from('projects').select('*').order('sort_order', { ascending: true })
    .then(function (result) {
      if (result.error || !result.data) { return; }
      renderGrid(result.data);
    });
})();
