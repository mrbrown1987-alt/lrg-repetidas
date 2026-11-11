/* ============================================================
   LRG Duplicates — app logic
   - Catalog of duplicate cards only (gold / silver / Dreamcast)
   - Visitor selection (cart) + CSV/ZIP export
   - "Request prices" form (Formspree) with validation + human check
   ============================================================ */
(function () {
  'use strict';

  var IMG_DIR = 'images/';
  var PAGE_SIZE = 50;
  var LS_CART = 'lrgDuplicates.cart.v2';
  var LS_COLS = 'lrgDuplicates.cols.v2';
  var LS_LANG = 'lrgDuplicates.lang.v2';
  var CONFIG = window.LRG_CONFIG || {};
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------------- i18n ---------------- */
  var I18N = {
    en: {
      brandTitle: 'LRG Duplicates',
      brandSub: 'Limited Run Games duplicates',
      navCatalog: 'Catalog',
      navSelected: 'Selected',
      sort: 'Sort',
      sortNumber: 'Number',
      sortName: 'Name (A–Z)',
      sortNameDesc: 'Name (Z–A)',
      perRow: 'Per row',
      searchPlaceholder: 'Search by name or number…',
      clearSearch: 'Clear search',
      results: 'Showing {a}–{b} of {n} cards',
      resultsEmpty: 'No cards match that search.',
      seriesAll: 'All',
      seriesPrefix: 'Series',
      seriesDreamcast: 'Dreamcast',
      finishFilterLabel: 'Finish',
      finishAll: 'All finishes',
      finishGold: 'Gold',
      finishSilver: 'Silver',
      finishDreamcast: 'Dreamcast',
      selectCards: 'Select cards',
      doneSelecting: 'Done selecting',
      nSelected: '{n} selected',
      selectPage: 'Select page',
      clear: 'Clear',
      viewSelected: 'View selected →',
      addToSelected: 'Add to selected',
      removeFromSelected: 'Remove from selected',
      inSelected: 'In selected — click to remove',
      selectedTitle: 'Selected cards',
      selectedSub: 'Cards you are interested in, most recently selected first.',
      selRecent: 'Most recent first',
      selNumber: 'Number',
      selName: 'Name (A–Z)',
      requestPrices: '✉ Request prices',
      exportZip: '⬇ Export list + images (.zip)',
      exportCsv: 'Export list (.csv)',
      clearAll: 'Clear all',
      backToCatalog: '← Back to catalog',
      emptySelTitle: 'No cards selected yet',
      emptySelText: 'Go to the catalog, press “Select cards” and click the ones you want to ask about.',
      browseCatalog: 'Browse catalog',
      viewBack: 'View back',
      viewFront: 'View front',
      noImage: 'No image',
      backUnavailable: 'Back not available',
      noDescription: 'No description available.',
      dreamcastPending: 'Dreamcast card · photo coming soon.',
      hint: 'Use ← → to move between cards.',
      rotate: 'Rotate',
      close: 'Close',
      previous: 'Previous',
      next: 'Next',
      footer: 'Unofficial fan collection · Limited Run Games is a trademark of its respective owners.',
      mobilePreview: '📱 iPhone preview',
      confirmClearTitle: 'Clear all selected cards?',
      confirmClearBody: 'This will remove every card from your selected list. This cannot be undone.',
      cancel: 'Cancel',
      preparing: 'Preparing export…',
      progress: 'Downloading images… {n}/{total}',
      exportDone: 'Exported {n} cards.',
      exportError: 'Export failed. The site needs to be served over http(s) for image downloads.',
      csvDone: 'List exported.',
      noSelection: 'Select some cards first.',
      cleared: 'Selection cleared.',
      emailTitle: 'Request prices',
      emailIntro: 'Send me your selection and I will reply with prices. Your email is only used to answer you.',
      labelReqEmail: 'Your email *',
      labelReqInstagram: 'Instagram (optional)',
      labelReqReddit: 'Reddit (optional)',
      instagramPlaceholder: '@you or profile URL',
      redditPlaceholder: 'u/you or profile URL',
      profileHint: 'Give at least one: Instagram or Reddit.',
      puzzleLabel: 'Human check: {a} + {b} = ?',
      sendRequest: 'Send request',
      emailSending: 'Sending…',
      errEmail: 'Enter a valid email.',
      errProfile: 'Give your Instagram or Reddit.',
      errPuzzle: 'Wrong answer.',
      emailNotConfigured: 'Email sending is not set up yet. Please contact me on Instagram/Reddit.',
      emailSent: 'Request sent. I will get back to you soon.',
      emailFailed: 'Could not send. Please try again.',
      emailNoSelection: 'Select some cards first.'
    },
    es: {
      brandTitle: 'LRG Repetidas',
      brandSub: 'Repetidas de Limited Run Games',
      navCatalog: 'Catálogo',
      navSelected: 'Seleccionadas',
      sort: 'Orden',
      sortNumber: 'Número',
      sortName: 'Nombre (A–Z)',
      sortNameDesc: 'Nombre (Z–A)',
      perRow: 'Por fila',
      searchPlaceholder: 'Buscar por nombre o número…',
      clearSearch: 'Borrar búsqueda',
      results: 'Mostrando {a}–{b} de {n} cartas',
      resultsEmpty: 'No hay cartas que coincidan con la búsqueda.',
      seriesAll: 'Todas',
      seriesPrefix: 'Serie',
      seriesDreamcast: 'Dreamcast',
      finishFilterLabel: 'Acabado',
      finishAll: 'Todos',
      finishGold: 'Oro',
      finishSilver: 'Plata',
      finishDreamcast: 'Dreamcast',
      selectCards: 'Seleccionar cartas',
      doneSelecting: 'Listo',
      nSelected: '{n} seleccionadas',
      selectPage: 'Seleccionar página',
      clear: 'Vaciar',
      viewSelected: 'Ver seleccionadas →',
      addToSelected: 'Añadir a seleccionadas',
      removeFromSelected: 'Quitar de seleccionadas',
      inSelected: 'En seleccionadas — pulsa para quitar',
      selectedTitle: 'Cartas seleccionadas',
      selectedSub: 'Cartas que te interesan, la última seleccionada primero.',
      selRecent: 'Últimas primero',
      selNumber: 'Número',
      selName: 'Nombre (A–Z)',
      requestPrices: '✉ Solicitar precios',
      exportZip: '⬇ Exportar lista + imágenes (.zip)',
      exportCsv: 'Exportar lista (.csv)',
      clearAll: 'Vaciar todo',
      backToCatalog: '← Volver al catálogo',
      emptySelTitle: 'Aún no hay cartas seleccionadas',
      emptySelText: 'Ve al catálogo, pulsa “Seleccionar cartas” y haz clic en las que quieras consultar.',
      browseCatalog: 'Ver catálogo',
      viewBack: 'Ver dorso',
      viewFront: 'Ver anverso',
      noImage: 'Sin imagen',
      backUnavailable: 'Dorso no disponible',
      noDescription: 'Descripción no disponible.',
      dreamcastPending: 'Carta Dreamcast · foto próximamente.',
      hint: 'Usa ← → para moverte entre cartas.',
      rotate: 'Girar',
      close: 'Cerrar',
      previous: 'Anterior',
      next: 'Siguiente',
      footer: 'Colección no oficial de fans · Limited Run Games es marca de sus respectivos propietarios.',
      mobilePreview: '📱 Vista iPhone',
      confirmClearTitle: '¿Vaciar todas las seleccionadas?',
      confirmClearBody: 'Se quitarán todas las cartas de tu lista. No se puede deshacer.',
      cancel: 'Cancelar',
      preparing: 'Preparando exportación…',
      progress: 'Descargando imágenes… {n}/{total}',
      exportDone: 'Exportadas {n} cartas.',
      exportError: 'Error al exportar. La web debe servirse por http(s) para descargar las imágenes.',
      csvDone: 'Lista exportada.',
      noSelection: 'Selecciona alguna carta primero.',
      cleared: 'Selección vaciada.',
      emailTitle: 'Solicitar precios',
      emailIntro: 'Envíame tu selección y te responderé con los precios. Tu email solo se usa para contestarte.',
      labelReqEmail: 'Tu email *',
      labelReqInstagram: 'Instagram (opcional)',
      labelReqReddit: 'Reddit (opcional)',
      instagramPlaceholder: '@usuario o URL del perfil',
      redditPlaceholder: 'u/usuario o URL del perfil',
      profileHint: 'Indica al menos uno: Instagram o Reddit.',
      puzzleLabel: 'Comprobación humana: {a} + {b} = ?',
      sendRequest: 'Enviar solicitud',
      emailSending: 'Enviando…',
      errEmail: 'Introduce un email válido.',
      errProfile: 'Indica tu Instagram o Reddit.',
      errPuzzle: 'Respuesta incorrecta.',
      emailNotConfigured: 'El envío de email aún no está configurado. Contacta por Instagram/Reddit.',
      emailSent: 'Solicitud enviada. Te responderé pronto.',
      emailFailed: 'No se pudo enviar. Inténtalo de nuevo.',
      emailNoSelection: 'Selecciona alguna carta primero.'
    }
  };

  var lang = 'en';
  function t(key, vars) {
    var dict = I18N[lang] || I18N.en;
    var s = dict[key];
    if (s == null) s = I18N.en[key];
    if (s == null) s = key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split('{' + k + '}').join(String(vars[k]));
      });
    }
    return s;
  }
  function fmtNum(n) {
    try { return Number(n).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US'); }
    catch (e) { return String(n); }
  }

  /* ---------------- DOM ---------------- */
  var $ = function (id) { return document.getElementById(id); };
  var cardGrid = $('cardGrid');
  var selectedGrid = $('selectedGrid');
  var seriesTabs = $('seriesTabs');
  var finishFilter = $('finishFilter');
  var searchInput = $('searchInput');
  var searchClear = $('searchClear');
  var colsToggle = $('colsToggle');
  var resultsSummary = $('resultsSummary');
  var emptyState = $('emptyState');
  var pagination = $('pagination');
  var paginationTop = $('paginationTop');
  var selectBarCount = $('selectBarCount');
  var selectPageBtn = $('selectPageBtn');
  var clearSelBtn = $('clearSelBtn');
  var viewSelectedBtn = $('viewSelectedBtn');
  var navCatalog = $('navCatalog');
  var navSelected = $('navSelected');
  var navSelectedCount = $('navSelectedCount');
  var catalogView = $('catalogView');
  var selectedView = $('selectedView');
  var selectedTitle = $('selectedTitle');
  var selectedTotal = $('selectedTotal');
  var selectedSub = $('selectedSub');
  var requestPricesBtn = $('requestPricesBtn');
  var exportZipBtn = $('exportZipBtn');
  var exportCsvBtn = $('exportCsvBtn');
  var clearSelectedBtn = $('clearSelectedBtn');
  var backToCatalog = $('backToCatalog');
  var selectedEmpty = $('selectedEmpty');
  var emptySelTitle = $('emptySelTitle');
  var emptySelText = $('emptySelText');
  var emptyBrowseBtn = $('emptyBrowseBtn');
  var langBtn = $('langBtn');
  var langLabel = $('langLabel');
  var langMenu = $('langMenu');
  var brandTitle = $('brandTitle');
  var footerText = $('footerText');
  var mobilePreviewLink = $('mobilePreviewLink');
  var confirmModal = $('confirmModal');
  var confirmTitle = $('confirmTitle');
  var confirmBody = $('confirmBody');
  var confirmCancel = $('confirmCancel');
  var confirmOk = $('confirmOk');
  var emailModal = $('emailModal');
  var emailClose = $('emailClose');
  var emailTitle = $('emailTitle');
  var emailIntro = $('emailIntro');
  var emailForm = $('emailForm');
  var reqEmail = $('reqEmail');
  var errEmail = $('errEmail');
  var reqInstagram = $('reqInstagram');
  var reqReddit = $('reqReddit');
  var profileHint = $('profileHint');
  var reqPuzzle = $('reqPuzzle');
  var errPuzzle = $('errPuzzle');
  var reqCompany = $('reqCompany');
  var errForm = $('errForm');
  var emailCancel = $('emailCancel');
  var emailSend = $('emailSend');
  var labelReqEmail = $('labelReqEmail');
  var labelReqInstagram = $('labelReqInstagram');
  var labelReqReddit = $('labelReqReddit');
  var labelReqPuzzle = $('labelReqPuzzle');
  var toast = $('toast');
  var selectModeBtn = $('selectModeBtn');
  var selectModeLabel = $('selectModeLabel');
  var lightbox = $('lightbox');
  var lbImg = $('lbImg');
  var lbPlaceholder = $('lbPlaceholder');
  var lbNoImage = $('lbNoImage');
  var lbSerie = $('lbSerie');
  var lbNumber = $('lbNumber');
  var lbName = $('lbName');
  var lbRarity = $('lbRarity');
  var lbClose = $('lbClose');
  var lbPrev = $('lbPrev');
  var lbNext = $('lbNext');
  var lbCard = document.querySelector('.lb-card');

  /* ---------------- state ---------------- */
  var cards = [];
  var cardsByKey = {};
  var seriesCounts = { all: 0, '1': 0, '2': 0, '3': 0, Dreamcast: 0 };
  var catalogList = [];
  var cartList = [];
  var page = 1;
  var activeSerie = 'all';
  var activeFinish = 'all';
  var view = 'catalog';
  var cols = 5;
  var cart = {};
  var lastStamp = 0;
  var emailPuzzle = { a: 0, b: 0 };
  var emailBusy = false;
  var selectionMode = false;
  var lbIndex = -1;
  var toastTimer = null;
  var confirmAction = null;

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function serieOrder(s) {
    s = String(s);
    return s === '1' ? 1 : s === '2' ? 2 : s === '3' ? 3 : s === 'Dreamcast' ? 4 : 99;
  }
  function finishOrder(f) {
    return f === 'gold' ? 0 : f === 'silver' ? 1 : 2;
  }
  function serieLabel(s) {
    s = String(s);
    return s === 'Dreamcast' ? t('seriesDreamcast') : t('seriesPrefix') + ' ' + s;
  }
  function finishLabel(f) {
    return f === 'gold' ? t('finishGold') : f === 'silver' ? t('finishSilver') : t('finishDreamcast');
  }
  function displayNumber(c) {
    return /^\d+$/.test(String(c.number)) ? '#' + c.number : String(c.number);
  }
  function numKey(n) {
    n = String(n);
    return /^\d+$/.test(n) ? [0, parseInt(n, 10), ''] : [1, 0, n];
  }
  function cmpNumber(a, b) {
    var d = serieOrder(a.serie) - serieOrder(b.serie);
    if (d) return d;
    var ka = numKey(a.number), kb = numKey(b.number);
    if (ka[0] !== kb[0]) return ka[0] - kb[0];
    if (ka[1] !== kb[1]) return ka[1] - kb[1];
    if (ka[2] !== kb[2]) return ka[2].localeCompare(kb[2], 'en', { numeric: true });
    var fa = finishOrder(a.finish), fb = finishOrder(b.finish);
    if (fa !== fb) return fa - fb;
    return a.name.localeCompare(b.name, lang === 'es' ? 'es' : 'en', { sensitivity: 'base' });
  }
  function cmpName(a, b) {
    var c = a.name.localeCompare(b.name, lang === 'es' ? 'es' : 'en', { sensitivity: 'base' });
    return c || cmpNumber(a, b);
  }
  function showToast(msg, sticky) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    if (!sticky) {
      toastTimer = setTimeout(function () { toast.hidden = true; }, 2800);
    }
  }

  /* ---------------- data ---------------- */
  function buildCards() {
    var raw = window.DUPLICATES_DATA || [];
    cards = raw.map(function (r) {
      var serie = String(r.serie);
      var number = String(r.number);
      return {
        serie: serie,
        number: number,
        name: r.name || '',
        finish: r.finish === 'gold' || r.finish === 'silver' ? r.finish : 'none',
        rarity: r.rarity || '',
        file: r.file || '',
        desc: r.desc || '',
        price: (typeof r.price === 'number') ? r.price : null,
        priceBase: (typeof r.priceBase === 'number') ? r.priceBase : null,
        key: r.key || (serie + '-' + number + '-' + (r.finish || 'none'))
      };
    });
    cardsByKey = {};
    seriesCounts = { all: 0, '1': 0, '2': 0, '3': 0, Dreamcast: 0 };
    cards.forEach(function (c) {
      cardsByKey[c.key] = c;
      seriesCounts.all++;
      if (seriesCounts[c.serie] == null) seriesCounts[c.serie] = 0;
      seriesCounts[c.serie]++;
    });
  }

  function wireImage(img) {
    var file = img.getAttribute('data-file');
    if (!file) return;
    var ph = img.parentElement ? img.parentElement.querySelector('.card-placeholder') : null;
    img.onload = function () {
      img.classList.add('loaded');
      if (ph) ph.hidden = true;
    };
    img.onerror = function () {
      img.style.display = 'none';
      if (ph) ph.hidden = false;
    };
    img.src = IMG_DIR + file;
  }
  function attachImageLoaders(container) {
    if (!container) return;
    container.querySelectorAll('img[data-file]').forEach(wireImage);
  }

  /* ---------------- cart ---------------- */
  function loadCart() {
    try { cart = JSON.parse(localStorage.getItem(LS_CART) || '{}') || {}; }
    catch (e) { cart = {}; }
    lastStamp = Object.keys(cart).reduce(function (max, k) {
      return Math.max(max, Number(cart[k]) || 0);
    }, 0);
  }
  function saveCart() {
    try { localStorage.setItem(LS_CART, JSON.stringify(cart)); }
    catch (e) { /* storage may be disabled */ }
  }
  function nextStamp() {
    var now = Date.now();
    if (now <= lastStamp) now = lastStamp + 1;
    lastStamp = now;
    return now;
  }
  function isSelected(key) { return !!cart[key]; }
  function toggleSelected(key) {
    if (!cardsByKey[key]) return;
    if (cart[key]) delete cart[key];
    else cart[key] = nextStamp();
    saveCart();
    updateSummary();
  }
  function addSelected(key) {
    if (!cardsByKey[key] || cart[key]) return;
    cart[key] = nextStamp();
  }
  function computeSelection() {
    return Object.keys(cart)
      .map(function (k) { return cardsByKey[k]; })
      .filter(Boolean)
      .sort(function (a, b) { return (cart[b.key] || 0) - (cart[a.key] || 0); });
  }
  function getCartInOrder() {
    return computeSelection();
  }
  function updateSummary() {
    var n = computeSelection().length;
    navSelectedCount.textContent = fmtNum(n);
    selectBarCount.textContent = t('nSelected', { n: fmtNum(n) });
  }
  function clearAllCart() {
    cart = {};
    saveCart();
    updateSummary();
    if (view === 'catalog') refreshCatalogSelectionDOM();
    else renderSelected();
  }

  /* ---------------- catalog ---------------- */
  function buildCatalogList() {
    var q = searchInput.value.trim().toLowerCase();
    var s = activeSerie;
    var f = activeFinish;
    var list = cards.filter(function (c) {
      if (s !== 'all' && c.serie !== s) return false;
      if (f !== 'all' && c.finish !== f) return false;
      if (!q) return true;
      var hay = (c.name + ' ' + c.number + ' ' + serieLabel(c.serie) + ' ' + finishLabel(c.finish) + ' ' + (c.rarity || '')).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    list.sort(cmpNumber);
    return list;
  }

  function cardHTML(c) {
    var sel = isSelected(c.key);
    var finishClass = c.finish === 'gold' ? 'finish-gold' : c.finish === 'silver' ? 'finish-silver' : 'finish-dreamcast';
    var badgeClass = c.finish === 'gold' ? 'gold' : c.finish === 'silver' ? 'silver' : 'none';
    var badge = '<span class="finish-badge ' + badgeClass + '">' + esc(finishLabel(c.finish)) + '</span>';
    var priceBadge = (c.price != null) ? '<span class="price-badge">$' + esc(c.price) + '</span>' : '';
    var numLabel = displayNumber(c);
    return (
      '<article class="card ' + finishClass + (sel ? ' is-selected' : '') + '" data-key="' + esc(c.key) + '" tabindex="0" role="button" aria-label="' + esc(c.name + ' ' + numLabel + ' ' + finishLabel(c.finish)) + '">' +
        '<div class="card-name-bar"><p class="card-name"><span class="card-name-num">' + esc(numLabel) + '</span> ' + esc(c.name) + '</p></div>' +
        '<div class="card-media">' +
          '<img loading="lazy" alt="" data-file="' + esc(c.file) + '">' +
          '<div class="card-placeholder" hidden><div class="cb-inner"><span class="cb-mark">LRG</span><small>' + esc(t('noImage')) + '</small></div></div>' +
          badge +
          priceBadge +
        '</div>' +
      '</article>'
    );
  }

  function renderCatalog() {
    catalogList = buildCatalogList();
    var total = catalogList.length;
    var pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (page > pages) page = pages;
    if (page < 1) page = 1;
    var start = (page - 1) * PAGE_SIZE;
    var slice = catalogList.slice(start, start + PAGE_SIZE);

    cardGrid.innerHTML = slice.map(cardHTML).join('');
    attachImageLoaders(cardGrid);

    emptyState.hidden = total !== 0;
    cardGrid.hidden = total === 0;
    resultsSummary.innerHTML = total
      ? t('results', { a: '<strong>' + fmtNum(start + 1) + '</strong>', b: '<strong>' + fmtNum(start + slice.length) + '</strong>', n: '<strong>' + fmtNum(total) + '</strong>' })
      : t('resultsEmpty');

    renderPagination(pages);
  }

  function refreshCatalogSelectionDOM() {
    cardGrid.querySelectorAll('.card').forEach(function (el) {
      el.classList.toggle('is-selected', isSelected(el.getAttribute('data-key')));
    });
  }

  /* ---------------- selection mode + zoom ---------------- */
  function setSelectionMode(on) {
    selectionMode = !!on;
    document.body.classList.toggle('select-mode', selectionMode);
    if (selectModeBtn) {
      selectModeBtn.classList.toggle('active', selectionMode);
      selectModeBtn.setAttribute('aria-pressed', selectionMode ? 'true' : 'false');
    }
    if (selectModeLabel) selectModeLabel.textContent = t(selectionMode ? 'doneSelecting' : 'selectCards');
  }

  function openLightbox(key) {
    var idx = -1;
    for (var i = 0; i < catalogList.length; i++) {
      if (catalogList[i].key === key) { idx = i; break; }
    }
    if (idx < 0) return;
    lbIndex = idx;
    showLightboxCard(catalogList[idx]);
    lightbox.hidden = false;
    document.body.classList.add('lb-open');
    lbClose.focus();
  }
  function showLightboxCard(c) {
    lbCard.classList.remove('is-landscape');
    lbImg.hidden = false;
    lbPlaceholder.hidden = true;
    lbImg.onload = function () {
      lbImg.hidden = false;
      lbPlaceholder.hidden = true;
      lbCard.classList.toggle('is-landscape', lbImg.naturalWidth > lbImg.naturalHeight);
    };
    lbImg.onerror = function () {
      lbImg.hidden = true;
      lbPlaceholder.hidden = false;
      lbCard.classList.remove('is-landscape');
    };
    lbImg.src = IMG_DIR + (c.file || '');
    lbImg.alt = c.name || '';
    lbSerie.textContent = serieLabel(c.serie);
    lbNumber.textContent = displayNumber(c);
    lbName.textContent = c.name || '';
    lbRarity.textContent = c.rarity || '';
    lbNoImage.textContent = t('noImage');
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('lb-open');
    lbIndex = -1;
  }
  function lbStep(delta) {
    if (!catalogList.length || lbIndex < 0) return;
    lbIndex = (lbIndex + delta + catalogList.length) % catalogList.length;
    showLightboxCard(catalogList[lbIndex]);
  }

  function pageNumbers(cur, total) {
    var out = [];
    var add = function (n) { if (out.indexOf(n) === -1) out.push(n); };
    add(1);
    if (cur > 3) out.push('...');
    for (var i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) add(i);
    if (cur < total - 2) out.push('...');
    if (total > 1) add(total);
    return out;
  }

  function renderPagination(pages) {
    if (pages <= 1) {
      pagination.hidden = true;
      pagination.innerHTML = '';
      paginationTop.hidden = true;
      paginationTop.innerHTML = '';
      return;
    }
    pagination.hidden = false;
    paginationTop.hidden = false;
    var parts = [];
    parts.push('<button type="button" class="page-btn" data-page="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + ' aria-label="' + esc(t('previous')) + '">‹</button>');
    pageNumbers(page, pages).forEach(function (n) {
      if (n === '...') parts.push('<span class="page-ellipsis">…</span>');
      else parts.push('<button type="button" class="page-btn' + (n === page ? ' active' : '') + '" data-page="' + n + '"' + (n === page ? ' aria-current="page"' : '') + '>' + n + '</button>');
    });
    parts.push('<button type="button" class="page-btn" data-page="' + (page + 1) + '"' + (page === pages ? ' disabled' : '') + ' aria-label="' + esc(t('next')) + '">›</button>');
    var html = parts.join('');
    pagination.innerHTML = html;
    paginationTop.innerHTML = html;
  }

  function renderSeriesTabs() {
    var items = [
      ['all', t('seriesAll'), seriesCounts.all],
      ['1', serieLabel('1'), seriesCounts['1']],
      ['2', serieLabel('2'), seriesCounts['2']],
      ['3', serieLabel('3'), seriesCounts['3']],
      ['Dreamcast', t('seriesDreamcast'), seriesCounts.Dreamcast]
    ];
    seriesTabs.innerHTML = items.map(function (it) {
      var active = activeSerie === it[0] ? ' active' : '';
      return '<button type="button" class="tab' + active + '" data-serie="' + it[0] + '" role="tab" aria-selected="' + (active ? 'true' : 'false') + '">' +
        esc(it[1]) + '<span class="tab-count">' + fmtNum(it[2]) + '</span></button>';
    }).join('');
  }

  function finishCountsFor(serie) {
    var counts = { all: 0, gold: 0, silver: 0 };
    cards.forEach(function (c) {
      if (serie !== 'all' && c.serie !== serie) return;
      counts.all++;
      if (c.finish === 'gold') counts.gold++;
      else if (c.finish === 'silver') counts.silver++;
    });
    return counts;
  }

  function renderFinishChips() {
    var isDreamcast = activeSerie === 'Dreamcast';
    finishFilter.hidden = isDreamcast;
    if (isDreamcast) { finishFilter.innerHTML = ''; return; }
    var counts = finishCountsFor(activeSerie);
    var items = [
      ['all', t('finishAll'), counts.all, ''],
      ['gold', t('finishGold'), counts.gold, 'gold'],
      ['silver', t('finishSilver'), counts.silver, 'silver']
    ];
    finishFilter.innerHTML = items.map(function (it) {
      var active = activeFinish === it[0] ? ' active' : '';
      var dot = it[3] ? '<span class="fc-dot ' + it[3] + '"></span>' : '';
      return '<button type="button" class="finish-chip' + active + '" data-finish="' + it[0] + '">' +
        dot + esc(it[1]) + ' <span class="fc-count">' + fmtNum(it[2]) + '</span></button>';
    }).join('');
  }

  /* ---------------- selected view ---------------- */
  function renderSelected() {
    cartList = getCartInOrder();
    var n = cartList.length;
    selectedTotal.textContent = fmtNum(n);
    selectedGrid.innerHTML = cartList.map(cardHTML).join('');
    attachImageLoaders(selectedGrid);
    selectedEmpty.hidden = n > 0;
    selectedGrid.hidden = n === 0;
    navSelectedCount.textContent = fmtNum(n);
    selectBarCount.textContent = t('nSelected', { n: fmtNum(n) });
  }

  /* ---------------- navigation ---------------- */
  function goToView(v, updateHash) {
    if (v !== 'catalog') {
      setSelectionMode(false);
      if (!lightbox.hidden) closeLightbox();
    }
    view = v;
    document.body.classList.toggle('selected-mode', v === 'selected');
    catalogView.hidden = v !== 'catalog';
    selectedView.hidden = v !== 'selected';
    navCatalog.classList.toggle('active', v === 'catalog');
    navSelected.classList.toggle('active', v === 'selected');
    if (v === 'selected') renderSelected();
    if (updateHash) {
      try { history.replaceState(null, '', v === 'selected' ? '#selected' : '#catalog'); } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    syncSticky();
  }

  /* ---------------- columns ---------------- */
  function applyCols() {
    [cardGrid, selectedGrid].forEach(function (g) {
      if (!g) return;
      g.classList.remove('cols-3', 'cols-4', 'cols-5', 'cols-6');
      g.classList.add('cols-' + cols);
    });
    colsToggle.querySelectorAll('.col-btn').forEach(function (b) {
      b.classList.toggle('active', Number(b.getAttribute('data-cols')) === cols);
    });
  }

  /* ---------------- sticky offsets ---------------- */
  function syncSticky() {
    var header = document.querySelector('.site-header');
    var toolbar = document.querySelector('.toolbar');
    if (!header) return;
    var h = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-h', h + 'px');
    if (toolbar) toolbar.style.top = h + 'px';
  }
  window.__syncSticky = syncSticky;

  /* ---------------- export ---------------- */
  function csvCell(v) {
    v = String(v == null ? '' : v);
    if (/[",\r\n]/.test(v)) return '"' + v.replace(/"/g, '""') + '"';
    return v;
  }
  function buildCSV(list) {
    var rows = [['Series', 'Number', 'Finish', 'Rarity', 'Name', 'Image']];
    list.forEach(function (c) {
      rows.push([serieLabel(c.serie), c.number, finishLabel(c.finish), c.rarity || '', c.name, c.file || '']);
    });
    return rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
  }
  function dateStamp() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 15000);
  }

  var CRC_TABLE = (function () {
    var table = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  })();
  function crc32(u8) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function makeZip(files) {
    var enc = new TextEncoder();
    var d = new Date();
    var dosTime = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xFFFF;
    var dosDate = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;
    var localParts = [];
    var centralParts = [];
    var offset = 0;
    files.forEach(function (f) {
      var nameBytes = enc.encode(f.name);
      var data = f.data;
      var crc = crc32(data);
      var size = data.length;

      var lh = new Uint8Array(30 + nameBytes.length);
      var dv = new DataView(lh.buffer);
      dv.setUint32(0, 0x04034b50, true);
      dv.setUint16(4, 20, true);
      dv.setUint16(6, 0x0800, true);
      dv.setUint16(8, 0, true);
      dv.setUint16(10, dosTime, true);
      dv.setUint16(12, dosDate, true);
      dv.setUint32(14, crc, true);
      dv.setUint32(18, size, true);
      dv.setUint32(22, size, true);
      dv.setUint16(26, nameBytes.length, true);
      dv.setUint16(28, 0, true);
      lh.set(nameBytes, 30);
      localParts.push(lh, data);

      var cd = new Uint8Array(46 + nameBytes.length);
      var cv = new DataView(cd.buffer);
      cv.setUint32(0, 0x02014b50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, dosTime, true);
      cv.setUint16(14, dosDate, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, size, true);
      cv.setUint32(24, size, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      cd.set(nameBytes, 46);
      centralParts.push(cd);

      offset += lh.length + data.length;
    });
    var centralSize = centralParts.reduce(function (a, b) { return a + b.length; }, 0);
    var eocd = new Uint8Array(22);
    var ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);
    return new Blob(localParts.concat(centralParts, [eocd]), { type: 'application/zip' });
  }
  function pool(items, limit, fn) {
    var idx = 0;
    function next() {
      if (idx >= items.length) return Promise.resolve();
      var item = items[idx++];
      return Promise.resolve(fn(item)).then(next);
    }
    var workers = [];
    for (var i = 0; i < Math.min(limit, items.length); i++) workers.push(next());
    return Promise.all(workers);
  }
  function fetchCardImage(card) {
    if (!card.file) return Promise.resolve(null);
    return fetch(IMG_DIR + card.file)
      .then(function (res) { return res.ok ? res.blob().then(function (b) { return { blob: b, filename: card.file }; }) : null; })
      .catch(function () { return null; });
  }
  function exportReadme(list) {
    return [
      'LRG Duplicates — selected cards',
      'Exported: ' + new Date().toISOString(),
      'Cards: ' + list.length,
      '',
      'This ZIP contains:',
      '  cards.csv  — the list of selected cards',
      '  images/    — one image per selected card',
      '',
      'Generated by the LRG Duplicates website.'
    ].join('\r\n');
  }
  async function exportZip() {
    var list = getCartInOrder();
    if (!list.length) { showToast(t('noSelection')); return; }
    if (location.protocol === 'file:') { showToast(t('exportError')); return; }
    showToast(t('preparing'), true);
    var enc = new TextEncoder();
    var files = [];
    files.push({ name: 'cards.csv', data: enc.encode('\ufeff' + buildCSV(list)) });
    files.push({ name: 'README.txt', data: enc.encode(exportReadme(list)) });
    var done = 0;
    var failed = 0;
    await pool(list, 6, async function (card) {
      var got = await fetchCardImage(card);
      if (got) {
        files.push({ name: 'images/' + got.filename, data: new Uint8Array(await got.blob.arrayBuffer()) });
      } else {
        failed++;
      }
      done++;
      showToast(t('progress', { n: done, total: list.length }), true);
    });
    try {
      var zip = makeZip(files);
      downloadBlob(zip, 'lrg-duplicates-' + dateStamp() + '.zip');
      showToast(t('exportDone', { n: fmtNum(list.length - failed) }));
    } catch (e) {
      showToast(t('exportError'));
    }
  }
  function exportCsv() {
    var list = getCartInOrder();
    if (!list.length) { showToast(t('noSelection')); return; }
    var blob = new Blob(['\ufeff' + buildCSV(list)], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, 'lrg-duplicates-' + dateStamp() + '.csv');
    showToast(t('csvDone'));
  }

  /* ---------------- confirm ---------------- */
  function askConfirm(title, body, okLabel, onOk) {
    confirmTitle.textContent = title;
    confirmBody.textContent = body;
    confirmOk.textContent = okLabel;
    confirmCancel.textContent = t('cancel');
    confirmAction = onOk;
    confirmModal.hidden = false;
  }
  function closeConfirm() {
    confirmModal.hidden = true;
    confirmAction = null;
  }

  /* ---------------- price request ---------------- */
  function openEmailModal() {
    var list = getCartInOrder();
    if (!list.length) { showToast(t('noSelection')); return; }
    emailPuzzle = { a: 1 + Math.floor(Math.random() * 9), b: 1 + Math.floor(Math.random() * 9) };
    emailForm.reset();
    reqCompany.value = '';
    errEmail.textContent = '';
    errPuzzle.textContent = '';
    errForm.textContent = '';
    profileHint.textContent = t('profileHint');
    profileHint.classList.remove('is-error');
    labelReqPuzzle.textContent = t('puzzleLabel', { a: emailPuzzle.a, b: emailPuzzle.b });
    emailSend.disabled = false;
    emailSend.textContent = t('sendRequest');
    emailBusy = false;
    emailModal.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { reqEmail.focus(); }, 60);
  }
  function closeEmailModal() {
    emailModal.hidden = true;
    document.body.style.overflow = '';
    emailBusy = false;
  }
  function onEmailSubmit(e) {
    e.preventDefault();
    if (emailBusy) return;
    var email = reqEmail.value.trim();
    var ig = reqInstagram.value.trim();
    var rd = reqReddit.value.trim();
    var answer = parseInt(reqPuzzle.value, 10);
    var hp = reqCompany.value;
    var ok = true;

    errEmail.textContent = '';
    errPuzzle.textContent = '';
    errForm.textContent = '';
    profileHint.textContent = t('profileHint');
    profileHint.classList.remove('is-error');

    if (!EMAIL_RE.test(email)) { errEmail.textContent = t('errEmail'); ok = false; }
    if (!ig && !rd) { profileHint.textContent = t('errProfile'); profileHint.classList.add('is-error'); ok = false; }
    if (answer !== emailPuzzle.a + emailPuzzle.b) { errPuzzle.textContent = t('errPuzzle'); ok = false; }
    if (hp) return; /* honeypot */
    if (!ok) return;

    var list = getCartInOrder();
    if (!list.length) { errForm.textContent = t('emailNoSelection'); return; }
    var formsubmitEmail = String(CONFIG.formsubmitEmail || '').trim();
    var endpoint = String(CONFIG.formspreeEndpoint || '').trim();
    var provider = formsubmitEmail ? 'formsubmit' : (endpoint.indexOf('http') === 0 ? 'formspree' : '');
    if (!provider) { errForm.textContent = t('emailNotConfigured'); return; }

    if (provider === 'formsubmit') {
      var form = document.getElementById('fsForm');
      form.action = 'https://formsubmit.co/' + formsubmitEmail;
      form.email.value = email;
      form.instagram.value = ig;
      form.reddit.value = rd;
      form.cards.value = buildCSV(list);
      form.count.value = String(list.length);
      form._subject.value = 'LRG price request — ' + list.length + ' cards';
      form._captcha.value = 'false';
      form._template.value = 'table';

      emailBusy = true;
      emailSend.disabled = true;
      emailSend.textContent = t('emailSending');

      var iframe = document.getElementById('fsTarget');
      var finished = false;
      var finish = function () {
        if (finished) return;
        finished = true;
        iframe.removeEventListener('load', finish);
        emailBusy = false;
        emailSend.disabled = false;
        emailSend.textContent = t('sendRequest');
        closeEmailModal();
        showToast(t('emailSent'));
      };
      iframe.addEventListener('load', finish);
      form.submit();
      setTimeout(finish, 9000);
      return;
    }

    var url = endpoint;
    var body = JSON.stringify({
      email: email,
      instagram: ig,
      reddit: rd,
      cards: buildCSV(list),
      count: list.length,
      _subject: 'LRG price request — ' + list.length + ' cards',
      _replyto: email,
      _gotcha: ''
    });
    var headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

    emailBusy = true;
    emailSend.disabled = true;
    emailSend.textContent = t('emailSending');
    fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json().catch(function () { return {}; });
      })
      .then(function (data) {
        if (data && data.success === false) throw new Error(data.message || 'send failed');
        emailBusy = false;
        emailSend.disabled = false;
        emailSend.textContent = t('sendRequest');
        closeEmailModal();
        showToast(t('emailSent'));
      })
      .catch(function () {
        emailBusy = false;
        emailSend.disabled = false;
        emailSend.textContent = t('sendRequest');
        errForm.textContent = t('emailFailed');
      });
  }

  /* ---------------- language ---------------- */
  function applyStaticLabels() {
    document.documentElement.lang = lang;
    brandTitle.textContent = t('brandTitle');
    $('navCatalogLabel').textContent = t('navCatalog');
    $('navSelectedLabel').textContent = t('navSelected');
    $('perRowLabel').textContent = t('perRow');
    searchInput.placeholder = t('searchPlaceholder');
    searchClear.setAttribute('aria-label', t('clearSearch'));
    selectPageBtn.textContent = t('selectPage');
    if (selectModeLabel) selectModeLabel.textContent = t(selectionMode ? 'doneSelecting' : 'selectCards');
    if (lbNoImage) lbNoImage.textContent = t('noImage');
    clearSelBtn.textContent = t('clear');
    viewSelectedBtn.textContent = t('viewSelected');
    selectedTitle.textContent = t('selectedTitle');
    selectedSub.textContent = t('selectedSub');
    requestPricesBtn.textContent = t('requestPrices');
    exportZipBtn.textContent = t('exportZip');
    exportCsvBtn.textContent = t('exportCsv');
    clearSelectedBtn.textContent = t('clearAll');
    backToCatalog.textContent = t('backToCatalog');
    emptySelTitle.textContent = t('emptySelTitle');
    emptySelText.textContent = t('emptySelText');
    emptyBrowseBtn.textContent = t('browseCatalog');
    footerText.textContent = t('footer');
    mobilePreviewLink.textContent = t('mobilePreview');
    langLabel.textContent = lang === 'es' ? 'ES' : 'EN';
    langMenu.querySelectorAll('.lang-option').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    emailTitle.textContent = t('emailTitle');
    emailIntro.textContent = t('emailIntro');
    labelReqEmail.textContent = t('labelReqEmail');
    labelReqInstagram.textContent = t('labelReqInstagram');
    labelReqReddit.textContent = t('labelReqReddit');
    reqInstagram.placeholder = t('instagramPlaceholder');
    reqReddit.placeholder = t('redditPlaceholder');
    profileHint.textContent = t('profileHint');
    profileHint.classList.remove('is-error');
    emailCancel.textContent = t('cancel');
    if (!emailModal.hidden) {
      labelReqPuzzle.textContent = t('puzzleLabel', { a: emailPuzzle.a, b: emailPuzzle.b });
      emailSend.textContent = t('sendRequest');
    }

    updateSummary();
    renderSeriesTabs();
    renderFinishChips();
    if (view === 'catalog') renderCatalog();
    else renderSelected();
    if (!confirmModal.hidden) {
      confirmTitle.textContent = t('confirmClearTitle');
      confirmBody.textContent = t('confirmClearBody');
      confirmOk.textContent = t('clearAll');
      confirmCancel.textContent = t('cancel');
    }
    syncSticky();
  }

  function setLang(l) {
    if (!I18N[l]) l = 'en';
    lang = l;
    try { localStorage.setItem(LS_LANG, l); } catch (e) {}
    langMenu.hidden = true;
    langBtn.setAttribute('aria-expanded', 'false');
    applyStaticLabels();
  }
  function loadLang() {
    var saved = null;
    try { saved = localStorage.getItem(LS_LANG); } catch (e) {}
    lang = saved && I18N[saved] ? saved : 'en';
  }

  /* ---------------- events ---------------- */
  function wireEvents() {
    seriesTabs.addEventListener('click', function (e) {
      var b = e.target.closest('.tab');
      if (!b) return;
      activeSerie = b.getAttribute('data-serie');
      if (activeSerie === 'Dreamcast') activeFinish = 'all';
      page = 1;
      renderSeriesTabs();
      renderFinishChips();
      renderCatalog();
    });

    finishFilter.addEventListener('click', function (e) {
      var b = e.target.closest('.finish-chip');
      if (!b) return;
      activeFinish = b.getAttribute('data-finish');
      page = 1;
      renderFinishChips();
      renderCatalog();
    });

    var searchTimer = null;
    searchInput.addEventListener('input', function () {
      searchClear.hidden = !searchInput.value;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () { page = 1; renderCatalog(); }, 120);
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { searchInput.value = ''; searchClear.hidden = true; page = 1; renderCatalog(); }
    });
    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchClear.hidden = true;
      page = 1;
      renderCatalog();
      searchInput.focus();
    });

    colsToggle.addEventListener('click', function (e) {
      var b = e.target.closest('.col-btn');
      if (!b) return;
      cols = Number(b.getAttribute('data-cols'));
      try { localStorage.setItem(LS_COLS, String(cols)); } catch (e) {}
      applyCols();
    });

    function onPageClick(e) {
      var b = e.target.closest('.page-btn');
      if (!b || b.disabled) return;
      var p = Number(b.getAttribute('data-page'));
      if (!p || p === page) return;
      page = p;
      renderCatalog();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    pagination.addEventListener('click', onPageClick);
    paginationTop.addEventListener('click', onPageClick);

    selectModeBtn.addEventListener('click', function () {
      setSelectionMode(!selectionMode);
    });

    cardGrid.addEventListener('click', function (e) {
      var cardEl = e.target.closest('.card');
      if (!cardEl) return;
      e.preventDefault();
      if (selectionMode) {
        toggleSelected(cardEl.getAttribute('data-key'));
        refreshCatalogSelectionDOM();
      } else {
        openLightbox(cardEl.getAttribute('data-key'));
      }
    });
    cardGrid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var cardEl = e.target.closest('.card');
      if (!cardEl) return;
      e.preventDefault();
      if (selectionMode) {
        toggleSelected(cardEl.getAttribute('data-key'));
        refreshCatalogSelectionDOM();
      } else {
        openLightbox(cardEl.getAttribute('data-key'));
      }
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function (e) { e.stopPropagation(); lbStep(-1); });
    lbNext.addEventListener('click', function (e) { e.stopPropagation(); lbStep(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); lbStep(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); lbStep(1); }
    });

    selectedGrid.addEventListener('click', function (e) {
      var cardEl = e.target.closest('.card');
      if (!cardEl) return;
      e.preventDefault();
      toggleSelected(cardEl.getAttribute('data-key'));
      renderSelected();
    });
    selectedGrid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var cardEl = e.target.closest('.card');
      if (!cardEl) return;
      e.preventDefault();
      toggleSelected(cardEl.getAttribute('data-key'));
      renderSelected();
    });

    selectPageBtn.addEventListener('click', function () {
      var start = (page - 1) * PAGE_SIZE;
      var slice = catalogList.slice(start, start + PAGE_SIZE);
      slice.slice().reverse().forEach(function (c) { addSelected(c.key); });
      saveCart();
      updateSummary();
      refreshCatalogSelectionDOM();
    });

    clearSelBtn.addEventListener('click', function () {
      askConfirm(t('confirmClearTitle'), t('confirmClearBody'), t('clearAll'), function () {
        clearAllCart();
        showToast(t('cleared'));
      });
    });

    viewSelectedBtn.addEventListener('click', function () { goToView('selected', true); });
    navCatalog.addEventListener('click', function () { goToView('catalog', true); });
    navSelected.addEventListener('click', function () { goToView('selected', true); });
    backToCatalog.addEventListener('click', function () { goToView('catalog', true); });
    emptyBrowseBtn.addEventListener('click', function () { goToView('catalog', true); });

    requestPricesBtn.addEventListener('click', openEmailModal);
    exportZipBtn.addEventListener('click', exportZip);
    exportCsvBtn.addEventListener('click', exportCsv);
    clearSelectedBtn.addEventListener('click', function () {
      askConfirm(t('confirmClearTitle'), t('confirmClearBody'), t('clearAll'), function () {
        clearAllCart();
        showToast(t('cleared'));
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (!emailModal.hidden) { closeEmailModal(); return; }
        if (!confirmModal.hidden) { closeConfirm(); return; }
      }
    });
    window.addEventListener('resize', syncSticky);

    confirmCancel.addEventListener('click', closeConfirm);
    confirmModal.addEventListener('click', function (e) {
      if (e.target === confirmModal) closeConfirm();
    });
    confirmOk.addEventListener('click', function () {
      var fn = confirmAction;
      closeConfirm();
      if (fn) fn();
    });

    emailClose.addEventListener('click', closeEmailModal);
    emailCancel.addEventListener('click', closeEmailModal);
    emailModal.addEventListener('click', function (e) {
      if (e.target === emailModal) closeEmailModal();
    });
    emailForm.addEventListener('submit', onEmailSubmit);

    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = langMenu.hidden;
      langMenu.hidden = !open;
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    langMenu.addEventListener('click', function (e) {
      var b = e.target.closest('.lang-option');
      if (!b) return;
      setLang(b.getAttribute('data-lang'));
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.header-tools')) {
        langMenu.hidden = true;
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('hashchange', function () {
      goToView(location.hash === '#selected' ? 'selected' : 'catalog', false);
    });
  }

  /* ---------------- init ---------------- */
  function init() {
    loadLang();
    loadCart();
    buildCards();
    if (location.search.indexOf('preview=iphone') !== -1) {
      document.body.classList.add('iphone-preview');
    }

    try {
      var savedCols = Number(localStorage.getItem(LS_COLS));
      if ([3, 4, 5, 6].indexOf(savedCols) !== -1) cols = savedCols;
    } catch (e) {}

    wireEvents();
    applyCols();
    applyStaticLabels();
    goToView(location.hash === '#selected' ? 'selected' : 'catalog', false);
    syncSticky();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
