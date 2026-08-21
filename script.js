const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const syncThemeButton = () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  };
  syncThemeButton();
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    syncThemeButton();
  });
}

function enableCssScrollReveal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const delayFor = (el) => {
    const root = el.closest('.section, .hero, .project-grid') || el.parentElement;
    const group = Array.from(root.querySelectorAll('.reveal'));
    const i = Math.min(Math.max(group.indexOf(el), 0), 5);
    return `${0.06 + i * 0.1}s`;
  };

  const show = (el) => {
    if (el.classList.contains('is-visible')) return;
    el.style.transitionDelay = delayFor(el);
    el.classList.add('is-visible');
  };

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: '0px 0px -10px 0px' }
  );

  els.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const visible = rect.bottom > 48 && rect.top < window.innerHeight - 24;
    if (visible) show(el);
    else io.observe(el);
  });
}

enableCssScrollReveal();

const hire = document.querySelector('.hire');
if (hire) {
  const toggle = hire.querySelector('#hireToggle');
  const menu = hire.querySelector('#hireMenu');

  const openHire = () => {
    menu.hidden = false;
    requestAnimationFrame(() => hire.classList.add('is-open'));
    toggle.setAttribute('aria-expanded', 'true');
  };

  const closeHire = () => {
    hire.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    window.setTimeout(() => {
      if (!hire.classList.contains('is-open')) menu.hidden = true;
    }, 240);
  };

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (hire.classList.contains('is-open')) {
      closeHire();
    } else {
      openHire();
    }
  });

  document.addEventListener('click', (event) => {
    if (hire.classList.contains('is-open') && !hire.contains(event.target)) {
      closeHire();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && hire.classList.contains('is-open')) {
      closeHire();
      toggle.focus();
    }
  });

  menu.querySelectorAll('.hire-option').forEach((option) => {
    option.addEventListener('click', () => closeHire());
  });
}

const modal = document.getElementById('projectModal');

if (modal) {
  const content = modal.querySelector('.project-modal-content');
  const scroller = modal.querySelector('.case-scroll');
  const tiles = Array.from(document.querySelectorAll('.project-open'));
  let lastFocused = null;

  const visualClasses = [
    'project-visual-one',
    'project-visual-two',
    'project-visual-three',
    'project-visual-four',
    'project-visual-five',
    'project-visual-six',
  ];

  function textOf(el) {
    return el ? el.textContent.trim() : '';
  }

  function prettyUrl(url) {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  function getTileData(button) {
    const tile = button.closest('.project-tile');
    const template = tile.querySelector('.project-detail');
    const visual = visualClasses.find((cls) =>
      tile.querySelector('.tile-visual').classList.contains(cls)
    );

    return {
      button,
      tile,
      template,
      visual: visual || 'project-visual-one',
      num: textOf(tile.querySelector('.tile-num')),
      year: textOf(tile.querySelector('.tile-year')),
      title: textOf(tile.querySelector('.tile-title')),
      sub: textOf(tile.querySelector('.tile-sub')),
      role: button.dataset.role || '',
      type: button.dataset.type || '',
      status: button.dataset.status || '',
      url: button.dataset.url || '',
    };
  }

  function buildSections(fragment) {
    const wrapper = document.createElement('div');
    wrapper.className = 'case-sections';

    const bodyBlocks = Array.from(fragment.querySelectorAll('.project-body > div'));
    bodyBlocks.forEach((block, index) => {
      const section = document.createElement('div');
      section.className = 'case-section';

      const num = document.createElement('span');
      num.className = 'case-section-num';
      num.textContent = String(index + 1).padStart(2, '0');

      const bodyCol = document.createElement('div');
      bodyCol.className = 'case-section-body';

      const heading = block.querySelector('h4');
      const title = document.createElement('h3');
      title.className = 'case-section-title';
      title.textContent = heading ? heading.textContent.trim() : '';
      bodyCol.appendChild(title);

      Array.from(block.children).forEach((child) => {
        if (child.tagName.toLowerCase() !== 'h4') {
          bodyCol.appendChild(child.cloneNode(true));
        }
      });

      section.appendChild(num);
      section.appendChild(bodyCol);
      wrapper.appendChild(section);
    });

    return wrapper;
  }

  function render(data) {
    const fragment = data.template.content.cloneNode(true);
    const tools = fragment.querySelector('.project-tools');

    const nextData = getTileData(tiles[(tiles.indexOf(data.button) + 1) % tiles.length]);

    content.innerHTML = '';

    const article = document.createElement('article');
    article.className = 'case';

    const hero = document.createElement('header');
    hero.className = 'case-hero';
    hero.innerHTML = `
      <div class="case-hero-meta">
        <span>${data.num}</span>
        <span>${(data.type || 'Website Design & Development').toUpperCase()}</span>
        <span>${data.year}</span>
      </div>
      <h2 class="case-title">${data.title}</h2>
      <p class="case-sub">${data.sub}</p>
    `;

    const preview = document.createElement('div');
    preview.className = 'case-preview';
    preview.innerHTML = `
      <div class="browser-bar">
        <span class="browser-dots"><i></i><i></i><i></i></span>
        <span class="browser-url">${prettyUrl(data.url)}</span>
      </div>
      <a class="browser-shot ${data.visual}" href="${data.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${data.title} live site">
        <span class="browser-shot-hint">Open live site ↗</span>
      </a>
    `;

    const main = document.createElement('div');
    main.className = 'case-main';

    const side = document.createElement('aside');
    side.className = 'case-side';
    side.innerHTML = `
      <div class="case-side-row"><dt>Role</dt><dd>${data.role}</dd></div>
      <div class="case-side-row"><dt>Type</dt><dd>${data.type}</dd></div>
      <div class="case-side-row"><dt>Status</dt><dd>${data.status}</dd></div>
    `;

    const sections = buildSections(fragment);

    if (tools) {
      const toolsWrap = document.createElement('div');
      toolsWrap.className = 'case-tools';
      const toolsLabel = document.createElement('h3');
      toolsLabel.className = 'case-section-title';
      toolsLabel.textContent = 'Built with';
      toolsWrap.appendChild(toolsLabel);
      toolsWrap.appendChild(tools);
      sections.appendChild(toolsWrap);
    }

    const cta = document.createElement('a');
    cta.className = 'case-cta';
    cta.href = data.url;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
    cta.innerHTML = `<span>Visit Live Website</span><span class="case-cta-arrow" aria-hidden="true">↗</span>`;
    sections.appendChild(cta);

    main.appendChild(side);
    main.appendChild(sections);

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'case-next';
    next.innerHTML = `
      <span class="case-next-label">Next Project</span>
      <span class="case-next-title">${nextData.title}</span>
      <span class="case-next-arrow" aria-hidden="true">→</span>
    `;
    next.addEventListener('click', () => open(nextData.button));

    article.appendChild(hero);
    article.appendChild(preview);
    article.appendChild(main);
    article.appendChild(next);

    content.appendChild(article);
  }

  function open(button) {
    const data = getTileData(button);
    if (!data.template) return;

    if (!lastFocused) lastFocused = button;
    render(data);

    modal.hidden = false;
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    if (scroller) scroller.scrollTop = 0;

    const closeBtn = modal.querySelector('.case-close');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');

    const finish = () => {
      modal.hidden = true;
      content.innerHTML = '';
      modal.removeEventListener('transitionend', onEnd);
    };
    const onEnd = (event) => {
      if (event.target.classList && event.target.classList.contains('case-shell')) finish();
    };

    modal.addEventListener('transitionend', onEnd);
    window.setTimeout(finish, 450);

    if (lastFocused) {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  tiles.forEach((button) => {
    const tile = button.closest('.project-tile');
    const url = button.dataset.url;
    if (tile && url && !tile.querySelector('.tile-view')) {
      const link = document.createElement('a');
      const title = textOf(tile.querySelector('.tile-title')) || 'project';
      link.className = 'tile-view';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `View ${title} live site`);
      link.innerHTML = 'View <span aria-hidden="true">↗</span>';
      tile.appendChild(link);
    }
    button.addEventListener('click', () => open(button));
  });

  modal.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) close();
  });
}

