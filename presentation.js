const navItems = [...document.querySelectorAll('.nav-item')];
const panels = navItems.map(item => document.getElementById(item.dataset.target));
let currentSlide = 0;
function showSlide(index) {
  currentSlide = (index + panels.length) % panels.length;
  panels.forEach((panel, i) => panel.classList.toggle('active', i === currentSlide));
  navItems.forEach((item, i) => { item.classList.toggle('active', i === currentSlide); item.toggleAttribute('aria-current', i === currentSlide); });
  if (currentSlide === 1) {
    renderChart();
    requestAnimationFrame(() => chart && chart.resize());
  }
  if (currentSlide === 2) {
    renderPocChart();
    requestAnimationFrame(() => pocChart && pocChart.resize());
  }
  if (currentSlide === 3) {
    renderComparisonCharts();
    requestAnimationFrame(() => { qoqChart && qoqChart.resize(); yoyChart && yoyChart.resize(); });
  }
  if (currentSlide === 4) {
    renderPipelineChart();
    requestAnimationFrame(() => pipelineChart && pipelineChart.resize());
  }
  if (currentSlide === 5) {
    renderSupportWinsChart();
    requestAnimationFrame(() => supportWinsChart && supportWinsChart.resize());
  }
  if (currentSlide === 6) {
    renderWinBreakdown(activeWinView);
  }
  if (currentSlide === 7) {
    renderRfpPstCharts();
    requestAnimationFrame(() => { rfpChart && rfpChart.resize(); pstChart && pstChart.resize(); });
  }
  if (currentSlide === 8) {
    renderCustomizationCharts();
    requestAnimationFrame(() => { customizationTypeChart && customizationTypeChart.resize(); customizationStatusChart && customizationStatusChart.resize(); });
  }
  if (currentSlide === 9) {
    renderDocumentation(activeDocPeriod);
  }
  syncChartTheme();
}
navItems.forEach((item, i) => item.addEventListener('click', () => showSlide(i)));
document.addEventListener('keydown', event => {
  if (event.target.closest('.person-filter, .win-view-filter, .doc-view-filter')) return;
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); showSlide(currentSlide + 1); }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); showSlide(currentSlide - 1); }
});
const teamData = {
  akshita: { name: 'Akshita', cases: [13,23,14], wins: [8,5,1] },
  aman: { name: 'Aman', cases: [0,1,6], wins: [0,0,1] },
  manoj: { name: 'Manoj', cases: [0,8,2], wins: [0,0,1] },
  utsav: { name: 'Utsav', cases: [15,15,12], wins: [6,12,9] },
  vishesh: { name: 'Vishesh', cases: [29,17,27], wins: [9,13,21] }
};
const allMembers = { name: 'All Members', cases: [57,64,60], wins: [23,30,32] };
const months = ['April', 'May', 'June'];
const rate = (wins, cases) => cases ? (wins / cases * 100).toFixed(1) : '0.0';
const winBreakdownData = {
  sources: {
    name: 'Lead Source', title: 'Top Lead Sources', subtitle: 'Percentage of 85 won cases', total: 85, totalLabel: 'Won cases', shareLabel: 'of all won cases',
    items: [['Partner',25],['Jasmine',8],['Management',7],['Website',6],['Others',6],['LinkedIn Ads',5],['Referral',5],['Sakshi',5],['Google Ads',4],['Self',4],['Sonal',4],['Inbound sales call',3],['Bengaluru TEM 2',1],['Aimfox',1],['AI Summit',1]]
  },
  industries: {
    name: 'Industries', title: 'Top Industries', subtitle: 'Percentage of 92 industry records', total: 92, totalLabel: 'Industry records', shareLabel: 'of industry records',
    items: [['IT Services / Software',47],['NBFC',13],['Education',7],['BPO / KPO',4],['Business Services',4],['Consultancy',4],['BFSI',3],['Others',3],['Automotive',1],['Healthcare',1],['Agriculture',1],['Retail / eCommerce / Wholesale',1],['Media & Entertainment',1],['Fashion & Beauty Wellness',1],['Manufacturer',1]]
  }
};
let activeWinView = 'sources';
function renderWinBreakdown(view) {
  activeWinView = view;
  const data = winBreakdownData[view];
  const visibleItems = data.items.filter(([, count]) => view === 'sources' ? count >= 5 : count >= 3);
  const topThree = data.items.slice(0, 3);
  const topThreeCount = topThree.reduce((sum, [, count]) => sum + count, 0);
  const percentage = count => (count / data.total * 100).toFixed(1);
  document.getElementById('winBreakdownTitle').textContent = data.title;
  document.getElementById('winBreakdownSubtitle').textContent = data.subtitle;
  document.getElementById('winViewName').textContent = data.name;
  document.getElementById('winRecordTotal').textContent = data.total;
  document.getElementById('winRecordLabel').textContent = data.totalLabel;
  document.getElementById('winCategoryTotal').textContent = data.items.length;
  document.getElementById('winTopName').textContent = data.items[0][0];
  document.getElementById('winTopCount').textContent = `${data.items[0][1]} ${view === 'sources' ? 'cases' : 'records'}`;
  document.getElementById('winTopShare').textContent = `${percentage(data.items[0][1])}%`;
  document.getElementById('winTopShareLabel').textContent = data.shareLabel;
  document.getElementById('winTopThreeShare').textContent = `${percentage(topThreeCount)}%`;
  document.getElementById('winTopThreeDetail').textContent = `${topThreeCount} of ${data.total} ${data.totalLabel.toLowerCase()} came from ${topThree.map(([name]) => name).join(', ')}.`;
  document.getElementById('winBreakdownBars').innerHTML = visibleItems.map(([name, count], index) => {
    const share = percentage(count);
    const colors = ['linear-gradient(90deg,#a3e635,#34d399)','linear-gradient(90deg,#34d399,#2dd4bf)','linear-gradient(90deg,#22d3ee,#60a5fa)','linear-gradient(90deg,#60a5fa,#818cf8)','linear-gradient(90deg,#a78bfa,#e879f9)','linear-gradient(90deg,#fb923c,#fbbf24)','linear-gradient(90deg,#fb7185,#f472b6)','linear-gradient(90deg,#94a3b8,#64748b)'];
    return `<div title="${count} ÷ ${data.total} × 100 = ${share}%"><div class="mb-1.5 flex items-center justify-between gap-4"><span class="truncate text-xs font-semibold text-slate-300">${index + 1}. ${name}</span><span class="shrink-0 text-xs"><strong class="text-white">${count}</strong><span class="ml-2 font-bold text-lime-400">${share}%</span></span></div><div class="h-2.5 overflow-hidden rounded-full bg-white/[.06]"><div class="h-full rounded-full" style="width:${share}%;background:${colors[index % colors.length]}"></div></div></div>`;
  }).join('');
  document.querySelectorAll('.win-view-filter').forEach(button => {
    const selected = button.dataset.view === view;
    button.classList.toggle('bg-lime-500', selected);
    button.classList.toggle('text-white', selected);
    button.classList.toggle('shadow-lg', selected);
    button.classList.toggle('text-slate-400', !selected);
  });
}
document.querySelectorAll('.win-view-filter').forEach(button => button.addEventListener('click', () => renderWinBreakdown(button.dataset.view)));
renderWinBreakdown(activeWinView);
const documentationTypes = ['Announcement','API','Comparison Doc','Configuration Doc','FAQ','Release Note','SOP','Tooling / Internal','Use-Case Doc','User Manual'];
const documentationData = {
  april: { name: 'April', values: [1,0,0,0,0,1,0,4,0,20] },
  may: { name: 'May', values: [0,2,0,0,1,2,2,2,1,13] },
  june: { name: 'June', values: [0,3,1,3,1,3,1,0,0,32] }
};
documentationData.q1 = { name: 'Q1 Total', values: documentationTypes.map((_, i) => documentationData.april.values[i] + documentationData.may.values[i] + documentationData.june.values[i]) };
let activeDocPeriod = 'q1';
function renderDocumentation(period) {
  activeDocPeriod = period;
  const data = documentationData[period];
  const items = documentationTypes.map((name, i) => [name, data.values[i]]);
  const total = items.reduce((sum, [, count]) => sum + count, 0);
  const activeTypes = items.filter(([, count]) => count > 0).length;
  const accents = ['#38bdf8','#818cf8','#34d399','#fbbf24','#f472b6','#fb7185','#94a3b8','#22d3ee','#c084fc','#60a5fa'];
  document.getElementById('documentationTotalBadge').textContent = `${total} Documents`;
  document.getElementById('documentationPeriodName').textContent = data.name;
  document.getElementById('documentationSelectedTotal').textContent = total;
  document.getElementById('documentationActiveTypes').textContent = activeTypes;
  document.getElementById('documentationTiles').innerHTML = items.map(([name, count], index) => `<div class="relative min-h-28 overflow-hidden rounded-xl border border-white/10 bg-white/[.03] p-4" style="opacity:${count === 0 ? '.48' : '1'}"><span class="absolute inset-x-0 top-0 h-1" style="background:${accents[index]}"></span><p class="text-3xl font-extrabold text-white">${count}</p><p class="mt-3 text-[11px] font-semibold leading-4 text-slate-400">${name}</p></div>`).join('');
  document.querySelectorAll('.doc-view-filter').forEach(button => {
    const selected = button.dataset.period === period;
    button.classList.toggle('bg-sky-500', selected);
    button.classList.toggle('text-white', selected);
    button.classList.toggle('shadow-lg', selected);
    button.classList.toggle('text-slate-400', !selected);
  });
}
document.querySelectorAll('.doc-view-filter').forEach(button => button.addEventListener('click', () => renderDocumentation(button.dataset.period)));
renderDocumentation(activeDocPeriod);
let chart;
function renderChart() {
  if (chart) return;
  chart = new Chart(document.getElementById('funnelChart'), { type: 'bar', data: { labels: months, datasets: [{ label: 'Cases handled', data: allMembers.cases, backgroundColor: 'rgba(59,130,246,.75)', borderColor: '#60a5fa', borderWidth: 1, borderRadius: 7 }, { label: 'Wins', data: allMembers.wins, backgroundColor: 'rgba(16,185,129,.75)', borderColor: '#34d399', borderWidth: 1, borderRadius: 7 }] }, options: { responsive: true, maintainAspectRatio: false, animation: { duration: 700 }, plugins: { legend: { position: 'top', align: 'end', labels: { color: '#94a3b8', boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 18, font: { family: 'Inter', size: 11 } } }, tooltip: { backgroundColor: '#0f172a', padding: 12 } }, scales: { x: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { family: 'Inter', weight: '600' } }, border: { display: false } }, y: { beginAtZero: true, suggestedMax: 70, grid: { color: 'rgba(148,163,184,.1)' }, ticks: { color: '#64748b', stepSize: 10 }, border: { display: false } } } } });
}
function updateReport(key) {
  const data = key === 'all' ? allMembers : teamData[key];
  const totalCases = data.cases.reduce((sum, value) => sum + value, 0);
  const totalWins = data.wins.reduce((sum, value) => sum + value, 0);
  const colors = ['text-blue-400', 'text-indigo-400', 'text-emerald-400'];
  document.getElementById('reportRows').innerHTML = months.map((month, i) => `<tr><td class="p-4 font-semibold text-white">${month}</td><td class="p-4 text-center">${data.cases[i]}</td><td class="p-4 text-center">${data.wins[i]}</td><td class="p-4 text-right font-bold ${colors[i]}">${rate(data.wins[i], data.cases[i])}%</td></tr>`).join('');
  ['april','may','june'].forEach((month, i) => {
    document.getElementById(`${month}Rate`).textContent = `${rate(data.wins[i], data.cases[i])}%`;
    document.getElementById(`${month}Detail`).textContent = `${data.wins[i]} of ${data.cases[i]} won`;
  });
  ['totalCases','tableTotalCases'].forEach(id => document.getElementById(id).textContent = totalCases);
  ['totalWins','tableTotalWins'].forEach(id => document.getElementById(id).textContent = totalWins);
  ['totalRate','tableTotalRate'].forEach(id => document.getElementById(id).textContent = `${rate(totalWins, totalCases)}%`);
  const lift = Number(rate(data.wins[2], data.cases[2])) - Number(rate(data.wins[0], data.cases[0]));
  document.getElementById('conversionLift').innerHTML = `${lift >= 0 ? '+' : ''}${lift.toFixed(1)}<span class="text-sm ${lift >= 0 ? 'text-emerald-400' : 'text-rose-400'}">pp</span>`;
  document.getElementById('chartTitle').textContent = `${data.name} · Cases vs. Wins`;
  renderChart();
  chart.data.datasets[0].data = data.cases;
  chart.data.datasets[1].data = data.wins;
  chart.update();
  document.querySelectorAll('.person-filter').forEach(button => {
    const selected = button.dataset.person === key;
    button.classList.toggle('bg-blue-500', selected);
    button.classList.toggle('text-white', selected);
    button.classList.toggle('border', !selected);
    button.classList.toggle('border-white/10', !selected);
    button.classList.toggle('bg-white/[.04]', !selected);
    button.classList.toggle('text-slate-400', !selected);
  });
}
document.querySelectorAll('.person-filter').forEach(button => button.addEventListener('click', () => updateReport(button.dataset.person)));
updateReport('all');
let pocChart;
function renderPocChart() {
  if (pocChart) return;
  pocChart = new Chart(document.getElementById('pocChart'), {
    type: 'bar',
    data: { labels: months, datasets: [
      { label: 'POCs initiated', data: [8,7,5], backgroundColor: 'rgba(139,92,246,.76)', borderColor: '#a78bfa', borderWidth: 1, borderRadius: 7 },
      { label: 'Wins recorded', data: [6,7,9], backgroundColor: 'rgba(16,185,129,.76)', borderColor: '#34d399', borderWidth: 1, borderRadius: 7 }
    ]},
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 800 }, plugins: { legend: { position: 'top', align: 'end', labels: { color: '#94a3b8', boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 18, font: { family: 'Inter', size: 11 } } }, tooltip: { backgroundColor: '#0f172a', padding: 12 } }, scales: { x: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { family: 'Inter', weight: '600' } }, border: { display: false } }, y: { beginAtZero: true, suggestedMax: 10, grid: { color: 'rgba(148,163,184,.1)' }, ticks: { color: '#64748b', stepSize: 1 }, border: { display: false } } } }
  });
}
let qoqChart, yoyChart;
const trendOptions = {
  responsive: true, maintainAspectRatio: false, animation: { duration: 850 }, interaction: { mode: 'index', intersect: false },
  plugins: { legend: { position: 'top', align: 'end', labels: { color: '#94a3b8', boxWidth: 9, boxHeight: 9, usePointStyle: true, padding: 16, font: { family: 'Inter', size: 10 } } }, tooltip: { backgroundColor: '#0f172a', padding: 12, callbacks: { label: context => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%` } } },
  scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 10, weight: '600' } }, border: { display: false } }, y: { min: 0, max: 60, grid: { color: 'rgba(148,163,184,.1)' }, ticks: { color: '#64748b', stepSize: 10, callback: value => `${value}%` }, border: { display: false } } }
};
const trendDataset = (label, data, color) => ({ label, data, borderColor: color, backgroundColor: color, borderWidth: 3, pointRadius: 4, pointHoverRadius: 6, pointBorderWidth: 2, pointBorderColor: '#0b1220', tension: .35, fill: false });
function renderComparisonCharts() {
  if (qoqChart && yoyChart) return;
  qoqChart = new Chart(document.getElementById('qoqChart'), { type: 'line', data: { labels: ['Month 1', 'Month 2', 'Month 3'], datasets: [trendDataset('Q4 · Jan–Mar', [38.9,46.7,40.8], '#60a5fa'), trendDataset('Q1 · Apr–Jun', [40.4,46.9,53.3], '#34d399')] }, options: trendOptions });
  yoyChart = new Chart(document.getElementById('yoyChart'), { type: 'line', data: { labels: ['April', 'May', 'June'], datasets: [trendDataset("Q1 FY24–25", [28.3,18.4,24.6], '#a78bfa'), trendDataset('Q1 FY25–26', [40.4,46.9,53.3], '#34d399')] }, options: trendOptions });
  syncChartTheme();
}
let pipelineChart;
function renderPipelineChart() {
  if (pipelineChart) return;
  pipelineChart = new Chart(document.getElementById('pipelineChart'), {
    type: 'bar',
    data: { labels: ['Domestic', 'International'], datasets: [
      { label: 'Total cases', data: [159,22], backgroundColor: 'rgba(59,130,246,.76)', borderColor: '#60a5fa', borderWidth: 1, borderRadius: 8, barPercentage: .68 },
      { label: 'Wins', data: [85,0], backgroundColor: 'rgba(16,185,129,.78)', borderColor: '#34d399', borderWidth: 1, borderRadius: 8, barPercentage: .68 }
    ]},
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 850 }, plugins: { legend: { position: 'top', align: 'end', labels: { color: '#94a3b8', boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 18, font: { family: 'Inter', size: 11 } } }, tooltip: { backgroundColor: '#0f172a', padding: 12 } }, scales: { x: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { family: 'Inter', weight: '600' } }, border: { display: false } }, y: { beginAtZero: true, suggestedMax: 180, grid: { color: 'rgba(148,163,184,.1)' }, ticks: { color: '#94a3b8', stepSize: 30 }, border: { display: false } } } }
  });
  syncChartTheme();
}
let supportWinsChart;
function renderSupportWinsChart() {
  if (supportWinsChart) return;
  supportWinsChart = new Chart(document.getElementById('supportWinsChart'), {
    type: 'doughnut',
    data: { labels: ['Presales Involvement', 'No Presales Involvement'], datasets: [{ data: [53,18], backgroundColor: ['rgba(34,211,238,.88)','rgba(100,116,139,.34)'], borderColor: 'rgba(15,23,42,.7)', borderWidth: 4, hoverOffset: 7 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '72%', animation: { duration: 900 }, plugins: { legend: { display: false, labels: { color: '#94a3b8' } }, tooltip: { backgroundColor: '#0f172a', padding: 12, callbacks: { label: context => `${context.label}: ${context.raw} cases` } } } }
  });
  syncChartTheme();
}
let rfpChart, pstChart;
function renderRfpPstCharts() {
  if (rfpChart && pstChart) return;
  const activityOptions = { responsive: true, maintainAspectRatio: false, animation: { duration: 750 }, plugins: { legend: { position: 'top', align: 'end', labels: { color: '#94a3b8', boxWidth: 9, boxHeight: 9, usePointStyle: true, padding: 14, font: { family: 'Inter', size: 10 } } }, tooltip: { backgroundColor: '#0f172a', padding: 10 } }, scales: { x: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { family: 'Inter', size: 10, weight: '600' } }, border: { display: false } }, y: { beginAtZero: true, suggestedMax: 16, grid: { color: 'rgba(148,163,184,.1)' }, ticks: { color: '#94a3b8', stepSize: 2 }, border: { display: false } } } };
  rfpChart = new Chart(document.getElementById('rfpChart'), { type: 'bar', data: { labels: ['April','May','June'], datasets: [{ label: 'Domestic', data: [3,1,2], backgroundColor: 'rgba(59,130,246,.82)', borderColor: '#60a5fa', borderWidth: 1, borderRadius: 6 }, { label: 'International', data: [3,0,3], backgroundColor: 'rgba(139,92,246,.82)', borderColor: '#a78bfa', borderWidth: 1, borderRadius: 6 }] }, options: activityOptions });
  pstChart = new Chart(document.getElementById('pstChart'), { type: 'bar', data: { labels: ['Jan / Apr','Feb / May','Mar / Jun'], datasets: [{ label: 'Q4', data: [7,15,7], backgroundColor: 'rgba(148,163,184,.62)', borderColor: '#94a3b8', borderWidth: 1, borderRadius: 6 }, { label: 'Q1', data: [12,11,11], backgroundColor: 'rgba(20,184,166,.82)', borderColor: '#2dd4bf', borderWidth: 1, borderRadius: 6 }] }, options: activityOptions });
  syncChartTheme();
}
let customizationTypeChart, customizationStatusChart;
function renderCustomizationCharts() {
  if (customizationTypeChart && customizationStatusChart) return;
  customizationTypeChart = new Chart(document.getElementById('customizationTypeChart'), {
    type: 'bar',
    data: { labels: ['Dialshree', 'VoiceLink', 'Code Blue', 'WhatsApp', 'Greeter', 'Voice Bot', 'CRM Integration'], datasets: [{ label: 'Requests', data: [7,6,3,2,1,1,1], backgroundColor: ['rgba(217,70,239,.82)','rgba(139,92,246,.82)','rgba(59,130,246,.82)','rgba(34,197,94,.82)','rgba(20,184,166,.82)','rgba(245,158,11,.82)','rgba(244,63,94,.82)'], borderWidth: 0, borderRadius: 7, barPercentage: .65 }] },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, animation: { duration: 800 }, plugins: { legend: { display: false, labels: { color: '#94a3b8' } }, tooltip: { backgroundColor: '#0f172a', padding: 11, callbacks: { label: context => `${context.parsed.x} request${context.parsed.x === 1 ? '' : 's'}` } } }, scales: { x: { beginAtZero: true, suggestedMax: 8, grid: { color: 'rgba(148,163,184,.1)' }, ticks: { color: '#94a3b8', stepSize: 1 }, border: { display: false } }, y: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { family: 'Inter', size: 11, weight: '600' } }, border: { display: false } } } }
  });
  customizationStatusChart = new Chart(document.getElementById('customizationStatusChart'), {
    type: 'doughnut',
    data: { labels: ['Won', 'Open', 'In Progress', 'Lost'], datasets: [{ data: [8,9,3,1], backgroundColor: ['rgba(16,185,129,.85)','rgba(59,130,246,.85)','rgba(245,158,11,.85)','rgba(244,63,94,.85)'], borderColor: 'rgba(15,23,42,.7)', borderWidth: 3, hoverOffset: 6 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '68%', animation: { duration: 850 }, plugins: { legend: { display: false, labels: { color: '#94a3b8' } }, tooltip: { backgroundColor: '#0f172a', padding: 11, callbacks: { label: context => `${context.label}: ${context.raw} (${(context.raw / 21 * 100).toFixed(1)}%)` } } } }
  });
  syncChartTheme();
}
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
function syncChartTheme() {
  const light = document.body.classList.contains('light-theme');
  [chart, pocChart, qoqChart, yoyChart, pipelineChart, supportWinsChart, rfpChart, pstChart, customizationTypeChart, customizationStatusChart].filter(Boolean).forEach(instance => {
    instance.options.plugins.legend.labels.color = light ? '#475569' : '#94a3b8';
    instance.options.plugins.tooltip.backgroundColor = light ? '#ffffff' : '#0f172a';
    instance.options.plugins.tooltip.titleColor = light ? '#0f172a' : '#ffffff';
    instance.options.plugins.tooltip.bodyColor = light ? '#334155' : '#ffffff';
    if (instance.options.scales?.x?.ticks) instance.options.scales.x.ticks.color = light ? '#475569' : '#cbd5e1';
    if (instance.options.scales?.y?.ticks) instance.options.scales.y.ticks.color = light ? '#64748b' : '#94a3b8';
    if (instance.options.scales?.y?.grid) instance.options.scales.y.grid.color = light ? 'rgba(15,23,42,.10)' : 'rgba(148,163,184,.10)';
    if (instance.options.scales?.x?.grid && instance.options.scales.x.grid.display !== false) instance.options.scales.x.grid.color = light ? 'rgba(15,23,42,.10)' : 'rgba(148,163,184,.10)';
    instance.data.datasets.forEach(dataset => { if ('pointBorderColor' in dataset) dataset.pointBorderColor = light ? '#ffffff' : '#0b1220'; });
    if (instance.config.type === 'doughnut') instance.data.datasets.forEach(dataset => { dataset.borderColor = light ? 'rgba(255,255,255,.9)' : 'rgba(15,23,42,.7)'; });
    instance.update('none');
  });
}
function applyTheme(theme) {
  const light = theme === 'light';
  document.body.classList.toggle('light-theme', light);
  sunIcon.classList.toggle('hidden', light);
  moonIcon.classList.toggle('hidden', !light);
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  syncChartTheme();
}
themeToggle.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
  applyTheme(nextTheme);
  try { localStorage.setItem('presales-theme', nextTheme); } catch (_) {}
});
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('presales-theme') || 'dark'; } catch (_) {}
applyTheme(savedTheme);
