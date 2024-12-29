// Get elements
const expenseForm = document.getElementById('expenseForm');
const expenseTableBody = document.getElementById('expenseTableBody');
const barChartContainer = document.getElementById('barChart');
const pieChartContainer = document.getElementById('pieChart');
const budgetAmountInput = document.getElementById('budgetAmount');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const budgetAlert = document.getElementById('budgetAlert');
const resetBtn = document.getElementById('resetBtn');

// Initialize expenses array and budget
let expenses = [];
let budget = 0;

// Load expenses and budget from local storage
if (localStorage.getItem('expenses')) {
    expenses = JSON.parse(localStorage.getItem('expenses'));
    displayExpenses();
}
if (localStorage.getItem('budget')) {
    budget = parseFloat(localStorage.getItem('budget'));
    budgetAmountInput.value = budget;
}

// Add expense
expenseForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    const newExpense = {
        amount,
        category,
        date,
    };

    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updateCharts();
    checkBudget();
});

// Display expenses
function displayExpenses() {
    expenseTableBody.innerHTML = '';

    expenses.forEach((expense) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
        `;
        expenseTableBody.appendChild(row);
    });
}

// Update charts
function updateCharts() {
    // Calculate expense data for charts
    const categoryExpenses = {};
    expenses.forEach((expense) => {
        if (!categoryExpenses[expense.category]) {
            categoryExpenses[expense.category] = 0;
        }
        categoryExpenses[expense.category] += expense.amount;
    });

    // Bar chart
    const barChartCanvas = document.getElementById('barChart').getContext('2d');
    new Chart(barChartCanvas, {
        type: 'bar',
        data: {
            labels: Object.keys(categoryExpenses),
            datasets: [
                {
                    label: 'Expenses by Category',
                    data: Object.values(categoryExpenses),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });

    // Pie chart
    const pieChartCanvas = document.getElementById('pieChart').getContext('2d');
    new Chart(pieChartCanvas, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryExpenses),
            datasets: [
                {
                    data: Object.values(categoryExpenses),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
    });
}

// Check budget
function checkBudget() {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    if (budget > 0 && totalExpenses > budget) {
        budgetAlert.textContent = 'You have exceeded your budget!';
        budgetAlert.style.color = 'red';
    } else {
        budgetAlert.textContent = '';
    }
}

// Set budget
setBudgetBtn.addEventListener('click', () => {
    budget = parseFloat(budgetAmountInput.value);
    localStorage.setItem('budget', budget);
    checkBudget();
});

// Reset expenses and budget
resetBtn.addEventListener('click', () => {
    localStorage.removeItem('expenses');
    localStorage.removeItem('budget');
    expenses = [];
    budget = 0;
    displayExpenses();
    updateCharts();
    checkBudget();
});
