document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search').addEventListener('input', renderTable);
  document.getElementById('filter-category').addEventListener('change', renderTable);
  document.getElementById('filter-type').addEventListener('change', renderTable);
  document.getElementById('sort-by').addEventListener('change', renderTable);
  renderTable();
});

function renderTable() {
  const search = document.getElementById('search').value.toLowerCase();
  const filterCat = document.getElementById('filter-category').value;
  const filterType = document.getElementById('filter-type').value;
  const sortBy = document.getElementById('sort-by').value;

  let txns = getTransactions()
    .filter(t => !search || t.title.toLowerCase().includes(search))
    .filter(t => !filterCat || t.category === filterCat)
    .filter(t => !filterType || t.type === filterType);

  if (sortBy === 'oldest') txns.sort((a, b) => new Date(a.date) - new Date(b.date));
  else if (sortBy === 'highest') txns.sort((a, b) => b.amount - a.amount);
  else if (sortBy === 'lowest') txns.sort((a, b) => a.amount - b.amount);
  else txns.sort((a, b) => new Date(b.date) - new Date(a.date)); // latest

  const tbody = document.getElementById('table-body');
  tbody.innerHTML = txns.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.title}</td>
      <td>${t.category}</td>
      <td>${t.type}</td>
      <td style="color:${t.type === 'income' ? 'var(--green)' : 'var(--red)'}">
        ${t.type === 'income' ? '+' : '-'}${fmt(t.amount)}
      </td>
      <td>
        <button class="edit-btn" onclick="editTransaction(${t.id})">Edit</button>
        <button class="del-btn" onclick="removeTransaction(${t.id})">Delete</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center">No transactions found.</td></tr>';
}

function removeTransaction(id) {
  if (confirm('Delete this transaction?')) {
    deleteTransaction(id);
    renderTable();
  }
}

function editTransaction(id) {
  const t = getTransactions().find(x => x.id === id);
  if (!t) return;
  const newTitle = prompt('Title:', t.title);
  const newAmount = parseFloat(prompt('Amount:', t.amount));
  if (!newTitle || isNaN(newAmount)) return;
  updateTransaction(id, { title: newTitle, amount: newAmount });
  renderTable();
}
