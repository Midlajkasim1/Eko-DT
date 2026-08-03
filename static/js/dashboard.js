/* ═══════════════════════════════════════════════
   Dashboard UI — Sidebar, Header, Theme
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];


  const arDict = {
    'OPERATIONS OVERVIEW': 'نظرة عامة على التشغيل',
    'ENERGY OVERVIEW': 'نظرة عامة على الطاقة',
    'ESG OVERVIEW': 'نظرة عامة على الاستدامة',
    'ASSETS OVERVIEW': 'نظرة عامة على الأصول',
    'SPACES OVERVIEW': 'نظرة عامة على المساحات',
    'MAINTENANCE OVERVIEW': 'نظرة عامة على الصيانة',
    'SECURITY OVERVIEW': 'نظرة عامة على الأمن',

    'OPEN ALARMS': 'التنبيهات المفتوحة',
    'SYSTEMS LIVE': 'الأنظمة المباشرة',
    'COMFORT COMPLIANCE': 'الالتزام بالراحة',
    'CONSUMED TODAY': 'الاستهلاك اليوم',
    'CURRENT LOAD': 'الحمل الحالي',
    'SAME DAY LAST MONTH': 'نفس اليوم الشهر الماضي',
    'CO2 TODAY': 'ثاني أكسيد الكربون اليوم',
    'ENERGY VS TARGET': 'الطاقة مقابل الهدف',
    'FRAMEWORKS ON TRACK': 'الأطر قيد التنفيذ',
    'ASSETS REGISTERED': 'الأصول المسجلة',
    'OPEN WORK ORDERS': 'أوامر العمل المفتوحة',
    'ASSETS IN ALARM': 'الأصول في حالة إنذار',
    'ZONES OCCUPIED': 'المناطق المشغولة',
    'IEQ INDEX': 'مؤشر جودة البيئة',
    'PREVENTIVE JOBS DUE': 'أعمال الصيانة المستحقة',
    'OVERDUE': 'متأخرة',
    'ON-TIME COMPLETION': 'الإنجاز في الوقت',
    'CAMERAS LIVE': 'الكاميرات المباشرة',
    'DOORS ONLINE': 'الأبواب المتصلة',
    'LIFE SAFETY': 'سلامة الأرواح',

    'Event Statistics': 'إحصاءات الأحداث',
    'Live Systems': 'الأنظمة المباشرة',
    'History Charts': 'الرسوم التاريخية',
    'Alarms': 'التنبيهات',
    'Water': 'المياه',
    'Waste Prevention': 'منع الهدر',
    'Portfolio Benchmarking': 'مقارنة المحفظة',
    'Location Based Metering': 'القياس حسب الموقع',
    'Flow and Trend Anomaly': 'شذوذ التدفق والاتجاه',
    'Budget Overrun': 'تجاوز الميزانية',
    'Consumption': 'الاستهلاك',
    'Forecasting': 'التنبؤ',
    'Target vs Actual': 'الهدف مقابل الفعلي',
    'Net Zero': 'الحياد الكربوني',
    'Utility Bill Management': 'إدارة فواتير الخدمات',
    'Reporting': 'التقارير',
    'Registry': 'السجل',
    'Work Orders': 'أوامر العمل',
    'Analytics': 'التحليلات',
    'RFID': 'تتبع RFID',
    'Room Data Sheets': 'بيانات الغرف',
    'Heat Map': 'الخريطة الحرارية',
    'Zone Status': 'حالة المنطقة',
    'Thermal Comfort': 'الراحة الحرارية',
    'IEQ': 'جودة البيئة (IEQ)',
    'Preventive Jobs': 'الأعمال الوقائية',
    'Schedules': 'الجداول الزمنية',
    'Status': 'الحالة',
    'CCTV': 'كاميرات المراقبة',
    'Access Control': 'التحكم بالوصول',
    'Life Safety': 'سلامة الأرواح',

    'AT A GLANCE': 'لمحة سريعة',
    'LIVE': 'مباشر',
    'Systems': 'الأنظمة',
    'forecast EOD': 'التوقع بنهاية اليوم',
    'month-on-month': 'مقارنة بالشهر الماضي',
    'within target band': 'ضمن النطاق المستهدف',
    'equipment reporting': 'المعدات المتصلة',
    'critical': 'حرج',
    'warning': 'تحذير',
    'info': 'معلومة',
    'open': 'مفتوحة',
    'live': 'مباشر',
    'findings': 'نتائج',
    'meters live': 'عداد مباشر',
    'MWh today': 'ميجاواط ساعة اليوم',
    'In design': 'قيد التصميم',
    'Requires portfolio': 'يتطلب محفظة عقارات',
    'Requires targets': 'يتطلب أهدافاً',
    'Requires budget targets in Settings': 'يتطلب أهداف ميزانية في الإعدادات',
    'Detail view in design': 'عرض التفاصيل قيد التصميم',

    '7-day trend and top opportunities': 'اتجاه 7 أيام وأبرز الفرص',
    'Avoidable consumption &middot; FDD + schedule analysis': 'الاستهلاك القابل للتجنب &middot; تحليل FDD والجداول',
    'Sub-view': 'عرض فرعي',
    'Module highlights': 'أبرز وحدات النظام',
    'Consumption, 7 days': 'الاستهلاك، 7 أيام',
    'Daily consumption': 'الاستهلاك اليومي',
    'kWh / day': 'كيلوواط ساعة / يوم',
    'Actual': 'الفعلي',
    'Baseline overlay requires targets in Settings': 'يتطلب عرض خط الأساس أهدافاً في الإعدادات',
    'Off-hours Load Heatmap': 'خريطة الحمل خارج ساعات العمل',
    'Hour-of-week average load &middot; last 28 days': 'متوسط الحمل بالساعة أسبوعياً &middot; آخر 28 يوماً',
    'OPPORTUNITIES': 'الفرص',
    'WARNING': 'تحذير',
    'No active findings': 'لا نتائج نشطة',
    'No active alarms': 'لا تنبيهات نشطة',
    'No history yet': 'لا يوجد سجل بعد',
    'Today only — trends require alarm history': 'اليوم فقط — تتطلب الاتجاهات سجل التنبيهات',
    'The assistant service is not connected yet. Live values are available on the Operations and Energy overviews.': 'خدمة المساعد غير متصلة بعد. القيم المباشرة متاحة في نظرتي التشغيل والطاقة.',

    'Mon': 'الاثنين',
    'Tue': 'الثلاثاء',
    'Wed': 'الأربعاء',
    'Thu': 'الخميس',
    'Fri': 'الجمعة',
    'Sat': 'السبت',
    'Sun': 'الأحد'
  };

  function t(str) {
    const langEl = document.querySelector('.app-shell') || document.documentElement;
    if (langEl.lang === "ar") {
      return arDict[str] || str;
    }
    return str;
  }

  /* ── Live data access ── */
  const live = {
    get power() { return window.DashboardData ? window.DashboardData.power : null; },
    get equipment() { return window.DashboardData ? window.DashboardData.equipment : null; },
    get alarms() { return window.DashboardData ? window.DashboardData.alarms : null; },
    get meters() { return window.DashboardData ? window.DashboardData.meters : null; },
    get connected() { return !!(window.DashboardData && window.DashboardData.connected); },
  };

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  function fmt(v, digits = 0) {
    return v == null || !isFinite(v) ? '—' : Number(v).toLocaleString('en-US', { maximumFractionDigits: digits });
  }

  const MONTH_INDEX = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };
  const HOUR_INDEX = {};
  for (let h = 0; h < 24; h++) {
    HOUR_INDEX[`${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'am' : 'pm'}`] = h;
  }

  // Nested year → month → 'month day' → 'h am/pm' historian shape from the backend
  function flattenHistory(nested) {
    const out = [];
    for (const [year, months] of Object.entries(nested || {})) {
      for (const [month, days] of Object.entries(months || {})) {
        const m = MONTH_INDEX[month];
        if (m == null) continue;
        for (const [dayKey, hours] of Object.entries(days || {})) {
          const d = parseInt(String(dayKey).split(' ')[1], 10);
          if (!d) continue;
          for (const [hourLabel, val] of Object.entries(hours || {})) {
            const h = HOUR_INDEX[hourLabel];
            const num = parseFloat(val);
            if (h == null || !isFinite(num)) continue;
            out.push({ ts: new Date(+year, m, d, h), val: num });
          }
        }
      }
    }
    return out.sort((a, b) => a.ts - b.ts);
  }

  function historySeries(key) {
    const power = live.power;
    const nested = power && power.power_history ? power.power_history[key] : null;
    return nested ? flattenHistory(nested) : [];
  }

  function sumDay(series, dayDate, maxHour = 24) {
    let sum = 0, count = 0;
    for (const p of series) {
      if (p.ts.getFullYear() === dayDate.getFullYear() &&
          p.ts.getMonth() === dayDate.getMonth() &&
          p.ts.getDate() === dayDate.getDate() &&
          p.ts.getHours() < maxHour) {
        sum += p.val;
        count++;
      }
    }
    return count ? { sum, count } : null;
  }

  function energyKpis() {
    const series = historySeries('Total_Power_Consumption_his');
    const now = new Date();
    const today = sumDay(series, now);
    const lastMonthDay = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonth = sumDay(series, lastMonthDay);
    const lastMonthSameHours = today ? sumDay(series, lastMonthDay, now.getHours() + 1) : null;
    let momPct = null;
    if (today && lastMonthSameHours && lastMonthSameHours.sum > 0) {
      momPct = ((today.sum - lastMonthSameHours.sum) / lastMonthSameHours.sum) * 100;
    }
    const power = live.power;
    return {
      consumed: today ? today.sum : null,
      eod: today ? (today.sum / today.count) * 24 : null,
      lastMonth: lastMonth ? lastMonth.sum : null,
      momPct,
      load: power ? power.total_power : null,
      spark: series.slice(-24),
    };
  }

  function sparkPaths(points) {
    if (!points || points.length < 2) return null;
    const vals = points.map(p => p.val);
    const min = Math.min(...vals);
    const span = (Math.max(...vals) - min) || 1;
    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * 240;
      const y = 44 - ((p.val - min) / span) * 34;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const line = 'M' + coords.join(' L');
    return { line, area: `${line} L240,48 L0,48 Z` };
  }

  function operationsKpis() {
    const counts = live.alarms ? live.alarms.counts : null;
    const power = live.power;
    const fac = power ? power.facilityServices : null;
    const comfort = power ? power.comfort_compliance : null;
    return [
      {
        label: 'OPEN ALARMS',
        v: counts ? String(counts.total) : '—',
        cap: counts ? `${counts.critical} ${t('critical')} &middot; ${counts.warning} ${t('warning')}` : '—',
        crit: !!counts && counts.critical > 0,
      },
      {
        label: 'SYSTEMS LIVE',
        v: fac ? `${fac.onlineEquipment}/${fac.totalEquipment}` : '—',
        cap: t('equipment reporting'),
      },
      {
        label: 'COMFORT COMPLIANCE',
        v: comfort != null ? Number(comfort).toFixed(1) : '—',
        unit: comfort != null ? '%' : '',
        cap: t('within target band'),
      },
    ];
  }

  function activeFindings() {
    const fdd = live.power ? live.power.fdd : null;
    const findings = [];
    (fdd || []).forEach(f => {
      Object.entries(f.rules || {}).forEach(([rule, val]) => {
        if (val === 'T' || val === 'true' || val === 'True') {
          findings.push({ equip: f.equip, floor: f.floor, rule });
        }
      });
    });
    return findings;
  }

  function glanceValue(modId, item) {
    const counts = live.alarms ? live.alarms.counts : null;
    if (modId === 'operations') {
      const fac = live.power ? live.power.facilityServices : null;
      if (item.id === 'alarms' || item.id === 'evstats') return counts ? `${counts.total} ${t('open')}` : '—';
      if (item.id === 'livesys') return fac ? `${fac.onlineEquipment}/${fac.totalEquipment} ${t('live')}` : '—';
      return '—';
    }
    if (modId === 'energy') {
      if (item.id === 'waste') { const n = activeFindings().length; return n ? `${n} ${t('findings')}` : '—'; }
      if (item.id === 'lbm') { const m = live.meters; const n = m ? Object.keys(m).length : 0; return n ? `${n} ${t('meters live')}` : '—'; }
      if (item.id === 'cons') { const k = energyKpis(); return k.consumed != null ? `${(k.consumed / 1000).toFixed(1)} ${t('MWh today')}` : '—'; }
      if (item.id === 'bench') return t('Requires portfolio');
      if (item.id === 'budget') return t('Requires targets');
      if (item.id === 'fcst') return t('In design');
      return '—';
    }
    return t('In design');
  }

  const modDefs = {
    operations: {
      ovEn: 'OPERATIONS OVERVIEW',
      l2: [
        { id: 'evstats', name: 'Event Statistics' },
        { id: 'livesys', name: 'Live Systems' },
        { id: 'histch', name: 'History Charts' },
        { id: 'alarms', name: 'Alarms' },
        { id: 'water', name: 'Water' }
      ]
    },
    energy: {
      ovEn: 'ENERGY OVERVIEW',
      l2: [
        { id: 'waste', name: 'Waste Prevention' },
        { id: 'bench', name: 'Portfolio Benchmarking' },
        { id: 'lbm', name: 'Location Based Metering' },
        { id: 'anom', name: 'Flow and Trend Anomaly' },
        { id: 'budget', name: 'Budget Overrun' },
        { id: 'cons', name: 'Consumption' },
        { id: 'fcst', name: 'Forecasting' }
      ]
    },
    esg: {
      ovEn: 'ESG OVERVIEW',
      kpiLabels: ['CO2 TODAY', 'ENERGY VS TARGET', 'FRAMEWORKS ON TRACK'],
      l2: [
        { id: 'tva', name: 'Target vs Actual' },
        { id: 'nz', name: 'Net Zero' },
        { id: 'ubm', name: 'Utility Bill Management' },
        { id: 'rep', name: 'Reporting' }
      ]
    },
    assets: {
      ovEn: 'ASSETS OVERVIEW',
      kpiLabels: ['ASSETS REGISTERED', 'OPEN WORK ORDERS', 'ASSETS IN ALARM'],
      l2: [
        { id: 'reg', name: 'Registry' },
        { id: 'wo', name: 'Work Orders' },
        { id: 'ana', name: 'Analytics' },
        { id: 'rfid', name: 'RFID' }
      ]
    },
    spaces: {
      ovEn: 'SPACES OVERVIEW',
      kpiLabels: ['COMFORT COMPLIANCE', 'ZONES OCCUPIED', 'IEQ INDEX'],
      l2: [
        { id: 'rds', name: 'Room Data Sheets' },
        { id: 'heat', name: 'Heat Map' },
        { id: 'zone', name: 'Zone Status' },
        { id: 'tc', name: 'Thermal Comfort' },
        { id: 'ieq', name: 'IEQ' }
      ]
    },
    maintenance: {
      ovEn: 'MAINTENANCE OVERVIEW',
      kpiLabels: ['PREVENTIVE JOBS DUE', 'OVERDUE', 'ON-TIME COMPLETION'],
      l2: [
        { id: 'pj', name: 'Preventive Jobs' },
        { id: 'sch', name: 'Schedules' },
        { id: 'stat', name: 'Status' }
      ]
    },
    security: {
      ovEn: 'SECURITY OVERVIEW',
      kpiLabels: ['CAMERAS LIVE', 'DOORS ONLINE', 'LIFE SAFETY'],
      l2: [
        { id: 'cctv', name: 'CCTV' },
        { id: 'ac', name: 'Access Control' },
        { id: 'ls', name: 'Life Safety' }
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
      const k = energyKpis();
      const spark = sparkPaths(k.spark);
      const momHtml = k.momPct == null ? '' :
        `<span style="color:${k.momPct > 0 ? 'var(--warnTx)' : 'var(--posTx)'}">${k.momPct > 0 ? '▲' : '▼'} ${Math.abs(k.momPct).toFixed(1)}% ${t('month-on-month')}</span>`;
      kpiHtml = `
        <div>
          <div class="kpi-label">${t("CONSUMED TODAY")}</div>
          <div class="kpi-value-row">
            <span class="kpi-val">${fmt(k.consumed)}</span>
            <span class="kpi-unit">kWh</span>
          </div>
          <div class="kpi-sub">${k.eod == null ? '—' : `${t('forecast EOD')} ${fmt(k.eod)} kWh`}</div>
        </div>
        <div>
          <div class="kpi-label">${t("CURRENT LOAD")}</div>
          <div class="kpi-value-row">
            <span class="kpi-val-lg">${fmt(k.load, 2)}</span>
            <span class="kpi-unit">kW</span>
            <svg class="histclock" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--warnTx)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
          </div>
          ${spark ? `
          <svg viewBox="0 0 240 48" preserveAspectRatio="none" style="width: 100%; height: 44px; display: block; margin-block: 6px;">
            <path d="${spark.area}" fill="var(--acc8)" stroke="none"></path>
            <path d="${spark.line}" fill="none" stroke="var(--acc)" stroke-width="1.5"></path>
          </svg>` : ''}
        </div>
        <div>
          <div class="kpi-label">${t("SAME DAY LAST MONTH")}</div>
          <div class="kpi-value-row">
            <span class="kpi-val">${fmt(k.lastMonth)}</span>
            <span class="kpi-unit">kWh</span>
          </div>
          ${momHtml}
        </div>
      `;
    } else {
      const kpis = modId === 'operations'
        ? operationsKpis()
        : (data.kpiLabels || []).map((label) => ({ label, v: '—', cap: t('In design') }));
      kpis.forEach((kpi) => {
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
            <span class="glance-val font-mono">${glanceValue(modId, item)}</span>
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
          ${weeklyChartHtml('line')}
          <div style="display:flex;gap:12px;margin-block-start:8px">
            <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:14px;height:2px;background:var(--acc)"></span>${t('Actual')}</span>
          </div>
        </div>
        <div style="font-family:var(--fH),sans-serif;font-size:10px;font-weight:600;letter-spacing:0.8px;color:var(--t2);margin-block-start:2px">${t('OPPORTUNITIES')}</div>
        ${oppRowsHtml()}
      `;
    } else if (showWaste) {
      html = `
        <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
          <div style="display:flex;align-items:baseline;gap:8px;margin-block-end:10px">
            <span style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1)">${t('Daily consumption')}</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t3)">${t('kWh / day')}</span>
          </div>
          ${weeklyChartHtml('bars')}
          <div style="font-size:10.5px;color:var(--t3);margin-block-start:8px">${t('Baseline overlay requires targets in Settings')}</div>
        </div>
        <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
          <div style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1);margin-block-end:10px">${t('Off-hours Load Heatmap')}</div>
          ${heatmapHtml()}
          <div style="font-size:10.5px;color:var(--t3);margin-block-start:8px">${t('Hour-of-week average load &middot; last 28 days')}</div>
        </div>
        <div style="font-family:var(--fH),sans-serif;font-size:10px;font-weight:600;letter-spacing:0.8px;color:var(--t2);margin-block-start:2px">${t('OPPORTUNITIES')}</div>
        ${oppRowsHtml()}
      `;
    } else if (showStub && subId === 'evstats') {
      html = eventStatsHtml();
    } else if (showStub && subId === 'alarms') {
      html = alarmListHtml();
    } else if (showStub) {
      html = `<div style="padding:26px 14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;line-height:1.5;color:var(--t3)">${t(STUB_REASONS[subId] || 'Detail view in design')}</div>`;
    } else {
      html = `<div style="padding:26px 14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;line-height:1.5;color:var(--t3)">${t('In design')}</div>`;
    }

    rpContent.innerHTML = html;
  }

  const STUB_REASONS = {
    bench: 'Requires portfolio',
    budget: 'Requires budget targets in Settings',
    fcst: 'In design',
  };

  function weeklyChartHtml(kind) {
    const series = historySeries('Total_Power_Consumption_his');
    const now = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const s = sumDay(series, d);
      days.push({ date: d, sum: s ? s.sum : null });
    }
    const known = days.filter(d => d.sum != null);
    if (!known.length) {
      return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">${t('No history yet')}</div>`;
    }
    const max = Math.max(...known.map(d => d.sum)) || 1;
    const yFor = v => 100 - (v / max) * 92;
    const short = v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v));
    const dayLabels = days.map((d, i) =>
      `<text x="${30 + i * 48}" y="114" text-anchor="middle">${t(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.date.getDay()])}</text>`).join('');
    let marks = '';
    if (kind === 'bars') {
      marks = '<g fill="var(--btnP)">' + days.map((d, i) =>
        d.sum == null ? '' : `<rect x="${24 + i * 48}" y="${yFor(d.sum).toFixed(1)}" width="12" height="${(100 - yFor(d.sum)).toFixed(1)}"/>`).join('') + '</g>';
    } else {
      const pts = [];
      const dots = [];
      days.forEach((d, i) => {
        if (d.sum == null) return;
        const y = yFor(d.sum).toFixed(1);
        pts.push(`${30 + i * 48},${y}`);
        dots.push(`<circle cx="${30 + i * 48}" cy="${y}" r="2"/>`);
      });
      marks = `<polyline points="${pts.join(' ')}" fill="none" stroke="var(--acc)" stroke-width="1.5"/><g fill="var(--acc)">${dots.join('')}</g>`;
    }
    return `
          <svg viewBox="0 0 330 122" style="width:100%;height:auto;display:block" role="img" aria-label="7-day consumption">
            <line x1="30" y1="8" x2="318" y2="8" stroke="var(--bd1)" stroke-dasharray="2 3"/>
            <line x1="30" y1="54" x2="318" y2="54" stroke="var(--bd1)" stroke-dasharray="2 3"/>
            <line x1="30" y1="100" x2="318" y2="100" stroke="var(--bd1)"/>
            <g font-family="'JetBrains Mono',monospace" font-size="8" fill="var(--t3)">
              <text x="24" y="103" text-anchor="end">0</text>
              <text x="24" y="57" text-anchor="end">${short(max / 2)}</text>
              <text x="24" y="12" text-anchor="end">${short(max)}</text>
              ${dayLabels}
            </g>
            ${marks}
          </svg>`;
  }

  function eventStatsHtml() {
    const counts = live.alarms ? live.alarms.counts : null;
    if (!counts) {
      return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">—</div>`;
    }
    const tile = (label, v, color) => `
      <div style="flex:1;background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:12px;text-align:center">
        <div style="font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:600;color:${color}">${v}</div>
        <div style="font-size:10px;letter-spacing:0.8px;color:var(--t3);text-transform:uppercase;margin-block-start:4px">${label}</div>
      </div>`;
    return `
      <div style="display:flex;gap:8px">
        ${tile(t('critical'), counts.critical, 'var(--crit)')}
        ${tile(t('warning'), counts.warning, 'var(--warn)')}
        ${tile('info', counts.info, 'var(--info)')}
      </div>
      <div style="padding:12px;border:1px dashed var(--bd1);border-radius:8px;font-size:11.5px;color:var(--t3);text-align:center">${t('Today only — trends require alarm history')}</div>`;
  }

  function alarmListHtml() {
    const data = live.alarms;
    if (!data) {
      return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">—</div>`;
    }
    if (!data.alarms.length) {
      return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">${t('No active alarms')}</div>`;
    }
    const sevStyle = {
      critical: 'background:var(--critT);border:1px solid var(--crit);color:var(--crit)',
      warning: 'background:var(--warnT);border:1px solid var(--warnB);color:var(--warnTx)',
      info: 'background:var(--s3);border:1px solid var(--bd2);color:var(--t2)',
    };
    return data.alarms.map((a) => {
      const when = a.occurred ? new Date(String(a.occurred).replace(/ [A-Za-z_\/]+$/, '')) : null;
      const timeStr = when && !isNaN(when) ?
        `${String(when.getDate()).padStart(2, '0')}/${String(when.getMonth() + 1).padStart(2, '0')} ${String(when.getHours()).padStart(2, '0')}:${String(when.getMinutes()).padStart(2, '0')}` : '';
      return `
        <article style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:4px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="flex:none;padding:2px 7px;border-radius:4px;font-family:var(--fH),sans-serif;font-size:9px;font-weight:600;letter-spacing:1px;text-transform:uppercase;${sevStyle[a.severity] || sevStyle.info}">${t(a.severity)}</span>
            <span style="flex:1;min-width:0;font-family:var(--fH),sans-serif;font-size:12px;font-weight:500;color:var(--t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(a.source)}</span>
            <span style="flex:none;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3)">${timeStr}</span>
          </div>
          <div style="font-size:11.5px;line-height:1.4;color:var(--t2)">${esc(a.message)}</div>
        </article>`;
    }).join('');
  }

  function oppRowsHtml() {
    if (!live.power) {
      return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">\u2014</div>`;
    }
    const findings = activeFindings();
    if (!findings.length) {
      return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">${t('No active findings')}</div>`;
    }
    return findings.map((f) => `
        <article style="display:flex;align-items:center;gap:8px;background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:11px 13px">
          <span style="flex:none;padding:2px 7px;border-radius:4px;background:var(--warnT);border:1px solid var(--warnB);color:var(--warnTx);font-family:var(--fH),sans-serif;font-size:9.5px;font-weight:600;letter-spacing:1px">${t('WARNING')}</span>
          <span style="flex:1;min-width:0;font-family:var(--fH),sans-serif;font-size:12px;font-weight:500;color:var(--t1)">${esc(f.rule.replace(/_/g, ' '))} &middot; ${esc(f.equip)}</span>
          <span style="flex:none;font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--t3)">${esc(f.floor)}</span>
        </article>
    `).join('');
  }

  // Hour-of-week load intensity averaged over the last 28 days of the historian
  function heatmapHtml() {
    const series = historySeries('Total_Power_Consumption_his');
    const cutoff = Date.now() - 28 * 86400000;
    const sums = Array.from({ length: 7 }, () => Array(24).fill(0));
    const counts = Array.from({ length: 7 }, () => Array(24).fill(0));
    for (const p of series) {
      if (p.ts.getTime() < cutoff) continue;
      const day = (p.ts.getDay() + 6) % 7;
      sums[day][p.ts.getHours()] += p.val;
      counts[day][p.ts.getHours()]++;
    }
    const cells = sums.map((row, d) => row.map((s, h) => counts[d][h] ? s / counts[d][h] : null));
    const known = cells.flat().filter(v => v != null);
    if (!known.length) {
      return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">${t('No history yet')}</div>`;
    }
    const min = Math.min(...known);
    const span = (Math.max(...known) - min) || 1;
    const bgFor = v => {
      if (v == null) return 'var(--s3)';
      const f = (v - min) / span;
      return f >= 0.58 ? 'var(--btnP)' : (f >= 0.4 ? 'color-mix(in srgb, var(--btnP) 50%, var(--s3))' : 'var(--s3)');
    };
    const days = [t('Mon'), t('Tue'), t('Wed'), t('Thu'), t('Fri'), t('Sat'), t('Sun')];
    const rows = days.map((d, i) => {
      const rowCells = cells[i].map(v => `<span style="display:block;aspect-ratio:1;border-radius:2px;background:${bgFor(v)}"></span>`).join('');
      return `<div style="display:grid;grid-template-columns:30px repeat(24,1fr);gap:2px;margin-block-end:2px;align-items:center;direction:ltr"><span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3)">${d}</span>${rowCells}</div>`;
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

  // Curve: last 48h of the building load historian; dots: today's active alarms
  let SERIES = [];
  let VMIN = 0, VMAX = 1;
  let EVENTS = [];

  // Given a fractional position f (0=left/oldest, 1=right/now), return SVG y
  function seriesY(f) {
    if (SERIES.length < 2) return (CHART_TOP + CHART_BTM) / 2;
    const idx = Math.round(f * (SERIES.length - 1));
    const v   = SERIES[Math.max(0, Math.min(SERIES.length - 1, idx))];
    return CHART_TOP + (CHART_BTM - CHART_TOP) * (1 - (v - VMIN) / (VMAX - VMIN));
  }

  // Build SVG M…L path string
  function buildSvgPath() {
    if (SERIES.length < 2) return '';
    const pts = SERIES.map((v, i) => {
      const x = (i / (SERIES.length - 1)) * SVG_W;
      const y = CHART_TOP + (CHART_BTM - CHART_TOP) * (1 - (v - VMIN) / (VMAX - VMIN));
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return 'M' + pts.join(' L');
  }

  function refreshTimelineData() {
    const cutoff = Date.now() - TOTAL_HOURS * 3600000;
    SERIES = historySeries('Total_Power_Consumption_his')
      .filter(p => p.ts.getTime() >= cutoff)
      .map(p => p.val);
    const power = live.power;
    if (power && power.total_power != null) SERIES.push(power.total_power);
    if (SERIES.length >= 2) {
      VMIN = Math.min(...SERIES);
      VMAX = Math.max(...SERIES);
      if (VMAX === VMIN) VMAX = VMIN + 1;
    }
    EVENTS = ((live.alarms && live.alarms.alarms) || []).map((a) => {
      if (!a.occurred) return null;
      const ts = new Date(String(a.occurred).replace(/ [A-Za-z_\/]+$/, ''));
      if (isNaN(ts)) return null;
      const age = (Date.now() - ts.getTime()) / 3600000;
      if (age < 0 || age > TOTAL_HOURS) return null;
      const sev = a.severity === 'critical' ? 'crit' : (a.severity === 'warning' ? 'warn' : 'info');
      return { age, sev, tip: `${a.source}: ${a.message}` };
    }).filter(Boolean);
    renderSvg();
    renderEventDots();
    updateStepBtns();
  }

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
      const color = ev.sev === 'crit' ? 'var(--crit)' : (ev.sev === 'warn' ? 'var(--warn)' : 'var(--info)');
      const size  = ev.sev === 'crit' ? 14 : (ev.sev === 'warn' ? 11 : 8);

      const dot = document.createElement('button');
      dot.setAttribute('aria-label', ev.tip);
      dot.setAttribute('data-ev-idx', i);
      dot.title = ev.tip;
      dot.style.cssText = `position:absolute;left:${xPct};top:${pxTop.toFixed(1)}px;width:${size}px;height:${size}px;margin-left:${-size / 2}px;margin-top:${-size / 2}px;padding:0;border-radius:50%;background:${color};border:1.5px solid var(--s1);cursor:pointer;z-index:3;pointer-events:auto;`;
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
    if (!EVENTS.length) return;
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
    if (!EVENTS.length) {
      scrubPrevBtn.disabled = true;
      scrubNextBtn.disabled = isLive;
      return;
    }
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
    refreshTimelineData();
    renderTicks();
    goLive();
  }
  initScrubbar();
  window.addEventListener('resize', () => { renderTicks(); renderEventDots(); });

  /* ── Live data subscription ── */
  function updateConnectionPill() {
    const dot = $('#systemsDot');
    const label = $('#systemsLabel');
    const ok = live.connected;
    if (dot) {
      dot.classList.toggle('status-ok', ok);
      dot.classList.toggle('status-warn', !ok);
    }
    if (label) label.textContent = `${t('Systems')} ${ok ? '1/1' : '0/1'}`;
  }

  function updateNotifBadge() {
    const badge = $('.notif-badge');
    if (!badge) return;
    const crit = (live.alarms && live.alarms.counts && live.alarms.counts.critical) || 0;
    badge.textContent = String(crit);
    badge.style.display = crit > 0 ? '' : 'none';
  }

  updateConnectionPill();
  updateNotifBadge();

  window.addEventListener('dashboard-data', (e) => {
    const type = e.detail && e.detail.type;
    if (type === 'power' || type === 'equipment' || type === 'alarms' || type === 'meters') {
      renderModuleOverview(currentModule, currentSubId);
      renderRightPanel(currentModule, currentSubId);
    }
    if (type === 'power' || type === 'alarms') refreshTimelineData();
    if (type === 'alarms') updateNotifBadge();
    if (type === 'status') updateConnectionPill();
  });




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

  function getEkoAnswer() {
    return t('The assistant service is not connected yet. Live values are available on the Operations and Energy overviews.');
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
