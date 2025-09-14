document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amt");
    const expenseList = document.getElementById("expense-list");
    const totalAmountDisplay = document.getElementById("total-amt");

    // Safely read and parse stored expenses (protect against "undefined", invalid JSON, etc.)
    let stored = localStorage.getItem('expenses');
    let expenses = [];
    if (stored && stored !== 'undefined') {
        try {
            expenses = JSON.parse(stored);
            // ensure it's an array
            if (!Array.isArray(expenses)) expenses = [];
        } catch (err) {
            console.error('Failed to parse saved expenses, resetting to empty array:', err);
            expenses = [];
        }
    } else {
        expenses = [];
    }

    let totalAmount = calculateTotal();

    renderExpenses();        // Render the list
    updateTotal();           // Update total right after rendering

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim());

        if (name !== "" && !isNaN(amount) && amount > 0) {
            const newExpense = {
                id: Date.now(),
                name: name,
                amount: amount,
            };
            expenses.push(newExpense);
            saveExpenseToLocal();
            renderExpenses();
            updateTotal();

            expenseNameInput.value = "";
            expenseAmountInput.value = "";
        }
    });

    function renderExpenses() {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const li = document.createElement("li");
            li.innerHTML = `${expense.name} - $${expense.amount.toFixed(2)}
                <button data-id="${expense.id}">Delete</button>`;
            expenseList.appendChild(li);
        });
    }

    function saveExpenseToLocal() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function calculateTotal() {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    function updateTotal() {
        const totalAmount = calculateTotal();
        totalAmountDisplay.textContent = totalAmount.toFixed(2);
    }

    expenseList.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const expenseId = parseInt(e.target.getAttribute("data-id"));
            expenses = expenses.filter(exp => exp.id !== expenseId);
            saveExpenseToLocal();
            renderExpenses();
            updateTotal();
        }
    });
});