const contactForm = document.getElementById('contactForm');
const contactSendWrap = document.getElementById('contactSendWrap');
const contactSendToggle = document.getElementById('contactSendToggle');
const contactSendMenu = document.getElementById('contactSendMenu');

if (contactForm && contactSendWrap && contactSendToggle && contactSendMenu) {
  const menuLinks = {
    email: contactSendMenu.querySelector('[data-send="email"]'),
    whatsapp: contactSendMenu.querySelector('[data-send="whatsapp"]'),
    messenger: contactSendMenu.querySelector('[data-send="messenger"]'),
    telegram: contactSendMenu.querySelector('[data-send="telegram"]'),
  };

  const closeSendMenu = () => {
    contactSendMenu.hidden = true;
    contactSendToggle.setAttribute('aria-expanded', 'false');
  };

  const getInquiry = () => {
    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const who = [name, email].filter(Boolean).join(' · ');
    const text = who ? `Hi Gabriel!\n${who}\n\n${message}` : `Hi Gabriel!\n\n${message}`;
    return { name, email, message, text };
  };

  const syncMenuLinks = () => {
    const inquiry = getInquiry();
    const subject = encodeURIComponent(inquiry.name ? `Project inquiry from ${inquiry.name}` : 'Project inquiry');
    const details = [inquiry.name && `Name: ${inquiry.name}`, inquiry.email && `Email: ${inquiry.email}`, inquiry.message]
      .filter(Boolean)
      .join('\n\n');
    const body = encodeURIComponent(details);
    const waText = encodeURIComponent(inquiry.text);

    if (menuLinks.email) {
      menuLinks.email.href = `mailto:gabrielpangilinan05@gmail.com?subject=${subject}&body=${body}`;
    }
    if (menuLinks.whatsapp) {
      menuLinks.whatsapp.href = `https://wa.me/639765600691?text=${waText}`;
    }
    if (menuLinks.messenger) {
      menuLinks.messenger.href = 'https://m.me/gabgabyy77';
    }
    if (menuLinks.telegram) {
      menuLinks.telegram.href = `https://t.me/gabgabyy77`;
    }
  };

  const openSendMenu = () => {
    syncMenuLinks();
    contactSendMenu.hidden = false;
    contactSendToggle.setAttribute('aria-expanded', 'true');
  };

  contactSendToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!contactForm.reportValidity()) return;
    if (contactSendMenu.hidden) openSendMenu();
    else closeSendMenu();
  });

  contactSendMenu.querySelectorAll('[data-send]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!contactForm.reportValidity()) {
        event.preventDefault();
        return;
      }
      syncMenuLinks();
      window.setTimeout(closeSendMenu, 0);
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    openSendMenu();
  });

  document.addEventListener('click', (event) => {
    if (!contactSendWrap.contains(event.target)) closeSendMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSendMenu();
  });
}
