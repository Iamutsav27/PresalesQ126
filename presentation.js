const panels = [...document.querySelectorAll('.slide-panel')];
const navItems = [...document.querySelectorAll('.nav-item')];
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
    renderRfpPstCharts();
    requestAnimationFrame(() => { rfpChart && rfpChart.resize(); pstChart && pstChart.resize(); });
  }
  if (currentSlide === 6) {
    renderCustomizationCharts();
    requestAnimationFrame(() => { customizationTypeChart && customizationTypeChart.resize(); customizationStatusChart && customizationStatusChart.resize(); });
  }
  syncChartTheme();
}
navItems.forEach((item, i) => item.addEventListener('click', () => showSlide(i)));
document.addEventListener('keydown', event => {
  if (event.target.closest('.person-filter')) return;
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
let rfpChart, pstChart;
function activityChart(canvasId, label, data, color, max, step) {
  return new Chart(document.getElementById(canvasId), {
    type: 'bar',
    data: { labels: ['April', 'May', 'June'], datasets: [{ label, data, backgroundColor: color, borderColor: color, borderWidth: 1, borderRadius: 7, barPercentage: .5 }] },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 750 }, plugins: { legend: { display: false, labels: { color: '#94a3b8' } }, tooltip: { backgroundColor: '#0f172a', padding: 10 } }, scales: { x: { grid: { display: false }, ticks: { color: '#cbd5e1', font: { family: 'Inter', size: 10, weight: '600' } }, border: { display: false } }, y: { beginAtZero: true, suggestedMax: max, grid: { color: 'rgba(148,163,184,.1)' }, ticks: { color: '#94a3b8', stepSize: step }, border: { display: false } } } }
  });
}
function renderRfpPstCharts() {
  if (rfpChart && pstChart) return;
  rfpChart = activityChart('rfpChart', 'RFP completed', [6,1,5], 'rgba(59,130,246,.82)', 7, 1);
  pstChart = activityChart('pstChart', 'PST delivered', [12,11,11], 'rgba(20,184,166,.82)', 14, 2);
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
  [chart, pocChart, qoqChart, yoyChart, pipelineChart, rfpChart, pstChart, customizationTypeChart, customizationStatusChart].filter(Boolean).forEach(instance => {
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
