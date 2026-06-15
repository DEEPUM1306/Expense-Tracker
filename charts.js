document.addEventListener('DOMContentLoaded', () => {
  renderPieChart();
});

function renderPieChart() {
  const txns = getTransactions().filter(t => t.type === 'expense');
  const grouped = {};
  txns.forEach(t => { grouped[t.category] = (grouped[t.category] || 0) + t.amount; });

  const labels = Object.keys(grouped);
  const data = Object.values(grouped);
  const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c'];

  const ctx = document.getElementById('pie-chart');
  if (!ctx) return;

  if (window._pieChart) window._pieChart.destroy();

  window._pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels.length ? labels : ['No Data'],
      datasets: [{ data: data.length ? data : [1], backgroundColor: colors }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } },
      responsive: true
    }
  });
}
