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
    'PMU live sum': 'المجموع المباشر لعدادات PMU',
    'Peak demand · 15-min': 'الطلب الأقصى · كل 15 دقيقة',
    'Peak demand, last 24 readings · kW': 'الطلب الأقصى، آخر 24 قراءة · كيلوواط',
    'Hourly consumption, last 24 h · kWh': 'الاستهلاك بالساعة، آخر 24 ساعة · كيلوواط ساعة',
    'Total and per-service consumption over time': 'الاستهلاك الكلي وحسب الخدمة عبر الزمن',
    'BY SERVICE': 'حسب الخدمة',
    'Service': 'الخدمة',
    'share': 'الحصة',
    'total': 'الإجمالي',
    'services': 'خدمات',
    'Total building': 'إجمالي المبنى',
    'Historian last collected': 'آخر تجميع للسجل منذ',
    'ago': '',
    'Showing': 'يعرض',
    'No history in this range': 'لا يوجد سجل في هذه الفترة',
    'Negative total — meter reset or bad data': 'إجمالي سالب — إعادة ضبط العداد أو بيانات خاطئة',
    'Services sum to': 'مجموع الخدمات',
    'vs building total': 'مقابل إجمالي المبنى',
    'the two do not reconcile': 'القيمتان غير متطابقتين',
    'service(s) report a negative total — meter reset or bad data': 'خدمة/خدمات بإجمالي سالب — إعادة ضبط العداد أو بيانات خاطئة',
    'click again for building total': 'انقر مرة أخرى لإجمالي المبنى',
    'no data': 'لا بيانات',
    'avg': 'متوسط',
    'ref': 'مرجع',
    'metered by': 'يُقاس بواسطة',
    'Electrical distribution boards · one PMU per board': 'لوحات التوزيع الكهربائية · عداد PMU لكل لوحة',
    'Motor control centre 01 · basement': 'مركز التحكم بالمحركات 01 · القبو',
    'Motor control centre 02 · basement': 'مركز التحكم بالمحركات 02 · القبو',
    'Kitchen sub-main distribution board': 'لوحة التوزيع الفرعية للمطبخ',
    'Low-voltage feeder pillar · zone 7': 'عمود التغذية منخفض الجهد · المنطقة 7',
    'Automatic transfer switch · essential supply': 'مفتاح النقل التلقائي · التغذية الأساسية',
    'Sump / sewage pump station 02 control panel': 'لوحة تحكم محطة ضخ الصرف 02',
    'MCC 1': 'لوحة MCC 1',
    'MCC 2': 'لوحة MCC 2',
    'Kitchen SMDB': 'لوحة المطبخ SMDB',
    'LVFP': 'لوحة LVFP',
    'ATS': 'مفتاح النقل ATS',
    'Sump pump': 'مضخة التصريف',
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
    'PMU trends': 'اتجاهات عدادات PMU',
    'Meter': 'العداد',
    'No meter data yet': 'لا بيانات عدادات بعد',
    'trend history available — click row': 'سجل الاتجاه متاح — انقر على الصف',
    'Live PMU meters · 5 parameters': 'عدادات PMU المباشرة · 5 معايير',
    'Hourly load vs typical profile': 'الحمل بالساعة مقابل النمط المعتاد',
    'Today': 'اليوم',
    'hour': 'ساعة',
    'Typical profile': 'النمط المعتاد',
    'anomaly hours': 'ساعات شاذة',
    'No history for this day': 'لا يوجد سجل لهذا اليوم',
    'Loading…': 'جارٍ التحميل…',
    'series': 'سلسلة',
    'channels': 'قنوات',
    'points': 'نقاط',
    'healthy': 'سليمة',
    'faulted': 'معطلة',
    'Staleness requires per-point thresholds': 'تتطلب حالة التقادم عتبات لكل نقطة',
    'No equipment in alarm': 'لا معدات في حالة إنذار',
    'No equipment reported yet': 'لا معدات مسجلة بعد',
    'No points reporting': 'لا نقاط مسجلة',
    'No historized points on this equipment': 'لا نقاط ذات سجل لهذه المعدة',
    'No historized points reported by FIN': 'لم تُبلّغ FIN عن نقاط ذات سجل',
    'No meter history yet': 'لا يوجد سجل للعدادات بعد',
    'EQUIPMENT IN ALARM': 'المعدات في حالة إنذار',
    'ALARMS': 'التنبيهات',
    'POINTS': 'النقاط',
    'All equipment': 'كل المعدات',
    'Equipment liveness and point detail': 'حالة المعدات وتفاصيل النقاط',
    'Chart picker over historized points': 'اختيار الرسم من النقاط ذات السجل',
    'Water and gas meters · consumption and health': 'عدادات المياه والغاز · الاستهلاك والحالة',
    'Counts by severity and day': 'الأعداد حسب الخطورة واليوم',
    'Active alarm list': 'قائمة التنبيهات النشطة',
    'Live alarms and equipment health': 'التنبيهات المباشرة وحالة المعدات',
    'Configured historians': 'السجلات المهيأة',
    'FIN historized points': 'نقاط FIN ذات السجل',
    'Loading FIN point list…': 'جارٍ تحميل قائمة نقاط FIN…',
    'Events by day': 'الأحداث حسب اليوم',
    'Today only — FIN retains no alarm history for this range': 'اليوم فقط — لا تحتفظ FIN بسجل تنبيهات لهذه الفترة',
    'Channel': 'القناة',
    'last': 'آخر قراءة',
    'WATER': 'المياه',
    'GAS': 'الغاز',
    'water channels': 'قنوات مياه',
    'gas meter': 'عداد غاز',
    'live total': 'الإجمالي المباشر',
    '1 gas meter · 3 kitchen channels': 'عداد غاز واحد · 3 قنوات مطبخ',
    'meter reading': 'قراءة العداد',
    'per-interval': 'لكل فترة',
    'Basement · cold water': 'القبو · مياه باردة',
    'L1 kitchen · supply cold': 'مطبخ الطابق 1 · تغذية باردة',
    'L1 kitchen · supply hot': 'مطبخ الطابق 1 · تغذية ساخنة',
    'L1 kitchen · return hot': 'مطبخ الطابق 1 · عودة ساخنة',
    'Kitchen channel 1': 'قناة المطبخ 1',
    'Kitchen channel 2': 'قناة المطبخ 2',
    'Kitchen channel 3': 'قناة المطبخ 3',
    'MWh today': 'ميجاواط ساعة اليوم',
    'Widen panel': 'توسيع اللوحة',
    'Narrow panel': 'تضييق اللوحة',
    'events': 'أحداث',
    'more': 'أخرى',
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

  // Live building load from the individual PMU meters (fallback when the
  // FIN total_power point is not reporting). Returns {sum, count} or null.
  function pmuLiveSum() {
    const meters = live.meters;
    if (!meters) return null;
    let sum = 0, count = 0;
    Object.values(meters).forEach((m) => {
      const v = m ? m.active_power : null;
      if (typeof v === 'number' && isFinite(v)) { sum += v; count++; }
    });
    return count ? { sum, count } : null;
  }

  function liveLoadKw() {
    const power = live.power;
    if (power && power.total_power != null) return power.total_power;
    const pmu = pmuLiveSum();
    return pmu ? pmu.sum : null;
  }

  // Per-PMU historian keys in the power_history payload (PMU04_MCC_02_his …)
  function pmuHistKeys() {
    const power = live.power;
    if (!power || !power.power_history) return [];
    return Object.keys(power.power_history).filter((k) => /^PMU\d+/i.test(k)).sort();
  }

  // Historian key for a live meter, matched on its PMU number
  function meterHistKey(name) {
    const m = String(name).match(/^PMU\d+/i);
    if (!m) return null;
    const prefix = m[0].toUpperCase();
    return pmuHistKeys().find((k) => k.toUpperCase().startsWith(prefix)) || null;
  }

  // Zone part of the FIN nav name: PMU05_SMDB_KIT → "SMDB KIT"
  function meterZoneLabel(name) {
    const s = String(name).replace(/^PMU\d+[_\- ]*/i, '').replace(/_/g, ' ').trim();
    return s || String(name);
  }

  function shortNum(v, digits = 1) {
    if (v == null || !isFinite(v)) return '—';
    if (Math.abs(v) >= 10000) return (v / 1000).toFixed(1) + 'k';
    return Number(v).toLocaleString('en-US', { maximumFractionDigits: digits });
  }

  // Values for each hour (0-23) of one calendar day, null where no sample
  function hourValues(series, dayDate) {
    const out = Array(24).fill(null);
    for (const p of series) {
      if (p.ts.getFullYear() === dayDate.getFullYear() &&
          p.ts.getMonth() === dayDate.getMonth() &&
          p.ts.getDate() === dayDate.getDate()) {
        out[p.ts.getHours()] = p.val;
      }
    }
    return out;
  }

  // EOD projection from the intraday profile: scale today's partial sum by the
  // typical full-day/partial-day ratio at this hour over the last 28 days.
  // Days with gaps or bad (non-positive) sums are skipped so meter glitches
  // never poison the forecast. Falls back to a flat projection.
  function eodForecast(series, now, today) {
    if (!today) return null;
    const hour = now.getHours();
    let fullSum = 0, partSum = 0, daysUsed = 0;
    for (let i = 1; i <= 28; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const full = sumDay(series, d);
      const part = sumDay(series, d, hour + 1);
      if (full && part && full.count >= 20 && full.sum > 0 && part.sum > 0) {
        fullSum += full.sum;
        partSum += part.sum;
        daysUsed++;
      }
    }
    if (daysUsed >= 3 && partSum > 0) return today.sum * (fullSum / partSum);
    return today.count ? (today.sum / today.count) * 24 : null;
  }

  // xlsx: "Wire to PMU sum" — when the building total historian has no data for a
  // day, fall back to summing the per-PMU historians for that day.
  function daySumWithPmuFallback(series, day) {
    const direct = sumDay(series, day);
    if (direct) return direct;
    const parts = pmuHistKeys().map((k) => sumDay(historySeries(k), day)).filter(Boolean);
    if (!parts.length) return null;
    return {
      sum: parts.reduce((a, p) => a + p.sum, 0),
      count: Math.max(...parts.map((p) => p.count)),
      fromPmu: true,
    };
  }

  function energyKpis() {
    const series = historySeries('Total_Power_Consumption_his');
    const now = new Date();
    const today = daySumWithPmuFallback(series, now);
    const lastMonthDay = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonth = daySumWithPmuFallback(series, lastMonthDay);
    const lastMonthSameHours = today ? sumDay(series, lastMonthDay, now.getHours() + 1) : null;
    let momPct = null;
    if (today && lastMonthSameHours && lastMonthSameHours.sum > 0) {
      momPct = ((today.sum - lastMonthSameHours.sum) / lastMonthSameHours.sum) * 100;
    }

    // Live kW: FIN total → live PMU sum → Peak_Demand (the only kW point at
    // Marsa whose historian is still collecting). Provenance is always labelled.
    const power = live.power;
    const finLoad = power ? power.total_power : null;
    const pmu = finLoad == null ? pmuLiveSum() : null;
    let load = finLoad != null ? finLoad : (pmu ? pmu.sum : null);
    let loadSrc = finLoad != null ? '' : (pmu ? 'pmu' : '');
    if (load == null && power && power.peak_demand != null) {
      load = power.peak_demand;
      loadSrc = 'peak';
    }

    // The sparkline falls back to a different point *and a different unit*
    // (kWh/h → kW), so its source is reported alongside it rather than left
    // to be guessed from an unlabelled squiggle.
    let spark = series.slice(-24);
    let sparkSrc = 'energy';
    if (!spark.length) {
      spark = historySeries('Peak_Demand_his').slice(-24);
      sparkSrc = 'peak';
    }

    return {
      consumed: today ? today.sum : null,
      consumedFromPmu: !!(today && today.fromPmu),
      eod: eodForecast(series, now, today),
      lastMonth: lastMonth ? lastMonth.sum : null,
      momPct,
      load,
      loadSrc,
      loadPmuCount: pmu ? pmu.count : 0,
      spark,
      sparkSrc,
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
    const dots = points.map((p, i) => {
      const x = (i / (points.length - 1)) * 240;
      const y = 44 - ((p.val - min) / span) * 34;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="transparent" data-tip="${esc(`${stamp(p.ts)}\n${shortNum(p.val, 2)}`)}" style="cursor:crosshair"/>`;
    }).join('');
    return { line, area: `${line} L240,48 L0,48 Z`, dots };
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
      if (item.id === 'histch') {
        const cfg = live.power && live.power.power_history ? Object.keys(live.power.power_history).length : 0;
        const fin = async$.hisPoints ? async$.hisPoints.points.length : 0;
        const n = cfg + fin;
        return n ? `${n} ${t('series')}` : '—';
      }
      if (item.id === 'water') {
        const hist = live.power && live.power.power_history ? live.power.power_history : null;
        const n = hist ? WATER_CHANNELS.filter((c) => hist[c.key]).length : 0;
        return n ? `${n} ${t('channels')}` : '—';
      }
      return '—';
    }
    if (modId === 'energy') {
      if (item.id === 'waste') { const n = activeFindings().length; return n ? `${n} ${t('findings')}` : '—'; }
      if (item.id === 'lbm') { const m = live.meters; const n = m ? Object.keys(m).length : 0; return n ? `${n} ${t('meters live')}` : '—'; }
      if (item.id === 'anom') { const n = pmuHistKeys().length; return n ? `${n} ${t('PMU trends')}` : '—'; }
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
        // { id: 'bench', name: 'Portfolio Benchmarking' },
        { id: 'lbm', name: 'Location Based Metering' },
        { id: 'anom', name: 'Flow and Trend Anomaly' },
        // { id: 'budget', name: 'Budget Overrun' },
        { id: 'cons', name: 'Consumption' },
        // { id: 'fcst', name: 'Forecasting' }
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
  // Sub-view selections (persist across live-data re-renders)
  let lbmSelectedPmu = null;
  let anomPmu = null;
  let anomDayOffset = 0;
  let livesysSelected = null;
  let livesysPointId = null;
  let histchPointId = null;
  // A render replaces the panel's DOM. If it lands while a <select> is open the
  // dropdown is torn out mid-choice, so the render is held until focus leaves.
  // Declared here because renderRightPanel runs before the sub-view state below.
  let rpRenderQueued = false;

  // Water/gas channels. Labels come from the raw meter points behind each FIN
  // aggregate: WM_FF_* are WATER_METER-ANC09-FF's WM_L1_KTCHN_* points, and the
  // 3 gas keys are GM_GF_KITCH1-3 on the single GAS-METER-ANC09-GF.
  const WATER_CHANNELS = [
    { key: 'WM_BF_Cold_Wtr_his', label: 'Basement · cold water', kind: 'water' },
    { key: 'WM_FF_Sup_Cold_Wtr_his', label: 'L1 kitchen · supply cold', kind: 'water' },
    { key: 'WM_FF_Sup_Hot_Wtr_his', label: 'L1 kitchen · supply hot', kind: 'water' },
    { key: 'WM_FF_Ret_Hot_Wtr_his', label: 'L1 kitchen · return hot', kind: 'water' },
    { key: 'GM_GF_01_his', label: 'Kitchen channel 1', kind: 'gas' },
    { key: 'GM_GF_02_his', label: 'Kitchen channel 2', kind: 'gas' },
    { key: 'GM_GF_03_his', label: 'Kitchen channel 3', kind: 'gas' },
  ];

  // On-demand backend data (fetched once, then cached; render re-runs on arrival)
  const async$ = { hisPoints: null, alarmHistory: null, pointHistory: {} };
  const pending$ = {};

  function afterLoad() { renderRightPanel(currentModule, currentSubId); }

  function ensureHisPoints() {
    if (async$.hisPoints || pending$.hisPoints || !window.DashboardData) return;
    pending$.hisPoints = true;
    window.DashboardData.getHisPoints().then((d) => {
      pending$.hisPoints = false;
      async$.hisPoints = d && d.points ? d : { points: [] };
      afterLoad();
    });
  }

  function ensureAlarmHistory() {
    if (async$.alarmHistory || pending$.alarmHistory || !window.DashboardData) return;
    pending$.alarmHistory = true;
    // 30 days, not 7: a week catches 4 of the 343 retained alarms at Marsa and
    // hides the 6 July cooling-valve event (196 alarms) completely.
    window.DashboardData.getAlarmHistory(30).then((d) => {
      pending$.alarmHistory = false;
      async$.alarmHistory = d || { retained: false, byDay: [] };
      afterLoad();
    });
  }

  // Returns a flattened series, or null while still loading
  function pointSeries(id, days = 7) {
    if (!id || !window.DashboardData) return null;
    const key = `${id}|${days}`;
    if (async$.pointHistory[key]) return async$.pointHistory[key].series;
    if (pending$[key]) return null;
    pending$[key] = true;
    window.DashboardData.getPointHistory(id, days).then((d) => {
      pending$[key] = false;
      async$.pointHistory[key] = {
        series: d && d.history ? flattenHistory(d.history) : [],
        unit: (d && d.unit) || '',
      };
      afterLoad();
    });
    return null;
  }

  function loadingBox() {
    return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">${t('Loading…')}</div>`;
  }

  function emptyBox(msg) {
    return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">${msg}</div>`;
  }

  /* ── Chart tooltips ──
     Charts are re-rendered on every data tick, so hover is delegated: any mark
     carrying data-tip shows the shared floating tooltip. */
  const chartTip = (() => {
    let el = null;
    function ensure() {
      if (el) return el;
      el = document.createElement('div');
      el.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;display:none;' +
        'padding:6px 9px;border-radius:6px;background:var(--s1);border:1px solid var(--bd2);' +
        "color:var(--t1);font-family:'JetBrains Mono',monospace;font-size:10.5px;line-height:1.5;" +
        'white-space:pre;box-shadow:0 4px 14px rgba(0,0,0,.45);direction:ltr';
      document.body.appendChild(el);
      return el;
    }
    return {
      show(text, x, y) {
        const e = ensure();
        e.textContent = text;
        e.style.display = 'block';
        const w = e.offsetWidth || 130, h = e.offsetHeight || 34;
        const vw = window.innerWidth || 1200;
        let left = x + 14, top = y - h - 10;
        if (left + w > vw - 8) left = x - w - 14;
        if (left < 8) left = 8;
        if (top < 8) top = y + 18;
        e.style.left = left + 'px';
        e.style.top = top + 'px';
      },
      hide() { if (el) el.style.display = 'none'; },
    };
  })();

  function bindChartTips(container) {
    if (!container || !container.addEventListener) return;
    container.addEventListener('mousemove', (e) => {
      const mark = e.target && e.target.closest ? e.target.closest('[data-tip]') : null;
      if (mark) chartTip.show(mark.getAttribute('data-tip'), e.clientX, e.clientY);
      else chartTip.hide();
    });
    container.addEventListener('mouseleave', () => chartTip.hide());
  }

  // Transparent full-height hover columns, so thin bars are still easy to hit
  function hoverColumns(items, x0, colW, top = 8, height = 92) {
    return items.map((it, i) => {
      const x = x0 + i * colW;
      return `<rect x="${x.toFixed(1)}" y="${top}" width="${colW.toFixed(1)}" height="${height}" fill="transparent" data-tip="${esc(it)}" style="cursor:crosshair"/>`;
    }).join('');
  }

  /* ── Signed vertical scale ──
     A meter reset or a bad interval can push a daily sum below zero. Plotting the
     absolute value would draw that as ordinary consumption, so the axis keeps zero
     where it really is: when any value is negative the baseline floats up and those
     bars and points are drawn below it. */
  function signedScale(values, top = 8, bottom = 100) {
    const known = (values || []).filter((v) => v != null && isFinite(v));
    let vmax = known.length ? Math.max(...known) : 1;
    let vmin = known.length ? Math.min(...known) : 0;
    if (vmax < 0) vmax = 0;      // all-negative data still shows the zero line
    if (vmin > 0) vmin = 0;      // positive-only charts keep their zero baseline
    if (vmax === vmin) vmax = vmin + 1;
    const span = vmax - vmin;
    return {
      vmin, vmax, hasNeg: vmin < 0,
      y: (v) => bottom - ((v - vmin) / span) * (bottom - top),
    };
  }

  const axisNum = (v) => Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v));

  // Grid lines and y-axis labels for a signed scale; zero is always solid
  function signedAxis(sc) {
    const line = (yv, solid) => `<line x1="30" y1="${yv.toFixed(1)}" x2="318" y2="${yv.toFixed(1)}" stroke="var(--bd1)"${solid ? '' : ' stroke-dasharray="2 3"'}/>`;
    const text = (yv, s) => `<text x="24" y="${(yv + 3).toFixed(1)}" text-anchor="end">${s}</text>`;
    const zy = sc.y(0);
    let grid = line(sc.y(sc.vmax), false) + line(zy, true);
    let labels = text(sc.y(sc.vmax), axisNum(sc.vmax)) + text(zy, '0');
    if (sc.hasNeg) {
      grid += line(sc.y(sc.vmin), false);
      labels += text(sc.y(sc.vmin), axisNum(sc.vmin));
    } else {
      grid += line(sc.y(sc.vmax / 2), false);
      labels += text(sc.y(sc.vmax / 2), axisNum(sc.vmax / 2));
    }
    return { grid, labels, zero: zy };
  }

  const dayMon = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  const stamp = (d) => `${dayMon(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
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
          ${k.loadSrc === 'pmu' ? `<div class="kpi-sub">${t('PMU live sum')} &middot; ${k.loadPmuCount} PMU</div>` : ''}
          ${k.loadSrc === 'peak' ? `<div class="kpi-sub">${t('Peak demand · 15-min')}</div>` : ''}
          ${spark ? `
          <svg viewBox="0 0 240 48" preserveAspectRatio="none" style="width: 100%; height: 44px; display: block; margin-block: 6px;">
            <path d="${spark.area}" fill="var(--acc8)" stroke="none"></path>
            <path d="${spark.line}" fill="none" stroke="var(--acc)" stroke-width="1.5"></path>
            ${spark.dots}
          </svg>
          <div class="kpi-sub">${k.sparkSrc === 'peak' ? t('Peak demand, last 24 readings · kW') : t('Hourly consumption, last 24 h · kWh')}</div>` : ''}
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
  function renderRightPanel(modId, subId, force) {
    const rpContent = document.getElementById('rpContent');
    const rpTitle   = document.querySelector('.rp-title');
    const rpSub     = document.querySelector('.rp-subtitle');
    const rpBack    = document.querySelector('.rp-back');
    if (!rpContent) return;

    const isEnergyMod = modId === 'energy';
    const hasSub      = !!subId;
    const showWaste   = hasSub && subId === 'waste';
    const built       = hasSub && !!SUB_RENDERERS[subId];
    const showStub    = hasSub && !showWaste && !built;
    const showEnergyHome = !hasSub && isEnergyMod;
    const showOpsHome    = !hasSub && modId === 'operations';
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
      } else if (built) {
        rpSub.textContent = t(SUB_SUBTITLES[subId] || 'Sub-view'); rpSub.style.display = '';
      } else if (showStub) {
        rpSub.textContent = t('Sub-view'); rpSub.style.display = '';
      } else if (showOpsHome) {
        rpSub.textContent = t('Live alarms and equipment health'); rpSub.style.display = '';
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
    } else if (built) {
      html = SUB_RENDERERS[subId]();
    } else if (showStub) {
      html = `<div style="padding:26px 14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;line-height:1.5;color:var(--t3)">${t(STUB_REASONS[subId] || 'Detail view in design')}</div>`;
    } else if (showOpsHome) {
      html = operationsHomeHtml();
    } else {
      html = `<div style="padding:26px 14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;line-height:1.5;color:var(--t3)">${t('In design')}</div>`;
    }

    const focus = document.activeElement;
    if (!force && focus && focus.tagName === 'SELECT' &&
        rpContent.contains && rpContent.contains(focus)) {
      rpRenderQueued = true;     // flushed by the focusout handler below
      return;
    }
    rpRenderQueued = false;
    rpContent.innerHTML = html;
  }

  const STUB_REASONS = {
    bench: 'Requires portfolio',
    budget: 'Requires budget targets in Settings',
    fcst: 'In design',
  };

  const SUB_SUBTITLES = {
    lbm: 'Live PMU meters · 5 parameters',
    anom: 'Hourly load vs typical profile',
    livesys: 'Equipment liveness and point detail',
    histch: 'Chart picker over historized points',
    water: 'Water and gas meters · consumption and health',
    cons: 'Total and per-service consumption over time',
    evstats: 'Counts by severity and day',
    alarms: 'Active alarm list',
  };

  let waterSelected = null;
  let consRange = 7;
  let consSelected = null;

  /* ── Shared chart + meter helpers ── */

  // Generic time-series line chart; optional dashed reference series (e.g. setpoint)
  function seriesLineChartHtml(series, refSeries, unit) {
    if (!series || !series.length) return emptyBox(t('No history yet'));
    const all = refSeries && refSeries.length ? series.concat(refSeries) : series;
    const t0 = Math.min(...all.map((p) => p.ts.getTime()));
    const t1 = Math.max(...all.map((p) => p.ts.getTime()));
    const span = (t1 - t0) || 1;
    const vals = all.map((p) => p.val);
    let vmin = Math.min(...vals), vmax = Math.max(...vals);
    if (vmax === vmin) { vmax = vmin + 1; }
    const pad = (vmax - vmin) * 0.08;
    vmin -= pad; vmax += pad;
    const x = (ts) => 30 + ((ts - t0) / span) * 288;
    const y = (v) => 100 - ((v - vmin) / (vmax - vmin)) * 92;
    const pts = (s) => s.map((p) => `${x(p.ts.getTime()).toFixed(1)},${y(p.val).toFixed(1)}`).join(' ');
    const fmtAxis = (v) => Math.abs(v) >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(1);
    const dLabel = (ms) => {
      const d = new Date(ms);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    };
    // The scale follows the data, so negatives already plot below — but mark where
    // zero actually falls whenever the series crosses it
    const zeroLine = (vmin < 0 && vmax > 0) ? `
        <line x1="30" y1="${y(0).toFixed(1)}" x2="318" y2="${y(0).toFixed(1)}" stroke="var(--bd2)"/>
        <text x="24" y="${(y(0) + 3).toFixed(1)}" text-anchor="end" font-family="'JetBrains Mono',monospace" font-size="8" fill="var(--t3)">0</text>` : '';
    return `
      <svg viewBox="0 0 330 122" style="width:100%;height:auto;display:block;direction:ltr" role="img" aria-label="point trend">
        <line x1="30" y1="8" x2="318" y2="8" stroke="var(--bd1)" stroke-dasharray="2 3"/>
        <line x1="30" y1="54" x2="318" y2="54" stroke="var(--bd1)" stroke-dasharray="2 3"/>
        <line x1="30" y1="100" x2="318" y2="100" stroke="var(--bd1)"/>
        ${zeroLine}
        <g font-family="'JetBrains Mono',monospace" font-size="8" fill="var(--t3)">
          <text x="24" y="103" text-anchor="end">${fmtAxis(vmin)}</text>
          <text x="24" y="57" text-anchor="end">${fmtAxis((vmin + vmax) / 2)}</text>
          <text x="24" y="12" text-anchor="end">${fmtAxis(vmax)}</text>
          <text x="30" y="114" text-anchor="middle">${dLabel(t0)}</text>
          <text x="318" y="114" text-anchor="end">${dLabel(t1)}</text>
          ${unit ? `<text x="174" y="114" text-anchor="middle">${esc(unit)}</text>` : ''}
        </g>
        ${/* Its own colour and a longer dash — in var(--t3) with a 3 3 dash it was
              indistinguishable from the dashed grid lines behind it */''}
        ${refSeries && refSeries.length >= 2 ? `<polyline points="${pts(refSeries)}" fill="none" stroke="var(--posTx)" stroke-width="1.4" stroke-dasharray="6 3"/>` : ''}
        <polyline points="${pts(series)}" fill="none" stroke="var(--acc)" stroke-width="1.5"/>
        <g>${series.map((p) => {
          const ref = refSeries && refSeries.length
            ? refSeries.reduce((a, r) => Math.abs(r.ts - p.ts) < Math.abs(a.ts - p.ts) ? r : a)
            : null;
          const tip = `${stamp(p.ts)}\n${shortNum(p.val, 2)}${unit ? ' ' + unit : ''}` +
            (ref ? `\n${t('ref')} ${shortNum(ref.val, 2)}` : '');
          return `<circle cx="${x(p.ts.getTime()).toFixed(1)}" cy="${y(p.val).toFixed(1)}" r="4" fill="transparent" data-tip="${esc(tip)}" style="cursor:crosshair"/>`;
        }).join('')}</g>
      </svg>`;
  }

  function lastReading(series) {
    if (!series || !series.length) return null;
    const last = series[series.length - 1];
    return { ts: last.ts, val: last.val, ageH: (Date.now() - last.ts.getTime()) / 3600000 };
  }

  function ageLabel(hours) {
    if (hours == null) return '—';
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 48) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  }

  // Meters may historize a rising totalizer or a per-interval rate — detect which,
  // so we never report a totalizer's absolute reading as period consumption.
  function periodConsumption(series, hours) {
    if (!series || series.length < 2) return null;
    const cutoff = Date.now() - hours * 3600000;
    const pts = series.filter((p) => p.ts.getTime() >= cutoff);
    if (pts.length < 2) return null;
    let rising = true;
    for (let i = 1; i < pts.length; i++) {
      if (pts[i].val < pts[i - 1].val - 1e-9) { rising = false; break; }
    }
    return rising
      ? { value: pts[pts.length - 1].val - pts[0].val, mode: 'totalizer' }
      : { value: pts.reduce((a, p) => a + p.val, 0), mode: 'interval' };
  }

  function statTile(value, label, color) {
    return `
      <div style="flex:1;min-width:0;background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:11px;text-align:center">
        <div style="font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:600;color:${color || 'var(--t1)'};overflow:hidden;text-overflow:ellipsis">${value}</div>
        <div style="font-size:9.5px;letter-spacing:0.6px;color:var(--t3);text-transform:uppercase;margin-block-start:3px">${label}</div>
      </div>`;
  }

  function equipList() {
    const eq = live.equipment;
    return eq && Array.isArray(eq.equipment) ? eq.equipment : [];
  }

  // Point quality per the xlsx row: healthy vs faulted from the point status tag.
  // Staleness stays unreported until per-type thresholds are agreed.
  function pointQuality() {
    let total = 0, healthy = 0, faulted = 0, historized = 0;
    equipList().forEach((e) => {
      (e.points || []).forEach((p) => {
        total++;
        if (p.his) historized++;
        if (String(p.status || 'ok').toLowerCase() === 'ok') healthy++;
        else faulted++;
      });
    });
    return { total, healthy, faulted, historized };
  }

  /* ── Operations module home ── */
  function operationsHomeHtml() {
    const counts = live.alarms ? live.alarms.counts : null;
    const fac = live.power ? live.power.facilityServices : null;
    const inAlarm = equipList().filter((e) => e.inAlarm);
    const q = pointQuality();

    const alarmRows = inAlarm.length
      ? inAlarm.slice(0, 8).map((e) => `
        <button data-eq="${esc(e.name)}" style="width:100%;display:flex;align-items:center;gap:8px;background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:9px 12px;cursor:pointer;text-align:start">
          <span style="flex:none;width:6px;height:6px;border-radius:50%;background:var(--crit)"></span>
          <span style="flex:1;min-width:0;font-family:var(--fH),sans-serif;font-size:12px;color:var(--t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(e.name)}</span>
          <span style="flex:none;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3)">${(e.alarms || []).length}</span>
        </button>`).join('')
      : emptyBox(t('No equipment in alarm'));

    return `
      <div style="display:flex;gap:8px">
        ${statTile(counts ? String(counts.total) : '—', t('open'), counts && counts.critical ? 'var(--crit)' : null)}
        ${statTile(fac ? `${fac.onlineEquipment}/${fac.totalEquipment}` : '—', t('live'))}
        ${statTile(q.total ? String(q.total) : '—', t('points'))}
      </div>
      <div style="font-family:var(--fH),sans-serif;font-size:10px;font-weight:600;letter-spacing:0.8px;color:var(--t2);margin-block-start:2px">${t('EQUIPMENT IN ALARM')}</div>
      ${alarmRows}`;
  }

  /* ── Live Systems: equipment list + detail ── */
  function liveSystemsHtml() {
    const list = equipList();
    if (!list.length) return emptyBox(t('No equipment reported yet'));
    if (livesysSelected) {
      const eq = list.find((e) => e.name === livesysSelected);
      if (eq) return equipDetailHtml(eq);
      livesysSelected = null;
    }
    const q = pointQuality();
    const rows = list.map((e) => {
      const pts = (e.points || []).length;
      const alarms = (e.alarms || []).length;
      const dot = alarms ? 'var(--crit)' : (pts ? 'var(--pos, var(--acc))' : 'var(--t3)');
      return `
        <button data-eq="${esc(e.name)}" style="width:100%;display:flex;align-items:center;gap:8px;background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:9px 12px;cursor:pointer;text-align:start">
          <span style="flex:none;width:6px;height:6px;border-radius:50%;background:${dot}"></span>
          <span style="flex:1;min-width:0">
            <span style="display:block;font-family:var(--fH),sans-serif;font-size:12px;color:var(--t1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(e.name)}</span>
            <span style="display:block;font-size:10px;color:var(--t3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(e.floor || '')}</span>
          </span>
          <span style="flex:none;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t3)">${pts}p</span>
          ${alarms ? `<span style="flex:none;padding:1px 6px;border-radius:4px;background:var(--critT);border:1px solid var(--crit);color:var(--crit);font-family:'JetBrains Mono',monospace;font-size:9px">${alarms}</span>` : ''}
        </button>`;
    }).join('');

    return `
      <div style="display:flex;gap:8px">
        ${statTile(String(q.total), t('points'))}
        ${statTile(String(q.healthy), t('healthy'), 'var(--acc)')}
        ${statTile(String(q.faulted), t('faulted'), q.faulted ? 'var(--warnTx)' : null)}
      </div>
      <div style="font-size:10px;color:var(--t3)">${t('Staleness requires per-point thresholds')}</div>
      ${rows}`;
  }

  // Header shows the floor only: eq.category is the backend's catch-all bucket
  // ("hvac" for anything non-CCTV), not a real classification, and eq.bimId is
  // an internal FIN guid — neither means anything to an operator.
  function equipDetailHtml(eq) {
    const points = eq.points || [];
    const hisPoints = points.filter((p) => p.his && p.id);
    if (livesysPointId && !hisPoints.some((p) => p.id === livesysPointId)) livesysPointId = null;
    // Timeline rule 3 / xlsx: chart the key signal against its setpoint when one
    // exists. Pair on the name — RA_Temp ↔ RA_Temp_SP — rather than taking the
    // first point containing "sp", which on an AHU with several measured signals
    // would happily chart RA_Temp against Zone_Temp_SP.
    const isSetpoint = (n) => /[_\s-](sp|setpoint|set_point|stpt)$/i.test(String(n));
    const baseName = (n) => String(n).replace(/[_\s-](sp|setpoint|set_point|stpt)$/i, '');

    if (!livesysPointId && hisPoints.length) {
      const zone = hisPoints.find((p) => /temp/i.test(p.navName) && !isSetpoint(p.navName));
      livesysPointId = (zone || hisPoints[0]).id;
    }

    const selected = hisPoints.find((p) => p.id === livesysPointId) || null;
    let mainPoint = selected, refPoint = null;
    if (selected) {
      const base = baseName(selected.navName);
      const pair = hisPoints.find((p) => p !== selected && baseName(p.navName) === base &&
        isSetpoint(p.navName) !== isSetpoint(selected.navName));
      // Clicking either half of a pair shows the same chart: measured solid,
      // setpoint dashed. A setpoint on its own still charts by itself.
      if (pair) {
        mainPoint = isSetpoint(selected.navName) ? pair : selected;
        refPoint = isSetpoint(selected.navName) ? selected : pair;
      }
    }
    const series = mainPoint ? pointSeries(mainPoint.id) : [];
    const refSeries = refPoint ? pointSeries(refPoint.id) : null;

    // A setpoint that has a measured partner gets no chip of its own: both chips
    // drew the identical measured-vs-setpoint chart, so the second was redundant.
    // Orphan setpoints (no measurement to pair with) still get one.
    const partnerOf = (p) => hisPoints.find((q) => q !== p && baseName(q.navName) === baseName(p.navName) &&
      isSetpoint(q.navName) !== isSetpoint(p.navName));
    const chipPoints = hisPoints.filter((p) => !(isSetpoint(p.navName) && partnerOf(p)));

    const chipRow = chipPoints.length ? `
      <div style="display:flex;flex-wrap:wrap;gap:5px">
        ${chipPoints.map((p) => {
          const on = mainPoint && p.id === mainPoint.id;
          const sp = partnerOf(p);
          return `<button data-eq-pt="${esc(p.id)}"${sp ? ` title="${esc(p.navName)} vs ${esc(sp.navName)}"` : ''} style="padding:3px 9px;border-radius:999px;border:1px solid ${on ? 'var(--acc)' : 'var(--bd2)'};background:${on ? 'var(--acc8)' : 'var(--s2)'};color:${on ? 'var(--acc)' : 'var(--t2)'};font-family:'JetBrains Mono',monospace;font-size:9.5px;cursor:pointer">${esc(p.navName)}${sp ? '<span style="opacity:.55"> +SP</span>' : ''}</button>`;
        }).join('')}
      </div>` : '';

    const chartBlock = !hisPoints.length
      ? emptyBox(t('No historized points on this equipment'))
      : `<div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
          <div style="display:flex;align-items:baseline;gap:8px;margin-block-end:10px">
            <span style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1)">${esc(mainPoint ? mainPoint.navName : '')}</span>
            ${refPoint ? `<span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t3)">vs ${esc(refPoint.navName)}</span>` : ''}
          </div>
          ${series == null ? loadingBox() : seriesLineChartHtml(series, refSeries, mainPoint ? mainPoint.unit : '')}
          ${refPoint ? `
          <div style="display:flex;gap:12px;margin-block-start:8px;flex-wrap:wrap">
            <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:14px;height:2px;background:var(--acc)"></span>${esc(mainPoint.navName)}</span>
            <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:14px;height:0;border-top:2px dashed var(--posTx)"></span>${esc(refPoint.navName)}</span>
          </div>` : ''}
        </div>`;

    const alarmsBlock = (eq.alarms || []).length ? `
      <div style="font-family:var(--fH),sans-serif;font-size:10px;font-weight:600;letter-spacing:0.8px;color:var(--t2)">${t('ALARMS')}</div>
      ${eq.alarms.map((a) => `
        <div style="background:var(--critT);border:1px solid var(--crit);border-radius:8px;padding:9px 12px;font-size:11.5px;color:var(--t1)">
          ${esc(a.alarm || '')}${a.priority ? `<span style="float:inline-end;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--t3)">P${esc(a.priority)}</span>` : ''}
        </div>`).join('')}` : '';

    // Point names and FDD messages are long ("Sensor No Response - Possible
    // Faults : Check the SA Temp Sensor, …"). Truncating them hid the very text
    // that says what is wrong, so nothing is clipped: short values sit inline on
    // the right, long ones drop onto their own wrapped lines under the name.
    const pointRows = points.length ? points.map((p) => {
      const ok = String(p.status || 'ok').toLowerCase() === 'ok';
      const val = String(p.currentValue == null ? '—' : p.currentValue);
      const stacked = val.length > 22;
      const valStyle = `font-family:'JetBrains Mono',monospace;font-size:10px;line-height:1.45;` +
        `color:${ok ? 'var(--t1)' : 'var(--warnTx)'};overflow-wrap:anywhere`;
      return `
        <div style="display:flex;${stacked ? 'flex-direction:column;align-items:flex-start;gap:2px' : 'align-items:baseline;gap:10px'};padding:6px 9px;border-top:1px solid var(--bd1)">
          <span style="${stacked ? '' : 'flex:1;min-width:0;'}font-size:10.5px;line-height:1.45;color:var(--t2);overflow-wrap:anywhere">${esc(p.navName)}${p.his ? '<span style="color:var(--acc);font-size:8px"> ●</span>' : ''}</span>
          <span style="${stacked ? '' : 'flex:none;text-align:end;'}${valStyle}">${esc(val)}</span>
        </div>`;
    }).join('') : `<div style="padding:10px;text-align:center;font-size:11px;color:var(--t3)">${t('No points reporting')}</div>`;

    return `
      <button data-eq-back="1" style="align-self:flex-start;display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--t2);font-size:11.5px;cursor:pointer;padding:0">← ${t('All equipment')}</button>
      <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:11px 13px">
        <div style="font-family:var(--fH),sans-serif;font-size:13px;font-weight:600;color:var(--t1)">${esc(eq.name)}</div>
        <div style="font-size:10.5px;color:var(--t3);margin-block-start:2px">${esc(eq.floor || '')}</div>
      </div>
      ${alarmsBlock}
      ${chipRow}
      ${chartBlock}
      <div style="font-family:var(--fH),sans-serif;font-size:10px;font-weight:600;letter-spacing:0.8px;color:var(--t2)">${t('POINTS')}</div>
      <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;overflow:hidden">${pointRows}</div>`;
  }

  /* ── History Charts: picker over historized points ── */
  function historyChartsHtml() {
    ensureHisPoints();
    const cfgKeys = live.power && live.power.power_history ? Object.keys(live.power.power_history) : [];
    const finPoints = async$.hisPoints ? async$.hisPoints.points : null;
    if (finPoints == null && !cfgKeys.length) return loadingBox();

    const optGroup = (label, opts) => opts.length
      ? `<optgroup label="${esc(label)}">${opts.join('')}</optgroup>` : '';
    const cfgOpts = cfgKeys.map((k) =>
      `<option value="cfg:${esc(k)}"${histchPointId === 'cfg:' + k ? ' selected' : ''}>${esc(k.replace(/_his$/i, '').replace(/_/g, ' '))}</option>`);

    // FIN's point dis is already "<equip> <point>", so prefixing the equipRef
    // repeated it — "ILIANA KPI_CALCULATION · ILIANA KPI_CALCULATION Peak_Demand" —
    // and a native dropdown sizes itself to its widest option, which is why it
    // spilled out of the panel. Strip the prefix; one optgroup per equipment
    // carries the name once.
    const pointLabel = (p) => {
      const d = String(p.dis || p.navName || '').trim();
      const e = String(p.equip || '').trim();
      return (e && d.startsWith(e) ? d.slice(e.length).trim() : d) || d || String(p.id);
    };
    const byEquip = new Map();
    (finPoints || []).forEach((p) => {
      const k = p.equip || t('FIN historized points');
      if (!byEquip.has(k)) byEquip.set(k, []);
      byEquip.get(k).push(p);
    });
    const finGroups = [...byEquip.entries()].map(([equip, pts]) =>
      optGroup(equip, pts.map((p) =>
        `<option value="pt:${esc(p.id)}"${histchPointId === 'pt:' + p.id ? ' selected' : ''}>${esc(pointLabel(p))}</option>`))
    ).join('');

    if (!cfgOpts.length && !(finPoints || []).length) {
      return emptyBox(t('No historized points reported by FIN'));
    }
    if (!histchPointId) histchPointId = cfgOpts.length ? 'cfg:' + cfgKeys[0] : 'pt:' + finPoints[0].id;

    let series = null, unit = '', label = '';
    if (histchPointId.startsWith('cfg:')) {
      const key = histchPointId.slice(4);
      series = historySeries(key);
      label = key.replace(/_his$/i, '').replace(/_/g, ' ');
    } else {
      const id = histchPointId.slice(3);
      series = pointSeries(id, 7);
      const p = (finPoints || []).find((x) => x.id === id);
      unit = p ? p.unit : '';
      // The card heading has room for the equipment; the dropdown row does not
      label = p ? (p.equip ? `${p.equip} · ${pointLabel(p)}` : pointLabel(p)) : id;
    }

    return `
      <select id="histchSelect" style="width:100%;max-width:100%;padding:7px 9px;border-radius:8px;border:1px solid var(--bd2);background:var(--s2);color:var(--t1);font-family:var(--fH),sans-serif;font-size:11.5px">
        ${optGroup(t('Configured historians'), cfgOpts)}
        ${finGroups}
      </select>
      <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
        <div style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1);margin-block-end:10px">${esc(label)}</div>
        ${series == null ? loadingBox() : seriesLineChartHtml(series, null, unit)}
      </div>
      ${pending$.hisPoints ? `<div style="font-size:10px;color:var(--t3)">${t('Loading FIN point list…')}</div>` : ''}`;
  }

  /* ── Water: water + gas meters, consumption and health ── */
  function waterPanelHtml() {
    const hist = live.power && live.power.power_history ? live.power.power_history : null;
    if (!hist) return emptyBox('—');
    const rows = WATER_CHANNELS.filter((c) => hist[c.key]).map((c) => ({ ...c, series: historySeries(c.key) }));
    if (!rows.length) return emptyBox(t('No meter history yet'));
    if (waterSelected && !rows.some((r) => r.key === waterSelected)) waterSelected = null;
    if (!waterSelected) waterSelected = rows[0].key;

    const liveWater = live.power ? live.power.total_water : null;
    const waterRows = rows.filter((r) => r.kind === 'water');
    const gasRows = rows.filter((r) => r.kind === 'gas');

    const table = (list, title, note) => !list.length ? '' : `
      <div style="font-family:var(--fH),sans-serif;font-size:10px;font-weight:600;letter-spacing:0.8px;color:var(--t2);margin-block-start:2px">${title}</div>
      ${note ? `<div style="font-size:10px;color:var(--t3);margin-block-end:-4px">${note}</div>` : ''}
      <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr>
            <th style="padding:5px 6px;text-align:start;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--t3)">${t('Channel')}</th>
            <th style="padding:5px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--t3)">24h</th>
            <th style="padding:5px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--t3)">7d</th>
            <th style="padding:5px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--t3)">${t('last')}</th>
          </tr></thead>
          <tbody>${list.map((r) => {
            const d1 = periodConsumption(r.series, 24);
            const d7 = periodConsumption(r.series, 168);
            const last = lastReading(r.series);
            const stale = last && last.ageH > 24;
            return `
            <tr data-wm="${esc(r.key)}" style="border-top:1px solid var(--bd1);cursor:pointer;${r.key === waterSelected ? 'background:var(--acc8);' : ''}">
              <td style="padding:4px 6px;font-size:10.5px;color:var(--t1);max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t(r.label)}</td>
              <td style="padding:4px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t2)">${d1 ? shortNum(d1.value, 1) : '—'}</td>
              <td style="padding:4px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t2)">${d7 ? shortNum(d7.value, 1) : '—'}</td>
              <td style="padding:4px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:${stale ? 'var(--warnTx)' : 'var(--t3)'}">${last ? ageLabel(last.ageH) : '—'}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>`;

    const sel = rows.find((r) => r.key === waterSelected);
    const mode = sel ? periodConsumption(sel.series, 168) : null;
    const chart = sel ? `
      <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
        <div style="display:flex;align-items:baseline;gap:8px;margin-block-end:10px">
          <span style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1)">${t(sel.label)}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t3)">${mode ? t(mode.mode === 'totalizer' ? 'meter reading' : 'per-interval') : ''}</span>
        </div>
        ${seriesLineChartHtml(sel.series, null, '')}
      </div>` : '';

    return `
      <div style="display:flex;gap:8px">
        ${statTile(waterRows.length ? String(waterRows.length) : '—', t('water channels'))}
        ${statTile(gasRows.length ? '1' : '—', t('gas meter'))}
        ${statTile(liveWater != null ? shortNum(liveWater, 1) : '—', t('live total'))}
      </div>
      ${table(waterRows, t('WATER'), '')}
      ${table(gasRows, t('GAS'), t('1 gas meter · 3 kitchen channels'))}
      ${chart}`;
  }

  /* ── Consumption: total and per-service over time (xlsx row 13) ──
     Per-service = the FIN hourly energy calcs per distribution board. This is
     the reference view, so it deliberately does not repeat the overview KPIs. */
  // Each "service" is an electrical distribution board, metered by one PMU.
  // Panel and meter names verified against the FIN equipment list.
  const SERVICE_CHANNELS = [
    { key: 'Hourly_EC_MCC1_his', label: 'MCC 1', panel: 'MCC-01', meter: 'PMU09_MCC_01', desc: 'Motor control centre 01 · basement' },
    { key: 'Hourly_EC_MCC2_his', label: 'MCC 2', panel: 'MCC-02', meter: 'PMU04_MCC_02', desc: 'Motor control centre 02 · basement' },
    { key: 'Hourly_EC_SMDB_KIT_his', label: 'Kitchen SMDB', panel: 'SMDBs', meter: 'PMU05_SMDB_KIT', desc: 'Kitchen sub-main distribution board' },
    { key: 'Hourly_EC_LVFP_his', label: 'LVFP', panel: 'LVFP Z7-01', meter: 'PMU06_LVFP_Z7_01', desc: 'Low-voltage feeder pillar · zone 7' },
    { key: 'Hourly_EC_ATS_his', label: 'ATS', panel: 'ATS', meter: 'PMU07_ATS_E', desc: 'Automatic transfer switch · essential supply' },
    { key: 'Hourly_EC_SP_his', label: 'Sump pump', panel: 'SUMP PUMP', meter: 'PMU08_SWPS02_CONTROLPANEL', desc: 'Sump / sewage pump station 02 control panel' },
  ];

  // Daily bars over an arbitrary range (weeklyChartHtml is fixed at 7 days, which
  // renders empty whenever the historian stopped collecting more than a week ago).
  function dailyBarsHtml(series, days) {
    const now = new Date();
    const bars = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const s = sumDay(series, d);
      bars.push({ date: d, sum: s ? s.sum : null });
    }
    const known = bars.filter((b) => b.sum != null);
    if (!known.length) return emptyBox(t('No history in this range'));

    // Bars grow from the zero line, so a negative day hangs below it
    const sc = signedScale(bars.map((b) => b.sum));
    const ax = signedAxis(sc);
    const w = 288 / days;
    const bw = Math.max(1, w * (days > 30 ? 0.85 : 0.6));
    const rects = bars.map((b, i) => {
      if (b.sum == null) return '';
      const yv = sc.y(b.sum);
      const x = 30 + i * w + (w - bw) / 2;
      return `<rect x="${x.toFixed(1)}" y="${Math.min(ax.zero, yv).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0.6, Math.abs(yv - ax.zero)).toFixed(1)}" fill="${b.sum < 0 ? 'var(--warn)' : 'var(--btnP)'}"/>`;
    }).join('');

    const mid = bars[Math.floor(bars.length / 2)];
    const tips = bars.map((b) => {
      const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][b.date.getDay()];
      return `${t(wd)} ${dayMon(b.date)}\n${b.sum == null ? t('no data') : shortNum(b.sum, 1) + ' kWh'}`;
    });
    return `
      <svg viewBox="0 0 330 122" style="width:100%;height:auto;display:block;direction:ltr" role="img" aria-label="daily consumption">
        ${ax.grid}
        <g font-family="'JetBrains Mono',monospace" font-size="8" fill="var(--t3)">
          ${ax.labels}
          <text x="30" y="114" text-anchor="start">${dayMon(bars[0].date)}</text>
          <text x="174" y="114" text-anchor="middle">${dayMon(mid.date)}</text>
          <text x="318" y="114" text-anchor="end">${dayMon(bars[bars.length - 1].date)}</text>
        </g>
        ${rects}
        ${hoverColumns(tips, 30, w)}
      </svg>`;
  }

  function rangeSum(series, days) {
    if (!series || !series.length) return null;
    const now = new Date();
    let sum = 0, n = 0;
    for (let i = 0; i < days; i++) {
      const d = sumDay(series, new Date(now.getFullYear(), now.getMonth(), now.getDate() - i));
      if (d) { sum += d.sum; n += d.count; }
    }
    return n ? { sum, count: n } : null;
  }

  function consumptionPanelHtml() {
    const hist = live.power && live.power.power_history ? live.power.power_history : null;
    if (!hist) return emptyBox('—');

    const total = historySeries('Total_Power_Consumption_his');
    const services = SERVICE_CHANNELS
      .filter((c) => hist[c.key])
      .map((c) => ({ ...c, series: historySeries(c.key) }));
    if (!total.length && !services.length) return emptyBox(t('No history yet'));

    if (consSelected && !services.some((s) => s.key === consSelected)) consSelected = null;

    const totalRange = rangeSum(total, consRange);
    const svcRows = services.map((s) => ({ ...s, range: rangeSum(s.series, consRange), last: lastReading(s.series) }));
    // Share is of the metered services, so the column sums to 100%. Dividing by
    // the building total gave >100% wherever the two do not reconcile.
    const denom = svcRows.reduce((a, s) => a + Math.max(0, s.range ? s.range.sum : 0), 0);
    const svcTotal = svcRows.reduce((a, s) => a + (s.range ? s.range.sum : 0), 0);
    const mismatch = totalRange && totalRange.sum > 0 && svcTotal > 0 &&
      Math.abs(svcTotal - totalRange.sum) / totalRange.sum > 0.2;
    const negatives = svcRows.filter((s) => s.range && s.range.sum < 0).length;

    const pill = (attrs, label, sel) =>
      `<button ${attrs} style="padding:3px 9px;border-radius:999px;border:1px solid ${sel ? 'var(--acc)' : 'var(--bd2)'};background:${sel ? 'var(--acc8)' : 'var(--s2)'};color:${sel ? 'var(--acc)' : 'var(--t2)'};font-family:'JetBrains Mono',monospace;font-size:9.5px;cursor:pointer">${label}</button>`;
    const rangePills = [7, 30, 90]
      .map((d) => pill(`data-cons-range="${d}"`, `${d}d`, d === consRange)).join('');

    // Freshest sample across the shown series — makes a stalled historian obvious
    const freshest = [total, ...services.map((s) => s.series)]
      .map(lastReading).filter(Boolean)
      .sort((a, b) => b.ts - a.ts)[0];
    const staleNote = freshest && freshest.ageH > 24
      ? `<div style="padding:9px 12px;border:1px solid var(--warnB);background:var(--warnT);border-radius:8px;font-size:11px;color:var(--warnTx)">${t('Historian last collected')} ${ageLabel(freshest.ageH)} ${t('ago')}</div>`
      : '';

    const svcTable = !svcRows.length ? '' : `
      <div style="font-family:var(--fH),sans-serif;font-size:10px;font-weight:600;letter-spacing:0.8px;color:var(--t2);margin-block-start:2px">${t('BY SERVICE')}</div>
      <div style="font-size:10px;color:var(--t3);margin-block-end:-4px">${t('Electrical distribution boards · one PMU per board')}</div>
      <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr>
            <th style="padding:5px 6px;text-align:start;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--t3)">${t('Service')}</th>
            <th style="padding:5px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--t3)">kWh</th>
            <th style="padding:5px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--t3)">${t('share')}</th>
            <th style="padding:5px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--t3)">${t('last')}</th>
          </tr></thead>
          <tbody>${svcRows.map((s) => {
            const val = s.range ? s.range.sum : null;
            // A negative daily sum is corrupt meter data, not a share of anything
            const bad = val != null && val < 0;
            const share = (val != null && val >= 0 && denom > 0) ? (val / denom) * 100 : null;
            const stale = s.last && s.last.ageH > 24;
            return `
            <tr data-cons-svc="${esc(s.key)}" data-tip="${esc(`${s.panel} — ${t(s.desc)}\n${t('metered by')} ${s.meter}`)}" style="border-top:1px solid var(--bd1);cursor:pointer;${s.key === consSelected ? 'background:var(--acc8);' : ''}">
              <td style="padding:4px 6px;font-size:10.5px;color:var(--t1);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                ${t(s.label)}<span style="display:block;font-size:9px;color:var(--t3);overflow:hidden;text-overflow:ellipsis">${esc(s.panel)}</span>
              </td>
              <td style="padding:4px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:${bad ? 'var(--warnTx)' : 'var(--t2)'}" ${bad ? `title="${t('Negative total — meter reset or bad data')}"` : ''}>${val == null ? '—' : shortNum(val, 0)}</td>
              <td style="padding:4px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t3)">${share == null ? '—' : share.toFixed(0) + '%'}</td>
              <td style="padding:4px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:${stale ? 'var(--warnTx)' : 'var(--t3)'}">${s.last ? ageLabel(s.last.ageH) : '—'}</td>
            </tr>`;
          }).join('')}</tbody>
        </table>
      </div>`;

    const sel = svcRows.find((s) => s.key === consSelected);
    const chartSeries = sel ? sel.series : total;
    const chartLabel = sel ? t(sel.label) : t('Total building');

    return `
      <div style="display:flex;flex-wrap:wrap;gap:5px">${rangePills}</div>
      ${staleNote}
      <div style="display:flex;gap:8px">
        ${statTile(totalRange ? shortNum(totalRange.sum, 0) : '—', `${t('total')} ${consRange}d`)}
        ${statTile(svcRows.length ? String(svcRows.length) : '—', t('services'))}
      </div>
      <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
        <div style="display:flex;align-items:baseline;gap:8px;margin-block-end:10px">
          <span style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1)">${chartLabel}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t3)">${t('kWh / day')}</span>
        </div>
        ${dailyBarsHtml(chartSeries, consRange)}
      </div>
      ${svcTable}
      ${mismatch ? `<div style="font-size:10px;color:var(--warnTx)">${t('Services sum to')} ${shortNum(svcTotal, 0)} kWh ${t('vs building total')} ${shortNum(totalRange.sum, 0)} kWh — ${t('the two do not reconcile')}</div>` : ''}
      ${negatives ? `<div style="font-size:10px;color:var(--warnTx)">${negatives} ${t('service(s) report a negative total — meter reset or bad data')}</div>` : ''}
      ${sel ? `<div style="font-size:10px;color:var(--t3)">${t('Showing')} ${chartLabel} — ${t('click again for building total')}</div>` : ''}`;
  }

  const SUB_RENDERERS = {
    cons: consumptionPanelHtml,
    lbm: lbmPanelHtml,
    anom: anomPanelHtml,
    livesys: liveSystemsHtml,
    histch: historyChartsHtml,
    water: waterPanelHtml,
    evstats: eventStatsHtml,
    alarms: alarmListHtml,
  };

  function weeklyChartHtml(kind, seriesOverride) {
    const series = seriesOverride || historySeries('Total_Power_Consumption_his');
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
    const sc = signedScale(days.map((d) => d.sum));
    const ax = signedAxis(sc);
    const yFor = (v) => sc.y(v);
    const dayLabels = days.map((d, i) =>
      `<text x="${30 + i * 48}" y="114" text-anchor="middle">${t(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.date.getDay()])}</text>`).join('');
    let marks = '';
    if (kind === 'bars') {
      // Anchored at zero: a negative day is drawn downward and flagged amber
      marks = days.map((d, i) => {
        if (d.sum == null) return '';
        const y = yFor(d.sum);
        return `<rect x="${24 + i * 48}" y="${Math.min(ax.zero, y).toFixed(1)}" width="12" height="${Math.max(0.6, Math.abs(y - ax.zero)).toFixed(1)}" fill="${d.sum < 0 ? 'var(--warn)' : 'var(--btnP)'}"/>`;
      }).join('');
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
            ${ax.grid}
            <g font-family="'JetBrains Mono',monospace" font-size="8" fill="var(--t3)">
              ${ax.labels}
              ${dayLabels}
            </g>
            ${marks}
            ${hoverColumns(days.map((d) => {
              const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.date.getDay()];
              return `${t(wd)} ${dayMon(d.date)}\n${d.sum == null ? t('no data') : shortNum(d.sum, 1) + ' kWh'}`;
            }), 30 - 24, 48)}
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
    ensureAlarmHistory();
    const hist = async$.alarmHistory;
    let trend;
    if (!hist) {
      trend = loadingBox();
    } else if (!hist.retained || !hist.byDay.length) {
      trend = `<div style="padding:12px;border:1px dashed var(--bd1);border-radius:8px;font-size:11.5px;color:var(--t3);text-align:center">${t('Today only — FIN retains no alarm history for this range')}</div>`;
    } else {
      const max = Math.max(...hist.byDay.map((d) => d.critical + d.warning + d.info)) || 1;
      const w = 288 / hist.byDay.length;
      const bars = hist.byDay.map((d, i) => {
        const x = 30 + i * w + w * 0.2;
        const bw = w * 0.6;
        let yTop = 100;
        return [['info', 'var(--info)'], ['warning', 'var(--warn)'], ['critical', 'var(--crit)']].map(([k, c]) => {
          const h = (d[k] / max) * 92;
          yTop -= h;
          return h > 0 ? `<rect x="${x.toFixed(1)}" y="${yTop.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" fill="${c}"/>` : '';
        }).join('');
      }).join('');
      const labels = hist.byDay.map((d, i) =>
        `<text x="${(30 + i * w + w / 2).toFixed(1)}" y="114" text-anchor="middle">${esc(d.date.slice(5))}</text>`).join('');
      trend = `
        <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
          <div style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1);margin-block-end:10px">${t('Events by day')}</div>
          <svg viewBox="0 0 330 122" style="width:100%;height:auto;display:block;direction:ltr" role="img" aria-label="alarm counts by day">
            <line x1="30" y1="100" x2="318" y2="100" stroke="var(--bd1)"/>
            <g font-family="'JetBrains Mono',monospace" font-size="8" fill="var(--t3)">
              <text x="24" y="103" text-anchor="end">0</text>
              <text x="24" y="12" text-anchor="end">${max}</text>
              ${labels}
            </g>
            ${bars}
            ${hoverColumns(hist.byDay.map((d) =>
              `${d.date}\n${t('critical')} ${d.critical}\n${t('warning')} ${d.warning}\ninfo ${d.info}`), 30, w)}
          </svg>
        </div>`;
    }

    return `
      <div style="display:flex;gap:8px">
        ${tile(t('critical'), counts.critical, 'var(--crit)')}
        ${tile(t('warning'), counts.warning, 'var(--warn)')}
        ${tile('info', counts.info, 'var(--info)')}
      </div>
      ${trend}`;
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

  /* ── Location Based Metering panel ── */
  function lbmPanelHtml() {
    const meters = live.meters;
    const names = meters ? Object.keys(meters).sort() : [];
    if (!names.length) {
      return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">${t('No meter data yet')}</div>`;
    }
    const pmu = pmuLiveSum();
    if (lbmSelectedPmu && !names.includes(lbmSelectedPmu)) lbmSelectedPmu = null;
    if (!lbmSelectedPmu) lbmSelectedPmu = names.find((n) => meterHistKey(n)) || null;

    const tile = (v, label) => `
      <div style="flex:1;background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:10px;text-align:center">
        <div style="font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:600;color:var(--t1)">${v}</div>
        <div style="font-size:9.5px;letter-spacing:0.6px;color:var(--t3);text-transform:uppercase;margin-block-start:3px">${label}</div>
      </div>`;

    const cols = [
      ['active_power', 'kW', 1],
      ['current', 'A', 1],
      ['voltage', 'V', 0],
      ['frequency', 'Hz', 1],
      ['total_energy', 'kWh', 0],
    ];

    const rowsHtml = names.map((name) => {
      const m = meters[name] || {};
      const hasHis = !!meterHistKey(name);
      const sel = hasHis && name === lbmSelectedPmu;
      const num = (String(name).match(/^PMU\d+/i) || [null])[0];
      const cells = cols.map(([key, , d]) =>
        `<td style="padding:4px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t2);white-space:nowrap">${shortNum(m[key], d)}</td>`).join('');
      return `
        <tr ${hasHis ? `data-lbm-pmu="${esc(name)}"` : ''} style="border-top:1px solid var(--bd1);${hasHis ? 'cursor:pointer;' : ''}${sel ? 'background:var(--acc8);' : ''}">
          <td style="padding:4px 6px;max-width:112px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(name)}">
            ${num ? `<span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--t3)">${esc(num.toUpperCase())}</span> ` : ''}
            <span style="font-size:10.5px;color:var(--t1)">${esc(meterZoneLabel(name))}</span>
            ${hasHis ? '<span style="font-size:8px;color:var(--acc);vertical-align:middle"> ●</span>' : ''}
          </td>${cells}
        </tr>`;
    }).join('');

    const selKey = lbmSelectedPmu ? meterHistKey(lbmSelectedPmu) : null;
    const chart = selKey ? `
      <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
        <div style="display:flex;align-items:baseline;gap:8px;margin-block-end:10px">
          <span style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1)">${esc(lbmSelectedPmu)}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t3)">${t('kWh / day')}</span>
        </div>
        ${weeklyChartHtml('line', historySeries(selKey))}
      </div>` : '';

    return `
      <div style="display:flex;gap:8px">
        ${tile(String(names.length), t('meters live'))}
        ${tile(pmu ? shortNum(pmu.sum, 1) : '—', 'Σ kW')}
      </div>
      <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr>
            <th style="padding:5px 6px;text-align:start;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--t3)">${t('Meter')}</th>
            ${cols.map((c) => `<th style="padding:5px 6px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:var(--t3)">${c[1]}</th>`).join('')}
          </tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
      <div style="font-size:10px;color:var(--t3)">● ${t('trend history available — click row')}</div>
      ${chart}`;
  }

  /* ── Flow and Trend Anomaly panel ── */
  function anomPanelHtml() {
    const keys = pmuHistKeys();
    if (!keys.length) {
      return `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">${t('No history yet')}</div>`;
    }
    if (!anomPmu || !keys.includes(anomPmu)) anomPmu = keys[0];
    const now = new Date();
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - anomDayOffset);
    const series = historySeries(anomPmu);

    const pill = (attrs, label, sel) =>
      `<button ${attrs} style="padding:3px 9px;border-radius:999px;border:1px solid ${sel ? 'var(--acc)' : 'var(--bd2)'};background:${sel ? 'var(--acc8)' : 'var(--s2)'};color:${sel ? 'var(--acc)' : 'var(--t2)'};font-family:'JetBrains Mono',monospace;font-size:9.5px;cursor:pointer;white-space:nowrap">${label}</button>`;

    const pmuPills = keys.map((k) => pill(`data-anom-pmu="${esc(k)}"`, esc(k.replace(/_his$/i, '')), k === anomPmu)).join('');
    const dayPills = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const lbl = i === 0 ? t('Today') : t(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]);
      return pill(`data-anom-day="${i}"`, lbl, i === anomDayOffset);
    }).join('');

    const chart = anomChartHtml(series, day);
    return `
      <div style="display:flex;flex-wrap:wrap;gap:5px">${pmuPills}</div>
      <div style="display:flex;flex-wrap:wrap;gap:5px">${dayPills}</div>
      <div style="background:var(--s2);border:1px solid var(--bd1);border-radius:8px;padding:13px">
        <div style="display:flex;align-items:baseline;gap:8px;margin-block-end:10px">
          <span style="font-family:var(--fH),sans-serif;font-size:12px;font-weight:600;color:var(--t1)">${esc(anomPmu.replace(/_his$/i, ''))}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--t3)">kWh / ${t('hour')}</span>
        </div>
        ${chart.html}
        <div style="display:flex;gap:12px;margin-block-start:8px;flex-wrap:wrap">
          <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:14px;height:2px;background:var(--acc)"></span>${t('Actual')}</span>
          <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:14px;height:0;border-top:2px dashed var(--t3)"></span>${t('Typical profile')}</span>
          <span style="display:flex;align-items:center;gap:5px;font-size:10.5px;color:var(--t3)"><span style="width:8px;height:8px;border-radius:50%;background:var(--warn)"></span>${chart.anomalies} ${t('anomaly hours')}</span>
        </div>
      </div>`;
  }

  // One day's hourly curve vs the typical profile (same weekday, last 4 weeks).
  // Hours deviating >30% from a positive profile are flagged as anomalies.
  function anomChartHtml(series, dayDate) {
    const actual = hourValues(series, dayDate);
    const refDays = [1, 2, 3, 4].map((w) =>
      hourValues(series, new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() - 7 * w)));
    const profile = Array.from({ length: 24 }, (_, h) => {
      const vals = refDays.map((r) => r[h]).filter((v) => v != null);
      return vals.length >= 2 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    });
    if (!actual.some((v) => v != null)) {
      return { anomalies: 0, html: `<div style="padding:14px;border:1px dashed var(--bd1);border-radius:8px;text-align:center;font-size:12px;color:var(--t3)">${t('No history for this day')}</div>` };
    }
    // Negative hours are real readings (export or a meter reset), not zero
    const sc = signedScale([...actual, ...profile]);
    const ax = signedAxis(sc);
    const x = (h) => 30 + h * 12.5;
    const y = (v) => sc.y(v);

    const actPts = [], dots = [], anomDots = [];
    let anomalies = 0;
    for (let h = 0; h < 24; h++) {
      const v = actual[h];
      if (v == null) continue;
      const px = x(h).toFixed(1), py = y(v).toFixed(1);
      actPts.push(`${px},${py}`);
      const p = profile[h];
      if (p != null && p > 0 && Math.abs(v - p) / p > 0.3) {
        anomalies++;
        anomDots.push(`<circle cx="${px}" cy="${py}" r="3"/>`);
      } else {
        dots.push(`<circle cx="${px}" cy="${py}" r="1.6"/>`);
      }
    }
    const profPts = profile.map((p, h) => p == null ? null : `${x(h).toFixed(1)},${y(p).toFixed(1)}`).filter(Boolean);
    const hourLabels = [0, 6, 12, 18, 23].map((h) =>
      `<text x="${x(h)}" y="114" text-anchor="middle">${String(h).padStart(2, '0')}</text>`).join('');
    return {
      anomalies,
      html: `
          <svg viewBox="0 0 330 122" style="width:100%;height:auto;display:block;direction:ltr" role="img" aria-label="hourly load vs typical profile">
            ${ax.grid}
            <g font-family="'JetBrains Mono',monospace" font-size="8" fill="var(--t3)">
              ${ax.labels}
              ${hourLabels}
            </g>
            ${profPts.length >= 2 ? `<polyline points="${profPts.join(' ')}" fill="none" stroke="var(--t3)" stroke-width="1" stroke-dasharray="3 3"/>` : ''}
            ${actPts.length >= 2 ? `<polyline points="${actPts.join(' ')}" fill="none" stroke="var(--acc)" stroke-width="1.5"/>` : ''}
            <g fill="var(--acc)">${dots.join('')}</g>
            <g fill="var(--warn)">${anomDots.join('')}</g>
            ${hoverColumns(Array.from({ length: 24 }, (_, h) => {
              const v = actual[h], p = profile[h];
              const dev = (v != null && p != null && p > 0) ? ((v - p) / p) * 100 : null;
              return `${String(h).padStart(2, '0')}:00\n${v == null ? t('no data') : t('Actual') + ' ' + shortNum(v, 2)}` +
                (p == null ? '' : `\n${t('Typical profile')} ${shortNum(p, 2)}`) +
                (dev == null ? '' : `\n${dev > 0 ? '+' : ''}${dev.toFixed(0)}%`);
            }), 30 - 6.25, 12.5)}
          </svg>`,
    };
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
    // Shade the positive range only, so a negative hour is not confused with a
    // quiet one — it gets its own amber tint instead of the palest blue
    const pos = known.filter((v) => v >= 0);
    const min = pos.length ? Math.min(...pos) : 0;
    const span = (pos.length ? Math.max(...pos) - min : 0) || 1;
    const bgFor = v => {
      if (v == null) return 'var(--s3)';
      if (v < 0) return 'color-mix(in srgb, var(--warn) 55%, var(--s3))';
      const f = (v - min) / span;
      return f >= 0.58 ? 'var(--btnP)' : (f >= 0.4 ? 'color-mix(in srgb, var(--btnP) 50%, var(--s3))' : 'var(--s3)');
    };
    const days = [t('Mon'), t('Tue'), t('Wed'), t('Thu'), t('Fri'), t('Sat'), t('Sun')];
    const rows = days.map((d, i) => {
      const rowCells = cells[i].map((v, h) => {
        const tip = `${d} ${String(h).padStart(2, '0')}:00\n${v == null ? t('no data') : shortNum(v, 1) + ' kWh ' + t('avg')}`;
        return `<span data-tip="${esc(tip)}" style="display:block;aspect-ratio:1;border-radius:2px;cursor:crosshair;background:${bgFor(v)}"></span>`;
      }).join('');
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

  /* ── LBM / Anomaly sub-view interactions (delegated — panel re-renders on data) ── */
  const rpContentEl = document.getElementById('rpContent');
  bindChartTips(rpContentEl);
  bindChartTips(vpOvp);
  if (rpContentEl) {
    rpContentEl.addEventListener('click', (e) => {
      const lbmRow = e.target.closest('[data-lbm-pmu]');
      const aPmu = e.target.closest('[data-anom-pmu]');
      const aDay = e.target.closest('[data-anom-day]');
      const eqBtn = e.target.closest('[data-eq]');
      const eqBack = e.target.closest('[data-eq-back]');
      const eqPt = e.target.closest('[data-eq-pt]');
      const wmRow = e.target.closest('[data-wm]');
      const cRange = e.target.closest('[data-cons-range]');
      const cSvc = e.target.closest('[data-cons-svc]');
      if (!lbmRow && !aPmu && !aDay && !eqBtn && !eqBack && !eqPt && !wmRow && !cRange && !cSvc) return;
      if (cRange) consRange = parseInt(cRange.getAttribute('data-cons-range'), 10) || 7;
      if (cSvc) {
        const k = cSvc.getAttribute('data-cons-svc');
        consSelected = consSelected === k ? null : k;   // click again to go back to total
      }
      if (lbmRow) lbmSelectedPmu = lbmRow.getAttribute('data-lbm-pmu');
      if (aPmu) anomPmu = aPmu.getAttribute('data-anom-pmu');
      if (aDay) anomDayOffset = parseInt(aDay.getAttribute('data-anom-day'), 10) || 0;
      if (wmRow) waterSelected = wmRow.getAttribute('data-wm');
      if (eqPt) livesysPointId = eqPt.getAttribute('data-eq-pt');
      if (eqBack) { livesysSelected = null; livesysPointId = null; }
      if (eqBtn) {
        livesysSelected = eqBtn.getAttribute('data-eq');
        livesysPointId = null;
        // Equipment rows on the Operations home panel jump into Live Systems
        if (currentSubId !== 'livesys') {
          currentSubId = 'livesys';
          renderModuleOverview(currentModule, currentSubId);
          $$('.sub-item').forEach((si) => si.classList.remove('active'));
          document.querySelector('.sub-item[data-sub="livesys"]')?.classList.add('active');
        }
      }
      renderRightPanel(currentModule, currentSubId);
    });

    rpContentEl.addEventListener('change', (e) => {
      if (e.target && e.target.id === 'histchSelect') {
        histchPointId = e.target.value;
        // force: the select still holds focus, which would otherwise defer this
        renderRightPanel(currentModule, currentSubId, true);
      }
    });

    // Catch up on any live tick that was held back while the picker was open
    rpContentEl.addEventListener('focusout', () => {
      setTimeout(() => {
        if (rpRenderQueued) renderRightPanel(currentModule, currentSubId, true);
      }, 0);
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
      syncRpWidenBtn();   // its tooltip is translated

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
    const liveLoad = liveLoadKw();
    if (liveLoad != null) SERIES.push(liveLoad);
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
  // Timeline rule 4 (xlsx): events closer together than CLUSTER_PX collapse
  // into one count bubble coloured by the worst severity inside, so a burst of
  // alarms never turns the track into unreadable dot soup. Members are grouped
  // against the first dot of the run, which bounds each cluster at CLUSTER_PX
  // wide instead of letting evenly-spaced dots chain into one giant blob.
  const CLUSTER_PX = 16;
  const SEV_RANK = { info: 0, warn: 1, crit: 2 };
  const sevColor = (s) => s === 'crit' ? 'var(--crit)' : (s === 'warn' ? 'var(--warn)' : 'var(--info)');
  const sevSize  = (s) => s === 'crit' ? 14 : (s === 'warn' ? 11 : 8);

  function clusterEvents() {
    if (!EVENTS.length) return [];
    const trackW = scrubTimeline ? scrubTimeline.getBoundingClientRect().width : 0;
    // Before first layout there is no width to cluster against — show them all
    const span = trackW > 0 ? CLUSTER_PX / trackW : 0;
    const ordered = EVENTS
      .map((ev, i) => ({ ev, i, frac: 1 - ev.age / TOTAL_HOURS }))
      .sort((a, b) => a.frac - b.frac);
    const groups = [];
    ordered.forEach((it) => {
      const g = groups[groups.length - 1];
      if (g && it.frac - g.start <= span) g.items.push(it);
      else groups.push({ start: it.frac, items: [it] });
    });
    return groups.map((g) => {
      const worst = g.items.reduce((a, b) => SEV_RANK[b.ev.sev] > SEV_RANK[a.ev.sev] ? b : a).ev.sev;
      // Newest member is the jump target: prev/next then walks the rest
      const newest = g.items.reduce((a, b) => b.frac > a.frac ? b : a);
      const frac = g.items.reduce((s, it) => s + it.frac, 0) / g.items.length;
      return { frac, worst, newest, items: g.items };
    });
  }

  function renderEventDots() {
    if (!scrubEventsEl) return;
    scrubEventsEl.innerHTML = '';
    clusterEvents().forEach((g) => {
      const n     = g.items.length;
      const svgY  = seriesY(g.frac);            // y within viewBox (2..32)
      const pxTop = (svgY / SVG_H) * 32 + 2;   // px within the 32px chart, +2 for chart top offset
      const xPct  = (g.frac * 100).toFixed(2) + '%';
      const color = sevColor(g.worst);
      const size  = n > 1 ? 18 : sevSize(g.worst);
      const tip   = n > 1
        ? `${n} ${t('events')}\n` + g.items.slice(0, 6).map((it) => it.ev.tip).join('\n') +
          (n > 6 ? `\n+${n - 6} ${t('more')}` : '')
        : g.items[0].ev.tip;

      const dot = document.createElement('button');
      dot.setAttribute('aria-label', tip);
      dot.setAttribute('data-ev-idx', g.newest.i);
      if (n > 1) dot.setAttribute('data-ev-count', n);
      dot.title = tip;
      dot.style.cssText = `position:absolute;left:${xPct};top:${pxTop.toFixed(1)}px;width:${size}px;height:${size}px;` +
        `margin-left:${-size / 2}px;margin-top:${-size / 2}px;padding:0;border-radius:50%;background:${color};` +
        `border:1.5px solid var(--s1);cursor:pointer;z-index:3;pointer-events:auto;` +
        (n > 1 ? `display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;` +
                 `font-size:9px;font-weight:600;color:var(--s1);line-height:1;` : '');
      if (n > 1) dot.textContent = String(n);
      dot.addEventListener('click', () => jumpToEvent(g.newest.i));
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

  // Timeline rule 5 (xlsx): "keyboard arrows nudge by 15 minutes; Home earliest,
  // End live". Shift+arrow steps a whole hour. Bound on the document because the
  // scrubber is a persistent chrome control rather than a focusable widget.
  const NUDGE_H = 0.25;
  function nudgeCursor(deltaH) {
    const next = (isLive ? 0 : cursorAge) + deltaH;
    if (next <= 0) { goLive(); return; }
    setCursorAge(next);
    enterHistory(ageToLabel(cursorAge));
    updateStepBtns();
  }
  document.addEventListener('keydown', (e) => {
    const el = e.target;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ||
               el.tagName === 'SELECT' || el.isContentEditable)) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    // Don't hijack arrows while a modal owns the screen
    if (ekoModal && ekoModal.style.display !== 'none') return;
    const step = e.shiftKey ? 1 : NUDGE_H;
    if (e.key === 'ArrowLeft')       { e.preventDefault(); nudgeCursor(step); }        // older
    else if (e.key === 'ArrowRight') { e.preventDefault(); nudgeCursor(-step); }       // newer
    else if (e.key === 'Home')       { e.preventDefault(); setCursorAge(TOTAL_HOURS); enterHistory(ageToLabel(cursorAge)); updateStepBtns(); }
    else if (e.key === 'End')        { e.preventDefault(); goLive(); }
  });

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

  /* ── Widen / narrow by button ──
     Steps through width presets. Dragging the inner edge still works and can
     land anywhere between them; the button just moves to the next preset up,
     then snaps back to normal once it is already at the widest. */
  const rpWidenBtn = $('#rpWidenBtn');
  const rpMaxWidth = () => Math.max(RP_NORMAL_W, Math.floor(window.innerWidth / 2));

  function rpWidthSteps() {
    const max = rpMaxWidth();
    return [...new Set([RP_NORMAL_W, Math.round((RP_NORMAL_W + max) / 2), max])]
      .sort((a, b) => a - b);
  }

  function rpCurrentWidth() {
    return Math.round(rightPanel ? rightPanel.getBoundingClientRect().width : RP_NORMAL_W);
  }

  function syncRpWidenBtn() {
    if (!rpWidenBtn || !rightPanel) return;
    const atMax = rpCurrentWidth() >= rpMaxWidth() - 2;
    rpWidenBtn.dataset.dir = atMax ? 'narrow' : 'widen';
    const label = t(atMax ? 'Narrow panel' : 'Widen panel');
    rpWidenBtn.title = label;
    rpWidenBtn.setAttribute('aria-label', label);
  }

  if (rpWidenBtn && rightPanel) {
    rpWidenBtn.addEventListener('click', () => {
      // Widening a collapsed panel should open it first
      if (rightPanel.classList.contains('collapsed')) expandRightPanel();
      const w = rpCurrentWidth();
      const next = rpWidthSteps().find((s) => s > w + 2);
      setRightPanelWidth(next != null ? next : RP_NORMAL_W);
      syncRpWidenBtn();
    });
    syncRpWidenBtn();
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
      syncRpWidenBtn();   // the drag may have reached (or left) the maximum
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
    rpResizer.addEventListener('dblclick', () => {
      setRightPanelWidth(RP_NORMAL_W);
      syncRpWidenBtn();
    });

    // Keep the half-viewport cap when the window itself shrinks
    window.addEventListener('resize', () => {
      const maxW = rpMaxWidth();
      if (rightPanel.getBoundingClientRect().width > maxW) setRightPanelWidth(maxW);
      syncRpWidenBtn();
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
