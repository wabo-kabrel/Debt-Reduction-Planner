// Initialize Chart.js
let payoffChart;

document.addEventListener('DOMContentLoaded', function() {
    initializeChart();
    updatePayoffPlan();
});

function initializeChart() {
    const ctx = document.getElementById('payoffChart').getContext('2d');
    payoffChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Remaining Balance',
                    borderColor: '#198cea',
                    data: []
                },
                {
                    label: 'Total Interest',
                    borderColor: '#dc3545',
                    data: []
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function decreaseAmount() {
    const input = document.getElementById('paymentAmount');
    let value = parseInt(input.value);
    if (value > 100) {
        input.value = value - 100;
    }
}

function increaseAmount() {
    const input = document.getElementById('paymentAmount');
    let value = parseInt(input.value);
    input.value = value + 100;
}

function updatePayoffPlan() {
    const monthlyPayment = parseInt(document.getElementById('paymentAmount').value);
    const strategy = document.getElementById('strategy').value;
    
    // Sample data calculation (replace with actual calculations)
    const totalMonths = 24;
    const initialBalance = 48000;
    const interestRate = 0.05;
    
    let currentBalance = initialBalance;
    let totalInterest = 0;
    const labels = [];
    const balanceData = [];
    const interestData = [];
    const scheduleData = [];
    
    for (let month = 0; month < totalMonths; month++) {
        const monthlyInterest = currentBalance * (interestRate / 12);
        const principalPayment = monthlyPayment - monthlyInterest;
        currentBalance = Math.max(0, currentBalance - principalPayment);
        totalInterest += monthlyInterest;
        
        labels.push(`Month ${month + 1}`);
        balanceData.push(currentBalance);
        interestData.push(totalInterest);
        
        scheduleData.push({
            month: month + 1,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: monthlyInterest,
            remaining: currentBalance
        });
    }
    
    // Update chart
    payoffChart.data.labels = labels;
    payoffChart.data.datasets[0].data = balanceData;
    payoffChart.data.datasets[1].data = interestData;
    payoffChart.update();
    
    // Update table
    updateScheduleTable(scheduleData);
    
    // Update status bar
    updateStatusBar({
        monthlyPayment,
        totalInterest,
        monthsLeft: totalMonths,
        progress: ((initialBalance - currentBalance) / initialBalance * 100).toFixed(1),
        completionDate: getCompletionDate(totalMonths)
    });
}

function updateScheduleTable(data) {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';
    
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.month}</td>
            <td>${new Date(2025, row.month - 1).toLocaleString('default', { month: 'short' })}