/* ═══════════════════════════════════════════════
   Dashboard UI — Sidebar, Header, Theme
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];


  const arDict = {
    'OPERATIONS OVERVIEW': 'نظرة عامة على التشغيل',
    'OPEN ALARMS': 'التنبيهات المفتوحة',
    '1 critical &middot; 2 warning': '1 حرج &middot; 2 تحذير',
    'SYSTEMS LIVE': 'الأنظمة المباشرة',
    'all integrations healthy': 'جميع التكاملات سليمة',
    'LIVE': 'مباشر',
    'COMFORT COMPLIANCE': 'الالتزام بالراحة',
    'within target band': 'ضمن النطاق المستهدف',
    'Event Statistics': 'إحصاءات الأحداث',
    '1,204 events / 7 d': '1,204 حدث / 7 أيام',
    'Live Systems': 'الأنظمة المباشرة',
    '6/6 live': '6/6 مباشر',
    'History Charts': 'الرسوم التاريخية',
    '48 h retained': 'سجل 48 ساعة',
    'Alarms': 'التنبيهات',
    '3 open': '3 مفتوحة',
    'Water': 'المياه',
    '142 m³ today': '142 م³ اليوم',

    'ENERGY OVERVIEW': 'نظرة عامة على الطاقة',
    'CONSUMED TODAY': 'الاستهلاك اليوم',
    'forecast EOD 1,698 kWh': 'التوقع بنهاية اليوم 1,698 كيلوواط ساعة',
    'CURRENT LOAD': 'الحمل الحالي',
    '<span style="color:var(--warnTx)">▲ 22% above 71.8 kW baseline</span>': '<span style="color:var(--warnTx)">▲ 22% أعلى من الأساس 71.8</span>',
    'ENERGY COST TODAY': 'تكلفة الطاقة اليوم',
    '${t("at blended DEWA tariff")}': 'حسب تعرفة ديوا المدمجة',
    'SAME DAY LAST MONTH': 'نفس اليوم الشهر الماضي',
    '<span style="color:var(--posTx)">▼ 49.6% month-on-month</span>': '<span style="color:var(--posTx)">▼ 49.6% مقارنة بالشهر الماضي</span>',
    'Waste Prevention': 'منع الهدر',
    'AED 14.2K / mo': '14.2 ألف درهم/شهر',
    'Portfolio Benchmarking': 'مقارنة المحفظة',
    'Rank 2 of 4': 'المرتبة 2 من 4',
    'Location Based Metering': 'القياس حسب الموقع',
    '12 meters live': '12 عداد مباشر',
    'Flow and Trend Anomaly': 'شذوذ التدفق والاتجاه',
    '2 this week': '2 هذا الأسبوع',
    'Budget Overrun': 'تجاوز الميزانية',
    '+3.2% MTD': '+3.2% منذ بداية الشهر',
    'Consumption': 'الاستهلاك',
    '19.1 MWh today': '19.1 ميجاوات/اليوم',
    'Forecasting': 'التنبؤ',
    '41.8 MWh month end': '41.8 ميجاوات/نهاية الشهر',

    'ESG OVERVIEW': 'نظرة عامة على الاستدامة',
    'CO2 TODAY': 'ثاني أكسيد الكربون اليوم',
    '<span style="color:var(--posTx)">▼ 5.0% vs baseline</span>': '<span style="color:var(--posTx)">▼ 5.0% مقارنة بالأساس</span>',
    'ENERGY VS TARGET': 'الطاقة مقابل الهدف',
    'month to date': 'منذ بداية الشهر',
    'FRAMEWORKS ON TRACK': 'الأطر قيد التنفيذ',
    '<span style="color:var(--warnTx)">GRESB submission overdue</span>': '<span style="color:var(--warnTx)">تأخر تقديم GRESB</span>',
    'Target vs Actual': 'الهدف مقابل الفعلي',
    '▼ 4.1% vs target MTD': '▼ 4.1% مقابل الهدف',
    'Net Zero': 'الحياد الكربوني',
    '2040 trajectory on track': 'مسار 2040 قيد التنفيذ',
    'Utility Bill Management': 'إدارة فواتير الخدمات',
    'AED 182K this month': '182 ألف درهم هذا الشهر',
    'Reporting': 'التقارير',
    '2 reports due': 'تقريران مستحقان',

    'ASSETS OVERVIEW': 'نظرة عامة على الأصول',
    'ASSETS REGISTERED': 'الأصول المسجلة',
    'synced from Hexagon EAM': 'مزامنة من Hexagon EAM',
    'OPEN WORK ORDERS': 'أوامر العمل المفتوحة',
    'synced with Maximo': 'مزامنة مع Maximo',
    'ASSETS IN ALARM': 'الأصول في حالة إنذار',
    '1 critical: CH-2': '1 حرج: CH-2',
    'Registry': 'السجل',
    '1,240 assets': '1,240 أصل',
    'Work Orders': 'أوامر العمل',
    '380 synced': '380 متزامنة',
    'Analytics': 'التحليلات',
    '12 trends watched': 'مراقبة 12 اتجاه',
    'RFID': 'تتبع RFID',
    '96% tagged': '96% موسومة',

    'SPACES OVERVIEW': 'نظرة عامة على المساحات',
    'ZONES OCCUPIED': 'المناطق المشغولة',
    'peak 14:00–16:00': 'الذروة 14:00–16:00',
    'IEQ INDEX': 'مؤشر جودة البيئة',
    'good &middot; CO₂ within limits': 'جيد &middot; ثاني أكسيد الكربون ضمن الحدود',
    'Room Data Sheets': 'بيانات الغرف',
    '412 sheets': '412 ورقة',
    'Heat Map': 'الخريطة الحرارية',
    '2 hot zones': 'منطقتان حارتان',
    'Zone Status': 'حالة المنطقة',
    '64 / 66 normal': '64 / 66 طبيعي',
    'Thermal Comfort': 'الراحة الحرارية',
    '97.2% in band': '97.2% ضمن النطاق',
    'IEQ': 'جودة البيئة (IEQ)',
    'index 88 &middot; good': 'المؤشر 88 &middot; جيد',

    'MAINTENANCE OVERVIEW': 'نظرة عامة على الصيانة',
    'PREVENTIVE JOBS DUE': 'أعمال الصيانة المستحقة',
    'this week': 'هذا الأسبوع',
    'OVERDUE': 'متأخرة',
    'oldest 6 days': 'أقدمها 6 أيام',
    'ON-TIME COMPLETION': 'الإنجاز في الوقت',
    'Preventive Jobs': 'الأعمال الوقائية',
    '14 due this week': '14 مستحقة هذا الأسبوع',
    'Schedules': 'الجداول الزمنية',
    '38 active': '38 نشطة',
    'Status': 'الحالة',
    '92% on time MTD': '92% في الوقت الموعد',

    'SECURITY OVERVIEW': 'نظرة عامة على الأمن',
    'CAMERAS LIVE': 'الكاميرات المباشرة',
    'read-only via VMS': 'للقراءة فقط عبر VMS',
    'DOORS ONLINE': 'الأبواب المتصلة',
    'read-only via access control': 'للقراءة فقط عبر التحكم',
    'LIFE SAFETY': 'سلامة الأرواح',
    'Normal': 'طبيعي',
    'monitored, never controlled': 'مراقبة فقط، بدون تحكم',
    'CCTV': 'كاميرات المراقبة',
    '96 cameras live': '96 كاميرا مباشرة',
    'Access Control': 'التحكم بالوصول',
    '212 doors online': '212 باب متصل',
    'Life Safety': 'سلامة الأرواح',
    'Normal &middot; monitored': 'طبيعي &middot; مراقب',
    
    'AT A GLANCE': 'لمحة سريعة',
    'Operations &middot; Marsa Al Arab': 'التشغيل &middot; مرسى العرب',

    // Right panel subtitle strings
    '7-day trend and top opportunities': 'اتجاه 7 أيام وأبرز الفرص',
    'Avoidable consumption &middot; FDD + schedule analysis': 'الاستهلاك القابل للتجنب &middot; تحليل FDD والجداول',
    'Sub-view': 'عرض فرعي',
    'Module highlights': 'أبرز وحدات النظام',

    // Right panel stub text
    'shows the built pattern.': 'يعرض النمط المطوّر.',
    'Detail view in design': 'عرض التفاصيل قيد التصميم',
    'Module highlights in design': 'أبرز الوحدات قيد التصميم',
    'see': 'راجع',
    'for the built pattern.': 'للنمط المطوّر.',

    // Energy chart labels
    'Actual': 'الفعلي',
    'Baseline': 'الأساسي',
    'Excess': 'الزائد',
    'Consumption, 7 days': 'الاستهلاك، 7 أيام',
    'Baseline vs Actual': 'الأساسي مقابل الفعلي',
    'kWh / day': 'كيلوواط ساعة / يوم',
    'Hourly average load by day &middot; last 7 days': 'متوسط الحمل بالساعة يومياً &middot; آخر 7 أيام',
    'Mon': 'الاثنين',
    'Tue': 'الثلاثاء',
    'Wed': 'الأربعاء',
    'Thu': 'الخميس',
    'Fri': 'الجمعة',
    'Sat': 'السبت',
    'Sun': 'الأحد',
    'Off-hours Load Heatmap': 'خريطة الحمل خارج ساعات العمل',

    // Opportunities section
    'OPPORTUNITIES': 'الفرص',
    'WARNING': 'تحذير',
    'Create work order': 'إنشاء أمر عمل',
    'Trend': 'الاتجاه',
    'Night setback not applied, L11 west': 'تخفيض الليل غير مطبّق، الطابق 11 غرب',
    'AED 6.1K / mo': '6.1 ألف درهم/شهر',
    'Zone temperatures hold occupied setpoints overnight. Applying the night setback schedule would remove most of the off-hours load plateau visible in the heatmap.': 'تحافظ درجات حرارة المناطق على نقاط الضبط المأهولة طوال الليل. سيؤدي تطبيق جدول التخفيض الليلي إلى إزالة معظم الحمل خارج ساعات العمل.',
    'Simultaneous heat and cool, L11': 'تسخين وتبريد متزامن، الطابق 11',
    'AED 4.9K / mo': '4.9 ألف درهم/شهر',
    'AHU heating coil valve and VAV reheat coils operate against active cooling coil. Synchronizing temperature loop schedules will eliminate dual-energy waste.': 'تعمل صمامات ملف التسخين في وحدة المعالجة الهوائية وملفات إعادة التسخين ضد ملف التبريد النشط. ستقضي مزامنة جداول حلقة درجة الحرارة على هدر الطاقة المزدوج.',
    'Car park lighting on daylight hours': 'إضاءة مواقف السيارات خلال ساعات النهار',
    'AED 3.2K / mo': '3.2 ألف درهم/شهر',
    'Lighting circuits in P1\u20132 run continuously. A daylight interlock or schedule would cut roughly half of the circuit consumption.': 'تعمل دوائر الإضاءة في P1-P2 باستمرار. سيؤدي استخدام قفل ضوء النهار أو جدول زمني إلى خفض نحو نصف استهلاك الدوائر.'
  };

  function t(str) {
    const langEl = document.querySelector('.app-shell') || document.documentElement;
    if (langEl.lang === "ar") {
      return arDict[str] || str;
    }
    return str;
  }

  const modDefs = {
    operations: {
      ovEn: 'OPERATIONS OVERVIEW',
      kpis: [
        { label: 'OPEN ALARMS', v: '3', cap: '1 critical &middot; 2 warning', crit: true },
        { label: 'SYSTEMS LIVE', v: '6/6', cap: 'all integrations healthy' },
        { label: 'COMFORT COMPLIANCE', v: '97.2', unit: '%', cap: 'within target band' }
      ],
      l2: [
        { id: 'evstats', name: 'Event Statistics', val: '1,204 events / 7 d' },
        { id: 'livesys', name: 'Live Systems', val: '6/6 live' },
        { id: 'histch', name: 'History Charts', val: '48 h retained' },
        { id: 'alarms', name: 'Alarms', val: '3 open' },
        { id: 'water', name: 'Water', val: '142 m³ today' }
      ]
    },
    energy: {
      ovEn: 'ENERGY OVERVIEW',
      kpis: [
        { label: 'CONSUMED TODAY', v: '1,022', unit: 'kWh', cap: 'forecast EOD 1,698 kWh' },
        { label: 'CURRENT LOAD', v: '87.44', unit: 'kW', cap: '<span style="color:var(--warnTx)">▲ 22% above 71.8 kW baseline</span>' },
        { label: 'ENERGY COST TODAY', v: 'AED 3,940', cap: '${t("at blended DEWA tariff")}' },
        { label: 'SAME DAY LAST MONTH', v: '2,029.63', unit: 'kWh', cap: '<span style="color:var(--posTx)">▼ 49.6% month-on-month</span>' }
      ],
      l2: [
        { id: 'waste', name: 'Waste Prevention', val: 'AED 14.2K / mo' },
        { id: 'bench', name: 'Portfolio Benchmarking', val: 'Rank 2 of 4' },
        { id: 'lbm', name: 'Location Based Metering', val: '12 meters live' },
        { id: 'anom', name: 'Flow and Trend Anomaly', val: '2 this week' },
        { id: 'budget', name: 'Budget Overrun', val: '+3.2% MTD' },
        { id: 'cons', name: 'Consumption', val: '19.1 MWh today' },
        { id: 'fcst', name: 'Forecasting', val: '41.8 MWh month end' }
      ]
    },
    esg: {
      ovEn: 'ESG OVERVIEW',
      kpis: [
        { label: 'CO2 TODAY', v: '8.4', unit: 't', cap: '<span style="color:var(--posTx)">▼ 5.0% vs baseline</span>' },
        { label: 'ENERGY VS TARGET', v: '-4.1', unit: '%', cap: 'month to date' },
        { label: 'FRAMEWORKS ON TRACK', v: '3/4', cap: '<span style="color:var(--warnTx)">GRESB submission overdue</span>' }
      ],
      l2: [
        { id: 'tva', name: 'Target vs Actual', val: '▼ 4.1% vs target MTD' },
        { id: 'nz', name: 'Net Zero', val: '2040 trajectory on track' },
        { id: 'ubm', name: 'Utility Bill Management', val: 'AED 182K this month' },
        { id: 'rep', name: 'Reporting', val: '2 reports due' }
      ]
    },
    assets: {
      ovEn: 'ASSETS OVERVIEW',
      kpis: [
        { label: 'ASSETS REGISTERED', v: '1,240', cap: 'synced from Hexagon EAM' },
        { label: 'OPEN WORK ORDERS', v: '380', cap: 'synced with Maximo' },
        { label: 'ASSETS IN ALARM', v: '3', cap: '1 critical: CH-2', crit: true }
      ],
      l2: [
        { id: 'reg', name: 'Registry', val: '1,240 assets' },
        { id: 'wo', name: 'Work Orders', val: '380 synced' },
        { id: 'ana', name: 'Analytics', val: '12 trends watched' },
        { id: 'rfid', name: 'RFID', val: '96% tagged' }
      ]
    },
    spaces: {
      ovEn: 'SPACES OVERVIEW',
      kpis: [
        { label: 'COMFORT COMPLIANCE', v: '97.2', unit: '%', cap: 'within target band' },
        { label: 'ZONES OCCUPIED', v: '68', unit: '%', cap: 'peak 14:00–16:00' },
        { label: 'IEQ INDEX', v: '88', cap: 'good &middot; CO₂ within limits' }
      ],
      l2: [
        { id: 'rds', name: 'Room Data Sheets', val: '412 sheets' },
        { id: 'heat', name: 'Heat Map', val: '2 hot zones' },
        { id: 'zone', name: 'Zone Status', val: '64 / 66 normal' },
        { id: 'tc', name: 'Thermal Comfort', val: '97.2% in band' },
        { id: 'ieq', name: 'IEQ', val: 'index 88 &middot; good' }
      ]
    },
    maintenance: {
      ovEn: 'MAINTENANCE OVERVIEW',
      kpis: [
        { label: 'PREVENTIVE JOBS DUE', v: '14', cap: 'this week' },
        { label: 'OVERDUE', v: '2', cap: 'oldest 6 days', crit: true },
        { label: 'ON-TIME COMPLETION', v: '92', unit: '%', cap: 'month to date' }
      ],
      l2: [
        { id: 'pj', name: 'Preventive Jobs', val: '14 due this week' },
        { id: 'sch', name: 'Schedules', val: '38 active' },
        { id: 'stat', name: 'Status', val: '92% on time MTD' }
      ]
    },
    security: {
      ovEn: 'SECURITY OVERVIEW',
      kpis: [
        { label: 'CAMERAS LIVE', v: '96', cap: 'read-only via VMS' },
        { label: 'DOORS ONLINE', v: '212', cap: 'read-only via access control' },
        { label: 'LIFE SAFETY', v: 'Normal', cap: 'monitored, never controlled' }
      ],
      l2: [
        { id: 'cctv', name: 'CCTV', val: '96 cameras live' },
        { id: 'ac', name: 'Access Control', val: '212 doors online' },
        { id: 'ls', name: 'Life Safety', val: 'Normal &middot; monitored' }
      ]
    }
  };

  let currentModule = 'operations';
  let currentSubId = null;
  const vpOvp = $('.vp-ovp');

  renderModuleOverview('operations', null);
  renderRightPanel('operations', null);

  function renderModuleOverview(modId, activeSubId = null) {
    if (!vpOvp) return;
    const data = modDefs[modId] || modDefs.operations;
    const scrollContainer = vpOvp.querySelector('.vp-ovp-scroll');
    if (!scrollContainer) return;
    
    const titleEl = vpOvp.querySelector('.ovp-title');
    if (titleEl) titleEl.textContent = t(data.ovEn);

    const ovtabText = vpOvp.querySelector('.ovtab-text');
    if (ovtabText) ovtabText.textContent = t(data.ovEn);

    let kpiHtml = '';
    
    if (modId === 'energy') {
      kpiHtml = `
        <div>
          <div class="kpi-label">${t("CONSUMED TODAY")}</div>
          <div class="kpi-value-row">
            <span class="kpi-val">1,022</span>
            <span class="kpi-unit">kWh</span>
          </div>
          <div class="kpi-sub">
            ${t("forecast EOD 1,698 kWh")}
          </div>
        </div>
        <div>
          <div class="kpi-label">${t("CURRENT LOAD")}</div>
          <div class="kpi-value-row">
            <span class="kpi-val-lg">87.44</span>
            <span class="kpi-unit">kW</span>
            <svg class="histclock" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--warnTx)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
          </div>
          <svg viewBox="0 0 240 48" preserveAspectRatio="none" style="width: 100%; height: 44px; display: block; margin-block: 6px;">
            <path d="M0,48 L0,32 C20,38 40,24 60,30 C80,36 100,20 120,25 C140,30 160,15 180,20 C200,25 220,10 240,15 L240,48 Z" fill="var(--acc8)" stroke="none"></path>
            <path d="M0,32 C20,38 40,24 60,30 C80,36 100,20 120,25 C140,30 160,15 180,20 C200,25 220,10 240,15" fill="none" stroke="var(--acc)" stroke-width="1.5"></path>
          </svg>
          ${t("<span style=\"color:var(--warnTx)\">▲ 22% above 71.8 kW baseline</span>")}
        </div>
        <div>
          <div class="kpi-label">${t("ENERGY COST TODAY")}</div>
          <div class="kpi-value-row">
            <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:var(--t2);">AED</span>
            <span class="kpi-val">3,940</span>
          </div>
          <div class="kpi-sub">${t("at blended DEWA tariff")}</div>
        </div>
        <div>
          <div class="kpi-label">${t("SAME DAY LAST MONTH")}</div>
          <div class="kpi-value-row">
            <span class="kpi-val">2,029.63</span>
            <span class="kpi-unit">kWh</span>
          </div>
          ${t("<span style=\"color:var(--posTx)\">▼ 49.6% month-on-month</span>")}
        </div>
      `;
    } else {
      data.kpis.forEach((kpi) => {
        let capHtml = `<div class="kpi-sub">${t(kpi.cap)}</div>`;
        if (kpi.crit) {
          capHtml = `<span style="display:inline-block;margin-block-start:5px;padding:3px 8px;border-radius:4px;background:var(--warnT);border:1px solid var(--warnB);color:var(--warnTx);font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;line-height:1.5">▲ ${t(kpi.cap)}</span>`;
        } else if (kpi.cap.includes('<span')) {
          capHtml = `<div class="kpi-sub">${t(kpi.cap)}</div>`;
        }

        const valColor = kpi.crit ? 'color: var(--critTx);' : '';

        kpiHtml += `
          <div>
            <div class="kpi-label">${t(kpi.label)}</div>
            <div class="kpi-value-row" style="${valColor}">
              <span class="kpi-val">${kpi.v}</span>
              ${kpi.unit ? `<span class="kpi-unit">${kpi.unit}</span>` : ''}
            </div>
            ${capHtml}
          </div>
        `;
      });
    }

    let glanceHtml = `
      <div class="glance-section">
        <div class="glance-header">${t('AT A GLANCE')}</div>
        <div class="glance-list">
    `;
    data.l2.forEach(item => {
      const isActive = item.id === activeSubId;
      const activeClass = isActive ? 'active' : '';
      glanceHtml += `
          <button class="glance-item ${activeClass}">
            <span class="glance-name">${t(item.name)}</span>
            <span class="glance-val font-mono">${t(item.val)}</span>
            <svg class="glance-chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
          </button>
      `;
    });
    glanceHtml += `
        </div>
      </div>
    `;

    scrollContainer.innerHTML = kpiHtml + glanceHtml;
  }


  /* ── Right Panel Renderer ── */
  function renderRightPanel(modId, subId) {
    const rpContent = document.getElementById('rpContent');
    const rpTitle   = document.querySelector('.rp-title');
    const rpSub     = document.querySelector('.rp-subtitle');
    const rpBack    = document.querySelector('.rp-back');
    if (!rpContent) return;

    const isEnergyMod = modId === 'energy';
    const hasSub      = !!subId;
    const showWaste   = hasSub && subId === 'waste';
    const showStub    = hasSub && !showWaste;
    const showEnergyHome = !hasSub && isEnergyMod;
    const modLabel    = document.querySelector(`.nav-item[data-module="${modId}"] .nav-label`)?.textContent.trim() || modId;
    const subLabel    = document.querySelector(`.sub-item[data-sub="${subId}"] .sub-label`)?.textContent.trim() || subId || '';

    // Update header
    if (rpTitle) rpTitle.textContent = hasSub ? subLabel : modLabel;
    
    // Update the collapsed tab text as well
    const rpTabText = document.getElementById('rpTabText');
    if (rpTabText) rpTabText.textContent = (hasSub ? subLabel : modLabel).toUpperCase();

    if (rpSub) {
      if (showEnergyHome) {
        rpSub.textContent = t('7-day trend and top opportunities'); rpSub.style.display = '';
      } else if (showWaste) {
        rpSub.textContent = t('Avoidable consumption &middot; FDD + schedule analysis'); rpSub.style.display = '';
      } else if (showStub) {
        rpSub.textContent = t('Sub-view'); rpSub.style.display = '';
      } else {
        rpSub.textContent = t('Module highlights'); rpSub.style.display = 'none';
      }
    }
    if (rpBack) rpBack.style.display = hasSub ? 'flex' : 'none';

    // Build content HTML
    let html = '';

    if (showEnergyHome) {
      html = `
        <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
          <div style="display:flex;align-items:baseline;gap:8px;margin-block-end:10px">
            <span style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1)">${t('Consumption, 7 days')}</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t3)">${t('kWh / day')}</span>
          </div>
          <svg viewBox="0 0 330 122" style="width:100%;height:auto;display:block" role="img" aria-label="7-day consumption trend">
            <line x1="30" y1="8" x2="318" y2="8" stroke="var(--bd1)" stroke-dasharray="2 3"/>
            <line x1="30" y1="54" x2="318" y2="54" stroke="var(--bd1)" stroke-dasharray="2 3"/>
            <line x1="30" y1="100" x2="318" y2="100" stroke="var(--bd1)"/>
            <g font-family="'JetBrains Mono',monospace" font-size="8" fill="var(--t3)">
              <text x="24" y="103" text-anchor="end">0</text><text x="24" y="57" text-anchor="end">1.5k</text><text x="24" y="12" text-anchor="end">3k</text>
              <text x="30" y="114" text-anchor="middle">${t('Mon')}</text><text x="78" y="114" text-anchor="middle">${t('Tue')}</text>
              <text x="126" y="114" text-anchor="middle">${t('Wed')}</text><text x="174" y="114" text-anchor="middle">${t('Thu')}</text>
              <text x="222" y="114" text-anchor="middle">${t('Fri')}</text><text x="270" y="114" text-anchor="middle">${t('Sat')}</text>
              <text x="318" y="114" text-anchor="middle">${t('Sun')}</text>
            </g>
            <polyline points="30,20.9 78,20 126,19 174,20.6 222,16.9 270,27 318,27.9" fill="none" stroke="var(--bd2)" stroke-width="1" stroke-dasharray="4 3"/>
            <polyline points="30,23 78,16.3 126,17.4 174,22.1 222,10.9 270,27.9 318,19.7" fill="none" stroke="var(--acc)" stroke-width="1.5"/>
            <g fill="var(--acc)"><circle cx="30" cy="23" r="2"/><circle cx="78" cy="16.3" r="2"/><circle cx="126" cy="17.4" r="2"/><circle cx="174" cy="22.1" r="2"/><circle cx="222" cy="10.9" r="2"/><circle cx="270" cy="27.9" r="2"/><circle cx="318" cy="19.7" r="2"/></g>
          </svg>
          <div style="display:flex;gap:12px;margin-block-start:8px">
            <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:14px;height:2px;background:var(--acc)"></span>${t('Actual')}</span>
            <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:14px;height:0;border-block-start:2px dashed var(--bd2)"></span>${t('Baseline')}</span>
          </div>
        </div>
        <div style="font-family:var(--fH),sans-serif;font-size:10px;font-weight:600;letter-spacing:0.8px;color:var(--t2);margin-block-start:2px">${t('OPPORTUNITIES')}</div>
        ${oppRowsHtml()}
      `;
    } else if (showWaste) {
      html = `
        <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
          <div style="display:flex;align-items:baseline;gap:8px;margin-block-end:10px">
            <span style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1)">${t('Baseline vs Actual')}</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t3)">${t('kWh / day')}</span>
          </div>
          <svg viewBox="0 0 330 122" style="width:100%;height:auto;display:block" role="img" aria-label="Baseline vs actual daily consumption">
            <line x1="30" y1="8" x2="318" y2="8" stroke="var(--bd1)" stroke-dasharray="2 3"/>
            <line x1="30" y1="54" x2="318" y2="54" stroke="var(--bd1)" stroke-dasharray="2 3"/>
            <line x1="30" y1="100" x2="318" y2="100" stroke="var(--bd1)"/>
            <g font-family="'JetBrains Mono',monospace" font-size="8" fill="var(--t3)">
              <text x="24" y="103" text-anchor="end">0</text><text x="24" y="57" text-anchor="end">1.5k</text><text x="24" y="12" text-anchor="end">3k</text>
              <text x="46" y="114" text-anchor="middle">${t('Mon')}</text><text x="87" y="114" text-anchor="middle">${t('Tue')}</text>
              <text x="128" y="114" text-anchor="middle">${t('Wed')}</text><text x="169" y="114" text-anchor="middle">${t('Thu')}</text>
              <text x="210" y="114" text-anchor="middle">${t('Fri')}</text><text x="251" y="114" text-anchor="middle">${t('Sat')}</text>
              <text x="292" y="114" text-anchor="middle">${t('Sun')}</text>
            </g>
            <g fill="var(--bd2)"><rect x="34" y="20.9" width="12" height="79.1"/><rect x="75" y="20" width="12" height="80"/><rect x="116" y="19" width="12" height="81"/><rect x="157" y="20.6" width="12" height="79.4"/><rect x="198" y="16.9" width="12" height="83.1"/><rect x="239" y="27" width="12" height="73"/><rect x="280" y="27.9" width="12" height="72.1"/></g>
            <g fill="var(--btnP)"><rect x="48" y="23" width="12" height="77"/><rect x="89" y="16.3" width="12" height="83.7"/><rect x="130" y="17.4" width="12" height="82.6"/><rect x="171" y="22.1" width="12" height="77.9"/><rect x="212" y="10.9" width="12" height="89.1"/><rect x="253" y="27.9" width="12" height="72.1"/><rect x="294" y="19.7" width="12" height="80.3"/></g>
            <g fill="var(--warn)"><rect x="89" y="16.3" width="12" height="3.7"/><rect x="130" y="17.4" width="12" height="1.6"/><rect x="212" y="10.9" width="12" height="6"/><rect x="294" y="19.7" width="12" height="8.2"/></g>
          </svg>
          <div style="display:flex;gap:12px;margin-block-start:8px">
            <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:10px;height:10px;border-radius:2px;background:var(--bd2)"></span>${t('Baseline')}</span>
            <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:10px;height:10px;border-radius:2px;background:var(--btnP)"></span>${t('Actual')}</span>
            <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:10px;height:10px;border-radius:2px;background:var(--warn)"></span>${t('Excess')}</span>
          </div>
        </div>
        <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
          <div style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1);margin-block-end:10px">${t('Off-hours Load Heatmap')}</div>
          ${heatmapHtml()}
          <div style="font-size:10.5px;color:var(--t3);margin-block-start:8px">${t('Hourly average load by day &middot; last 7 days')}</div>
        </div>
        <div style="font-family:var(--fH),sans-serif;font-size:10px;font-weight:600;letter-spacing:0.8px;color:var(--t2);margin-block-start:2px">${t('OPPORTUNITIES')}</div>
        ${oppRowsHtml()}
      `;
    } else if (showStub) {
      html = `<div style="padding:26px 14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;line-height:1.5;color:var(--t3)">${t('Detail view in design')} — ${t('see')} ${modLabel ? modLabel + ' › ' : ''}${subLabel} ${t('for the built pattern.')}</div>`;
    } else {
      // Non-energy module home — stub
      html = `<div style="padding:26px 14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;line-height:1.5;color:var(--t3)">${t('Module highlights in design')} — ${modLabel} ${t('shows the built pattern.')}</div>`;
    }

    rpContent.innerHTML = html;
  }

  let openOppIndex = null;

  function oppRowsHtml() {
    const opps = [
      {
        title: 'Night setback not applied, L11 west',
        aed: 'AED 6.1K / mo',
        desc: 'Zone temperatures hold occupied setpoints overnight. Applying the night setback schedule would remove most of the off-hours load plateau visible in the heatmap.'
      },
      {
        title: 'Simultaneous heat and cool, L11',
        aed: 'AED 4.9K / mo',
        desc: 'AHU heating coil valve and VAV reheat coils operate against active cooling coil. Synchronizing temperature loop schedules will eliminate dual-energy waste.'
      },
      {
        title: 'Car park lighting on daylight hours',
        aed: 'AED 3.2K / mo',
        desc: 'Lighting circuits in P1\u20132 run continuously. A daylight interlock or schedule would cut roughly half of the circuit consumption.'
      }
    ];

    return opps.map((o, i) => {
      const isOpen = openOppIndex === i;
      const chevronTransform = isOpen ? 'rotate(90deg)' : 'none';
      const bodyHtml = isOpen ? `
        <div class="opp-body">
          <p style="margin:0;font-size:12px;line-height:1.5;color:var(--t2)">${t(o.desc)}</p>
          <div style="display:flex;gap:8px">
            <button style="flex:1;padding:7px 10px;border-radius:6px;background:transparent;border:1px solid var(--bd2);color:var(--t1);font-size:12px;font-weight:500;cursor:pointer" onmouseover="this.style.background='var(--s3)'" onmouseout="this.style.background='transparent'">${t('Create work order')}</button>
            <button style="flex:none;padding:7px 16px;border-radius:6px;background:var(--btnP);border:1px solid transparent;color:var(--btnPfg);font-size:12px;font-weight:500;cursor:pointer" onmouseover="this.style.filter='brightness(.94)'" onmouseout="this.style.filter='none'">${t('Trend')}</button>
          </div>
        </div>
      ` : '';

      return `
        <article style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;overflow:hidden">
          <button class="opp-btn" data-opp-index="${i}" style="display:flex;align-items:center;gap:8px;width:100%;padding:11px 13px;background:transparent;border:none;cursor:pointer;text-align:start" onmouseover="this.style.background='var(--s3)'" onmouseout="this.style.background='transparent'">
            <span style="flex:none;padding:2px 7px;border-radius:4px;background:var(--warnT);border:1px solid var(--warnB);color:var(--warnTx);font-family:var(--fH),sans-serif;font-size:9.5px;font-weight:600;letter-spacing:1px">${t('WARNING')}</span>
            <span style="flex:1;min-width:0;font-family:var(--fH),sans-serif;font-size:12px;font-weight:500;color:var(--t1)">${t(o.title)}</span>
            <span style="flex:none;font-family:'JetBrains Mono',monospace;font-size:11.5px;font-weight:600;color:var(--t1)">${t(o.aed)}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none;color:var(--t3);transform:${chevronTransform};transition:transform 0.2s ease"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          ${bodyHtml}
        </article>
      `;
    }).join('');
  }

  function heatmapHtml() {
    const days = [t('Mon'),t('Tue'),t('Wed'),t('Thu'),t('Fri'),t('Sat'),t('Sun')];
    const intensity = [
      [0.3,0.3,0.3,0.3,0.6,0.7,0.8,0.8,0.6,0.5,0.5,0.6,0.6,0.5,0.5,0.5,0.6,0.7,0.7,0.6,0.5,0.4,0.3,0.3],
      [0.3,0.3,0.3,0.3,0.6,0.7,0.8,0.8,0.6,0.5,0.5,0.6,0.6,0.5,0.5,0.5,0.6,0.9,0.8,0.6,0.5,0.4,0.3,0.3],
      [0.3,0.3,0.3,0.3,0.6,0.7,0.8,0.8,0.6,0.5,0.5,0.6,0.6,0.5,0.5,0.5,0.6,0.7,0.7,0.6,0.5,0.4,0.3,0.3],
      [0.3,0.3,0.3,0.3,0.6,0.7,0.8,0.8,0.6,0.5,0.5,0.6,0.6,0.5,0.5,0.5,0.6,0.8,0.7,0.6,0.5,0.4,0.3,0.3],
      [0.3,0.3,0.3,0.3,0.6,0.7,0.9,0.8,0.6,0.5,0.5,0.6,0.6,0.5,0.5,0.5,0.6,0.7,0.8,0.6,0.5,0.4,0.3,0.3],
      [0.3,0.3,0.3,0.3,0.4,0.4,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.3,0.3,0.3,0.3],
      [0.3,0.3,0.3,0.3,0.4,0.4,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.3,0.3,0.3,0.3]
    ];
    const bgFor = v => v >= 0.58 ? 'var(--btnP)' : (v >= 0.4 ? 'color-mix(in srgb, var(--btnP) 50%, var(--s3))' : 'var(--s3)');
    let rows = days.map((d, i) => {
      const cells = intensity[i].map(v => `<span style="display:block;aspect-ratio:1;border-radius:2px;background:${bgFor(v)}"></span>`).join('');
      return `<div style="display:grid;grid-template-columns:30px repeat(24,1fr);gap:2px;margin-block-end:2px;align-items:center;direction:ltr"><span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3)">${d}</span>${cells}</div>`;
    }).join('');
    return rows + `<div style="display:flex;justify-content:space-between;margin-inline-start:32px;font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);direction:ltr"><span>00</span><span>06</span><span>12</span><span>18</span><span>23</span></div>`;
  }

  /* ── Live Clock ── */
  function tickClock() {
    const el = $('#liveClock');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ── Theme Toggle ── */
  const html = document.querySelector('.app-shell') || document.documentElement;
  const themeBtn = $('#themeToggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = html.dataset.theme !== 'light';
      html.classList.add('tfade');
      html.dataset.theme = isDark ? 'light' : 'dark';
      setTimeout(() => html.classList.remove('tfade'), 350);
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      themeBtn?.click();
    }
  });

  /* ── Sidebar Collapse ── */
  const collapseBtn = $('#collapseBtn');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      const isMin = html.dataset.nav === 'min';
      html.dataset.nav = isMin ? 'max' : 'min';
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === '[') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      collapseBtn?.click();
    }
  });

  /* ── Nav Item Expand/Collapse & Accordion ── */
  function collapseAllSubsExcept(targetPanel) {
    $$('.nav-subs').forEach((panel) => {
      if (panel !== targetPanel) {
        panel.classList.add('hidden');
        const parentBtn = panel.previousElementSibling;
        const icon = parentBtn?.querySelector('.chevron-icon');
        if (icon) icon.classList.remove('open');
      }
    });
  }

  $$('.nav-item[data-module]').forEach((btn) => {
    const chevron = btn.querySelector('.nav-chevron');
    const subsPanel = btn.nextElementSibling;
    if (!subsPanel || !subsPanel.classList.contains('nav-subs')) return;

    const chevronIcon = btn.querySelector('.chevron-icon');

    // Click on chevron only toggles subs
    if (chevron) {
      chevron.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = subsPanel.classList.contains('hidden');
        if (isHidden) {
          collapseAllSubsExcept(subsPanel);
        }
        subsPanel.classList.toggle('hidden', !isHidden);
        if (chevronIcon) chevronIcon.classList.toggle('open', isHidden);
      });
    }

    // Hover flyout logic when nav is collapsed
    let flyoutTimer;
    btn.addEventListener('mouseenter', () => {
      if (html.dataset.nav !== 'min') return;
      const rect = btn.getBoundingClientRect();
      subsPanel.style.top = rect.top + 'px';
      subsPanel.classList.add('flyout-active');

      if (!subsPanel.querySelector('.flyout-title')) {
        const title = document.createElement('div');
        title.className = 'flyout-title';
        const lbl = btn.querySelector('.nav-label');
        title.textContent = lbl ? lbl.textContent : '';
        subsPanel.insertBefore(title, subsPanel.firstChild);
      }
    });

    btn.addEventListener('mouseleave', () => {
      if (html.dataset.nav !== 'min') return;
      flyoutTimer = setTimeout(() => {
        subsPanel.classList.remove('flyout-active');
      }, 150);
    });

    subsPanel.addEventListener('mouseenter', () => {
      clearTimeout(flyoutTimer);
    });

    subsPanel.addEventListener('mouseleave', () => {
      if (html.dataset.nav !== 'min') return;
      subsPanel.classList.remove('flyout-active');
    });

    // Click on nav item itself sets active + expands section + clears sub-item highlights
    btn.addEventListener('click', (e) => {
      if (chevron && chevron.contains(e.target)) return;

      // Remove active from all nav items AND sub-items
      $$('.nav-item.active').forEach((el) => el.classList.remove('active'));
      $$('.sub-item.active').forEach((el) => el.classList.remove('active'));

      btn.classList.add('active');

      // Accordion: collapse all other sections
      collapseAllSubsExcept(subsPanel);

      // Expand this module's subs
      subsPanel.classList.remove('hidden');
      if (chevronIcon) chevronIcon.classList.add('open');
    });

    // Initialize: if active, ensure chevron is open
    if (btn.classList.contains('active') && chevronIcon) {
      chevronIcon.classList.add('open');
    }
  });

  /* ── Sub-item active (sidebar) ── */
  $$('.sub-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.sub-item.active').forEach((el) => el.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ── Glance-item click (event delegation, since rendered dynamically) ── */
  if (vpOvp) {
    vpOvp.addEventListener('click', (e) => {
      const glanceBtn = e.target.closest('.glance-item');
      if (!glanceBtn) return;

      // Find the index of this glance item in the list
      const allItems = vpOvp.querySelectorAll('.glance-item');
      const idx = [...allItems].indexOf(glanceBtn);

      // Get l2 list for current module to resolve subId
      const data = modDefs[currentModule];
      if (!data || !data.l2[idx]) return;
      const subId = data.l2[idx].id;
      const subLabel = data.l2[idx].name;

      // Re-render with this subId highlighted
      currentSubId = subId;
      renderModuleOverview(currentModule, subId);

      // Also highlight matching sidebar sub-item
      $$('.sub-item').forEach(si => si.classList.remove('active'));
      const matchingSub = document.querySelector(`.sub-item[data-sub="${subId}"]`);
      if (matchingSub) matchingSub.classList.add('active');

      // Update breadcrumb
      const parentLabel = document.querySelector(`.nav-item[data-module="${currentModule}"] .nav-label`)?.textContent.trim() || '';
      if (crumbModule) {
        crumbModule.innerHTML = `<span style="color: var(--t2);">${parentLabel}</span><span style="color: var(--t3); margin: 0 4px;">/</span><span style="color: var(--t2);">${subLabel}</span>`;
      }
      
      // Update Right Panel via renderRightPanel
      renderRightPanel(currentModule, subId);
    });
  }

  /* ── Property Switcher Dropdown ── */
  const propSwitcher = $('#propSwitcher');
  const propMenu = $('#propMenu');
  if (propSwitcher && propMenu) {
    propSwitcher.addEventListener('click', () => {
      const isOpen = propMenu.classList.contains('open');
      propMenu.classList.toggle('open', !isOpen);
      propSwitcher.setAttribute('aria-expanded', !isOpen);
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!propSwitcher.contains(e.target) && !propMenu.contains(e.target)) {
        propMenu.classList.remove('open');
        propSwitcher.setAttribute('aria-expanded', 'false');
      }
    });
    // Property item selection
    $$('.dropdown-item[data-key]', propMenu).forEach((item) => {
      item.addEventListener('click', () => {
        $$('.dropdown-item.active', propMenu).forEach((el) => el.classList.remove('active'));
        item.classList.add('active');
        const name = item.querySelector('span')?.textContent || '';
        const crumbName = $('#crumbName');
        if (crumbName) crumbName.textContent = name;
        propMenu.classList.remove('open');
        propSwitcher.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Language Toggle ── */
  $$('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.lang-btn').forEach((el) => el.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.dataset.lang;
      html.lang = lang;
      html.dir = lang === 'ar' ? 'rtl' : 'ltr';
      
      if (typeof window.updateTranslations === 'function') {
        window.updateTranslations(lang);
      }
      
      renderModuleOverview(currentModule, currentSubId);
      renderRightPanel(currentModule, currentSubId);
      if (typeof updateTimelineLang === 'function') updateTimelineLang();

    });
  });

  /* ── Hotspot Interactivity ── */
  const hsPins = $$('.hs-pin');
  const hsDialogs = $$('.hs-dialog');

  function closeAllDialogs() {
    hsDialogs.forEach(dialog => dialog.hidden = true);
    hsPins.forEach(pin => {
      const btn = pin.querySelector('.hs-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  hsPins.forEach(pin => {
    const targetId = pin.dataset.target;
    const dialog = targetId ? $(`#${targetId}`) : null;
    const btn = pin.querySelector('.hs-btn');

    if (btn && dialog) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dialog.hidden;
        closeAllDialogs();
        if (isHidden) {
          dialog.hidden = false;
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  $$('.hs-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDialogs();
    });
  });

  // Close when clicking outside of any hotspot or dialog
  document.addEventListener('click', (e) => {
    const oppBtn = e.target.closest('.opp-btn');
    if (oppBtn) {
      const idx = parseInt(oppBtn.getAttribute('data-opp-index'), 10);
      openOppIndex = (openOppIndex === idx) ? null : idx;
      renderRightPanel(currentModule, currentSubId);
      return;
    }

    const isClickInside = e.target.closest('.hs-pin') || e.target.closest('.hs-dialog');
    if (!isClickInside) {
      closeAllDialogs();
    }
  });

  /* ── Scrubbar Interactive Timeline ── */
  const scrubLiveBtn    = $('#scrubLiveBtn');
  const scrubHistBtn    = $('#scrubHistBtn');
  const scrubPrevBtn    = $('#scrubPrevBtn');
  const scrubNextBtn    = $('#scrubNextBtn');
  const scrubSvgArea    = $('#scrubArea');
  const scrubSvgLine    = $('#scrubLine');
  const scrubEventsEl   = $('#scrubEventsEl');
  const scrubCursorLine = $('#scrubCursorLine');
  const scrubCursorLabel= $('#scrubCursorLabel');
  const scrubTicksEl    = $('#scrubTicksEl');
  const scrubGhost      = $('#scrubGhost');
  const scrubGhostLabel = $('#scrubGhostLabel');
  const scrubTimeline   = $('#scrubTimeline');
  const scrubStatusMode = $('#scrubStatusMode');
  const scrubStatusTime = $('#scrubStatusTime');
  const histBanner      = $('.vp-histbanner');
  const histBannerBack  = $('#histBannerBack');
  const histBannerTime  = $('#histBannerTime');
  const histClocks      = $$('.histclock');
  const vpCaption       = $('.vp-caption');

  // ── Timeline data model ──────────────────────────────────────────────────
  // SVG viewBox is 480×34. x=0 is 48h ago, x=480 is now.
  // y range: 2..32 (line stays 2px from top, 2px from bottom of 34px box)
  const TOTAL_HOURS = 48;
  const SVG_W = 480, SVG_H = 34;
  const CHART_TOP = 2, CHART_BTM = 32; // line lives between y=2 and y=32

  // Build a 193-sample energy waveform in SVG coords (y in 2..32)
  const SERIES = (() => {
    const n = 193;
    const arr = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      // multi-frequency sine = realistic load curve
      const v = 0.5
        + 0.28 * Math.sin(t * Math.PI * 2.8 + 0.4)
        + 0.12 * Math.sin(t * Math.PI * 9.1 + 1.2)
        + 0.07 * Math.sin(t * Math.PI * 17 + 2.0);
      arr.push(v); // 0..1
    }
    return arr;
  })();
  const VMIN = Math.min(...SERIES), VMAX = Math.max(...SERIES);

  // Given a fractional position f (0=left/oldest, 1=right/now), return SVG y
  function seriesY(f) {
    const idx = Math.round(f * (SERIES.length - 1));
    const v   = SERIES[Math.max(0, Math.min(SERIES.length - 1, idx))];
    return CHART_TOP + (CHART_BTM - CHART_TOP) * (1 - (v - VMIN) / (VMAX - VMIN));
  }

  // Build SVG M…L path string
  function buildSvgPath() {
    const pts = SERIES.map((v, i) => {
      const x = (i / (SERIES.length - 1)) * SVG_W;
      const y = CHART_TOP + (CHART_BTM - CHART_TOP) * (1 - (v - VMIN) / (VMAX - VMIN));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return 'M' + pts.join(' L');
  }

  // Events: age in hours from now, sev 'warn'|'crit'
  const EVENTS = [
    { age: 47.0, sev: 'crit', tip: 'Chiller trip – L14'      },
    { age: 38.5, sev: 'warn', tip: 'AHU overcool – L08'      },
    { age: 31.0, sev: 'warn', tip: 'Schedule deviation – L3' },
    { age: 22.3, sev: 'crit', tip: 'High kW demand spike'    },
    { age: 14.8, sev: 'warn', tip: 'Pump VFD fault – Zone B' },
    { age:  7.2, sev: 'warn', tip: 'CO₂ sensor OOL – L06'   },
    { age:  2.1, sev: 'crit', tip: 'BMS comms loss – L11'    },
  ];

  let isLive    = true;
  let cursorAge = 0;
  let liveTickId= null;
  let dragActive= false;

    function updateTimelineLang() {
      if (typeof renderTicks === 'function') renderTicks();
      if (isLive) {
        if (scrubStatusMode) scrubStatusMode.textContent = t('LIVE');
      } else {
        const lbl = ageToLabel(cursorAge);
        if (scrubStatusTime) scrubStatusTime.textContent = lbl;
        if (histBannerTime) histBannerTime.textContent = lbl;
      }
    }

  // ── Render SVG paths ─────────────────────────────────────────────────────
  function renderSvg() {
    const tl = buildSvgPath();
    if (scrubSvgLine) scrubSvgLine.setAttribute('d', tl);
    if (scrubSvgArea) scrubSvgArea.setAttribute('d', `${tl} L${SVG_W},${SVG_H} L0,${SVG_H} Z`);
  }

  // ── Render time ticks ────────────────────────────────────────────────────
  function renderTicks() {
    if (!scrubTicksEl) return;
    scrubTicksEl.innerHTML = '';
    const now = new Date();
    let prevDs = '';
    for (let i = 0; i <= 8; i++) {
      const ageH = 48 - 6 * i;            // i=0 → 48h ago, i=8 → now
      const dT   = new Date(now.getTime() - ageH * 3600000);
      const frac = i / 8;                  // 0=left, 1=right
      const xPct = (frac * 100).toFixed(2) + '%';
      const ds   = dT.toDateString();
      const dayL = ds !== prevDs ? t(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dT.getDay()]) : '';
      prevDs = ds;
      const hh = String(dT.getHours()).padStart(2,'0');
      const mm = String(dT.getMinutes()).padStart(2,'0');

      // tick mark
      const tick = document.createElement('span');
      tick.setAttribute('aria-hidden','true');
      tick.style.cssText = `position:absolute;left:${xPct};bottom:20px;width:1px;height:4px;background:var(--bd2);transform:translateX(-50%);`;
      scrubTicksEl.appendChild(tick);

      // time label
      const tlbl = document.createElement('span');
      tlbl.setAttribute('aria-hidden','true');
      tlbl.style.cssText = `position:absolute;left:${xPct};bottom:10px;transform:translateX(-50%);font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3);white-space:nowrap;`;
      tlbl.textContent = `${hh}:${mm}`;
      scrubTicksEl.appendChild(tlbl);

      // day label (only on day boundary)
      if (dayL) {
        const dlbl = document.createElement('span');
        dlbl.setAttribute('aria-hidden','true');
        dlbl.style.cssText = `position:absolute;left:${xPct};bottom:0;transform:translateX(-50%);font-family:'JetBrains Mono',monospace;font-size:8px;color:var(--t3);opacity:.8;white-space:nowrap;`;
        dlbl.textContent = dayL;
        scrubTicksEl.appendChild(dlbl);
      }
    }
  }

  // ── Render event dots ────────────────────────────────────────────────────
  // Each dot: left = % along timeline, top = matched y from SVG curve in *px* relative to timeline div
  // timeline div height = 56px (scrubbar height), chart SVG sits at top:2px, height:32px
  // So chart px within timeline = svgY / SVG_H * 32 + 2
  function renderEventDots() {
    if (!scrubEventsEl) return;
    scrubEventsEl.innerHTML = '';
    EVENTS.forEach((ev, i) => {
      const frac = 1 - (ev.age / TOTAL_HOURS); // 0=left(old), 1=right(now)
      const svgY = seriesY(frac);               // y within viewBox (2..32)
      const pxTop = (svgY / SVG_H) * 32 + 2;   // convert to px within 32px chart, then +2 for chart top offset
      const xPct  = (frac * 100).toFixed(2) + '%';
      const color = ev.sev === 'crit' ? 'var(--crit)' : 'var(--warn)';

      const dot = document.createElement('button');
      dot.setAttribute('aria-label', ev.tip);
      dot.setAttribute('data-ev-idx', i);
      dot.title = ev.tip;
      // width/height 12px, centered with -6px margins — exactly as in reference
      dot.style.cssText = `position:absolute;left:${xPct};top:${pxTop.toFixed(1)}px;width:12px;height:12px;margin-left:-6px;margin-top:-6px;padding:0;border-radius:50%;background:${color};border:1.5px solid var(--s1);cursor:pointer;z-index:3;pointer-events:auto;`;
      dot.addEventListener('click', () => jumpToEvent(i));
      scrubEventsEl.appendChild(dot);
    });
  }

  // ── Time helpers ─────────────────────────────────────────────────────────
  function ageToLabel(ageH) {
    const d   = new Date(Date.now() - ageH * 3600000);
    const day = t(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]);
    const hh  = String(d.getHours()).padStart(2,'0');
    const mm  = String(d.getMinutes()).padStart(2,'0');
    return `${day} ${hh}:${mm}`;
  }

  // ── Cursor ───────────────────────────────────────────────────────────────
  function setCursorPct(pct) { // pct = 0..100 (percentage of timeline width)
    if (scrubCursorLine)  { scrubCursorLine.style.display  = 'block'; scrubCursorLine.style.left  = pct + '%'; }
    if (scrubCursorLabel) { scrubCursorLabel.style.display = 'block'; scrubCursorLabel.style.left = pct + '%'; }
  }
  function setCursorAge(ageH) {
    cursorAge = Math.max(0, Math.min(TOTAL_HOURS, ageH));
    const pct  = ((1 - cursorAge / TOTAL_HOURS) * 100).toFixed(2);
    const label = ageToLabel(cursorAge);
    setCursorPct(pct);
    if (scrubCursorLabel) scrubCursorLabel.textContent = label;
  }

  // ── History mode ─────────────────────────────────────────────────────────
  function jumpToEvent(idx) {
    setCursorAge(EVENTS[idx].age);
    enterHistory(ageToLabel(EVENTS[idx].age));
  }

  function enterHistory(label) {
    isLive = false;
    html.dataset.time = 'history';
    if (scrubLiveBtn) scrubLiveBtn.classList.remove('active');
    if (scrubHistBtn) scrubHistBtn.classList.add('active');
    if (scrubStatusMode) scrubStatusMode.textContent = '';
    if (scrubStatusTime) scrubStatusTime.textContent = label;
    if (histBanner)     histBanner.style.display = 'flex';
    if (histBannerTime) histBannerTime.textContent = label;
    if (vpCaption)      vpCaption.classList.add('hidden');
    histClocks.forEach(c => c.style.display = 'inline-block');
    updateStepBtns();
    if (liveTickId) { clearInterval(liveTickId); liveTickId = null; }
  }

  function goLive() {
    isLive = true;
    cursorAge = 0;
    html.dataset.time = 'live';
    if (scrubLiveBtn)     scrubLiveBtn.classList.add('active');
    if (scrubHistBtn)     scrubHistBtn.classList.remove('active');
    if (scrubCursorLine)  scrubCursorLine.style.display  = 'none';
    if (scrubCursorLabel) scrubCursorLabel.style.display = 'none';
    if (histBanner)       histBanner.style.display = 'none';
    if (vpCaption)        vpCaption.classList.remove('hidden');
    histClocks.forEach(c => c.style.display = 'none');
    updateStepBtns();
    startLiveClock();
  }

  function startLiveClock() {
    function tick() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2,'0');
      const mm = String(now.getMinutes()).padStart(2,'0');
      if (scrubStatusMode) scrubStatusMode.textContent = t('LIVE');
      if (scrubStatusTime) scrubStatusTime.textContent = `${hh}:${mm}`;
    }
    tick();
    liveTickId = setInterval(tick, 30000);
  }

  // ── Prev / Next ───────────────────────────────────────────────────────────
  function stepPrev() {
    const older = EVENTS.filter(e => e.age > cursorAge + 0.01);
    const prev  = older.length ? older.reduce((a,b) => a.age < b.age ? a : b) : null;
    if (prev) {
      jumpToEvent(EVENTS.indexOf(prev));
    } else if (isLive) {
      // From live jump to most recent event
      const newest = EVENTS.reduce((a,b) => a.age < b.age ? a : b);
      jumpToEvent(EVENTS.indexOf(newest));
    }
    updateStepBtns();
  }

  function stepNext() {
    if (isLive) return;
    const newer = EVENTS.filter(e => e.age < cursorAge - 0.01);
    const next  = newer.length ? newer.reduce((a,b) => a.age > b.age ? a : b) : null;
    if (next) {
      jumpToEvent(EVENTS.indexOf(next));
    } else {
      goLive();
    }
    updateStepBtns();
  }

  function updateStepBtns() {
    if (!scrubPrevBtn || !scrubNextBtn) return;
    const oldestAge = Math.max(...EVENTS.map(e => e.age));
    scrubPrevBtn.disabled = !isLive && (cursorAge >= oldestAge - 0.05);
    scrubNextBtn.disabled = isLive;
  }

  // ── Mouse interactions on timeline ────────────────────────────────────────
  function fractionFromEvent(e) {
    const rect = scrubTimeline.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  }

  if (scrubTimeline) {
    scrubTimeline.addEventListener('mousemove', e => {
      const f   = fractionFromEvent(e);
      const xPct = (f * 100).toFixed(2) + '%';
      const age  = (1 - f) * TOTAL_HOURS;
      const lbl  = age < 0.3 ? t('LIVE') : ageToLabel(age);
      if (scrubGhost)      { scrubGhost.style.display = 'block';      scrubGhost.style.left      = xPct; }
      if (scrubGhostLabel) { scrubGhostLabel.style.display = 'block'; scrubGhostLabel.style.left = xPct; scrubGhostLabel.textContent = lbl; }
    });
    scrubTimeline.addEventListener('mouseleave', () => {
      if (scrubGhost)      scrubGhost.style.display      = 'none';
      if (scrubGhostLabel) scrubGhostLabel.style.display = 'none';
    });

    // drag to scrub
    scrubTimeline.addEventListener('pointerdown', e => {
      dragActive = true;
      try { scrubTimeline.setPointerCapture(e.pointerId); } catch(_) {}
      handleScrubAt(e);
    });
    scrubTimeline.addEventListener('pointermove', e => {
      if (!dragActive) return;
      handleScrubAt(e);
    });
    scrubTimeline.addEventListener('pointerup',  () => { dragActive = false; });
    scrubTimeline.addEventListener('pointercancel', () => { dragActive = false; });

    // click to jump
    scrubTimeline.addEventListener('click', e => {
      if (e.target.closest('[data-ev-idx]')) return;
      handleScrubAt(e);
    });
  }

  function handleScrubAt(e) {
    const f   = fractionFromEvent(e);
    const age = (1 - f) * TOTAL_HOURS;
    if (age < 0.3) { goLive(); return; }
    const label = ageToLabel(age);
    setCursorAge(age);
    enterHistory(label);
  }

  // ── Wire buttons ──────────────────────────────────────────────────────────
  if (scrubLiveBtn) scrubLiveBtn.addEventListener('click', goLive);
  if (scrubHistBtn) scrubHistBtn.addEventListener('click', () => { if (!isLive) return; stepPrev(); });
  if (scrubPrevBtn) scrubPrevBtn.addEventListener('click', stepPrev);
  if (scrubNextBtn) scrubNextBtn.addEventListener('click', stepNext);
  if (histBannerBack) histBannerBack.addEventListener('click', e => { e.preventDefault(); goLive(); });

  // ── Init ─────────────────────────────────────────────────────────────────
  function initScrubbar() {
    renderSvg();
    renderTicks();
    renderEventDots();
    goLive();
  }
  initScrubbar();
  window.addEventListener('resize', () => { renderTicks(); renderEventDots(); });




  /* ── Update Right Panel & Breadcrumbs on Nav Click ── */
  const rpTitle = $('.rp-title');
  const rpCard = $('.rp-card');
  const rpSubtitle = $('.rp-subtitle');
  const rpHeader = $('.rp-header');
  const crumbModule = $('#crumbModule');
  const rpBackBtn = rpHeader ? rpHeader.querySelector('.rp-back') : null;

  // Right Panel & Overlay Actions
  const ovpHeader = $('.ovp-close-btn');
  const ovpTabBtn = $('#ovpTabBtn');
  
  if (vpOvp) {
    const togglePanel = () => {
      vpOvp.classList.toggle('collapsed');
    };
    if (ovpHeader) ovpHeader.addEventListener('click', togglePanel);
    if (ovpTabBtn) ovpTabBtn.addEventListener('click', togglePanel);
  }

  if (rpBackBtn) {
    rpBackBtn.addEventListener('click', () => {
      // Return to current active main module
      const activeNav = $('.nav-item.active');
      if (activeNav) {
        activeNav.click();
      } else {
        const opsNav = $('.nav-item[data-module="operations"]');
        if (opsNav) opsNav.click();
      }
      // Remove sub-item active highlights
      $$('.sub-item.active').forEach(el => el.classList.remove('active'));
    });
  }

  /* ── Right Panel Collapse / Expand ── */
  const rightPanel    = $('#rightPanel');
  const rpCollapseBtn = $('#rpCollapseBtn');
  const rpOpenTab     = $('#rpOpenTab');

  function collapseRightPanel() {
    if (!rightPanel) return;
    rightPanel.setAttribute('data-rp', 'min');
    rightPanel.classList.add('collapsed');
  }

  function expandRightPanel() {
    if (!rightPanel) return;
    rightPanel.setAttribute('data-rp', 'max');
    rightPanel.classList.remove('collapsed');
  }

  if (rpCollapseBtn) rpCollapseBtn.addEventListener('click', collapseRightPanel);
  if (rpOpenTab)     rpOpenTab.addEventListener('click',     expandRightPanel);

  // ] key shortcut to toggle right panel
  document.addEventListener('keydown', (e) => {
    if (e.key === ']') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (rightPanel?.getAttribute('data-rp') === 'min') expandRightPanel();
      else collapseRightPanel();
    }
  });

  /* ── Right Panel Resize (drag inner edge, LTR + RTL) ── */
  const rpResizer = $('#rpResizer');
  const RP_NORMAL_W = 378;

  function setRightPanelWidth(w) {
    rightPanel.style.width = w + 'px';
    rightPanel.style.setProperty('--rp-w', w + 'px');
  }

  if (rpResizer && rightPanel) {
    let dragStartX = 0, dragStartW = 0, dragRtl = false;

    const onResizeMove = (e) => {
      const delta = e.clientX - dragStartX;
      const maxW = Math.max(RP_NORMAL_W, Math.floor(window.innerWidth / 2));
      // In RTL the panel sits on the left, so dragging right grows it; in LTR the opposite
      const w = Math.min(maxW, Math.max(RP_NORMAL_W, Math.round(dragRtl ? dragStartW + delta : dragStartW - delta)));
      setRightPanelWidth(w);
    };

    const onResizeEnd = (e) => {
      rightPanel.classList.remove('resizing');
      document.body.classList.remove('rp-resizing');
      rpResizer.removeEventListener('pointermove', onResizeMove);
      rpResizer.removeEventListener('pointerup', onResizeEnd);
      rpResizer.removeEventListener('pointercancel', onResizeEnd);
      if (rpResizer.hasPointerCapture && rpResizer.hasPointerCapture(e.pointerId)) {
        rpResizer.releasePointerCapture(e.pointerId);
      }
    };

    rpResizer.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (rightPanel.classList.contains('collapsed')) return;
      e.preventDefault();
      dragRtl = getComputedStyle(html).direction === 'rtl';
      dragStartX = e.clientX;
      dragStartW = rightPanel.getBoundingClientRect().width;
      rightPanel.classList.add('resizing');
      document.body.classList.add('rp-resizing');
      rpResizer.setPointerCapture(e.pointerId);
      rpResizer.addEventListener('pointermove', onResizeMove);
      rpResizer.addEventListener('pointerup', onResizeEnd);
      rpResizer.addEventListener('pointercancel', onResizeEnd);
    });

    // Double-click the edge to snap back to the normal width
    rpResizer.addEventListener('dblclick', () => setRightPanelWidth(RP_NORMAL_W));

    // Keep the half-viewport cap when the window itself shrinks
    window.addEventListener('resize', () => {
      const maxW = Math.max(RP_NORMAL_W, Math.floor(window.innerWidth / 2));
      if (rightPanel.getBoundingClientRect().width > maxW) setRightPanelWidth(maxW);
    });
  }

  /* ── Viewer Toolbar (tools, floors flyout, caption) ── */
  const toolBtns   = $$('.vp-toolbar .tool-btn');
  const floorsBtn  = $('.vp-toolbar .tool-btn[data-tool="floors"]');
  const floorsMenu = $('#vpFloorsMenu');
  // reuses the existing `vpCaption` element reference declared above
  const FLOORS = ['ALL', 'Roof', 'L12', 'L11', 'L10', 'L9', 'L8', 'L7', 'L6', 'L5', 'L4', 'L3', 'L2', 'L1', 'G', 'B1'];
  const VP_CAPTION_TXT = {
    en: { site: 'MARSA AL ARAB', model: 'LIVE MODEL', all: 'ALL FLOORS' },
    ar: { site: 'مرسى العرب', model: 'نموذج مباشر', all: 'كل الطوابق' },
  };
  let currentTool = 'select';
  let currentFloor = 'ALL';

  if (toolBtns.length) {
    const capLang = () => VP_CAPTION_TXT[html.lang === 'ar' ? 'ar' : 'en'];

    function updateVpCaption() {
      if (!vpCaption) return;
      const c = capLang();
      const floorLabel = currentFloor === 'ALL' ? c.all : currentFloor;
      // Longest variant first; drop the site, then the model, when the viewer
      // is too narrow (e.g. right panel dragged wide) to avoid covering the
      // overview panel
      const variants = [
        c.site + ' &middot; ' + c.model + ' &middot; ' + floorLabel,
        c.model + ' &middot; ' + floorLabel,
        floorLabel,
      ];
      const wrap = vpCaption.closest('.vp-wrapper');
      const ovp = $('.vp-ovp');
      const ovpW = ovp ? (ovp.classList.contains('collapsed') ? 40 : ovp.getBoundingClientRect().width) : 0;
      const avail = wrap ? wrap.clientWidth - ovpW - 66 - 16 : Infinity;
      for (const v of variants) {
        vpCaption.innerHTML = v;
        if (vpCaption.offsetWidth <= avail) break;
      }
    }

    // Re-fit the caption when the viewer resizes (panel drag, window resize)
    // or the overview panel collapses/expands
    const vpWrapEl = vpCaption && vpCaption.closest('.vp-wrapper');
    if (vpWrapEl && window.ResizeObserver) {
      new ResizeObserver(() => updateVpCaption()).observe(vpWrapEl);
    }
    const vpOvpEl = $('.vp-ovp');
    if (vpOvpEl && window.MutationObserver) {
      new MutationObserver(() => updateVpCaption())
        .observe(vpOvpEl, { attributes: true, attributeFilter: ['class'] });
    }

    function syncToolActive() {
      toolBtns.forEach((b) => b.classList.toggle('active', b.dataset.tool === currentTool));
    }

    function closeFloorsMenu() {
      if (!floorsMenu || floorsMenu.hidden) return;
      floorsMenu.hidden = true;
      if (floorsBtn) floorsBtn.setAttribute('aria-expanded', 'false');
      syncToolActive();
    }

    function openFloorsMenu() {
      if (!floorsMenu) return;
      floorsMenu.innerHTML = '';
      FLOORS.forEach((f) => {
        const b = document.createElement('button');
        b.className = 'floor-item' + (f === currentFloor ? ' active' : '');
        b.setAttribute('role', 'menuitem');
        b.textContent = f === 'ALL' ? capLang().all : f;
        b.addEventListener('click', () => {
          currentFloor = f;
          closeFloorsMenu();
          updateVpCaption();
        });
        floorsMenu.appendChild(b);
      });
      floorsMenu.hidden = false;
      if (floorsBtn) floorsBtn.setAttribute('aria-expanded', 'true');
      toolBtns.forEach((b) => b.classList.toggle('active', b === floorsBtn));
    }

    function activateTool(tool) {
      if (tool === 'floors') {
        if (floorsMenu && floorsMenu.hidden) openFloorsMenu();
        else closeFloorsMenu();
        return;
      }
      closeFloorsMenu();
      if (tool === 'reset') {
        currentFloor = 'ALL';
        updateVpCaption();
        tool = 'select';
      }
      currentTool = tool;
      syncToolActive();
    }

    toolBtns.forEach((b) => b.addEventListener('click', () => activateTool(b.dataset.tool)));

    document.addEventListener('click', (e) => {
      if (floorsMenu && !floorsMenu.hidden &&
          !e.target.closest('.vp-floors-menu, .tool-btn[data-tool="floors"]')) {
        closeFloorsMenu();
      }
    });

    // V / S / F / W / M / R shortcuts (advertised in the tooltips)
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') { closeFloorsMenu(); return; }
      const map = { v: 'select', s: 'slice', f: 'floors', w: 'walk', m: 'measure', r: 'reset' };
      const tool = map[e.key.toLowerCase()];
      if (tool) activateTool(tool);
    });

    // The language toggle resets the caption via data-i18n; re-apply the selected floor after it
    $$('.lang-btn').forEach((btn) => btn.addEventListener('click', updateVpCaption));
  }

  /* ── Search Palette (Ctrl+K) ── */
  const palOverlay = $('#palOverlay');
  const palDialog  = $('#palDialog');
  const palInput   = $('#palInput');
  const palBody    = $('#palBody');
  const searchBtn  = $('#searchBtn');

  /* ── Reports Library ── */
  const reportsPanel = $('#reportsPanel');
  const reportsBtn   = $('#reportsBtn');
  const reportsClose = $('#reportsClose');

  function closeReports() {
    if (!reportsPanel || reportsPanel.hidden) return;
    reportsPanel.hidden = true;
    if (reportsBtn) reportsBtn.setAttribute('aria-expanded', 'false');
  }

  function openReports() {
    if (!reportsPanel) return;
    reportsPanel.hidden = false;
    if (reportsBtn) reportsBtn.setAttribute('aria-expanded', 'true');
  }

  if (palDialog && palInput && palBody) {
    const PAL_IC = {
      asset: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
      fault: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01',
      wo:    'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
      doc:   'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v5h5',
      page:  'M3 3h18v18H3zM3 9h18M9 21V9',
      zap:   'M13 2 3 14h9l-1 8 10-12h-9l1-8',
      clock: 'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    };
    let palSel = 0;
    let palRows = [];
    let palGroupStarts = [];

    const palAr = () => html.lang === 'ar';
    const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    function closePal() {
      if (palOverlay) palOverlay.hidden = true;
      palDialog.hidden = true;
    }

    function palNavTo(mod, sub) {
      closePal();
      $(`.nav-item[data-module="${mod}"]`)?.click();
      if (sub) $(`.sub-item[data-sub="${sub}"]`)?.click();
    }

    // Same demo dataset as the EKO Frame reference: recents + quick actions
    // when empty, entity groups while typing
    function palData() {
      const ar = palAr();
      const q = palInput.value.trim().toLowerCase();
      if (!q) {
        return [
          { hdr: ar ? 'الأخيرة' : 'RECENT', rows: [
            { t: 'Chiller CH-2', ctx: ar ? 'أصل · محطة القبو' : 'Asset · Basement plant', ic: 'clock', act: () => palNavTo('assets') },
            { t: 'Work order WO-2214', ctx: ar ? 'استبدال سير AHU-02 · مفتوح' : 'AHU-02 belt replacement · open', ic: 'clock', act: () => palNavTo('assets', 'wo') },
            { t: ar ? 'منع الهدر' : 'Waste Prevention', ctx: ar ? 'الطاقة' : 'Energy', ic: 'clock', act: () => palNavTo('energy', 'waste') },
          ]},
          { hdr: ar ? 'إجراءات سريعة' : 'QUICK ACTIONS', rows: [
            { t: ar ? 'إنشاء أمر عمل' : 'Create work order', ctx: '', ic: 'zap', act: () => palNavTo('assets', 'wo') },
            { t: ar ? 'إنشاء تقرير المالك' : 'Generate owner report', ctx: '', ic: 'zap', act: () => { closePal(); $('.ask-eko-bar button[data-i18n="btnReport"]')?.click(); } },
            { t: ar ? 'الانتقال إلى المحفظة' : 'Go to Portfolio', ctx: '', ic: 'zap', act: () => { closePal(); $('#propSwitcher')?.click(); } },
          ]},
        ];
      }
      const groups = [
        { hdr: ar ? 'الأصول' : 'ASSETS', rows: [
          { t: 'AHU-L12-03', ctx: ar ? 'وحدة مناولة هواء · الطابق 12 شمال' : 'Air handling unit · Level 12 north', ic: 'asset', act: () => palNavTo('assets') },
          { t: 'AHU-02', ctx: ar ? 'وحدة مناولة هواء · محطة القبو' : 'Air handling unit · Basement plant', ic: 'asset', act: () => palNavTo('assets') },
          { t: 'Chiller CH-2', ctx: ar ? 'أصل · محطة القبو' : 'Asset · Basement plant', ic: 'asset', act: () => palNavTo('assets') },
        ]},
        { hdr: ar ? 'الأعطال' : 'FAULTS', rows: [
          { t: 'AHU-L12-03 setpoint deviation', ctx: ar ? 'تحذير · نشط' : 'warning · active', ic: 'fault', act: () => palNavTo('operations', 'alarms') },
          { t: 'CH-2 condenser approach rising', ctx: ar ? 'حرج · نشط' : 'critical · active', ic: 'fault', act: () => palNavTo('operations', 'alarms') },
        ]},
        { hdr: ar ? 'أوامر العمل' : 'WORK ORDERS', rows: [
          { t: 'WO-2214 · AHU-02 belt replacement', ctx: ar ? 'مفتوح' : 'open', ic: 'wo', act: () => palNavTo('assets', 'wo') },
        ]},
        { hdr: ar ? 'المستندات' : 'DOCUMENTS', rows: [
          { t: 'AHU O&M Manual', ctx: ar ? 'PDF · الأنظمة الميكانيكية' : 'PDF · mechanical systems', ic: 'doc', act: () => palNavTo('assets', 'reg') },
        ]},
        { hdr: ar ? 'الصفحات' : 'PAGES', rows: [
          { t: ar ? 'شذوذ التدفق والاتجاه' : 'Flow and Trend Anomaly', ctx: ar ? 'الطاقة' : 'Energy', ic: 'page', act: () => palNavTo('energy', 'anom') },
          { t: ar ? 'منع الهدر' : 'Waste Prevention', ctx: ar ? 'الطاقة' : 'Energy', ic: 'page', act: () => palNavTo('energy', 'waste') },
        ]},
      ];
      return groups
        .map((g) => ({ ...g, rows: g.rows.filter((r) => (r.t + ' ' + r.ctx).toLowerCase().includes(q)) }))
        .filter((g) => g.rows.length);
    }

    function syncPalSel() {
      palRows.forEach((r, i) => r.classList.toggle('selected', i === palSel));
      if (palRows[palSel]) palRows[palSel].scrollIntoView({ block: 'nearest' });
    }

    function renderPal() {
      const q = palInput.value.trim().toLowerCase();
      const groups = palData();
      palRows = [];
      palGroupStarts = [];
      palBody.innerHTML = '';
      if (!groups.length) {
        palBody.innerHTML = `<div class="pal-empty">${palAr() ? 'لا نتائج' : 'No results'}</div>`;
        return;
      }
      groups.forEach((g) => {
        palGroupStarts.push(palRows.length);
        const hdr = document.createElement('div');
        hdr.className = 'pal-group-hdr';
        hdr.textContent = g.hdr;
        palBody.appendChild(hdr);
        g.rows.forEach((r) => {
          const m = q ? r.t.toLowerCase().indexOf(q) : -1;
          const label = m >= 0
            ? escHtml(r.t.slice(0, m)) + '<b>' + escHtml(r.t.slice(m, m + q.length)) + '</b>' + escHtml(r.t.slice(m + q.length))
            : escHtml(r.t);
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'pal-row';
          btn.innerHTML =
            `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${PAL_IC[r.ic]}"></path></svg>` +
            `<span class="pal-row-label">${label}</span>` +
            (r.ctx ? `<span class="pal-row-ctx">${escHtml(r.ctx)}</span>` : '');
          btn.addEventListener('click', r.act);
          palBody.appendChild(btn);
          palRows.push(btn);
        });
      });
      palSel = Math.max(0, Math.min(palSel, palRows.length - 1));
      syncPalSel();
    }

    function openPal() {
      closeReports();
      if (palOverlay) palOverlay.hidden = false;
      palDialog.hidden = false;
      palInput.value = '';
      palSel = 0;
      renderPal();
      setTimeout(() => palInput.focus(), 30);
    }

    if (searchBtn) searchBtn.addEventListener('click', openPal);
    if (palOverlay) palOverlay.addEventListener('click', closePal);

    palInput.addEventListener('input', () => { palSel = 0; renderPal(); });

    palInput.addEventListener('keydown', (e) => {
      const n = palRows.length;
      if (!n) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        palSel = (palSel + 1) % n;
        syncPalSel();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        palSel = (palSel - 1 + n) % n;
        syncPalSel();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const next = palGroupStarts.find((x) => x > palSel);
        palSel = next != null ? next : palGroupStarts[0] || 0;
        syncPalSel();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (palRows[palSel]) palRows[palSel].click();
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (palDialog.hidden) openPal();
        else closePal();
      } else if (e.key === 'Escape') {
        closePal();
        closeReports();
      }
    });

    // Re-render open palette when the language switches
    $$('.lang-btn').forEach((btn) => btn.addEventListener('click', () => {
      if (!palDialog.hidden) renderPal();
    }));
  }

  if (reportsBtn && reportsPanel) {
    reportsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (reportsPanel.hidden) openReports();
      else closeReports();
    });
    if (reportsClose) reportsClose.addEventListener('click', closeReports);
    document.addEventListener('click', (e) => {
      if (!reportsPanel.hidden && !e.target.closest('#reportsPanel, #reportsBtn')) closeReports();
    });
  }

  $$('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const mod = btn.getAttribute('data-module');
      const label = btn.querySelector('.nav-label')?.textContent.trim();
      if (label && !label.includes('Collapse')) {
        if (mod) {
          currentModule = mod;
          currentSubId = null;
          renderModuleOverview(mod, null);
          renderRightPanel(mod, null);
        }
        if (crumbModule) crumbModule.textContent = label;
        const ekoScope = $('#ekoChatScope');
        if (ekoScope) ekoScope.innerHTML = `${label} &middot; Marsa Al Arab`;
      }
    });
  });

  $$('.sub-item').forEach(subBtn => {
    subBtn.addEventListener('click', () => {
      const subId = subBtn.getAttribute('data-sub');
      const label = subBtn.querySelector('.sub-label')?.textContent.trim() || subBtn.textContent.trim();
      const parentNav = subBtn.closest('.nav-subs')?.previousElementSibling;
      const parentLabel = parentNav?.querySelector('.nav-label')?.textContent.trim() || '';
      const mod = parentNav?.getAttribute('data-module');

      if (mod) {
        currentModule = mod;
        currentSubId = subId;
        renderModuleOverview(mod, subId);
        renderRightPanel(mod, subId);
      }

      if (crumbModule) {
        crumbModule.innerHTML = `<span style="color: var(--t2);">${parentLabel}</span><span style="color: var(--t3); margin: 0 4px;">/</span><span style="color: var(--t2);">${label}</span>`;
      }

      const ekoScope = $('#ekoChatScope');
      if (ekoScope) ekoScope.innerHTML = `${parentLabel} &middot; Marsa Al Arab`;
    });
  });

  /* ── Ask EKO Floating Chat Window & Prompt Actions ── */
  const ekoModal = $('#ekoChatModal');
  const ekoMessages = $('#ekoChatMessages');
  const askForm = $('.askbox');
  const askInput = askForm?.querySelector('input');
  const presetBtns = $$('.ask-eko-bar button');
  let ekoStreamTimer = null;

  const ekoAnswers = {
    spike: "Afternoon load is running 23% above the 71.8 kW baseline, and roughly two-thirds of the excess traces to Chiller CH-2 &mdash; its condenser approach has been rising for 11 days, so it draws more power per ton of cooling just as afternoon demand peaks. Clearing the suspected tube fouling would recover most of it; the remainder aligns with elevated F&B tenant load between 13:00 and 16:00.",
    yesterday: "Yesterday's load peaked at 88.1 kW between 15:00 and 17:00, about 23% above the 71.8 kW baseline, and most of the excess traces to Chiller CH-2 drawing extra power as its condenser approach kept rising through the afternoon.",
    faults: "Three faults are open: CH-2 condenser approach rising (critical, AED 9,400/mo), AHU-L12-03 setpoint deviation (warning, AED 3,100/mo), and simultaneous heat/cool on L11 west (warning, AED 1,900/mo). Work orders are drafted for the first two and can be pushed to Maximo in one click.",
    report: "Drafting the July owner report: energy is tracking 6.2% under baseline month-to-date, comfort compliance is at 97.2%, and FDD has identified AED 21.7K/mo of avoidable cost &mdash; led by the CH-2 remediation plan. The PDF will appear under Reports when ready."
  };

  function getEkoAnswer(text) {
    const t = text.toLowerCase();
    if (t.includes('yesterday')) return ekoAnswers.yesterday;
    if (t.includes('fault') || t.includes('fdd')) return ekoAnswers.faults;
    if (t.includes('report')) return ekoAnswers.report;
    if (t.includes('spike') || t.includes('baseline') || t.includes('west tower')) return ekoAnswers.spike;
    return ekoAnswers.spike;
  }

  function appendEkoMessage(userText, aiText) {
    if (!ekoModal || !ekoMessages) return;

    clearInterval(ekoStreamTimer); // clear any active stream
    ekoModal.style.display = 'flex';

    // User Bubble
    const userMsgHtml = `
      <div dir="auto" style="align-self: flex-end; background: var(--s3); border: 1px solid var(--bd2); color: var(--t1); padding: 8px 14px; border-radius: 16px 16px 4px 16px; font-size: 12.5px; max-width: 85%; line-height: 1.4;">
        ${userText}
      </div>
    `;

    // AI Bubble Wrapper
    const aiWrapper = document.createElement('div');
    aiWrapper.style.cssText = "align-self: flex-start; display: flex; gap: 10px; max-width: 95%;";
    
    const iconHtml = `
      <div style="width: 22px; height: 22px; border-radius: 50%; background: var(--acc10); display: flex; align-items: center; justify-content: center; flex: none; margin-top: 2px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--acc)"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path></svg>
      </div>
    `;
    
    const textBubble = document.createElement('div');
    textBubble.setAttribute('dir', 'auto');
    textBubble.style.cssText = "font-size: 12.5px; line-height: 1.6; color: var(--t1); background: var(--s2); border: 1px solid var(--bd1); padding: 10px 14px; border-radius: 4px 16px 16px 16px;";
    
    aiWrapper.innerHTML = iconHtml;
    aiWrapper.appendChild(textBubble);

    ekoMessages.insertAdjacentHTML('beforeend', userMsgHtml);
    ekoMessages.appendChild(aiWrapper);
    ekoMessages.scrollTop = ekoMessages.scrollHeight;

    // Stream effect
    let i = 0;
    ekoStreamTimer = setInterval(() => {
      i += 3;
      const done = i >= aiText.length;
      textBubble.innerHTML = aiText.slice(0, i);
      ekoMessages.scrollTop = ekoMessages.scrollHeight;
      if (done) clearInterval(ekoStreamTimer);
    }, 14);
  }

  // Close & Clear actions using event delegation
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('#ekoCloseChat')) {
      if (ekoModal) ekoModal.style.display = 'none';
      clearInterval(ekoStreamTimer);
    }
    if (e.target.closest('#ekoClearChat')) {
      if (ekoMessages) ekoMessages.innerHTML = '';
      if (ekoModal) ekoModal.style.display = 'none';
      clearInterval(ekoStreamTimer);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ekoModal && ekoModal.style.display !== 'none') {
      ekoModal.style.display = 'none';
      clearInterval(ekoStreamTimer);
    }
  });

  // Prompt buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.textContent.trim();
      const a = getEkoAnswer(q);
      appendEkoMessage(q, a);
    });
  });

  // Form submit
  if (askForm && askInput) {
    askForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = askInput.value.trim();
      if (!q) return;
      const a = getEkoAnswer(q);
      appendEkoMessage(q, a);
      askInput.value = '';
    });
  }

  /* ── Account Menu ── */
  const userMenuBtn = $('#userMenu');
  const accountMenu = $('#accountMenu');

  function closeAccountMenu() {
    if (!accountMenu || accountMenu.hidden) return;
    accountMenu.hidden = true;
    if (userMenuBtn) userMenuBtn.setAttribute('aria-expanded', 'false');
  }

  if (userMenuBtn && accountMenu) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = accountMenu.hidden;
      accountMenu.hidden = !open;
      userMenuBtn.setAttribute('aria-expanded', String(open));
      if (open) closeReports();
    });

    document.addEventListener('click', (e) => {
      if (!accountMenu.hidden && !accountMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
        closeAccountMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAccountMenu();
    });

    // Menu items are presentational for now — just dismiss the menu
    $$('.account-item', accountMenu).forEach((item) => {
      item.addEventListener('click', closeAccountMenu);
    });
  }

  /* ── Settings View ── */
  const settingsView   = $('#settingsView');
  const settingsNavBtn = $('#settingsNavBtn');
  const vpWrapperEl    = $('.vp-wrapper');
  const crumbModuleEl  = $('#crumbModule');
  // Remember which module the breadcrumb showed so we can restore it on exit
  let crumbBeforeSettings = crumbModuleEl ? crumbModuleEl.getAttribute('data-i18n') : null;

  function setSettingsSection(sec) {
    $$('.settings-sec-btn').forEach((b) => b.classList.toggle('active', b.dataset.sec === sec));
    $$('.settings-pane').forEach((p) => { p.hidden = p.dataset.pane !== sec; });
  }

  function openSettings() {
    if (!settingsView) return;
    crumbBeforeSettings = crumbModuleEl ? crumbModuleEl.getAttribute('data-i18n') : null;

    settingsView.hidden = false;
    if (vpWrapperEl) vpWrapperEl.style.display = 'none';
    if (rightPanel) rightPanel.style.display = 'none';

    $$('.nav-item.active').forEach((el) => el.classList.remove('active'));
    $$('.sub-item.active').forEach((el) => el.classList.remove('active'));
    if (settingsNavBtn) settingsNavBtn.classList.add('active');

    if (crumbModuleEl) {
      crumbModuleEl.setAttribute('data-i18n', 'settings');
      if (typeof window.updateTranslations === 'function') {
        window.updateTranslations(html.lang === 'ar' ? 'ar' : 'en');
      }
    }
  }

  function closeSettings() {
    if (!settingsView || settingsView.hidden) return;
    settingsView.hidden = true;
    if (vpWrapperEl) vpWrapperEl.style.display = '';
    if (rightPanel) rightPanel.style.display = '';
    if (settingsNavBtn) settingsNavBtn.classList.remove('active');

    if (crumbModuleEl && crumbBeforeSettings) {
      crumbModuleEl.setAttribute('data-i18n', crumbBeforeSettings);
      if (typeof window.updateTranslations === 'function') {
        window.updateTranslations(html.lang === 'ar' ? 'ar' : 'en');
      }
    }
  }

  if (settingsView && settingsNavBtn) {
    settingsNavBtn.addEventListener('click', openSettings);

    $$('.settings-sec-btn').forEach((btn) => {
      btn.addEventListener('click', () => setSettingsSection(btn.dataset.sec));
    });

    // Any module / sub-view click leaves Settings and restores the viewer
    $$('.nav-item[data-module], .sub-item').forEach((btn) => {
      btn.addEventListener('click', closeSettings);
    });
  }

})();
