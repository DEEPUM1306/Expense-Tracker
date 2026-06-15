document.addEventListener('DOMContentLoaded', () => {
  // Populate category dropdown based on type
  const typeEl = document.getElementById('t-type');
  const catEl = document.getElementById('t-category');

  function updateCategories() {
    const cats = typeEl.value === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    catEl.innerHTML = cats.map(c => `<option>${c}</option>`).join('');
  }
  typeEl.addEventListener('change', updateCategories);
  updateCategories();

  // Set today's date
  document.getElementById('t-date').value = new Date().toISOString().split('T')[0];

  // Add transaction
  document.getElementById('add-form').addEventListener('submit', e => {
    e.preventDefault();
    addTransaction({
      title: document.getElementById('t-title').value.trim(),
      amount: parseFloat(document.getElementById('t-amount').value),
      date: document.getElementById('t-date').value,
      type: typeEl.value,
      category: catEl.value
    });
    e.target.reset();
    updateCategories();
    document.getElementById('t-date').value = new Date().toISOString().split('T')[0];
    renderDashboard();
  });

  renderDashboard();
});

function renderDashboard() {
  const { income, expense, balance, savings } = getSummary();
  document.getElementById('total-income').textContent = fmt(income);
  document.getElementById('total-expense').textContent = fmt(expense);
  document.getElementById('balance').textContent = fmt(balance);
  document.getElementById('savings').textContent = fmt(savings);

  // Recent transactions (last 5)
  const list = document.getElementById('recent-list');
  const txns = getTransactions().slice(0, 5);
  list.innerHTML = txns.map(t => `
    <li class="${t.type}">
      <span>${t.title} <small>(${t.category})</small></span>
      <span>${t.type === 'income' ? '+' : '-'}${fmt(t.amount)}</span>
    </li>
  `).join('') || '<li>No transactions yet.</li>';
}
