(function () {
  var slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) { window.location.replace('../index.html'); return; }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  async function load() {
    var infoEl   = document.getElementById('project-info');
    var imagesEl = document.getElementById('project-images');
    var navEl    = document.getElementById('project-nav');

    var ref = await window.db.from('projects').select('*').eq('slug', slug).single();
    if (ref.error || !ref.data) {
      infoEl.innerHTML = '<p style="color:#e37c5d;font-family:\'IBM Plex Mono\',monospace;padding:40px">Project not found.</p>';
      return;
    }
    var p = ref.data;

    document.title = esc(p.client) + ' — Amanda Slatter';

    infoEl.innerHTML =
      '<a class="back-link" href="../index.html#work">← All Work</a>' +
      '<div class="project-meta">' +
        '<div class="project-meta-col"><div class="project-label">Client</div><div class="project-value">' + esc(p.client) + '</div></div>' +
        '<div class="project-meta-col"><div class="project-label">Project</div><div class="project-value">' + esc(p.project_name) + '</div></div>' +
      '</div>' +
      (p.blurb ? '<p class="project-blurb">' + esc(p.blurb) + '</p>' : '');

    var urls = p.full_image_urls || [];
    imagesEl.innerHTML = urls.map(function (url) {
      return '<img src="' + esc(url) + '" alt="' + esc(p.client + ' — ' + p.project_name) + '" loading="lazy">';
    }).join('');

    var prevRef = await window.db.from('projects').select('slug,client').lt('sort_order', p.sort_order).order('sort_order', { ascending: false }).limit(1);
    var nextRef = await window.db.from('projects').select('slug,client').gt('sort_order', p.sort_order).order('sort_order', { ascending: true }).limit(1);

    if (!prevRef.data || !prevRef.data.length) {
      prevRef = await window.db.from('projects').select('slug,client').order('sort_order', { ascending: false }).limit(1);
    }
    if (!nextRef.data || !nextRef.data.length) {
      nextRef = await window.db.from('projects').select('slug,client').order('sort_order', { ascending: true }).limit(1);
    }

    var prev = prevRef.data && prevRef.data[0];
    var next = nextRef.data && nextRef.data[0];

    navEl.innerHTML =
      (prev ? '<a href="project.html?slug=' + esc(prev.slug) + '">← ' + esc(prev.client) + '</a>' : '<span></span>') +
      (next ? '<a href="project.html?slug=' + esc(next.slug) + '">' + esc(next.client) + ' →</a>' : '<span></span>');
  }

  if (window.db) load();
})();
