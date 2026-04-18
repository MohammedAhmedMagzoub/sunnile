/* SunNile — Bilingual Arabic / English support
 * Arabic is the default (stays in HTML). English is applied via JS.
 * Preference saved to localStorage key 'sunnile_lang'.
 */
(function () {
  'use strict';

  var LANG_KEY = 'sunnile_lang';
  var lang = localStorage.getItem(LANG_KEY) || 'ar';

  /* ── helpers ── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function save(el, html) {
    if (!el.hasAttribute('data-ar')) el.setAttribute('data-ar', el.innerHTML);
    el.innerHTML = html;
  }
  function restore(el) {
    if (el.hasAttribute('data-ar')) el.innerHTML = el.getAttribute('data-ar');
  }

  function getPage() {
    var p = location.pathname;
    if (p === '/' || /index\.html$/.test(p)) return 'index';
    var m = p.match(/([^/]+)\.html$/);
    return m ? m[1] : null;
  }

  /* ── CSS injection ── */
  function injectStyles() {
    var s = document.createElement('style');
    s.textContent =
      '.lang-toggle-btn{background:transparent;border:1px solid var(--amber);color:var(--amber);' +
      'padding:5px 13px;border-radius:6px;font-family:\'Cairo\',sans-serif;font-size:12px;' +
      'font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap;line-height:1;}' +
      '.lang-toggle-btn:hover{background:var(--amber);color:#1C1A14;}' +
      'html.lang-en body{direction:ltr;}' +
      'html.lang-en .nav-links{direction:ltr;}' +
      'html.lang-en .hero-quote{border-right:none;border-left:3px solid var(--blue);' +
      'border-radius:8px 0 0 8px;text-align:left;}' +
      'html.lang-en .result-note{border-right:none;border-left:3px solid var(--blue);' +
      'border-radius:6px 0 0 6px;}' +
      'html.lang-en .tl-dot::after{left:auto;right:4px;}' +
      '@media(max-width:768px){' +
      'html.lang-en .nav-links li a:hover,html.lang-en .nav-links li a.active{' +
      'border-right-color:transparent;border-left:3px solid var(--amber);}}';
    document.head.appendChild(s);
  }

  /* ── nav ── */
  var NAV_AR = ['الرئيسية','الحاسبة','الإنفرترات','المعايير','مستقبل الطاقة','السياسات','المعهد','عن المبادرة'];
  var NAV_EN = ['Home','Calculator','Inverters','Standards','Solar Future','Policy Hub','Institute','About'];

  function applyNavEN() {
    $$('.nav-links li a').forEach(function (a, i) {
      if (!a.hasAttribute('data-ar')) a.setAttribute('data-ar', a.textContent.trim());
      if (NAV_EN[i]) a.textContent = NAV_EN[i];
    });
  }
  function restoreNavAR() {
    $$('.nav-links li a').forEach(function (a) {
      if (a.hasAttribute('data-ar')) a.textContent = a.getAttribute('data-ar');
    });
  }

  /* ── footer ── */
  function applyFooterEN() {
    var logo = $('.footer-logo'), text = $('.footer-text');
    if (logo) save(logo, 'SunNile ☀');
    if (text) save(text, 'Free non-profit initiative for rooftop solar in Sudan<br>Sudan\'s Rooftop Solar Initiative | sunnile.org');
  }
  function restoreFooterAR() {
    var logo = $('.footer-logo'), text = $('.footer-text');
    if (logo) restore(logo);
    if (text) restore(text);
  }

  /* ── per-page translations ── */
  var PAGES = {

    index: function () {
      var el;
      if ((el = $('.hero-badge'))) save(el, 'Free Non-Profit Initiative');
      if ((el = $('.hero-sub')))  save(el, 'Sudan\'s Rooftop Solar Initiative');
      if ((el = $('.hero-tagline'))) save(el,
        'Sudan has one of the highest solar irradiance rates in the world — over 300 sunny days per year. ' +
        'SunNile helps you turn this treasure into clean, free electricity for your home and business.');
      if ((el = $('.hero-quote p'))) save(el,
        '«SunNile was born from longing… <strong>God gave us everything.</strong><br>' +
        'We just need to give ourselves a chance.»');
      if ((el = $('.hero-quote cite'))) save(el,
        '— Mohammed Ahmed Magzoub, Founder of SunNile');
      var ctas = $$('.hero-ctas a');
      if (ctas[0]) save(ctas[0], 'Calculate Your System');
      if (ctas[1]) save(ctas[1], 'Start Learning Free');
      // stats
      var statLabels = $$('.stat-label');
      var statEN = [
        'sun hours per day in northern regions',
        'of Sudan\'s land area is suitable for solar generation',
        'sunny days per year across most of Sudan',
        'years payback period with a feed-in tariff'
      ];
      statLabels.forEach(function (s, i) { if (statEN[i]) save(s, statEN[i]); });
      // section
      if ((el = $('.section-title'))) save(el, 'What is SunNile?');
      if ((el = $('.section-sub')))  save(el, 'Everything you need to install your solar system — free');
      // cards
      var cards = $$('.cards-grid .card');
      var cardData = [
        ['Solar System Calculator',
         'Calculate your ideal system size based on your region, daily consumption, and outage hours.',
         'Use the Calculator →'],
        ['Certified Inverter Registry',
         'Over 65 models from 15 brands, all tested and meeting SunNile standards.',
         'Browse Registry →'],
        ['Technical Standards',
         'SunNile\'s comprehensive installation and safety standards — the foundation for quality in every system.',
         'View Standards →'],
        ['Solar Technician Institute',
         '24 training units across 3 levels — from electrical safety to advanced system design.',
         'Start Learning →'],
        ['Policy Centre',
         'Lessons from Australia, Germany, Morocco, Bangladesh, Jordan and the UAE — what works and what doesn\'t.',
         'Explore Experiences →'],
        ['Sudan\'s Solar Future',
         'Virtual Power Plants (VPP) and renewable energy integration — Sudan\'s solar vision for 2030.',
         'Explore the Future →']
      ];
      cards.forEach(function (card, i) {
        var d = cardData[i];
        if (!d) return;
        var h3 = $('h3', card), p = $('p', card), lnk = $('.card-link', card);
        if (h3) save(h3, d[0]);
        if (p)  save(p,  d[1]);
        if (lnk) save(lnk, d[2]);
      });
      document.title = 'SunNile — Sudan\'s Rooftop Solar Initiative';
    },

    calculator: function () {
      var el;
      if ((el = $('.page-header h1'))) save(el, '🧮 Solar System Calculator');
      if ((el = $('.page-header p')))  save(el, 'Calculate the ideal system size for your home or business in Sudan');
      // form labels
      var labels = $$('.form-label');
      var labelEN = [
        'Geographic Region <span>(PSH = Peak Sun Hours)</span>',
        'Daily Consumption <span>(kWh/day)</span>',
        'Panel Power <span>(Watts)</span>',
        'Daily Power Outage Hours <span>(for battery sizing)</span>'
      ];
      labels.forEach(function (lbl, i) { if (labelEN[i]) save(lbl, labelEN[i]); });
      // region options
      var region = document.getElementById('region');
      if (region) {
        var opts = region.querySelectorAll('option');
        var optEN = [
          'North — 6.8 hr/day (Nile, Northern)',
          'Centre — 6.2 hr/day (Khartoum, Gezira)',
          'East — 5.8 hr/day (Kassala, Red Sea)',
          'West — 6.0 hr/day (Kordofan, Darfur)',
          'South — 5.2 hr/day (Blue Nile)'
        ];
        opts.forEach(function (o, i) {
          if (!o.hasAttribute('data-ar')) o.setAttribute('data-ar', o.textContent);
          if (optEN[i]) o.textContent = optEN[i];
        });
      }
      // calc button
      if ((el = $('.calc-btn'))) save(el, 'Calculate Optimal System →');
      // results
      if ((el = $('h3', document.getElementById('calc-results')))) save(el, 'Design Results');
      var resultLabels = $$('.result-label');
      var resultEN = ['System Size (kWp)', 'Solar Panels', 'Battery Capacity (kWh)'];
      resultLabels.forEach(function (r, i) { if (resultEN[i]) save(r, resultEN[i]); });
      var resultUnits = $$('.result-unit');
      var unitEN = ['kWp peak', 'panels', 'kWh'];
      resultUnits.forEach(function (r, i) { if (unitEN[i]) save(r, unitEN[i]); });
      // notes
      var notesH3 = $('h3', document.querySelector('.calc-wrap > div:last-of-type'));
      if (notesH3) save(notesH3, 'Important Notes');
      document.title = 'Solar System Calculator — SunNile';
    },

    inverters: function () {
      var el;
      if ((el = $('.page-header h1'))) save(el, '⚡ Certified Inverter Registry');
      if ((el = $('.page-header p')))  save(el, '65+ models from 15 brands — all meeting SunNile standards');
      // best-picks badges
      var picks = $$('.inv-wrap > div:first-of-type > div');
      if (picks[0]) save(picks[0], '🏆 Best Quality: <strong>Fronius</strong>');
      if (picks[1]) save(picks[1], '💰 Best Value: <strong>Sungrow</strong>');
      if (picks[2]) save(picks[2], '🔬 New Generation: <strong>SiGEnergy</strong>');
      // filter label
      var filterLabel = $('.filter-bar span');
      if (filterLabel) save(filterLabel, 'Filter:');
      // "All" filter button
      var allBtn = $('.filter-btn.active, .filter-btn:first-of-type');
      if (allBtn && allBtn.textContent.indexOf('الكل') !== -1) save(allBtn, 'All (65+)');
      // table headers
      var ths = $$('.inv-table th');
      var thEN = ['Brand','Model','Type','Power','IEC / AS4777','DRED','SunSpec','Rating'];
      ths.forEach(function (th, i) { if (thEN[i]) save(th, thEN[i]); });
      // re-render table with English data
      /* inverter t field: أحادي→Single-phase, ثلاثي→Three-phase */
      var tbody = document.getElementById('inv-tbody');
      if (tbody) {
        var rows = tbody.querySelectorAll('tr');
        rows.forEach(function (row) {
          var cells = row.querySelectorAll('td');
          if (cells[2]) {
            var t = cells[2];
            if (!t.hasAttribute('data-ar')) t.setAttribute('data-ar', t.textContent);
            t.textContent = t.getAttribute('data-ar') === 'أحادي' ? 'Single-phase' : 'Three-phase';
          }
          // rating badge (last cell)
          var badge = row.querySelector('.badge');
          if (badge) {
            var ratingMap = {
              'الأفضل جودةً':'Best Quality',
              'الأفضل قيمةً':'Best Value',
              'الجيل الجديد':'New Generation',
              'موصى به':'Recommended',
              'قيمة جيدة':'Good Value',
              'متميز':'Premium'
            };
            if (!badge.hasAttribute('data-ar')) badge.setAttribute('data-ar', badge.textContent.trim());
            badge.textContent = ratingMap[badge.getAttribute('data-ar')] || badge.getAttribute('data-ar');
          }
        });
      }
      document.title = 'Certified Inverter Registry — SunNile';
    },

    standards: function () {
      var el;
      if ((el = $('.page-header h1'))) save(el, '📋 SunNile Technical Standards');
      if ((el = $('.page-header p')))  save(el, 'Comprehensive installation and safety standards for rooftop solar in Sudan');
      document.title = 'Technical Standards — SunNile';
    },

    future: function () {
      var el;
      if ((el = $('.page-header h1'))) save(el, '🔮 Sudan\'s Solar Future');
      if ((el = $('.page-header p')))  save(el, 'Virtual Power Plants, smart grids, and the roadmap to Sudan\'s solar-powered future');
      document.title = 'Sudan\'s Solar Future — SunNile';
    },

    policy: function () {
      var el;
      if ((el = $('.page-header h1'))) save(el, '🌍 Policy Centre');
      if ((el = $('.page-header p')))  save(el, 'International lessons and policy frameworks for rooftop solar — what works and what doesn\'t');
      document.title = 'Policy Centre — SunNile';
    },

    institute: function () {
      var el;
      if ((el = $('.page-header h1'))) save(el, '🎓 Solar Technician Institute');
      if ((el = $('.page-header p')))  save(el, 'Free training for solar technicians across 24 units and 3 levels');
      // stats
      var statNums = $$('.inst-stats .stat-item, .stats-block .stat-item');
      // level tabs
      var tabs = $$('.level-tab, .tab-btn');
      var tabEN = ['Beginner','Intermediate','Advanced'];
      tabs.forEach(function (t, i) {
        if (!t.hasAttribute('data-ar')) t.setAttribute('data-ar', t.textContent.trim());
        if (tabEN[i]) t.textContent = tabEN[i];
      });
      // note for English users about Arabic content
      var progressWrap = document.getElementById('progressWrap');
      if (progressWrap && !document.getElementById('en-academy-note')) {
        var note = document.createElement('p');
        note.id = 'en-academy-note';
        note.style.cssText = 'font-size:12px;color:var(--amber);text-align:center;padding:8px 0;';
        note.textContent = 'Note: Academy lesson content is in Arabic only.';
        progressWrap.parentNode.insertBefore(note, progressWrap.nextSibling);
      }
      document.title = 'Solar Technician Institute — SunNile';
    },

    about: function () {
      var el;
      if ((el = $('.hero-eyebrow')))   save(el, 'Who We Are');
      if ((el = $('.page-hero h1')))   save(el, 'SunNile<br>A Personal National Initiative');
      if ((el = $('.page-hero p')))    save(el,
        'A free non-profit initiative born from longing for a better homeland — Sudan has the sun, ' +
        'and we have the knowledge. We just need to give ourselves a chance.');
      // founder
      if ((el = $('.founder-name')))   save(el, 'Mohammed Ahmed Magzoub Albashier');
      if ((el = $('.founder-title')))  save(el, 'Founder of SunNile');
      if ((el = $('.founder-org')))    save(el, 'Customer Success Team Lead — SwitchDin | Newcastle, Australia');
      // founder bio paragraphs
      var bioPs = $$('.founder-bio p');
      var bioEN = [
        'A Sudanese engineer based in Australia, working at the heart of the solar energy and distributed systems industry. ' +
        'He leads the Customer Success team at <strong>SwitchDin</strong> — the Australian company specialising in distributed energy management and VPP technologies — ' +
        'where he oversees the deployment of IoT systems for over <strong>1,600 units</strong> within the <strong>Horizon Power Smart Home Connect</strong> project, ' +
        'connecting rooftop solar to remote communities in Western Australia.',

        'He graduated with a <strong>Bachelor of Electronic Engineering</strong> (with Honours) from Multimedia University in Malaysia in 2016, ' +
        'and received the <strong>Best Paper Award</strong> at the WPMC 2017 conference in Bali, Indonesia, in the field of wireless network security.',

        'Before Australia, he worked in Sudan in telecommunications and smart agricultural systems (IoT), ' +
        'and always saw the gap between Sudan\'s vast solar resources and the lack of local investment and knowledge. ' +
        'That\'s where <strong>SunNile</strong> was born.',

        '«Every day I see how the right technology solves problems that seemed complex. ' +
        '<strong>What SwitchDin does in Australia</strong> — connecting thousands of homes into one smart network — ' +
        'is exactly what Sudan can achieve within a single decade if we lay the right foundations now.»'
      ];
      bioPs.forEach(function (p, i) { if (bioEN[i]) save(p, bioEN[i]); });
      // tags
      var tags = $$('.founder-tags .ftag');
      var tagEN = ['Solar Energy','DER / VPP','IoT & SaaS','Electronic Engineering','Network Security','Project Management','PKI & Security','Training & Development'];
      tags.forEach(function (t, i) { if (tagEN[i]) save(t, tagEN[i]); });
      // big quote
      if ((el = $('.big-quote blockquote'))) save(el,
        '«SunNile was born from longing…<br><strong>God gave us everything.</strong><br>' +
        'We just need to give ourselves a chance.»');
      if ((el = $('.big-quote cite'))) save(el, '— Mohammed Ahmed Magzoub Albashier');
      // initiative section
      var initTitles = $$('.initiative-section .section-title');
      if (initTitles[0]) save(initTitles[0], 'Why SunNile?');
      if ((el = $('.initiative-section .section-sub'))) save(el,
        'Sudan has one of the highest solar irradiance rates in the world — over 300 sunny days per year and generation potential exceeding 10 kWh/m²/day in the north. ' +
        'Yet millions of households suffer from frequent and worsening power cuts. The gap between potential and reality is not technical — it is informational, regulatory, and educational. SunNile bridges that gap.');
      // pillars
      var pillars = $$('.pillar');
      var pillarData = [
        ['Free Tools for Everyone',
         'Solar system calculator, certified inverter registry, and technical standards — everything open and free, no exceptions.'],
        ['Technician Training Institute',
         '24 training units across 3 levels — from electrical safety to VPP system design. Free and open to all.'],
        ['National Technical Standards',
         'Inspired by AS/NZS 5033 and adapted for the Sudanese environment — ensuring quality in every installation and safety for every household.'],
        ['International Experience, Localised',
         'Lessons distilled from 9 countries combining European, African, and Asian experiences — written through Sudanese eyes.'],
        ['Sudan\'s Vision 2030',
         'A realistic roadmap to make Sudan a leader in distributed solar energy within a single decade.'],
        ['Real Field Knowledge',
         'Every piece of content comes from hands-on experience with real solar systems serving thousands of homes — not just books.']
      ];
      pillars.forEach(function (pillar, i) {
        var d = pillarData[i];
        if (!d) return;
        var t = $('.pillar-title', pillar), tx = $('.pillar-text', pillar);
        if (t) save(t, d[0]);
        if (tx) save(tx, d[1]);
      });
      // timeline
      if (initTitles[1]) save(initTitles[1], 'Initiative Timeline');
      var tlSub = $$('.initiative-section .section-sub');
      if (tlSub[1]) save(tlSub[1], 'How SunNile grew from an idea to a full platform');
      var tlTexts = $$('.tl-text');
      var tlEN = [
        '<strong>Start:</strong> Joining SwitchDin and working directly on the Horizon Power project — a real-world view of how software and standards turn rooftop solar from a dream into infrastructure.',
        '<strong>The Idea:</strong> Why doesn\'t Sudan — with all that sunshine — have the same information infrastructure? Work begins on the solar system calculator and technical standards.',
        '<strong>Launch:</strong> SunNile launches with the inverter registry, calculator, and initial standards. The Solar Technician Institute is added with 24 training units.',
        '<strong>Expansion:</strong> International policy centre added with 10 global case studies, the 2030 vision, and activation of partnerships with Sudanese organisations.',
        '<strong>Goal:</strong> First cohort of 100 technicians certified by SunNile — the seed of a trusted technician network across all of Sudan\'s states.'
      ];
      tlTexts.forEach(function (t, i) { if (tlEN[i]) save(t, tlEN[i]); });
      // contact
      if ((el = $('.contact-section .section-title'))) save(el, 'Get in Touch');
      if ((el = $('.contact-section .section-sub'))) save(el,
        'Whether you are a technician looking to learn, a decision-maker seeking collaboration, ' +
        'or a Sudanese in the diaspora wanting to contribute — we are here.');
      var ccards = $$('.contact-card');
      var ccData = [
        ['Institutional Collaboration',
         'Do you represent a government entity, organisation, or company that wants to partner with SunNile?',
         'Connect via LinkedIn ↗'],
        ['Content Suggestions',
         'Do you have feedback on the technical standards or training units? Your input improves the initiative.',
         'Send us an Email ✉'],
        ['Contribute & Support',
         'SunNile is a free voluntary initiative. If you want to contribute your time or expertise, our doors are open.',
         'Join the Team ←']
      ];
      ccards.forEach(function (card, i) {
        var d = ccData[i];
        if (!d) return;
        var h3 = $('h3', card), p = $('p', card), a = $('a', card);
        if (h3) save(h3, d[0]);
        if (p)  save(p,  d[1]);
        if (a)  save(a,  d[2]);
      });
      document.title = 'About SunNile — Sudan\'s Rooftop Solar Initiative';
    },

    '404': function () {
      var el;
      if ((el = $('h1'))) save(el, 'Page Not Found');
      if ((el = $('p')))  save(el,
        'The link you followed seems to be incorrect or the page has moved.<br>' +
        'But SunNile is still here — go back to the home page and start again.');
      var btns = $$('.links a');
      if (btns[0]) save(btns[0], 'Back to Home');
      if (btns[1]) save(btns[1], 'Solar Institute');
      document.title = 'Page Not Found — SunNile';
    }
  };

  /* ── apply / restore ── */
  function applyEN() {
    var html = document.documentElement;
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    html.classList.add('lang-en');
    applyNavEN();
    applyFooterEN();
    var page = getPage();
    if (page && PAGES[page]) PAGES[page]();
  }

  function restoreAR() {
    var html = document.documentElement;
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    html.classList.remove('lang-en');
    restoreNavAR();
    restoreFooterAR();
    // restore all saved elements
    $$('[data-ar]').forEach(function (el) { el.innerHTML = el.getAttribute('data-ar'); });
    // restore region options
    var region = document.getElementById('region');
    if (region) {
      region.querySelectorAll('option[data-ar]').forEach(function (o) {
        o.textContent = o.getAttribute('data-ar');
      });
    }
    // restore inverter type cells & badges
    var tbody = document.getElementById('inv-tbody');
    if (tbody) {
      tbody.querySelectorAll('td[data-ar]').forEach(function (td) {
        td.textContent = td.getAttribute('data-ar');
      });
      tbody.querySelectorAll('.badge[data-ar]').forEach(function (b) {
        b.textContent = b.getAttribute('data-ar');
      });
    }
    // remove EN academy note
    var note = document.getElementById('en-academy-note');
    if (note) note.remove();
    document.title = document.querySelector('meta[name="og:title"]') ?
      document.querySelector('meta[property="og:title"]').content : document.title;
  }

  /* ── toggle button ── */
  function createToggleBtn() {
    var btn = document.createElement('button');
    btn.id = 'langToggle';
    btn.className = 'lang-toggle-btn';
    btn.setAttribute('aria-label', 'Switch language / تغيير اللغة');
    btn.textContent = lang === 'ar' ? 'EN' : 'عربي';
    btn.addEventListener('click', function () {
      lang = lang === 'ar' ? 'en' : 'ar';
      localStorage.setItem(LANG_KEY, lang);
      btn.textContent = lang === 'ar' ? 'EN' : 'عربي';
      if (lang === 'en') applyEN(); else restoreAR();
    });
    return btn;
  }

  /* ── init ── */
  document.addEventListener('DOMContentLoaded', function () {
    injectStyles();
    var nav = $('.site-nav');
    if (nav) {
      var hamburger = nav.querySelector('.nav-toggle');
      var btn = createToggleBtn();
      if (hamburger) nav.insertBefore(btn, hamburger);
      else nav.appendChild(btn);
    }
    if (lang === 'en') applyEN();
  });

})();
