document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('month-select');
  select.value = new Date().getMonth();
  select.addEventListener('change', renderReport);
  renderReport();
  renderBarChart();
});

function renderReport() {
  const month = parseInt(document.getElementById('month-select').value);
  const txns = getTransactions().filter(t => new Date(t.date).getMonth() === month);
  const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  document.getElementById('r-income').textContent = fmt(income);
  document.getElementById('r-expense').textContent = fmt(expense);
  document.getElementById('r-savings').textContent = fmt(income - expense);
}

function renderBarChart() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const txns = getTransactions();
  const incomeData = Array(12).fill(0);
  const expenseData = Array(12).fill(0);

  txns.forEach(t => {
    const m = new Date(t.date).getMonth();
    if (t.type === 'income') incomeData[m] += t.amount;
    else expenseData[m] += t.amount;
  });

  const ctx = document.getElementById('bar-chart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Income', data: incomeData, backgroundColor: '#2ecc71' },
        { label: 'Expense', data: expenseData, backgroundColor: '#e74c3c' }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}
