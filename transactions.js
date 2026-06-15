const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business'];
const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Education', 'Health', 'Bills'];

function getTransactions() {
  const session = getSession();
  if (!session) return [];
  const key = `et_transactions_${session.email}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveTransactions(data) {
  const session = getSession();
  if (!session) return;
  const key = `et_transactions_${session.email}`;
  localStorage.setItem(key, JSON.stringify(data));
}

function addTransaction(t) {
  const data = getTransactions();
  data.unshift({ ...t, id: Date.now() });
  saveTransactions(data);
}

function deleteTransaction(id) {
  const data = getTransactions().filter(t => t.id !== id);
  saveTransactions(data);
}

function updateTransaction(id, updated) {
  const data = getTransactions().map(t => t.id === id ? { ...t, ...updated } : t);
  saveTransactions(data);
}

function getSummary() {
  const data = getTransactions();
  const income = data.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = data.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense, savings: income - expense };
}

function fmt(n) { return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`; }
