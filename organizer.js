document.addEventListener('DOMContentLoaded', function() {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword) {
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    } else {
        document.getElementById('signup-form').style.display = 'block';
        document.getElementById('login-form').style.display = 'none';
    }
});

document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    if (username && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        alert('Sign up successful! Please log in.');
        document.getElementById('signup-form').reset();
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    } else {
        alert('Please enter a valid username and password.');
    }
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    if (username === storedUsername && password === storedPassword) {
        alert('Login successful!');
        document.getElementById('login-form').reset();
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('bill-container').style.display = 'block';
    } else {
        alert('Invalid username or password. Please try again.');
    }
});

document.getElementById('bill-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const billName = document.getElementById('bill-name').value;
    const billAmount = parseFloat(document.getElementById('bill-amount').value);
    const password = prompt('Enter your password to add the bill:');
    const storedPassword = localStorage.getItem('password');
    if (password === storedPassword) {
        if (validateInput(billName, billAmount)) {
            addBill(billName, billAmount);
            updateTotal();
            document.getElementById('bill-form').reset();
        }
    } else {
        alert('Invalid password. Please try again.');
    }
});

document.getElementById('clear-bills').addEventListener('click', function() {
    clearAllBills();
});

function validateInput(name, amount) {
    if (!name || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid bill name and amount.');
        return false;
    }
    return true;
}

function addBill(name, amount) {
    const billList = document.getElementById('bill-list');
    const li = document.createElement('li');
    li.innerHTML = `${name} - #${amount.toFixed(2)}`;
    
    const markAsPaidButton = document.createElement('button');
    markAsPaidButton.textContent = 'Mark as Paid';
    markAsPaidButton.onclick = function() {
        markAsPaid(this);
    };
    li.appendChild(markAsPaidButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.onclick = function() {
        editBill(this);
    };
    li.appendChild(editButton);

    billList.appendChild(li);
    saveBills();
}

function markAsPaid(button) {
    const li = button.parentElement;
    li.classList.toggle('paid');
    saveBills();
    updateTotal();
}

function editBill(button) {
    const li = button.parentElement;
    const [name, amount] = li.textContent.split(' - #');
    document.getElementById('bill-name').value = name;
    document.getElementById('bill-amount').value = parseFloat(amount);
    li.remove();
    updateTotal();
}

function updateTotal() {
    const bills = document.querySelectorAll('#bill-list li');
    let total = 0;

    bills.forEach(bill => {
        if (!bill.classList.contains('paid')) {
            const amount = parseFloat(bill.textContent.split('- #')[1]);
            total += amount;
        }
    });

    document.getElementById('total-amount').textContent = `#${total.toFixed(2)}`;
}

function saveBills() {
    const bills = [];
    document.querySelectorAll('#bill-list li').forEach(bill => {
        bills.push({
            name: bill.textContent.split(' - #')[0],
            amount: parseFloat(bill.textContent.split('- #')[1]),
            paid: bill.classList.contains('paid')
        });
    });
    localStorage.setItem('bills', JSON.stringify(bills));
}

function loadBills() {
    const bills = JSON.parse(localStorage.getItem('bills')) || [];
    bills.forEach(bill => {
        const billList = document.getElementById('bill-list');
        const li = document.createElement('li');
        li.innerHTML = `${bill.name} - #${bill.amount.toFixed(2)}`;

        const markAsPaidButton = document.createElement('button');
        markAsPaidButton.textContent = 'Mark as Paid';
        markAsPaidButton.onclick = function() {
            markAsPaid(this);
        };
        li.appendChild(markAsPaidButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = function() {
            editBill(this);
        };
        li.appendChild(editButton);

        if (bill.paid) {
            li.classList.add('paid');
        }
        billList.appendChild(li);
    });
    updateTotal();
}

function clearAllBills() {
    localStorage.removeItem('bills');
    document.getElementById('bill-list').innerHTML = '';
    updateTotal();
}

// Load bills when the page loads
window.onload = loadBills;
