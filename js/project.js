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

    var urls = p.full_image_urls || [];
    var leadImage = null;
    if (slug === 'fafsa-vcac' && urls.length) {
      leadImage = urls[0];
      urls = urls.slice(1);
    }

    var meta =
      '<div class="project-meta">' +
        '<div class="project-meta-col"><div class="project-label">Client</div><div class="project-value">' + esc(p.client) + '</div></div>' +
        '<div class="project-meta-col"><div class="project-label">Project</div><div class="project-value">' + esc(p.project_name) + '</div></div>' +
      '</div>';

    var blurb = p.blurb ? '<p class="project-blurb">' + esc(p.blurb) + '</p>' : '';

    var featureImg = leadImage ? '<div class="project-feature-image-wrap"><img class="project-feature-image" src="' + esc(leadImage) + '" alt="' + esc(p.client + ' — ' + p.project_name) + '" loading="lazy"></div>' : '';

    infoEl.innerHTML =
      '<a class="back-link" href="../index.html#work">← All Work</a>' +
      meta +
      (leadImage
        ? '<div class="project-info-row">' + featureImg + blurb + '</div>'
        : blurb);

    imagesEl.innerHTML =
      '<button class="carousel-arrow carousel-prev" aria-label="Previous image">←</button>' +
      '<div class="carousel-track">' +
        urls.map(function (url) {
          return '<img src="' + esc(url) + '" alt="' + esc(p.client + ' — ' + p.project_name) + '" loading="lazy">';
        }).join('') +
      '</div>' +
      '<button class="carousel-arrow carousel-next" aria-label="Next image">→</button>';

    var track = imagesEl.querySelector('.carousel-track');
    imagesEl.querySelector('.carousel-prev').addEventListener('click', function () {
      track.scrollBy({ left: -track.clientWidth * 0.8, behavior: 'smooth' });
    });
    imagesEl.querySelector('.carousel-next').addEventListener('click', function () {
      track.scrollBy({ left: track.clientWidth * 0.8, behavior: 'smooth' });
    });

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
