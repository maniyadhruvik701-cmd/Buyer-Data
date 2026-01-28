// Data Management
let buyers = JSON.parse(localStorage.getItem('buyers')) || [];

// Tab Switching
function switchTab(tabName) {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const pageHeader = document.getElementById('page-header');
    const breadcrumbText = document.getElementById('breadcrumb-text');

    // Update Nav Active State
    navItems.forEach(item => {
        if (item.querySelector('.link-text').innerText.toLowerCase().replace(' ', '-') === tabName ||
            (tabName === 'buyer-data' && item.querySelector('.link-text').innerText === 'Buyer Data') ||
            (tabName === 'call-report' && item.querySelector('.link-text').innerText === 'Call Report')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Toggle Sections
    if (tabName === 'buyer-data') {
        document.getElementById('buyer-data-section').style.display = 'block';
        document.getElementById('call-report-section').style.display = 'none';
        pageHeader.innerText = 'Buyer Data';
        breadcrumbText.innerText = 'Buyer Data';
        renderTableRows(); // Refresh table
    } else {
        document.getElementById('buyer-data-section').style.display = 'none';
        document.getElementById('call-report-section').style.display = 'block';
        pageHeader.innerText = 'Call Report';
        breadcrumbText.innerText = 'Call Report';

        // Initial load for today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reportDate').value = today;
        loadDailyReport(today);
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date in form
    const entryDateInput = document.getElementById('entryDate');
    if (entryDateInput) entryDateInput.valueAsDate = new Date();

    // Initial Render
    renderTableRows();
});

// --- Buyer Data Logic ---
const buyerForm = document.getElementById('buyer-form');
if (buyerForm) {
    buyerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newBuyer = {
            id: Date.now(),
            entryDate: document.getElementById('entryDate').value,
            name: document.getElementById('buyerName').value,
            state: document.getElementById('state').value,
            city: document.getElementById('city').value,
            position: document.getElementById('position').value,
            category: document.getElementById('category').value,
            lastBillDate: document.getElementById('lastBillDate').value,
            nature: document.getElementById('buyerNature').value,
            priceRange: document.getElementById('priceRange').value,
            lastCallDate: document.getElementById('lastCallDate').value,
            talking: document.getElementById('talkingNote').value,
            nextCallDate: document.getElementById('nextCallDate').value
        };

        buyers.push(newBuyer);
        localStorage.setItem('buyers', JSON.stringify(buyers));

        // Simple Reset
        buyerForm.reset();
        document.getElementById('entryDate').valueAsDate = new Date();

        renderTableRows();
        alert('Buyer Added Successfully!');
    });
}

function renderTableRows() {
    const tbody = document.getElementById('buyer-table-body');
    if (!tbody) return;

    if (buyers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No buyers added yet.</td></tr>';
        return;
    }

    // Sort by latest entry first
    const sortedBuyers = [...buyers].reverse();

    tbody.innerHTML = sortedBuyers.map(buyer => `
        <tr>
            <td>${formatDate(buyer.entryDate)}</td>
            <td><strong>${buyer.name}</strong></td>
            <td>${buyer.city}, ${buyer.state}</td>
            <td><span class="badge ${buyer.position.toLowerCase()}">${buyer.position}</span></td>
            <td>${buyer.category}</td>
            <td>${buyer.nature}</td>
            <td style="color: var(--secondary-color); font-weight:bold;">${formatDate(buyer.nextCallDate)}</td>
            <td>
                <button class="btn-icon" onclick="deleteBuyer(${buyer.id})" title="Delete">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteBuyer(id) {
    if (confirm('Are you sure you want to delete this buyer record?')) {
        buyers = buyers.filter(b => b.id !== id);
        localStorage.setItem('buyers', JSON.stringify(buyers));
        renderTableRows();
    }
}
window.deleteBuyer = deleteBuyer; // Global expose for onclick

// --- Call Report Logic ---
const checkReportBtn = document.getElementById('checkReportBtn');
if (checkReportBtn) {
    checkReportBtn.addEventListener('click', () => {
        const date = document.getElementById('reportDate').value;
        if (date) loadDailyReport(date);
    });
}

function loadDailyReport(date) {
    const callsToday = buyers.filter(b => b.nextCallDate === date);
    const container = document.getElementById('report-results');

    if (!container) return;

    if (callsToday.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <ion-icon name="checkmark-done-circle-outline"></ion-icon>
                <h3>No calls scheduled for ${formatDate(date)}</h3>
                <p>Have a relaxing day!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="report-summary">
            <h3><span class="highlight">${callsToday.length}</span> Calls Scheduled for ${formatDate(date)}</h3>
        </div>
        <div class="card-grid">
            ${callsToday.map(buyer => `
                <div class="call-card">
                    <div class="card-header">
                        <h4>${buyer.name}</h4>
                        <span class="badge ${buyer.position.toLowerCase()}">${buyer.position}</span>
                    </div>
                    <div class="card-body">
                        <p><ion-icon name="location-outline"></ion-icon> ${buyer.city}, ${buyer.state}</p>
                        <p><ion-icon name="pricetags-outline"></ion-icon> ${buyer.category}</p>
                        <div class="note-box">
                            <strong><ion-icon name="document-text-outline"></ion-icon> Last Talk:</strong>
                            <p>${buyer.talking || 'No notes available'}</p>
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="tel:+" class="btn-call">
                            <ion-icon name="call"></ion-icon> Call Now
                        </a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Helper
function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
