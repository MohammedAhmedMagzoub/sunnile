/* SunNile — Bilingual Arabic / English support
 * Arabic is the default (stays in HTML). English applied via JS.
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
      'html.lang-en .card-lesson{border-right:none;border-left:3px solid var(--blue);' +
      'border-radius:0 6px 6px 0;}' +
      'html.lang-en .tl-dot::after{left:auto;right:4px;}' +
      'html.lang-en .modal-section-title{text-align:left;}' +
      'html.lang-en .sudan-takeaway-title{text-align:left;}' +
      'html.lang-en .compare-table th{text-align:left;}' +
      '@media(max-width:768px){' +
      'html.lang-en .nav-links li a:hover,html.lang-en .nav-links li a.active{' +
      'border-right-color:transparent;border-left:3px solid var(--amber);}}';
    document.head.appendChild(s);
  }

  /* ── nav ── */
  var NAV_AR = ['الرئيسية','الحاسبة','الإنفرترات','المعايير','مستقبل الطاقة','السياسات','المعهد','المركّبون','عن المبادرة'];
  var NAV_EN = ['Home','Calculator','Inverters','Standards','Solar Future','Policy Hub','Institute','Installers','About'];

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

  /* ════════════════════════════════════════════
     PER-PAGE TRANSLATIONS
  ════════════════════════════════════════════ */
  var PAGES = {

    /* ── INDEX ── */
    index: function () {
      var el;
      // Hero
      if ((el = $('.hero h1')))        save(el, 'Sun Nile');
      if ((el = $('.hero-badge')))      save(el, 'Free Non-Profit Initiative');
      if ((el = $('.hero-sub')))        save(el, 'Sudan\'s Rooftop Solar Initiative');
      if ((el = $('.hero-tagline')))    save(el,
        'Sudan has one of the highest solar irradiance rates in the world — over 300 sunny days per year. ' +
        'SunNile helps you turn this treasure into clean, free electricity for your home and business.');
      if ((el = $('.hero-quote p')))    save(el,
        '«SunNile was born from longing… <strong>God gave us everything.</strong><br>' +
        'We just need to give ourselves a chance.»');
      if ((el = $('.hero-quote cite'))) save(el,
        '— Mohammed Ahmed Magzoub, Founder of SunNile');
      var ctas = $$('.hero-ctas a');
      if (ctas[0]) save(ctas[0], 'Calculate Your System');
      if (ctas[1]) save(ctas[1], 'Start Learning Free');

      // Stats — numbers + labels
      var statDivs = $$('.stats-strip > div');
      var statData = [
        {num: '7<span class="stat-unit">+</span>', lbl: 'sun hours per day<br>in northern regions'},
        {num: '97<span class="stat-unit">%</span>', lbl: 'of Sudan\'s land area<br>suitable for solar generation'},
        {num: '300<span class="stat-unit">+</span>', lbl: 'sunny days per year<br>across most of Sudan'},
        {num: '9', lbl: 'years payback period<br>with a feed-in tariff'}
      ];
      statDivs.forEach(function (div, i) {
        var d = statData[i];
        if (!d) return;
        var num = $('.stat-num', div);
        var lbl = $('.stat-label', div);
        if (num) save(num, d.num);
        if (lbl) save(lbl, d.lbl);
      });

      // Section
      if ((el = $('.section-title'))) save(el, 'What is SunNile?');
      if ((el = $('.section-sub')))   save(el, 'Everything you need to install your solar system — free');

      // Cards
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

    /* ── CALCULATOR ── */
    calculator: function () {
      var el;
      /* page header */
      if ((el = $('.page-header h1'))) save(el, '🧮 Solar System Calculator');
      if ((el = $('.page-header p')))  save(el, 'Calculate the ideal system size for your home or business in Sudan');

      /* form labels (basic + advanced) */
      var labelEN = [
        'Geographic Region <span>(PSH = Peak Sun Hours)</span>',
        'Daily Consumption <span>(kWh/day)</span>',
        'Panel Power <span>(Watts)</span>',
        'Daily Power Outage Hours <span>(for battery sizing)</span>',
        'Battery Type',
        'Autonomy Days <span>(days without sun)</span>',
        'Tilt Angle <span>(° — 0 flat, 90 vertical)</span>',
        'Estimated Installation Cost <span>(USD / Watt)</span>',
        'Current Electricity Tariff <span>(USD / kWh)</span>',
        'Battery Cost <span>(USD / kWh)</span>'
      ];
      $$('.form-label').forEach(function (lbl, i) { if (labelEN[i]) save(lbl, labelEN[i]); });

      /* region options */
      var region = document.getElementById('region');
      if (region) {
        ['North — 6.8 hr/day (Nile, Northern)',
         'Centre — 6.2 hr/day (Khartoum, Gezira)',
         'East — 5.8 hr/day (Kassala, Red Sea)',
         'West — 6.0 hr/day (Kordofan, Darfur)',
         'South — 5.2 hr/day (Blue Nile)'].forEach(function (t, i) {
          var o = region.options[i];
          if (!o) return;
          if (!o.hasAttribute('data-ar')) o.setAttribute('data-ar', o.textContent);
          o.textContent = t;
        });
      }

      /* battery type options */
      var battType = document.getElementById('batt-type');
      if (battType) {
        ['Lithium Iron Phosphate (LiFePO4) — 80% DoD, 95% efficiency',
         'Lead-Acid — 50% DoD, 80% efficiency'].forEach(function (t, i) {
          var o = battType.options[i];
          if (!o) return;
          if (!o.hasAttribute('data-ar')) o.setAttribute('data-ar', o.textContent);
          o.textContent = t;
        });
      }

      /* autonomy options */
      var aut = document.getElementById('autonomy');
      if (aut) {
        ['1 day', '2 days', '3 days'].forEach(function (t, i) {
          var o = aut.options[i];
          if (!o) return;
          if (!o.hasAttribute('data-ar')) o.setAttribute('data-ar', o.textContent);
          o.textContent = t;
        });
      }

      /* battery cost options */
      var bc = document.getElementById('batt-cost');
      if (bc) {
        ['LiFePO4 — ~$150/kWh', 'Premium LiFePO4 — ~$200/kWh', 'Lead-Acid — ~$80/kWh'].forEach(function (t, i) {
          var o = bc.options[i];
          if (!o) return;
          if (!o.hasAttribute('data-ar')) o.setAttribute('data-ar', o.textContent);
          o.textContent = t;
        });
      }

      /* panel options */
      var pw = document.getElementById('panel-w');
      if (pw) {
        pw.querySelectorAll('option').forEach(function (o) {
          if (!o.hasAttribute('data-ar')) o.setAttribute('data-ar', o.textContent);
          o.textContent = o.value + ' W';
        });
      }

      /* form hints (skip tilt-hint — managed dynamically by updateTiltHint) */
      if ((el = document.getElementById('hint-cost')))   save(el, 'Includes panels, inverter, installation and wiring — excludes battery');
      if ((el = document.getElementById('hint-tariff'))) save(el, 'Leave 0 if unknown — used to calculate payback period');

      /* advanced toggle label */
      if ((el = document.getElementById('adv-label'))) save(el, '⚙ Advanced Settings — Battery type · Tilt angle · Cost estimate');

      /* tilt hint update (if tilt element exists, push English version) */
      var tiltHint = document.getElementById('tilt-hint');
      var tiltVal = document.getElementById('tilt');
      if (tiltHint && tiltVal) {
        var curTilt = tiltVal.value || '16';
        tiltHint.textContent = 'Optimal tilt for this region: ' + curTilt + '° — panels face south in Sudan';
      }

      /* calculate button */
      if ((el = $('.calc-btn'))) save(el, 'Calculate Optimal System →');

      /* result card labels + units */
      var rlEN = ['System Size (kWp)', 'Solar Panels', 'Min. Inverter Size', 'Battery Capacity'];
      var ruEN = ['kWp peak', 'panels', 'kW', 'kWh'];
      ['rl-kwp','rl-panels','rl-inv','rl-batt'].forEach(function (id, i) {
        if ((el = document.getElementById(id))) save(el, rlEN[i]);
      });
      ['ru-kwp','ru-panels','ru-inv','ru-batt'].forEach(function (id, i) {
        if ((el = document.getElementById(id))) save(el, ruEN[i]);
      });

      /* results section title */
      if ((el = document.getElementById('results-title'))) save(el, 'Design Results');

      /* chart + performance section titles */
      if ((el = document.getElementById('chart-title'))) save(el, 'Expected Monthly Generation');
      if ((el = document.getElementById('perf-title')))  save(el, 'Performance Ratio (PR) Breakdown');

      /* cost section title */
      if ((el = document.getElementById('cost-title'))) save(el, '💰 Cost Estimate & Payback Period');

      /* CO2 line label */
      if ((el = document.getElementById('co2-label'))) save(el, 'Estimated Annual Carbon Offset 🌱');

      /* notes */
      if ((el = document.getElementById('notes-title'))) save(el, 'Important Notes');
      var noteLi = $$('#notes-list li');
      var noteEN = [
        '⚠️ This calculator provides an initial estimate — a certified technician must review the final design',
        '📊 PSH data is based on NASA POWER measurements per Sudanese state — including monthly temperature effects',
        '🌡 Performance ratio is calculated automatically with monthly thermal derating at −0.35%/°C above 25°C',
        '🔋 Battery capacity includes depth-of-discharge (DoD) and round-trip efficiency margin per battery type',
        '⚡ Cost estimates are indicative only — actual prices vary by supplier, location and market conditions'
      ];
      noteLi.forEach(function (li, i) { if (noteEN[i]) save(li, noteEN[i]); });

      var ctaEl;
      if ((ctaEl = document.getElementById('installer-cta-text'))) save(ctaEl, 'Ready to install? Find an accredited installer in your state');
      if ((ctaEl = document.getElementById('installer-cta-btn')))  save(ctaEl, 'Find an Installer →');

      document.title = 'Solar System Calculator — SunNile';
    },

    /* ── INVERTERS ── */
    inverters: function () {
      var el;
      var el;
      if ((el = $('.page-header h1'))) save(el, '⚡ Certified Inverter Registry');
      if ((el = $('.page-header p')))  save(el, '37 models from 10 brands — IEC 62109 certified · reviewed every 12 months');
      var picks = $$('.inv-wrap > div:first-of-type > div');
      if (picks[0]) save(picks[0], '🏆 Best Quality: <strong>Fronius</strong>');
      if (picks[1]) save(picks[1], '💰 Best Value: <strong>Sungrow</strong>');
      if (picks[2]) save(picks[2], '🔬 New Generation: <strong>SiGEnergy</strong>');
      var filterLabel = $('.filter-bar span');
      if (filterLabel) save(filterLabel, 'Filter:');
      $$('.filter-btn').forEach(function (btn) {
        if (btn.textContent.indexOf('الكل') !== -1) save(btn, 'All (37)');
      });
      var ths = $$('.inv-table th');
      ['Brand','Model','Type','Power','IEC / AS4777','DRED','SunSpec','Cert. Reference','Last Reviewed','Rating']
        .forEach(function (t, i) { if (ths[i]) save(ths[i], t); });
      var tbody = document.getElementById('inv-tbody');
      if (tbody) {
        tbody.querySelectorAll('tr').forEach(function (row) {
          var cells = row.querySelectorAll('td');
          if (cells[2]) {
            var t = cells[2];
            if (!t.hasAttribute('data-ar')) t.setAttribute('data-ar', t.textContent);
            t.textContent = t.getAttribute('data-ar') === 'أحادي' ? 'Single-phase' : 'Three-phase';
          }
          /* last-reviewed cell (index 8) — month name translation */
          if (cells[8]) {
            var rv = cells[8];
            if (!rv.hasAttribute('data-ar')) rv.setAttribute('data-ar', rv.textContent.trim());
            var arMonths = {'يناير':'Jan','فبراير':'Feb','مارس':'Mar','أبريل':'Apr','مايو':'May','يونيو':'Jun','يوليو':'Jul','أغسطس':'Aug','سبتمبر':'Sep','أكتوبر':'Oct','نوفمبر':'Nov','ديسمبر':'Dec'};
            var arText = rv.getAttribute('data-ar');
            var translated = arText;
            Object.keys(arMonths).forEach(function(ar) {
              translated = translated.replace(ar, arMonths[ar]);
            });
            rv.textContent = translated;
          }
          var badge = row.querySelector('.badge');
          if (badge) {
            var m = {'الأفضل جودةً':'Best Quality','الأفضل قيمةً':'Best Value',
              'الجيل الجديد':'New Generation','موصى به':'Recommended',
              'قيمة جيدة':'Good Value','متميز':'Premium'};
            if (!badge.hasAttribute('data-ar')) badge.setAttribute('data-ar', badge.textContent.trim());
            badge.textContent = m[badge.getAttribute('data-ar')] || badge.getAttribute('data-ar');
          }
        });
      }
      /* methodology note */
      var methEl = $('.inv-wrap > div:last-of-type');
      if (methEl && methEl.querySelector('strong')) {
        save(methEl, '<strong style="color:var(--text);">Certification Methodology</strong> — A model is listed only when it meets all of the following: (1) Valid IEC 62109 Parts 1 &amp; 2 certificate from an accredited body (TÜV / DNV / Bureau Veritas / SGS), (2) IEC 62116 anti-islanding test passed, (3) IP65 or higher ingress protection, (4) CEC efficiency ≥97%, (5) continuous operation to 60°C, (6) DRED and SunSpec Modbus TCP support. The registry is reviewed every 12 months — models with revoked certificates are removed immediately.');
      }
      document.title = 'Certified Inverter Registry — SunNile';
    },

    /* ── STANDARDS ── */
    standards: function () {
      var el;
      if ((el = $('.page-header h1'))) save(el, '📋 SunNile Technical Standards');
      if ((el = $('.page-header p')))  save(el, 'Comprehensive technical framework to ensure the quality and safety of every solar system in Sudan');

      // Intro paragraph
      var introPara = $('.std-wrap > div > p');
      if (introPara) save(introPara,
        'SunNile developed these standards to ensure that every solar system installed in Sudan is safe, reliable, and high-performing. ' +
        'These standards are built on international best practices and adapted to Sudan\'s climate and infrastructure conditions.');

      // Section headers + requirements
      var sections = $$('.std-section');
      var sectionData = [
        {
          header: '1. Inverter Requirements',
          reqs: [
            ['IEC', 'IEC 62109 (Parts 1 & 2)', 'Safety standard for power converters in photovoltaic systems — mandatory'],
            ['IEC', 'IEC 62116', 'Anti-islanding test procedure — protects the safety of grid technicians'],
            ['AS',  'AS 4777.2', 'Grid connection requirements for inverters — the internationally recognised Australian standard'],
            ['DR',  'DRED — Mandatory', 'Demand Response Enabling Device — allows the grid to control generation when needed'],
            ['SS',  'SunSpec Modbus', 'Standard communication protocol for monitoring and managing distributed systems']
          ]
        },
        {
          header: '2. Performance Requirements',
          reqs: [
            ['%',  'CEC Efficiency ≥ 97%', 'Minimum acceptable — California Energy Commission certification'],
            ['🌡', 'Operation up to 60°C', 'Essential for Sudan\'s climate — inverters that shut down at 45°C are not acceptable'],
            ['IP', 'IP65 Protection Rating', 'Full dust and water protection — required in desert environments'],
            ['MP', 'Multiple MPPT', 'Maximum power point tracking — important for multi-orientation rooftops']
          ]
        },
        {
          header: '3. Installation & Safety Requirements',
          reqs: [
            ['📐', 'Optimal Tilt: 15°–25°', 'For northern regions — calculated precisely for each location and geographic zone'],
            ['⬅', 'South-Facing Orientation', 'Sudan is in the northern hemisphere — panels face south, not north'],
            ['⚡', 'Full System Earthing', 'Structure, panels, and inverter — protection from lightning and electrical leakage'],
            ['🔒', 'Visible DC Isolator', 'Isolates panels immediately in emergencies — a non-negotiable safety requirement'],
            ['📝', 'Full Installation Documentation', 'Single-line diagram + cable schedule + final inspection record']
          ]
        },
        {
          header: '4. Solar Panel Requirements',
          reqs: [
            ['IEC', 'IEC 61215 / IEC 61730', 'Performance and safety standard for PV modules — mandatory for all models'],
            ['🔥', 'Temp Coefficient ≤ -0.35%/°C', 'Pmax Temp Coeff — panels with high thermal degradation are unsuitable for Sudan'],
            ['25', '25-Year Performance Warranty', 'Output ≥ 80% of original power after 25 years — required for every panel in the registry'],
            ['🌊', 'IEC 62782 — Mechanical Loads', 'Resistance to wind, dust, and mechanical shock in Sudan\'s climate']
          ]
        },
        {
          header: '5. Cable & Connection Requirements',
          reqs: [
            ['DC', 'UV-Resistant DC Cables', 'TUV 2 PfG 1169 — required to withstand Sudan\'s sun for decades'],
            ['MC', 'MC4 or Compatible Connectors', 'IP67 protection rating — prevents moisture and dust ingress'],
            ['mm', 'Standard Cable Cross-sections', 'DC: 4–6mm² | AC: 6–16mm² based on load — Sudanese load tables'],
            ['⚡', 'Lightning Surge Protection SPD', 'Type 1+2 on DC side, Type 2 on AC side — mandatory for rural areas']
          ]
        }
      ];

      sections.forEach(function (sec, i) {
        var d = sectionData[i];
        if (!d) return;
        var h3 = $('h3', sec);
        if (h3) save(h3, d.header);
        var items = $$('.req-list li', sec);
        items.forEach(function (li, j) {
          var r = d.reqs[j];
          if (!r) return;
          var title = $('.req-title', li);
          var desc  = $('.req-desc', li);
          if (title) save(title, r[1]);
          if (desc)  save(desc,  r[2]);
        });
      });
      document.title = 'Technical Standards — SunNile';
    },

    /* ── FUTURE ── */
    future: function () {
      var el;

      // Hero
      if ((el = $('.hero-badge')))  save(el, '🌍 Long-Term Vision');
      if ((el = $('h1', $('.hero')))) save(el, 'The Future of <span>Solar Energy</span><br>in Sudan');
      var heroQ = $('.hero-quote');
      if (heroQ) {
        var qText = heroQ.childNodes[0];
        if (qText && qText.nodeType === 3) {
          // The quote text is a text node before <cite>
          if (!heroQ.hasAttribute('data-ar')) heroQ.setAttribute('data-ar', heroQ.innerHTML);
          heroQ.innerHTML =
            'SunNile was born from longing — a longing that saw a homeland drowning in darkness ' +
            'while the sun shines on it 365 days a year. God gave us everything. ' +
            'We just need to give ourselves a chance.' +
            '<cite>— Mohammed Ahmed Magzoub, Founder of SunNile</cite>';
        } else {
          save(heroQ,
            'SunNile was born from longing — a longing that saw a homeland drowning in darkness ' +
            'while the sun shines on it 365 days a year. God gave us everything. ' +
            'We just need to give ourselves a chance.' +
            '<cite>— Mohammed Ahmed Magzoub, Founder of SunNile</cite>');
        }
      }

      // Why Now section
      var sections = $$('section');
      if (sections[0]) {
        var s = sections[0];
        if ((el = $('.sec-label', s))) save(el, '⚡ Why Now?');
        if ((el = $('.sec-title', s))) save(el, 'Sudan on the Brink of an Energy Transition');
        var bodies = $$('.sec-body', s);
        if (bodies[0]) save(bodies[0],
          'Sudan suffers from power cuts that sometimes last 18 hours a day, while it holds solar resources ' +
          'sufficient to cover its needs three times over. Researchers have documented this opportunity clearly — ' +
          'and the global shift in solar costs makes acting today a necessity, not a choice.');
        if (bodies[1]) save(bodies[1],
          'The IMF and World Bank estimate that eliminating fuel subsidies and redirecting them to renewables ' +
          'would reduce the fiscal deficit and raise the level of public services for citizens. ' +
          'Rooftop solar is the lowest-cost and fastest-to-deploy pathway.');
        var statBoxes = $$('.stat-box', s);
        var statEN = [
          {num: '6.2', lbl: 'daily solar irradiance hours<br>in central Sudan (PSH)'},
          {num: '70%', lbl: 'reduction in panel costs<br>over the past decade'},
          {num: '9 yrs', lbl: 'payback period with<br>feed-in tariff (Ahmed et al. 2022)'}
        ];
        statBoxes.forEach(function (box, i) {
          var d = statEN[i];
          if (!d) return;
          var lbl = $('.lbl', box);
          if (lbl) save(lbl, d.lbl);
        });
      }

      // Success Stories
      if (sections[1]) {
        var s2 = sections[1];
        if ((el = $('.sec-label', s2))) save(el, '🌐 Global Experiences');
        if ((el = $('.sec-title', s2))) save(el, 'Countries that Succeeded — and We Can Too');
        if ((el = $('.sec-body', s2)))  save(el, 'These are not theories — they are documented results from countries that faced challenges similar to Sudan\'s.');
        var cards = $$('.story-card', s2);
        var storyEN = [
          {title:'Australia — National VPP', stat:'50,000 homes', body:'Australia built the world\'s largest virtual power plant by connecting homes with Tesla Powerwall batteries to each other. The model proved that distributed energy can be managed at scale.'},
          {title:'Germany — Feed-in Tariff', stat:'35% renewable', body:'The Renewable Energy Act (EEG) guaranteed a fixed tariff for every kWh fed to the grid. The result: rapid and widespread adoption within 15 years.'},
          {title:'Jordan — Net Metering', stat:'100,000 systems', body:'Jordan implemented net metering — surplus is credited on the electricity bill. The result: a sudden surge in rooftop solar installations.'},
          {title:'India — Rapid Scale-up', stat:'70 GW target', body:'India cut licensing bureaucracy and opened green financing. Rooftop solar installation multiplied several times over within a few years.'},
          {title:'Bangladesh — Home Systems', stat:'6 million systems', body:'Hellqvist & Heubaum 2023 documented how Bangladesh deployed 6 million home solar systems through accessible finance and local supply chains.'}
        ];
        cards.forEach(function (card, i) {
          var d = storyEN[i];
          if (!d) return;
          var title = $('.story-title', card);
          var stat  = $('.story-stat', card);
          var body  = $('p.story-body', card);
          if (title) save(title, d.title);
          if (stat)  save(stat,  d.stat);
          if (body)  save(body,  d.body);
        });
      }

      // VPP Section
      var vppSec = $('.vpp-section');
      if (vppSec) {
        if ((el = $('.vpp-badge', vppSec)))  save(el, '⚡ Virtual Power Plant — VPP');
        if ((el = $('.vpp-title', vppSec)))  save(el, 'Sudan\'s Opportunity:<br>A Network of Rooftops');
        if ((el = $('.vpp-sub', vppSec)))    save(el,
          'Imagine a thousand homes, each with solar panels on the roof. Every home uses its solar power first — ' +
          'when the energy generated exceeds the home\'s needs, we take only that surplus and pool it with ' +
          'surpluses from other homes. That combined total becomes real power feeding the national grid.');
        var surplus = $('.surplus-text', vppSec);
        if (surplus) save(surplus,
          '<strong>Core principle: We take only the surplus</strong><br>' +
          'The home consumes its solar power first to cover its needs (lighting, AC, appliances). ' +
          'Only what remains after covering the load — the surplus — is sent to the grid via the VPP system. ' +
          'The homeowner loses nothing; they gain from selling the surplus.' +
          '<br><span style="font-size:11px;color:var(--text-dim);display:inline-block;margin-top:4px;">' +
          'Your load is served first. Only the surplus — power your home doesn\'t need — flows to the grid.</span>');
        // Slider labels
        var ctrlLabels = $$('.ctrl-lbl', vppSec);
        if (ctrlLabels[0]) save(ctrlLabels[0], 'Connected homes');
        if (ctrlLabels[1]) save(ctrlLabels[1], 'Surplus export ratio');
        // VPP stats labels
        var vstatLabels = $$('.vlbl', vppSec);
        if (vstatLabels[0]) save(vstatLabels[0], 'Connected · Houses');
        if (vstatLabels[1]) save(vstatLabels[1], 'Pooled Surplus · kW/MW');
        if (vstatLabels[2]) save(vstatLabels[2], 'Homes Served · Grid');

        // Override updateVPP to output English text
        if (!window._origUpdateVPP) window._origUpdateVPP = window.updateVPP;
        window.updateVPP = function (h) {
          h = parseInt(h);
          var surplusPct = parseInt(document.getElementById('sSlider').value);
          document.getElementById('hVal').textContent = h.toLocaleString('en') + ' homes';
          document.getElementById('sVal').textContent = surplusPct + '% surplus';
          var surplusKW = Math.round(h * 2.5 * (surplusPct / 100));
          var served = Math.round(surplusKW * 2.8);
          var kwStr = surplusKW >= 1000 ? (surplusKW / 1000).toFixed(1) + ' MW' : surplusKW + ' kW';
          document.getElementById('vStatH').textContent = h.toLocaleString('en');
          document.getElementById('vStatKW').textContent = kwStr;
          document.getElementById('vStatS').textContent = served.toLocaleString('en');
          document.getElementById('kwTxt').textContent = kwStr;
        };
        // Re-trigger to update display
        var hSlider = document.getElementById('hSlider');
        if (hSlider) window.updateVPP(hSlider.value);

        // Challenges
        if ((el = $('.ch-title', vppSec))) save(el, '⚠️ Why is this not easy? — The Real Challenges');
        if ((el = $('.ch-intro', vppSec))) save(el, 'The idea is compelling — implementation requires serious solutions to these obstacles:');
        var chCards = $$('.ch-card', vppSec);
        var chEN = [
          ['Weak Grid Infrastructure',
           'The existing electricity grid was not designed to receive intermittent renewable energy from thousands of small sources. Pylons and transformers need substantial upgrading.'],
          ['Lack of Standardisation',
           'To connect thousands of inverters they must speak the same digital language. Without unified standards (SunSpec Modbus, DRED), centralised control becomes impossible.'],
          ['Generation Variability',
           'Clouds and dust storms cause sudden disruptions. The grid needs storage systems and forecasting to absorb these changes and maintain stability.'],
          ['Absent Regulatory Framework',
           'There is no clear feed-in tariff or net metering law. Without a financial incentive, homeowners will not invest in sufficiently large systems.'],
          ['High Upfront Cost & No Financing',
           'Installing a grid-connected solar system costs thousands of dollars. Without green loans and accessible financing, the solution remains out of reach for most households.'],
          ['Shortage of Trained Technicians',
           'Grid-tied system installation, inverter programming, and VPP management require specialised technicians not yet available in sufficient numbers.']
        ];
        chCards.forEach(function (card, i) {
          var d = chEN[i];
          if (!d) return;
          var name = $('.ch-name', card);
          var desc = $('.ch-desc', card);
          if (name) save(name, d[0]);
          if (desc) save(desc, d[1]);
        });
        var concl = $('.vpp-conclusion p', vppSec);
        if (concl) save(concl,
          '<strong style="color:var(--amber);">The Core Message:</strong> ' +
          'The challenges are real — but they are solvable. Australia built the world\'s largest VPP after facing these exact same obstacles. ' +
          'Sudan has the sun, the will, and the human resources. What we need is the legislative framework, unified standards, and systematic training.');
      }

      // Action Plan
      if (sections[2]) {
        var s3 = sections[2];
        if ((el = $('.sec-label', s3))) save(el, '🗺️ Action Plan');
        if ((el = $('.sec-title', s3))) save(el, 'Five Steps to Build a Sudanese VPP Network');
        if ((el = $('.sec-body', s3)))  save(el, 'Built on lessons from scientific research and documented international experience.');
        var steps = $$('.step', s3);
        var stepData = [
          ['Issue Unified National Technical Standards',
           'Adopt IEC 62116, AS 4777.2, and SunSpec Modbus as mandatory standards for every new inverter entering the Sudanese market. SunNile establishes the reference standards framework until official regulations are issued.'],
          ['Legislate Net Metering and Feed-in Tariff',
           'One government step that would completely transform the solar investment equation. Jordan did it — Sudan can follow the same path and achieve similar results within 3 years.'],
          ['Build a National Solar System Registry',
           'A database where all installed panels, inverters, and batteries are registered. This data is the foundation of any future VPP system and is indispensable for grid management.'],
          ['Train Certified Technicians at National Scale',
           'SunNile Institute offers 24 training units to build a generation of technicians qualified for proper installation and safe grid connection. This human investment is necessary before everything else.'],
          ['Launch a Pilot VPP Project in Khartoum',
           'Connect 500–1,000 homes in a single neighbourhood as a pilot project that proves viability and builds trust. Ahmed et al. 2023 shows Khartoum has sufficient population density for this model.']
        ];
        steps.forEach(function (step, i) {
          var d = stepData[i];
          if (!d) return;
          var title = $('.step-title', step);
          var text  = $('p.step-text', step);
          if (title) save(title, d[0]);
          if (text)  save(text,  d[1]);
        });
      }

      // Citations
      if (sections[3]) {
        var s4 = sections[3];
        if ((el = $('.sec-label', s4))) save(el, '📚 Scientific References');
        if ((el = $('.sec-title', s4))) save(el, 'This Page is Built on Documented Research');
        if ((el = $('.sec-body', s4)))  save(el, 'Every claim here is linked to a peer-reviewed scientific reference or recognised international report.');
        var citeItems = $$('.cite-item', s4);
        var citeEN = [
          ['Ahmed et al. 2022 — Khartoum PV', 'Study of rooftop solar potential in Khartoum. Payback period: 18 years → 9 years with feed-in tariff.'],
          ['Ahmed et al. 2023 — Oxford Energy Policy', 'Analysis of solar energy policies in Sudan. Most cited work on the topic (15+ citations).'],
          ['Younis et al. 2025 — Elsevier', 'Sudan needs an institutional framework first; weak governance is the main barrier, not technology.'],
          ['Fadlallah & Serradj 2020 — Solar Energy', 'Analysis of solar energy potential in Sub-Saharan Africa. (82+ citations)'],
          ['Hellqvist & Heubaum 2023 — Climate Policy', 'SHS deployment in Bangladesh: 6 million systems through accessible finance. (40+ citations)'],
          ['AEMO — Australia VPP', 'Australian Energy Market Operator reports on national VPP performance.'],
          ['IMF & World Bank — Fuel Subsidy Reform', 'Estimated fiscal impact of redirecting subsidies to renewables in MENA and Africa.'],
          ['Fraunhofer ISE 2023 — Energy Costs', 'Tracking the decline in solar panel costs over the past decade (−90% since 2010).']
        ];
        citeItems.forEach(function (item, i) {
          var d = citeEN[i];
          if (!d) return;
          var strong = $('strong', item);
          if (!item.hasAttribute('data-ar')) item.setAttribute('data-ar', item.innerHTML);
          item.innerHTML = '<strong>' + d[0] + '</strong>' + d[1];
        });
      }

      document.title = 'Sudan\'s Solar Future — SunNile';
    },

    /* ── POLICY ── */
    policy: function () {
      var el;

      // Page hero
      if ((el = $('.page-hero h1'))) save(el, '🌍 Policy <span>Centre</span>');
      if ((el = $('.page-hero p')))  save(el,
        'International and African experiences in rooftop solar policy — what worked, what failed, and what Sudan can learn');
      if ((el = $('.source-note')))  save(el,
        '📚 Based on: Ahmed et al. 2023 · Younis et al. 2025 · Hellqvist & Heubaum 2023 · IRENA 2024 · IEA Africa 2023 — Click any card for full details');

      // Filter buttons
      $$('.filter-bar .filter-btn').forEach(function (btn) {
        var t = btn.textContent.trim();
        if (t === 'الكل') save(btn, 'All');
        else if (t === 'دول متقدمة') save(btn, 'Advanced Countries');
        else if (t === 'النماذج الأفريقية') save(btn, 'African Models');
      });

      // Section labels
      $$('.section-label-text').forEach(function (lbl) {
        var t = lbl.textContent.trim();
        if (t === 'نماذج دولية رائدة') save(lbl, 'LEADING INTERNATIONAL MODELS');
        else if (t === 'النماذج الأفريقية') save(lbl, 'AFRICAN MODELS');
        else if (t === 'جدول المقارنة الشامل') save(lbl, 'COMPREHENSIVE COMPARISON TABLE');
      });

      // Country card data
      var cardMap = {
        au: {
          name: 'Australia',
          tagline: 'World leader in residential solar adoption',
          stats: ['Rooftop adoption rate', 'Feed-in Tariff (FiT)', 'Installation standard'],
          lesson: '<strong>Lesson for Sudan:</strong> Strict technical standards + accreditation system = public trust from day one.',
          badge: 'International', hint: 'Click for full details ↓'
        },
        de: {
          name: 'Germany',
          tagline: 'The historic feed-in tariff model — Energiewende',
          stats: ['Installed solar capacity', 'First FiT rate', 'Core legislation'],
          lesson: '<strong>Lesson for Sudan:</strong> Legal framework precedes investment — without legislation, there is no market.',
          badge: 'International', hint: 'Click for full details ↓'
        },
        ma: {
          name: 'Morocco',
          tagline: 'The African model — combining large and small scale',
          stats: ['2030 target', 'Self-sufficiency law', 'Regulator'],
          lesson: '<strong>Lesson for Sudan:</strong> An explicit self-sufficiency law + independent regulator = investor confidence.',
          badge: 'International', hint: 'Click for full details ↓'
        },
        bd: {
          name: 'Bangladesh',
          tagline: 'The fastest-ever rollout of home solar systems in history',
          stats: ['SHS units installed', 'Implementing body', 'Finance mechanism'],
          lesson: '<strong>Lesson for Sudan:</strong> Accessible finance is the primary driver — not the technology.',
          badge: 'International', hint: 'Click for full details ↓'
        },
        jo: {
          name: 'Jordan',
          tagline: 'A successful Arab model in distributed solar energy',
          stats: ['Net Metering law', 'Annual growth', 'Installed capacity'],
          lesson: '<strong>Lesson for Sudan:</strong> Net Metering is easier than FiT to start — it improves the bill without cash payments to producers.',
          badge: 'International', hint: 'Click for full details ↓'
        },
        ke: {
          name: 'Kenya',
          tagline: 'Off-grid solar leader in Africa',
          stats: ['SHS units sold', 'Rural electrification', 'Payment model'],
          lesson: '<strong>Lesson for Sudan:</strong> The Pay-As-You-Go (PAYG) model made solar energy fully accessible to the poor.',
          badge: 'Africa', hint: 'Click for full details ↓'
        },
        rw: {
          name: 'Rwanda',
          tagline: 'From zero to 70% electrification in 15 years through a national plan',
          stats: ['Electrification rate', 'Rural mini-grids', '2024 target'],
          lesson: '<strong>Lesson for Sudan:</strong> Political will + clear national plan = a historic energy transformation within a decade.',
          badge: 'Africa', hint: 'Click for full details ↓'
        },
        ng: {
          name: 'Nigeria',
          tagline: 'Africa\'s largest economy facing Sudan\'s exact same challenges',
          stats: ['Daily power outage', 'Solar market growth', 'Import exemption'],
          lesson: '<strong>Lesson for Sudan:</strong> A customs exemption multiplies solar penetration without direct government spending.',
          badge: 'Africa', hint: 'Click for full details ↓'
        },
        et: {
          name: 'Ethiopia',
          tagline: 'Rural electrification via solar at continental scale',
          stats: ['GET FiT project', 'SHS distributed', 'Technician training curriculum'],
          lesson: '<strong>Lesson for Sudan:</strong> Integrating technician training into the national TVET curriculum is faster than separate training programmes.',
          badge: 'Africa', hint: 'Click for full details ↓'
        },
        sn: {
          name: 'Senegal',
          tagline: 'The ASER programme model for solar village electrification',
          stats: ['Solar-powered villages', 'ASER programme', 'Management model'],
          lesson: '<strong>Lesson for Sudan:</strong> Public-private partnership (PPP) is the most successful mechanism for electrifying remote African villages.',
          badge: 'Africa', hint: 'Click for full details ↓'
        }
      };

      $$('.country-card').forEach(function (card) {
        var id = card.getAttribute('onclick');
        if (!id) return;
        var m = id.match(/openModal\('(\w+)'\)/);
        if (!m) return;
        var d = cardMap[m[1]];
        if (!d) return;
        var name    = $('.card-name', card);
        var tagline = $('.card-tagline', card);
        var lesson  = $('.card-lesson', card);
        var hint    = $('.card-expand-hint', card);
        var badge   = $('.card-badge', card);
        if (name)    save(name,    d.name);
        if (tagline) save(tagline, d.tagline);
        if (lesson)  save(lesson,  d.lesson);
        if (hint)    save(hint,    d.hint);
        if (badge) {
          var cls = badge.className;
          if (cls.indexOf('badge-intl') !== -1) save(badge, 'International');
          else if (cls.indexOf('badge-africa') !== -1) save(badge, 'Africa');
        }
        // Stat keys
        $$('.card-stat .k', card).forEach(function (k, i) {
          if (d.stats[i]) save(k, d.stats[i]);
        });
      });

      // Comparison table headers
      $$('.compare-table th').forEach(function (th, i) {
        var en = ['Country','Feed-in Tariff (FiT)','Net Metering','Technician Accreditation',
                  'Customs Exemption','Accessible Finance','2030 Target'];
        if (en[i]) save(th, en[i]);
      });
      // Table country names in first column
      var countryNameMap = {
        'أستراليا':'Australia','ألمانيا':'Germany','المغرب':'Morocco',
        'بنغلاديش':'Bangladesh','الأردن':'Jordan','كينيا':'Kenya',
        'رواندا':'Rwanda','نيجيريا':'Nigeria','السودان الآن':'Sudan (Current)'
      };
      $$('.compare-table td:first-child').forEach(function (td) {
        var text = td.textContent.trim();
        for (var ar in countryNameMap) {
          if (text.indexOf(ar) !== -1) {
            save(td, td.innerHTML.replace(ar, countryNameMap[ar]));
            break;
          }
        }
      });
      // Tag translations in table
      $$('.compare-table .tag').forEach(function (tag) {
        var t = tag.textContent.trim();
        var m2 = {'✓ نعم':'✓ Yes','✗ لا':'✗ No','جزئي':'Partial','✓ إلزامي':'✓ Required',
          'قيد التطوير':'In Development','✓ KfW':'✓ KfW','✓ IDCOL':'✓ IDCOL',
          'قديم':'Outdated','محدود':'Limited','✓ PAYG':'✓ PAYG','✗ ضعيف':'✗ Weak',
          '✗ غائب':'✗ Absent','✗ رسوم عالية':'✗ High Tariffs'};
        if (m2[t]) save(tag, m2[t]);
      });
      // 2030 goals in last column
      $$('.compare-table td:last-child').forEach(function (td) {
        var m3 = {'٨٢٪ متجددة':'82% renewable','٨٠٪ متجددة':'80% renewable',
          '٥٢٪ متجددة':'52% renewable','٤٠٪ متجددة':'40% renewable',
          '٣١٪ متجددة':'31% renewable','١٠٠٪ كهرباء':'100% electrification',
          '٣٠٪ متجددة':'30% renewable','غير محدد':'Not defined'};
        var t2 = td.textContent.trim();
        if (m3[t2]) save(td, m3[t2]);
      });

      // Sudan Roadmap
      var roadmap = $('.roadmap-section');
      if (roadmap) {
        if ((el = $('.roadmap-header h2', roadmap))) save(el, '☀ Proposed Sudan Solar Roadmap');
        if ((el = $('.roadmap-header p', roadmap)))  save(el, 'Inspired by the most successful experiences from the ten countries — phased, realistic, and implementable');
        var phases = $$('.phase-card', roadmap);
        var phaseData = [
          {num:'Phase One', years:'2025–2026', title:'Building the Foundation',
           items:['Issue national technical installation standards (Australia model)',
                  'Full customs exemption on solar equipment (Nigeria model)',
                  'Launch national technician accreditation programme (SunNile)',
                  'Net Metering pilot in Khartoum and Nile River State']},
          {num:'Phase Two', years:'2026–2028', title:'Rural Expansion',
           items:['Mini-grids programme for remote villages — Rwanda model',
                  'Accessible solar finance fund — IDCOL model',
                  'PAYG programmes in partnership with Islamic banks',
                  'Integrate technician training in technical institute curricula']},
          {num:'Phase Three', years:'2028–2030', title:'Legislation & Market',
           items:['Explicit self-sufficiency law — Morocco model',
                  'Studied feed-in tariff (FiT) for systems > 10 kWp',
                  'Independent renewable energy regulator',
                  'National target: 100,000 home systems by 2030']},
          {num:'The Vision', years:'2030+', title:'Sudan as an African Model',
           items:['National VPP grid pooling thousands of distributed systems',
                  'Solar electricity exports to neighbouring countries',
                  'Sudan as a regional solar training hub',
                  '30%+ of electricity from renewable sources']}
        ];
        phases.forEach(function (phase, i) {
          var d = phaseData[i];
          if (!d) return;
          var num   = $('.phase-num', phase);
          var years = $('.phase-years', phase);
          var title = $('.phase-title', phase);
          var items = $$('.phase-items li', phase);
          if (num)   save(num,   d.num);
          if (years) save(years, d.years);
          if (title) save(title, d.title);
          items.forEach(function (li, j) { if (d.items[j]) save(li, d.items[j]); });
        });
      }

      // Override openModal to use English data
      if (!window._origOpenModal) window._origOpenModal = window.openModal;
      var DATA_EN = {
        au: {
          heroClass:'hero-au', flag:'🇦🇺', name:'Australia',
          sub:'World #1 — More than a third of homes have solar panels',
          overview:'Australia is the world\'s number one country in residential solar adoption — <strong>more than 3.4 million homes</strong> have solar panels, representing over 34% of all homes. It reached this figure in less than 20 years thanks to a unique mix of supportive policies, strict standards, and smart financing.',
          overview2:'The defining feature of the Australian experience is that it did not wait for panel prices to fall — it <strong>injected government support</strong> in the early phase when prices were high, which created a market, accelerated industrial production globally, and helped drive prices down for everyone.',
          overview3:'<strong>The Deeper Technical Dimension:</strong> Australia proved that most challenges a grid faces when solar scales up — from real-time load balancing, to remote control, to integrating distributed systems — can be solved with software. Companies like <strong>SwitchDin</strong> (Newcastle, Australia) developed small, secure IoT gateways called "Droplets" that connect to every inverter and allow the grid to control thousands of solar systems simultaneously. The <strong>Horizon Power Smart Home Connect</strong> project — serving remote communities in Western Australia — uses these gateways to operate over 1,600 home solar systems as a single smart grid, making solar power more reliable and easier to adopt than ever before.',
          stats:[{k:'Residential solar adoption',v:'>34%'},{k:'Installed capacity (residential)',v:'>20 GW'},{k:'Current FiT rate',v:'0.06–0.12 AUD/kWh'},{k:'Installation standard',v:'AS/NZS 5033'},{k:'Accreditation body',v:'CEC'},{k:'Year started',v:'2001'}],
          timeline:[{y:'2001',t:'<strong>First pilot FiT</strong> in Queensland — a small start that ignited interest'},{y:'2009',t:'<strong>Small-scale Technology Certificates (STCs):</strong> a certificate system effectively reducing installation cost by 30–40%'},{y:'2012',t:'<strong>Clean Energy Council:</strong> mandatory accreditation for every installer — no installation without CEC Accreditation'},{y:'2016',t:'<strong>Battery storage boom:</strong> after Tesla Powerwall, the home battery market took off'},{y:'2022',t:'<strong>Virtual Power Plant:</strong> VPP projects in South Australia pooling 50,000+ homes'},{y:'2024',t:'<strong>1 in 3 Australian homes</strong> has solar panels — a world record'}],
          good:['Strict technical standards from day one built public trust','Mandatory installer accreditation raised installation quality','Government financial support in the early phase overcame the cost barrier','A large competitive market drove down prices quickly'],
          bad:['The early FiT was too high and cost the government dearly','Policy variation between states confused investors','The ageing grid struggled with excess solar generation at midday'],
          takeaway:['<strong>Mandatory installer accreditation</strong> is the fastest path to building public trust — SunNile is walking this road','<strong>Australian STCs</strong> can be adapted as direct tariff reductions in Sudan','<strong>AS/NZS 5033 standard</strong> is the basis of SunNile\'s technical standards — same philosophy','<strong>Grid technical challenges are solvable with software</strong> — smart IoT gateways (like the SwitchDin/Horizon Power model) enable thousands of distributed systems to be managed as one','The <strong>Australian VPP model</strong> is Sudan\'s 2030 goal with 100,000+ distributed systems']
        },
        de: {
          heroClass:'hero-de', flag:'🇩🇪', name:'Germany',
          sub:'Energiewende — the largest energy transition in industrial history',
          overview:'Germany is the most influential legislative experience in the history of renewable energy. The EEG law in 2000 (<strong>Erneuerbare-Energien-Gesetz</strong>) set a guaranteed feed-in tariff for 20 years, giving investors sufficient certainty to deploy capital.',
          overview2:'The result: the market exploded. Germany, which relied on coal and nuclear, now <strong>produces over 50% of its electricity from renewable sources</strong>. The lesson is not money — the lesson is legal certainty.',
          stats:[{k:'Installed solar capacity',v:'>81 GW'},{k:'First FiT rate',v:'0.57 EUR/kWh (2000)'},{k:'Tariff guarantee duration',v:'20 years'},{k:'Core legislation',v:'EEG 2000'},{k:'Renewables share',v:'>52% of electricity'},{k:'Solar jobs',v:'>40,000 jobs'}],
          timeline:[{y:'2000',t:'<strong>EEG 2000:</strong> the world\'s first comprehensive renewable energy law — guarantees purchase at a fixed price for 20 years'},{y:'2004',t:'<strong>Installation wave:</strong> German households install panels in large numbers after return is guaranteed'},{y:'2012',t:'<strong>FiT peak:</strong> Germany installs 7.5 GW in a single year — more than the entire Middle East total'},{y:'2017',t:'<strong>Tariff decline:</strong> FiT falls below 0.12 EUR after market success'},{y:'2022',t:'<strong>Ukraine war:</strong> Germany accelerates solar expansion to escape Russian gas dependency'},{y:'2024',t:'<strong>>81 GW</strong> installed solar capacity — producing 12% of national electricity'}],
          good:['20-year legal certainty attracts private investment','Guaranteed FiT removed market risk for small investors','Created a strong domestic industry and thousands of jobs','Proved that a non-tropical country can build a massive solar market'],
          bad:['The initial tariff was too high, burdening consumers','Frequent policy changes confused long-term investors','Germany did not coordinate with neighbours, causing grid problems'],
          takeaway:['<strong>One national law</strong> with a guaranteed tariff moves private investment more than any direct subsidy','<strong>20-year guarantee duration</strong> matches panel lifetime — a principle to adopt in any Sudanese legislation','<strong>Start with government buildings</strong> rather than a high tariff — proves viability without financial burden','Legal certainty > direct money — investors need confidence before returns']
        },
        ma: {
          heroClass:'hero-ma', flag:'🇲🇦', name:'Morocco',
          sub:'The most successful African model — combining large and small scale',
          overview:'Morocco is the most applicable model for Sudan geographically, climatically, and culturally. It shares similar solar irradiance (5–6 kWh/m²/day) and a portion of its population without a reliable electricity grid. The difference: <strong>clear and sustained political will</strong>.',
          overview2:'Morocco combines two strategies: large centralised projects like <strong>Noor Ouarzazate</strong> (580 MW) to supply cities, and small distributed programmes to electrify villages. This duality is exactly what Sudan needs.',
          stats:[{k:'2030 renewables target',v:'52%'},{k:'Noor Ouarzazate capacity',v:'580 MW'},{k:'Self-sufficiency law',v:'Law 13–09'},{k:'Regulator',v:'ANRE'},{k:'Customs exemption',v:'Yes — renewable equipment'},{k:'MASEN agency',v:'Dedicated to renewables'}],
          timeline:[{y:'2009',t:'<strong>Law 13-09:</strong> allows individuals and companies to produce and use solar energy — the first of its kind in Africa'},{y:'2010',t:'<strong>MASEN:</strong> establishment of a national agency dedicated to solar energy — clear administrative focus'},{y:'2016',t:'<strong>Noor 1:</strong> first phase of Noor Ouarzazate — 160 MW concentrated solar thermal'},{y:'2019',t:'<strong>Law amendment:</strong> allowing energy citizens to sell to the grid with simplified procedures'},{y:'2022',t:'<strong>ANRE:</strong> independent regulator starts operations — gives investors additional assurance'},{y:'2024',t:'Morocco is on track to become a <strong>solar electricity exporter</strong> to Europe via submarine cable'}],
          good:['Explicit self-sufficiency law removed legal ambiguity','Specialised MASEN agency made implementation faster','Combining large and small projects in one strategy','Geographic position enabling electricity exports to Europe'],
          bad:['Net Metering is still complex for small households','Accessible finance for individuals not well enough developed','Grid connection bureaucracy still a barrier'],
          takeaway:['<strong>A Sudanese MASEN:</strong> a national renewable energy agency is faster and more efficient than a general electricity ministry','<strong>A clear, simplified self-sufficiency law</strong> is the most important first legislative step','<strong>Customs exemption</strong> on solar equipment can be applied immediately by executive decree','Morocco proves that developing nations can lead the energy transition — the resources are there']
        },
        bd: {
          heroClass:'hero-bd', flag:'🇧🇩', name:'Bangladesh',
          sub:'The secret of remarkable spread: accessible payment, not technology',
          overview:'Bangladesh achieved a world record that has not been repeated: <strong>distributing more than 6 million home solar units</strong> in less than 15 years. The astonishment grows when you learn this happened in a country considered among Asia\'s poorest, with limited infrastructure.',
          overview2:'The secret is not in the technology — it is in <strong>IDCOL</strong>, which invented a financing model that makes a solar unit priced between $60 and $200 accessible to a family earning $100 per month, through very small weekly or monthly payments.',
          stats:[{k:'SHS units installed',v:'>6 million'},{k:'Direct beneficiaries',v:'>35 million people'},{k:'Implementing body',v:'IDCOL'},{k:'Finance model',v:'Accessible instalment payments'},{k:'Common unit size',v:'20–65 Watts'},{k:'Period',v:'2003–2018'}],
          timeline:[{y:'2003',t:'<strong>IDCOL launches the programme:</strong> soft loans to local organisations distributing units on instalment'},{y:'2008',t:'<strong>One million units:</strong> exceeded one million in just 5 years — faster than any projection'},{y:'2012',t:'<strong>Three million:</strong> international donors and the World Bank double funding'},{y:'2015',t:'<strong>Sustainable Energy Award:</strong> IDCOL programme wins best renewable energy programme in the world'},{y:'2018',t:'<strong>Six million:</strong> the largest off-grid solar programme in human history'},{y:'2023',t:'Focus shifts to the national grid as electrification expands — IDCOL adapts'}],
          good:['Creative finance model made solar accessible to the poor','Indirect funding through trusted local organisations rather than direct government','Dense rural distribution network for small units','Local technician training in every village'],
          bad:['Units too small (20–65 W) for air conditioning or pumps','Speed-focused rollout created quality problems','Transition from off-grid to on-grid is technically complex'],
          takeaway:['<strong>A Sudanese IDCOL fund:</strong> in partnership with Islamic banks to create a simplified finance model','<strong>Weekly/monthly payments</strong> are more effective than bank loans for rural Sudanese households','Finance before technology — Sudanese households know solar\'s value but the upfront price is the barrier','<strong>Distribution through trusted community organisations</strong> is faster than government networks in remote areas']
        },
        jo: {
          heroClass:'hero-jo', flag:'🇯🇴', name:'Jordan',
          sub:'How Net Metering turned Jordan into a successful Arab model',
          overview:'Jordan is not very different from Sudan in some challenges: water scarcity, limited traditional natural resources, and high energy prices. But it differed in one decision: <strong>it adopted Net Metering in 2012</strong> and allowed individuals and companies to inject surplus electricity into the grid and deduct it from their bill.',
          overview2:'The result: growth exceeding 50% annually for five consecutive years. Jordan proved that <strong>Net Metering is easier than FiT to start</strong> — it requires no cash payment, just a deduction right, and that is enough to move the market.',
          stats:[{k:'Net Metering law',v:'2012'},{k:'Total installed capacity',v:'>3.5 GW'},{k:'Annual growth',v:'>50% (2015–2020)'},{k:'2030 renewables target',v:'31%'},{k:'Customs exemption',v:'Yes on equipment'},{k:'Home system limit',v:'Up to 250 kWp'}],
          timeline:[{y:'2010',t:'<strong>National Energy Strategy:</strong> Jordan sets 10% renewables by 2020 as an initial target'},{y:'2012',t:'<strong>Net Metering Regulation:</strong> allows grid injection and deduction from bill'},{y:'2014',t:'<strong>Customs exemption:</strong> zero duty on imported solar equipment'},{y:'2016',t:'<strong>Real take-off:</strong> commercial companies install large systems to cut their bills'},{y:'2019',t:'<strong>Ahead of target:</strong> Jordan reaches 20% renewable energy a year ahead of schedule'},{y:'2023',t:'<strong>Raising the cap:</strong> allowing systems up to 250 kWp for factories and commercial users'}],
          good:['Net Metering is simple and immediately applicable without government spending','Customs exemption directly reduced costs','JREEEF technician accreditation raised quality','Private sector growth created thousands of jobs'],
          bad:['The grid was not ready to absorb large amounts of solar power','Delayed development of smart grid communication infrastructure','Net Metering benefits concentrated in cities and wealthier segments rather than rural areas'],
          takeaway:['<strong>Net Metering today</strong> — can be applied in Khartoum with a single ministerial decision as a first pilot','<strong>Customs exemption</strong> proved effective in Jordan — can be applied in Sudan as the first immediately actionable step','Jordan\'s model is the closest <strong>culturally, linguistically, and legally</strong> to Sudan — easy to adopt directly','Commercial businesses will be the first beneficiaries and fastest adopters — start with them']
        },
        ke: {
          heroClass:'hero-ke', flag:'🇰🇪', name:'Kenya',
          sub:'M-Kopa and Pay-As-You-Go — Africa\'s solar energy revolution',
          overview:'Kenya is the most inspiring story in African solar energy. It started with a small company called <strong>M-Kopa</strong> in 2012 with a simple idea: instead of selling a solar unit for $180 in one payment, make it payable at $0.50 per day via mobile phone. In less than 10 years, they reached <strong>over 4 million customers</strong>.',
          overview2:'The PAYG (Pay-As-You-Go) model changed the rules — the rural family that cannot afford $180 can afford $0.50 per day. And the mobile phone (widely available even in villages) became the payment, activation, and deactivation system.',
          stats:[{k:'M-Kopa customers',v:'>4 million'},{k:'National electrification rate',v:'75%'},{k:'Payment model',v:'Pay-As-You-Go'},{k:'Tool',v:'M-Pesa (Mobile Money)'},{k:'Kenya 2030 target',v:'100% electricity'},{k:'Pico-solar units',v:'>10 million'}],
          timeline:[{y:'2007',t:'<strong>M-Pesa:</strong> mobile payment system launch — which became the infrastructure for everything that followed'},{y:'2012',t:'<strong>M-Kopa launches:</strong> 8W solar unit at $0.50/day via M-Pesa — a revolutionary model'},{y:'2015',t:'<strong>Off-Grid Solar Market:</strong> Kenya becomes the largest off-grid solar market in Africa'},{y:'2018',t:'<strong>Competition:</strong> ZOLA, Azuri, SunCulture join — market expands'},{y:'2021',t:'<strong>Agriculture Solar:</strong> SunCulture launches PAYG solar pumps — a revolution for farmers'},{y:'2024',t:'Kenya <strong>exports the model</strong> to Nigeria, Ghana, Tanzania and Uganda'}],
          good:['PAYG made solar accessible to the poorest households','Mobile infrastructure (M-Pesa) already existed, accelerating adoption','A profitable sustainable business model — not dependent on government subsidy','Easy to scale and replicate in other African countries'],
          bad:['Small units (8–20W) insufficient for air conditioning or large appliances','Remote deactivation for late payment raises human rights concerns','Transition from pico-solar to full systems is slow and complex'],
          takeaway:['<strong>PAYG model in Sudanese pounds via Bankak or Fawry</strong> is immediately applicable','Mobile phones replace banks in Sudanese villages — use them as payment and activation tools','<strong>Starting with small units</strong> (lighting + phone charging) introduces households to solar and builds trust','Kenya\'s model succeeds in environments without grid electricity and without high education levels — <strong>ideal for rural Sudan</strong>']
        },
        rw: {
          heroClass:'hero-rw', flag:'🇷🇼', name:'Rwanda',
          sub:'From 2% to 70% electrification in 15 years — a story of political will',
          overview:'Rwanda in 2009: electrification rate of just 2% — among the lowest in the world. Rwanda in 2024: <strong>over 70% of households have electricity</strong>, with thousands of homes added every month. This transformation did not happen because of oil wealth or massive aid — but because of <strong>a clear national plan and iron political will</strong>.',
          overview2:'Rwanda proved that a small, poor country can achieve what a large giant cannot — provided there is leadership that believes in the goal and a detailed implementation plan with clear accountability.',
          stats:[{k:'Electrification rate (2009)',v:'2%'},{k:'Electrification rate (2024)',v:'>70%'},{k:'Rural mini-grids',v:'>200 networks'},{k:'Implementing agency',v:'REG + RURA'},{k:'Economy size',v:'Smaller than Khartoum State'},{k:'2024 target',v:'100% electricity'}],
          timeline:[{y:'2009',t:'<strong>Economic Development Plan:</strong> Rwanda embeds electrification as a national priority with specific numbers and deadlines'},{y:'2011',t:'<strong>REG established:</strong> Rwanda Energy Group — implements public investment in energy'},{y:'2014',t:'<strong>Gigawatt Global:</strong> first large solar farm in Sub-Saharan Africa — 8.5 MW'},{y:'2017',t:'<strong>30% electrification:</strong> surpassing the interim target — the plan is working'},{y:'2021',t:'<strong>Solar mini-grids spread:</strong> over 200 rural networks serving remote villages'},{y:'2024',t:'<strong>70%+</strong> — what began at 2% is now a model studied in universities worldwide'}],
          good:['Real political will with clear accountability at every level','Specialised implementation agency REG with sufficient authority','Private sector involvement in implementation via PPP','Transparent data and regular progress reports to parliament'],
          bad:['Foreign financing (World Bank, AfDB) was essential — not easily replicable','Electricity in some villages is still unreliable','Electricity costs remain high for poor households despite connection'],
          takeaway:['<strong>A Sudanese national plan</strong> with numbers, deadlines, and named responsible parties — this is the difference','Rwanda is a country <strong>smaller than Khartoum State</strong> that achieved what seems impossible — Sudan is larger and richer in resources','<strong>Mini-grid networks for villages</strong> is the fastest solution for Sudan\'s remote areas — Rwanda proved it practically','Political will matters more than financing — financing comes when donors see a real plan']
        },
        ng: {
          heroClass:'hero-ng', flag:'🇳🇬', name:'Nigeria',
          sub:'Africa\'s largest economy facing exactly Sudan\'s challenges',
          overview:'Nigeria and Sudan share the same wound: <strong>more than 18 hours of daily power outages</strong> in many areas, despite having vast resources. Nigeria is an oil country — but its oil has not solved the electricity problem. This pushed it toward solar energy not as a luxury but as a necessity.',
          overview2:'In just 3 years (2020–2023), Nigeria\'s solar market grew by <strong>300%</strong>. The reason: a full customs exemption on solar equipment issued by the government in 2019. One decision unlocked a market.',
          stats:[{k:'Daily power outage hours',v:'>18 hrs/day'},{k:'Solar market growth',v:'300% (2020–2023)'},{k:'Customs exemption',v:'Zero since 2019'},{k:'Support package',v:'NESP + World Bank'},{k:'Solar vs generator cost',v:'70% cheaper'},{k:'Market potential',v:'200+ million consumers'}],
          timeline:[{y:'2017',t:'<strong>NESP:</strong> government launches Nigeria Electrification Project with World Bank funding ($550M)'},{y:'2019',t:'<strong>Customs exemption:</strong> zero duty on solar equipment — the most important decision in the sector\'s history'},{y:'2020',t:'<strong>COVID pandemic:</strong> fuel prices rose and generators stopped — demand for solar surged'},{y:'2021',t:'<strong>Mini-grids spread:</strong> 100+ private companies build rural networks with NESP support'},{y:'2022',t:'<strong>$3 billion investment:</strong> international companies enter after market stabilises'},{y:'2024',t:'Nigeria targets electrifying 25 million additional households with solar by 2030'}],
          good:['Customs exemption ignited the market without direct government spending','Huge market size attracts foreign investment','Private sector led expansion without waiting for government','Rising fuel prices made solar the natural competitor'],
          bad:['Absence of clear technical standards led to widespread quality problems','Weak technician accreditation — many installations are unsafe','Bureaucracy in obtaining financing remains a barrier'],
          takeaway:['<strong>Customs exemption</strong> is the fastest and easiest to apply in Sudan — requires only a ministerial decision','Nigeria proved that <strong>a generator is no match for solar</strong> — solar is 70% cheaper','<strong>Quality standards</strong> must precede the market — Nigeria made this mistake and Sudan can avoid it','The private sector leads when barriers are removed — the Sudanese government\'s role is removing barriers, not direct implementation']
        },
        et: {
          heroClass:'hero-et', flag:'🇪🇹', name:'Ethiopia',
          sub:'Electrifying 115 million people — Africa\'s greatest ambition',
          overview:'Ethiopia faces Africa\'s greatest electricity challenge: <strong>115 million people</strong>, over 55% without electricity. The difference from Sudan: Ethiopia chose to confront this challenge with an integrated national plan combining hydro, solar, and wind.',
          overview2:'The most applicable contribution for Sudan is Ethiopia\'s experience in <strong>integrating solar technician training into the national TVET curriculum</strong> — rather than separate programmes, training was embedded in existing infrastructure.',
          stats:[{k:'GET FiT project',v:'250 MW renewable'},{k:'SHS distributed',v:'>5 million units'},{k:'TVET solar curriculum',v:'Integrated 2016'},{k:'2025 electrification target',v:'100% of population'},{k:'Finance partners',v:'World Bank + AfDB'},{k:'Current electrification rate',v:'~45%'}],
          timeline:[{y:'2013',t:'<strong>GET FiT Ethiopia:</strong> framework to support small renewable projects with government guarantees'},{y:'2016',t:'<strong>TVET Integration:</strong> solar installation curricula integrated in 200+ national technical institutes'},{y:'2017',t:'<strong>National off-grid programme:</strong> SHS for remote villages targeting 5 million units'},{y:'2020',t:'<strong>European award:</strong> GET FiT wins best renewable programme in Africa'},{y:'2022',t:'<strong>IKEA Foundation partnership:</strong> 100,000 additional solar units for villages'},{y:'2024',t:'Ethiopia aims to become an <strong>electricity exporter</strong> to neighbours after Grand Renaissance Dam completion'}],
          good:['Integrating training in national TVET is faster and more sustainable than separate programmes','GET FiT model reduces private investment risk','Large market size attracts international financing','Diversified sources (hydro + solar + wind) achieves higher energy security'],
          bad:['Ambitious plans stalled by recurring political crises','Large external financing creates dependency','National grid remains fragile despite investment'],
          takeaway:['<strong>Integrate solar training into Sudanese technical institutes</strong> — faster than building new programmes from scratch','<strong>GET FiT model</strong> can be applied in Sudan as guarantees for private solar projects','Ethiopia proves that <strong>scale is not a barrier</strong> — Sudan is smaller and more focused in its challenges','<strong>Partnership with Sudanese universities</strong> to build TVET solar curricula on Ethiopia\'s model']
        },
        sn: {
          heroClass:'hero-sn', flag:'🇸🇳', name:'Senegal',
          sub:'The ASER programme — how villages are lit through public-private partnership',
          overview:'Senegal is neither an oil country nor a rich country — yet it managed to electrify <strong>over 300 villages with solar energy</strong> via the ASER programme launched in 2000. The model is based on a partnership between government and private sector (PPP) in financing, operations, and maintenance.',
          overview2:'What distinguishes ASER: <strong>the private company\'s responsibility does not end with installation</strong> — the operator is obligated to operate and maintain for 15–20 years, in exchange for monthly fees from users. This ensures faults are fixed because it is in the company\'s financial interest.',
          stats:[{k:'Solar-powered villages',v:'>300 villages'},{k:'Management model',v:'PPP — public-private'},{k:'Contract duration',v:'15–20 years'},{k:'Agency',v:'ASER since 2000'},{k:'Rural coverage',v:'>50%'},{k:'Payment',v:'Fixed monthly fees'}],
          timeline:[{y:'2000',t:'<strong>ASER established:</strong> Senegal\'s rural electrification agency — the first specialised agency of its kind in West Africa'},{y:'2005',t:'<strong>First PPP:</strong> government funds infrastructure, private company operates and earns from monthly fees'},{y:'2011',t:'<strong>Solar expansion:</strong> solar mini-grid projects added to existing diesel networks'},{y:'2016',t:'<strong>300 villages:</strong> interim target exceeded — model is successful and sustainable'},{y:'2020',t:'<strong>Senelec adopts solar:</strong> the national electricity company integrates solar into its large grid'},{y:'2024',t:'Senegal targets <strong>exporting surplus power</strong> to Gambia and Guinea-Bissau'}],
          good:['PPP obliges private sector to maintain for 20 years — solves the unrepaired faults problem','Model replicable in every village using the same mechanism','Low monthly fees within reach of poor households','Government bears initial risk, private sector bears operational risk'],
          bad:['Monthly fees can be a burden on the poorest households','Negotiating with private companies is complex and time-consuming','Some contracts were poorly designed and became negotiating burdens'],
          takeaway:['<strong>The Senegalese PPP model</strong> is the most appropriate for electrifying Sudanese villages — government finances, private sector operates','<strong>Mandatory maintenance contract</strong> within the installation contract — prevents the abandoned systems phenomenon common in Africa','<strong>A Sudanese ASER</strong> — a specialised rural agency independent of the electricity ministry — is the right implementation tool','Well-considered monthly fees are better than open subsidies — they make the programme self-sustainably viable']
        }
      };

      window.openModal = function (id) {
        var d = DATA_EN[id];
        if (!d) return;
        var stats = d.stats.map(function(s){ return '<div class="modal-stat"><div class="modal-stat-val">'+s.v+'</div><div class="modal-stat-key">'+s.k+'</div></div>'; }).join('');
        var tl    = d.timeline.map(function(t){ return '<div class="tl-item"><div class="tl-left"><div class="tl-year">'+t.y+'</div><div class="tl-dot"></div><div class="tl-line"></div></div><div class="tl-text">'+t.t+'</div></div>'; }).join('');
        var good  = d.good.map(function(g){ return '<li>'+g+'</li>'; }).join('');
        var bad   = d.bad.map(function(b){ return '<li>'+b+'</li>'; }).join('');
        var tak   = d.takeaway.map(function(t){ return '<li>'+t+'</li>'; }).join('');
        document.getElementById('modal-content').innerHTML =
          '<div class="modal-hero '+d.heroClass+'">' +
          '<div class="modal-hero-overlay"></div>' +
          '<div class="modal-hero-content">' +
          '<span class="modal-flag">'+d.flag+'</span>' +
          '<div class="modal-country-name">'+d.name+'</div>' +
          '<div class="modal-country-sub">'+d.sub+'</div>' +
          '</div></div>' +
          '<div class="modal-body">' +
          '<div class="modal-section"><div class="modal-section-title">Overview</div>' +
          '<p class="modal-p">'+d.overview+'</p><p class="modal-p">'+d.overview2+'</p>' +
          (d.overview3 ? '<p class="modal-p">'+d.overview3+'</p>' : '') + '</div>' +
          '<div class="modal-section"><div class="modal-section-title">Key Statistics</div>' +
          '<div class="modal-stats">'+stats+'</div></div>' +
          '<div class="modal-section"><div class="modal-section-title">Major Milestones</div>' +
          '<div class="timeline">'+tl+'</div></div>' +
          '<div class="modal-section"><div class="modal-section-title">What Worked & What Didn\'t</div>' +
          '<div class="two-col">' +
          '<div class="verdict-box verdict-good"><div class="verdict-title">✓ What Worked</div><ul class="verdict-list">'+good+'</ul></div>' +
          '<div class="verdict-box verdict-bad"><div class="verdict-title">✗ What Failed or Stumbled</div><ul class="verdict-list">'+bad+'</ul></div>' +
          '</div></div>' +
          '<div class="modal-section"><div class="sudan-takeaway">' +
          '<div class="sudan-takeaway-title">☀ What can Sudan take from this experience?</div>' +
          '<ul>'+tak+'</ul></div></div></div>';
        document.getElementById('modal-overlay').classList.add('open');
        document.body.style.overflow = 'hidden';
      };

      document.title = 'Policy Centre — SunNile';
    },

    /* ── INSTITUTE ── */
    institute: function () {
      var el;
      if ((el = $('.page-header h1'))) save(el, '🎓 Solar Technician Institute');
      if ((el = $('.page-header p')))  save(el, 'Free training across 24 units and 3 levels');
      var tabs = $$('.level-tab, .tab-btn');
      ['Beginner','Intermediate','Advanced'].forEach(function (t, i) {
        if (tabs[i]) { if (!tabs[i].hasAttribute('data-ar')) tabs[i].setAttribute('data-ar', tabs[i].textContent.trim()); tabs[i].textContent = t; }
      });
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

    /* ── ABOUT ── */
    about: function () {
      var el;
      if ((el = $('.hero-eyebrow')))   save(el, 'Who We Are');
      if ((el = $('.page-hero h1')))   save(el, 'SunNile<br>A Personal National Initiative');
      if ((el = $('.page-hero p')))    save(el,
        'A free non-profit initiative born from longing for a better homeland — Sudan has the sun, ' +
        'and we have the knowledge. We just need to give ourselves a chance.');
      if ((el = $('.founder-name')))   save(el, 'Mohammed Ahmed Magzoub Albashier');
      if ((el = $('.founder-title')))  save(el, 'Founder of SunNile');
      if ((el = $('.founder-org')))    save(el, 'Customer Success Team Lead — SwitchDin | Newcastle, Australia');
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
      $$('.founder-tags .ftag').forEach(function (t, i) {
        var en = ['Solar Energy','DER / VPP','IoT & SaaS','Electronic Engineering','Network Security','Project Management','PKI & Security','Training & Development'];
        if (en[i]) save(t, en[i]);
      });
      if ((el = $('.big-quote blockquote'))) save(el,
        '«SunNile was born from longing…<br><strong>God gave us everything.</strong><br>We just need to give ourselves a chance.»');
      if ((el = $('.big-quote cite'))) save(el, '— Mohammed Ahmed Magzoub Albashier');
      var initTitles = $$('.initiative-section .section-title');
      if (initTitles[0]) save(initTitles[0], 'Why SunNile?');
      var initSubs = $$('.initiative-section .section-sub');
      if (initSubs[0]) save(initSubs[0],
        'Sudan has one of the highest solar irradiance rates in the world — over 300 sunny days per year and generation ' +
        'potential exceeding 10 kWh/m²/day in the north. Yet millions of households suffer from frequent and worsening power cuts. ' +
        'The gap between potential and reality is not technical — it is informational, regulatory, and educational. SunNile bridges that gap.');
      $$('.pillar').forEach(function (pillar, i) {
        var d = [
          ['Free Tools for Everyone','Solar system calculator, certified inverter registry, and technical standards — everything open and free, no exceptions.'],
          ['Technician Training Institute','24 training units across 3 levels — from electrical safety to VPP system design. Free and open to all.'],
          ['National Technical Standards','Inspired by AS/NZS 5033 and adapted for the Sudanese environment — ensuring quality in every installation and safety for every household.'],
          ['International Experience, Localised','Lessons distilled from 9 countries combining European, African, and Asian experiences — written through Sudanese eyes.'],
          ['Sudan\'s Vision 2030','A realistic roadmap to make Sudan a leader in distributed solar energy within a single decade.'],
          ['Real Field Knowledge','Every piece of content comes from hands-on experience with real solar systems serving thousands of homes — not just books.']
        ][i];
        if (!d) return;
        var t = $('.pillar-title', pillar), tx = $('.pillar-text', pillar);
        if (t) save(t, d[0]);
        if (tx) save(tx, d[1]);
      });
      if (initTitles[1]) save(initTitles[1], 'Initiative Timeline');
      if (initSubs[1]) save(initSubs[1], 'How SunNile grew from an idea to a full platform');
      var tlTexts = $$('.tl-text');
      var tlEN = [
        '<strong>Start:</strong> Joining SwitchDin and working directly on the Horizon Power project — a real-world view of how software and standards turn rooftop solar from a dream into infrastructure.',
        '<strong>The Idea:</strong> Why doesn\'t Sudan — with all that sunshine — have the same information infrastructure? Work begins on the solar system calculator and technical standards.',
        '<strong>Launch:</strong> SunNile launches with the inverter registry, calculator, and initial standards. The Solar Technician Institute is added with 24 training units.',
        '<strong>Expansion:</strong> International policy centre added with 10 global case studies, the 2030 vision, and activation of partnerships with Sudanese organisations.',
        '<strong>Goal:</strong> First cohort of 100 technicians certified by SunNile — the seed of a trusted technician network across all of Sudan\'s states.'
      ];
      tlTexts.forEach(function (t, i) { if (tlEN[i]) save(t, tlEN[i]); });
      if ((el = $('.contact-section .section-title'))) save(el, 'Get in Touch');
      if ((el = $('.contact-section .section-sub')))   save(el,
        'Whether you are a technician looking to learn, a decision-maker seeking collaboration, ' +
        'or a Sudanese in the diaspora wanting to contribute — we are here.');
      $$('.contact-card').forEach(function (card, i) {
        var d = [
          ['Institutional Collaboration','Do you represent a government entity, organisation, or company that wants to partner with SunNile?','Connect via LinkedIn ↗'],
          ['Content Suggestions','Do you have feedback on the technical standards or training units? Your input improves the initiative.','Send us an Email ✉'],
          ['Contribute & Support','SunNile is a free voluntary initiative. If you want to contribute your time or expertise, our doors are open.','Join the Team ←']
        ][i];
        if (!d) return;
        var h3 = $('h3', card), p = $('p', card), a = $('a', card);
        if (h3) save(h3, d[0]);
        if (p)  save(p,  d[1]);
        if (a)  save(a,  d[2]);
      });
      document.title = 'About SunNile — Sudan\'s Rooftop Solar Initiative';
    },

    /* ── INSTALLERS ── */
    installers: function () {
      var el;
      if ((el = $('.page-header h1'))) save(el, '🔧 Certified Solar Installer Directory');
      if ((el = $('.page-header p')))  save(el, 'Find a verified, Level 2+ accredited solar installer in your state');
      if ((el = $('.pilot-badge')))    save(el, '🚀 Pilot — Khartoum | Expanding to all states soon');
      if ((el = document.getElementById('trust-1'))) save(el, 'Level 2+ accreditation from SunNile Institute');
      if ((el = document.getElementById('trust-2'))) save(el, 'Personally verified by the SunNile team');
      if ((el = document.getElementById('trust-3'))) save(el, 'Direct contact — no middleman');
      if ((el = document.getElementById('fl-state'))) save(el, 'State');
      if ((el = document.getElementById('fo-all')))   save(el, 'All States');
      if ((el = document.getElementById('fl-level'))) save(el, 'Accreditation Level');
      if ((el = document.getElementById('fo-level-all'))) save(el, 'All Levels');
      if ((el = document.getElementById('fo-l2')))    save(el, 'Level 2');
      if ((el = document.getElementById('fo-l3')))    save(el, 'Level 3');
      if ((el = document.getElementById('fl-spec')))  save(el, 'Specialty');
      if ((el = document.getElementById('fo-spec-all'))) save(el, 'All Specialties');
      if ((el = document.getElementById('fo-res')))   save(el, 'Residential');
      if ((el = document.getElementById('fo-com')))   save(el, 'Commercial');
      if ((el = document.getElementById('fo-off')))   save(el, 'Off-Grid Systems');
      if ((el = document.getElementById('fo-hyb')))   save(el, 'Hybrid Systems');
      if ((el = document.getElementById('how-title'))) save(el, 'How the Directory Works');
      if ((el = document.getElementById('how-sub')))   save(el, 'From system sizing to installation — four simple steps');
      if ((el = document.getElementById('how1-t')))    save(el, 'Size Your System');
      if ((el = document.getElementById('how1-p')))    save(el, 'Use the <a href="calculator.html" style="color:var(--amber)">SunNile Calculator</a> to find the ideal system size for your home or project');
      if ((el = document.getElementById('how2-t')))    save(el, 'Find an Installer');
      if ((el = document.getElementById('how2-p')))    save(el, 'Browse the directory and filter by state, level, or specialty to find the right technician');
      if ((el = document.getElementById('how3-t')))    save(el, 'Contact Directly');
      if ((el = document.getElementById('how3-p')))    save(el, 'Reach the technician via WhatsApp or phone — no middleman, no commission');
      if ((el = document.getElementById('how4-t')))    save(el, 'Install With Confidence');
      if ((el = document.getElementById('how4-p')))    save(el, 'Every installer in the directory holds Level 2+ accreditation from SunNile Institute');
      if ((el = document.getElementById('reg-title'))) save(el, '🔧 Are You a Certified Solar Technician?');
      if ((el = document.getElementById('reg-sub')))   save(el, 'Join the SunNile directory and connect with clients in your state — completely free during launch');
      if ((el = document.getElementById('reg-btn')))   save(el, 'Create Account & Submit Profile →');
      if ((el = document.getElementById('reg-note')))  save(el, 'Create your account, complete your profile — the SunNile team will review and publish it within 72 hours');
      document.title = 'Certified Solar Installer Directory — SunNile';
    },

    /* ── CALCULATOR installer CTA ── */

    '404': function () {
      var el;
      if ((el = $('h1'))) save(el, 'Page Not Found');
      if ((el = $('p')))  save(el,
        'The link you followed seems incorrect or the page has moved.<br>' +
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
    $$('[data-ar]').forEach(function (el) { el.innerHTML = el.getAttribute('data-ar'); });
    // restore region options
    var region = document.getElementById('region');
    if (region) {
      region.querySelectorAll('option[data-ar]').forEach(function (o) {
        o.textContent = o.getAttribute('data-ar');
      });
    }
    // restore inverter table
    var tbody = document.getElementById('inv-tbody');
    if (tbody) {
      tbody.querySelectorAll('td[data-ar]').forEach(function (td) { td.textContent = td.getAttribute('data-ar'); });
      tbody.querySelectorAll('.badge[data-ar]').forEach(function (b) { b.textContent = b.getAttribute('data-ar'); });
    }
    // restore functions
    if (window._origUpdateVPP) { window.updateVPP = window._origUpdateVPP; window._origUpdateVPP = null; }
    if (window._origOpenModal)  { window.openModal  = window._origOpenModal;  window._origOpenModal  = null; }
    // re-trigger VPP display with Arabic
    var hSlider = document.getElementById('hSlider');
    if (hSlider && window.updateVPP) window.updateVPP(hSlider.value);
    // remove EN academy note
    var note = document.getElementById('en-academy-note');
    if (note) note.remove();
    document.title = (document.querySelector('meta[property="og:title"]') || {}).content || document.title;
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
