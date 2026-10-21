// DorkIntel · interfaz
(function () {
  'use strict';
  const { DORKS, CATEGORIES, normalizeTarget, buildQuery, needsTarget, googleUrl, escapeHtml, colorizeQuery, isGlobal } = window.DorkIntel;

  // ── i18n ──
  const T = {
    es: {
      subtitle: 'Google Hacking Intelligence · OSINT Toolkit',
      statDorks: 'Dorks', statCats: 'Categorías', statVisible: 'Visibles', statLaunched: 'Lanzados',
      ethics: '<b>Uso responsable.</b> Usa DorkIntel solo sobre dominios propios o con autorización por escrito (auditoría, bug bounty dentro del alcance, formación). Que algo esté indexado no da permiso para entrar: acceder a un panel, una cámara o un fichero ajeno sin autorización puede ser delito (art. 197 bis del Código Penal). Si encuentras datos expuestos de terceros, avisa al responsable o a <a href="https://www.incibe.es/incibe-cert/notificaciones" target="_blank" rel="noopener">INCIBE-CERT</a>.',
      understood: 'ENTENDIDO',
      target: 'Objetivo', targetLabel: 'DOMINIO OBJETIVO',
      targetEmpty: 'Sin objetivo: los dorks con {TARGET} lo necesitan.',
      targetOk: 'Objetivo: {t}',
      targetBad: 'No es un dominio ni una IP válidos (ej. ejemplo.com).',
      targetFixed: 'Normalizado a {t}',
      scope: 'Limitar al objetivo',
      scopeHelp: 'Añade site:objetivo a los dorks globales para no salir del dominio autorizado.',
      search: 'Buscar', searchPh: 'filtrar dorks...',
      categories: 'Categorías',
      history: 'Historial', clearHistory: 'BORRAR', historyEmpty: 'Sin lanzamientos aún',
      builder: '// CONSTRUCTOR DE CONSULTA',
      editorPh: 'Elige un dork con «+ USAR» o escribe tu consulta (usa {TARGET} para el objetivo)',
      launch: '▶ LANZAR', copy: '⎘ COPIAR', clear: '✕ LIMPIAR',
      previewLbl: 'GOOGLE ›',
      previewNeedTarget: 'Indica un dominio objetivo para resolver {TARGET}.',
      previewNeedScope: 'Dork global: indica un objetivo o desactiva «Limitar al objetivo».',
      help: 'Operadores útiles: <code>site:</code> <code>intitle:</code> <code>inurl:</code> <code>intext:</code> <code>filetype:</code>/<code>ext:</code> <code>before:</code>/<code>after:</code>, <code>-</code> para excluir y <code>OR</code> entre alternativas. <code>cache:</code>, <code>info:</code> y <code>related:</code> ya no funcionan en Google.',
      use: '+ USAR', launchShort: '▶ LANZAR', copyShort: '⎘ COPIAR',
      global: 'GLOBAL', globalTitle: 'No incluye el objetivo: con «Limitar al objetivo» se añade site:',
      noResults: '// SIN RESULTADOS //<br><br>Modifica el filtro o cambia de categoría',
      toastPick: '⚠ Elige o escribe un dork primero',
      toastNeedTarget: '⚠ Indica un dominio objetivo válido',
      toastNeedScope: '⚠ Dork global: indica un objetivo o desactiva «Limitar al objetivo»',
      toastCopied: '✓ Consulta copiada', toastCopyFail: '⚠ No se pudo copiar: selecciónala a mano',
      source: 'código fuente',
      tags: { danger: 'PELIGRO', warn: 'AVISO', info: 'INFO' },
    },
    en: {
      subtitle: 'Google Hacking Intelligence · OSINT Toolkit',
      statDorks: 'Dorks', statCats: 'Categories', statVisible: 'Visible', statLaunched: 'Launched',
      ethics: '<b>Responsible use.</b> Use DorkIntel only on your own domains or with written authorization (audits, in-scope bug bounty, training). Being indexed is not permission to access: entering someone else’s panel, camera or file without authorization may be a crime. If you find third-party data exposed, notify the owner or your national CERT.',
      understood: 'GOT IT',
      target: 'Target', targetLabel: 'TARGET DOMAIN',
      targetEmpty: 'No target: dorks with {TARGET} need one.',
      targetOk: 'Target: {t}',
      targetBad: 'Not a valid domain or IP (e.g. example.com).',
      targetFixed: 'Normalized to {t}',
      scope: 'Stay on target',
      scopeHelp: 'Adds site:target to global dorks so you never leave the authorized domain.',
      search: 'Search', searchPh: 'filter dorks...',
      categories: 'Categories',
      history: 'History', clearHistory: 'CLEAR', historyEmpty: 'Nothing launched yet',
      builder: '// QUERY BUILDER',
      editorPh: 'Pick a dork with “+ USE” or type your own query (use {TARGET} for the target)',
      launch: '▶ LAUNCH', copy: '⎘ COPY', clear: '✕ CLEAR',
      previewLbl: 'GOOGLE ›',
      previewNeedTarget: 'Set a target domain to resolve {TARGET}.',
      previewNeedScope: 'Global dork: set a target or turn off “Stay on target”.',
      help: 'Useful operators: <code>site:</code> <code>intitle:</code> <code>inurl:</code> <code>intext:</code> <code>filetype:</code>/<code>ext:</code> <code>before:</code>/<code>after:</code>, <code>-</code> to exclude and <code>OR</code> between alternatives. <code>cache:</code>, <code>info:</code> and <code>related:</code> no longer work on Google.',
      use: '+ USE', launchShort: '▶ LAUNCH', copyShort: '⎘ COPY',
      global: 'GLOBAL', globalTitle: 'Does not include the target: “Stay on target” adds site:',
      noResults: '// NO RESULTS //<br><br>Change the filter or the category',
      toastPick: '⚠ Pick or type a dork first',
      toastNeedTarget: '⚠ Set a valid target domain',
      toastNeedScope: '⚠ Global dork: set a target or turn off “Stay on target”',
      toastCopied: '✓ Query copied', toastCopyFail: '⚠ Could not copy: select it by hand',
      source: 'source code',
      tags: { danger: 'DANGER', warn: 'WARN', info: 'INFO' },
    },
  };

  const TAG_CONFIG = {
    danger: 'tag-danger', warn: 'tag-warn', info: 'tag-info', ok: 'tag-ok',
    creds: 'tag-danger', sqli: 'tag-danger', recon: 'tag-info', osint: 'tag-info', social: 'tag-purple',
    db: 'tag-danger', api: 'tag-warn', email: 'tag-info', cam: 'tag-danger', wp: 'tag-warn', git: 'tag-warn',
    cloud: 'tag-danger', docs: 'tag-info', files: 'tag-info', config: 'tag-danger', finance: 'tag-danger',
    gdpr: 'tag-danger', ftp: 'tag-warn', vpn: 'tag-warn', leak: 'tag-danger', admin: 'tag-danger',
    network: 'tag-danger', login: 'tag-warn', upload: 'tag-danger', redirect: 'tag-warn', devops: 'tag-danger',
    monitor: 'tag-warn', cms: 'tag-warn', legacy: 'tag-warn', data: 'tag-warn',
  };
  const TAG_LABEL = { creds: 'CREDS', sqli: 'SQLi', network: 'NET', finance: 'FIN', redirect: 'REDIR' };

  // ── Persistencia (puede fallar en modo privado) ──
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
  };

  const state = {
    lang: store.get('dorkintel-lang', (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en'),
    cat: 'all',
    search: '',
    target: '',
    scope: store.get('dorkintel-scope', true),
    history: store.get('dorkintel-history', []),
    launched: store.get('dorkintel-launched', 0),
  };
  if (!T[state.lang]) state.lang = 'es';
  if (!Array.isArray(state.history)) state.history = [];

  const $ = (id) => document.getElementById(id);
  const t = (key) => T[state.lang][key];

  // ── Textos estáticos ──
  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $('langToggle').textContent = state.lang === 'es' ? 'EN' : 'ES';
    $('langToggle').title = state.lang === 'es' ? 'English' : 'Español';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    $('themeToggle').textContent = theme === 'dark' ? '☀' : '☾';
    $('themeToggle').title = theme === 'dark' ? (state.lang === 'es' ? 'Tema claro' : 'Light theme') : (state.lang === 'es' ? 'Tema oscuro' : 'Dark theme');
  }

  // ── Categorías ──
  function buildCatNav() {
    const nav = $('catNav');
    nav.innerHTML = CATEGORIES.map((cat) => {
      const count = cat.id === 'all' ? DORKS.length : DORKS.filter((d) => d.cat === cat.id).length;
      return `<button type="button" class="cat-nav-item${cat.id === state.cat ? ' active' : ''}" data-cat="${cat.id}" aria-pressed="${cat.id === state.cat}">` +
        `<span class="cat-icon">${cat.icon}</span>${escapeHtml(cat[state.lang])}<span class="cat-count">${count}</span></button>`;
    }).join('');
  }

  // ── Tarjetas ──
  function dorkCard(dork) {
    const txt = dork[state.lang];
    const tags = dork.tags.map((tag) => {
      const lbl = t('tags')[tag] || TAG_LABEL[tag] || tag.toUpperCase();
      return `<span class="tag ${TAG_CONFIG[tag] || 'tag-info'}">${escapeHtml(lbl)}</span>`;
    });
    if (isGlobal(dork.query)) tags.push(`<span class="tag tag-global" title="${escapeHtml(t('globalTitle'))}">${t('global')}</span>`);
    return `<div class="dork-card" data-cat="${dork.cat}">
      <div class="dork-header">
        <div class="dork-query">${colorizeQuery(dork.query)}</div>
        <div class="dork-tags">${tags.join('')}</div>
      </div>
      <div class="dork-desc"><b>${escapeHtml(txt.title)}</b> — ${escapeHtml(txt.desc)}</div>
      <div class="dork-actions">
        <button type="button" class="dork-btn dork-btn-use" data-act="use" data-id="${dork.id}">${t('use')}</button>
        <button type="button" class="dork-btn dork-btn-launch" data-act="launch" data-id="${dork.id}">${t('launchShort')}</button>
        <button type="button" class="dork-btn dork-btn-copy" data-act="copy" data-id="${dork.id}">${t('copyShort')}</button>
      </div>
    </div>`;
  }

  function renderDorks() {
    const q = state.search.trim().toLowerCase();
    const filtered = DORKS.filter((d) => {
      if (state.cat !== 'all' && d.cat !== state.cat) return false;
      if (!q) return true;
      const cat = CATEGORIES.find((c) => c.id === d.cat);
      const hay = [d.query, d.es.title, d.es.desc, d.en.title, d.en.desc, d.tags.join(' '), cat.es, cat.en].join(' ').toLowerCase();
      return hay.includes(q);
    });
    $('results-count').textContent = filtered.length;

    const container = $('dorksContainer');
    if (filtered.length === 0) {
      container.innerHTML = `<div class="no-results">${t('noResults')}</div>`;
      return;
    }

    const groups = new Map();
    filtered.forEach((d) => { if (!groups.has(d.cat)) groups.set(d.cat, []); groups.get(d.cat).push(d); });
    const catInfo = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
    let idx = 0;
    container.innerHTML = [...groups.entries()].map(([catId, dorks]) => {
      const cat = catInfo[catId];
      return `<section class="dork-section" style="animation-delay:${(idx++ * 0.04).toFixed(2)}s">
        <div class="section-header">
          <div class="section-line"></div>
          <h2 class="section-title" style="color:${cat.color}">
            <span class="section-icon">${cat.icon}</span>${escapeHtml(cat[state.lang].toUpperCase())}
            <span style="color:var(--muted2);font-size:10px;font-family:'Share Tech Mono',monospace">[${dorks.length}]</span>
          </h2>
          <div class="section-line"></div>
        </div>
        <div class="dork-grid">${dorks.map(dorkCard).join('')}</div>
      </section>`;
    }).join('');
  }

  // ── Objetivo ──
  function updateTarget() {
    const raw = $('targetInput').value;
    const res = normalizeTarget(raw);
    state.target = res.value;
    const hint = $('targetHint');
    $('targetInput').classList.toggle('invalid', !res.valid);
    hint.className = 'target-hint';
    if (!raw.trim()) {
      hint.textContent = t('targetEmpty');
    } else if (!res.valid) {
      hint.textContent = t('targetBad');
      hint.classList.add('err');
    } else {
      hint.textContent = (res.value !== raw.trim().toLowerCase() ? t('targetFixed') : t('targetOk')).replace('{t}', res.value);
      hint.classList.add('ok');
    }
    updatePreview();
  }

  // ── Constructor ──
  const editor = () => $('queryEditor');

  function updatePreview() {
    const raw = editor().value.trim();
    const el = $('queryPreview');
    if (!raw) { el.innerHTML = ''; return; }
    if (needsTarget(raw, state.scope) && !state.target) {
      el.innerHTML = `<span class="lbl">${t('previewLbl')}</span><span class="warn">${escapeHtml(t(/\{TARGET\}/.test(raw) ? 'previewNeedTarget' : 'previewNeedScope'))}</span>`;
      return;
    }
    el.innerHTML = `<span class="lbl">${t('previewLbl')}</span><span class="resolved">${colorizeQuery(buildQuery(raw, state.target, state.scope))}</span>`;
  }

  // Devuelve la consulta lista para Google o null (y avisa) si falta el objetivo
  function resolveOrWarn(query) {
    if (!query.trim()) { showToast(t('toastPick')); return null; }
    if (needsTarget(query, state.scope) && !state.target) {
      showToast(t(/\{TARGET\}/.test(query) ? 'toastNeedTarget' : 'toastNeedScope'));
      $('targetInput').focus();
      return null;
    }
    return buildQuery(query, state.target, state.scope);
  }

  function launch(query) {
    const q = resolveOrWarn(query);
    if (!q) return;
    window.open(googleUrl(q), '_blank', 'noopener');
    state.launched += 1;
    state.history = [q, ...state.history.filter((h) => h !== q)].slice(0, 30);
    store.set('dorkintel-history', state.history);
    store.set('dorkintel-launched', state.launched);
    renderHistory();
  }

  async function copy(query) {
    const q = resolveOrWarn(query);
    if (!q) return;
    try {
      await navigator.clipboard.writeText(q);
      showToast(t('toastCopied'));
    } catch (e) {
      showToast(t('toastCopyFail'));
    }
  }

  function setEditor(query) {
    editor().value = query;
    updatePreview();
    editor().focus();
    editor().scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  // ── Historial ──
  function renderHistory() {
    $('history-count').textContent = state.launched;
    const list = $('historyList');
    if (!state.history.length) {
      list.innerHTML = `<div class="history-empty">${t('historyEmpty')}</div>`;
      return;
    }
    list.innerHTML = state.history.map((h, i) =>
      `<button type="button" class="history-item" data-hist="${i}" title="${escapeHtml(h)}">${escapeHtml(h)}</button>`).join('');
  }

  // ── Avisos ──
  function showToast(msg) {
    document.querySelector('.toast')?.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2100);
  }

  // ── Ticker ──
  function buildTicker() {
    const items = ['site:', 'intitle:', 'inurl:', 'intext:', 'filetype:', 'ext:', 'before:', 'after:', 'OR', '-',
      '"index of"', '"password"', '"admin"', 'wp-login.php', '.env', '.git', 'phpMyAdmin', 'Elasticsearch',
      '"SQL syntax"', 'id_rsa', '.pem', 'docker-compose', 'api_key', 'AKIA', 'xmlrpc', 'wp-config', 'robots.txt'];
    const html = items.map((i) => `<span class="ticker-item"><span>${escapeHtml(i)}</span></span>`).join('');
    $('tickerInner').innerHTML = html + html; // dos copias: la animación se desplaza un 50%
  }

  // ── Lluvia Matrix (se pausa en segundo plano y respeta "reducir movimiento") ──
  function startMatrix() {
    const canvas = $('matrix-canvas');
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { canvas.remove(); return; }
    const ctx = canvas.getContext('2d');
    const chars = 'アイウエオカキクケコサシスセソタチツテト01010101site:inurl:intext:filetype:'.split('');
    let drops = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array(Math.floor(canvas.width / 14)).fill(1);
    };
    resize();
    window.addEventListener('resize', resize);
    let last = 0;
    const frame = (ts) => {
      requestAnimationFrame(frame);
      if (document.hidden || ts - last < 50) return;
      last = ts;
      const css = getComputedStyle(document.documentElement);
      ctx.fillStyle = css.getPropertyValue('--matrix-fade').trim() || 'rgba(2,5,8,0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = css.getPropertyValue('--matrix').trim() || '#00ff41';
      ctx.font = '12px monospace';
      drops.forEach((y, i) => {
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    requestAnimationFrame(frame);
  }

  // ── Eventos ──
  function bind() {
    $('targetInput').addEventListener('input', updateTarget);
    $('searchInput').addEventListener('input', (e) => { state.search = e.target.value; renderDorks(); });
    $('scopeToggle').checked = state.scope;
    $('scopeToggle').addEventListener('change', (e) => { state.scope = e.target.checked; store.set('dorkintel-scope', state.scope); updatePreview(); });
    editor().addEventListener('input', updatePreview);
    editor().addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); launch(editor().value); } });

    $('launchBtn').addEventListener('click', () => launch(editor().value));
    $('copyBtn').addEventListener('click', () => copy(editor().value));
    $('clearBtn').addEventListener('click', () => { editor().value = ''; updatePreview(); editor().focus(); });

    $('catNav').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      state.cat = btn.dataset.cat;
      buildCatNav();
      renderDorks();
    });

    $('dorksContainer').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const dork = DORKS.find((d) => d.id === btn.dataset.id);
      if (!dork) return;
      if (btn.dataset.act === 'use') setEditor(dork.query);
      else if (btn.dataset.act === 'launch') launch(dork.query);
      else if (btn.dataset.act === 'copy') copy(dork.query);
    });

    $('historyList').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-hist]');
      if (btn) setEditor(state.history[Number(btn.dataset.hist)] || '');
    });
    $('historyClear').addEventListener('click', () => {
      state.history = [];
      store.set('dorkintel-history', state.history);
      renderHistory();
    });

    $('langToggle').addEventListener('click', () => {
      state.lang = state.lang === 'es' ? 'en' : 'es';
      store.set('dorkintel-lang', state.lang);
      renderAll();
    });
    $('themeToggle').addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('dorkintel-theme', next); } catch (e) { /* sin almacenamiento */ }
      applyTheme(next);
    });

    if (store.get('dorkintel-ethics-ok', false)) $('ethics').hidden = true;
    $('ethicsClose').addEventListener('click', () => { $('ethics').hidden = true; store.set('dorkintel-ethics-ok', true); });
  }

  function renderAll() {
    applyI18n();
    applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    buildCatNav();
    renderDorks();
    renderHistory();
    updateTarget();
  }

  $('total-count').textContent = DORKS.length;
  $('cat-count').textContent = CATEGORIES.length - 1;
  bind();
  buildTicker();
  renderAll();
  startMatrix();
})();
