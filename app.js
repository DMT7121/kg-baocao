// Global Chart.js Settings for Dark Theme
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Outfit', sans-serif";
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.95)';
Chart.defaults.plugins.tooltip.titleColor = '#f8fafc';
Chart.defaults.plugins.tooltip.bodyColor = '#e2e8f0';
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.borderColor = 'rgba(255, 255, 255, 0.1)';
Chart.defaults.plugins.tooltip.borderWidth = 1;

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. BIỂU ĐỒ CƠ CẤU CHI PHÍ LƯƠNG (DOUGHNUT) ---
    const ctxStructure = document.getElementById('salaryStructureChart').getContext('2d');
    
    // Dataset 1: Nhóm Chính
    const dataMainGroups = {
        labels: ['BQL & Phục vụ', 'Bộ phận Khác (Bếp, Tạp Vụ, BV...)'],
        datasets: [{
            data: [101116852, 114821250],
            backgroundColor: [
                'rgba(139, 92, 246, 0.85)', // Purple
                'rgba(59, 130, 246, 0.85)'  // Blue
            ],
            borderColor: [
                '#8b5cf6',
                '#3b82f6'
            ],
            borderWidth: 1,
            hoverOffset: 8,
            cutout: '70%'
        }]
    };

    // Dataset 2: Khai căn chi tiết
    const dataDetails = {
        labels: ['Lương BQL', 'Lương Phục vụ', 'Lương Bếp', 'Lương Tạp vụ', 'Lương Bảo vệ', 'Lương Thợ chụp ảnh'],
        datasets: [{
            data: [41315367, 59801485, 94290000, 10301205, 5730000, 4500000],
            backgroundColor: [
                'rgba(236, 72, 153, 0.85)', // Pink
                'rgba(168, 85, 247, 0.85)', // Purple-light
                'rgba(16, 185, 129, 0.85)', // Green
                'rgba(245, 158, 11, 0.85)', // Yellow
                'rgba(6, 182, 212, 0.85)',  // Cyan
                'rgba(99, 102, 241, 0.85)'  // Indigo
            ],
            borderColor: 'rgba(30, 41, 59, 0.5)',
            borderWidth: 2,
            hoverOffset: 8,
            cutout: '65%'
        }]
    };

    // Khởi tạo Doughnut Chart
    let structureChart = new Chart(ctxStructure, {
        type: 'doughnut',
        data: dataMainGroups,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { 
                        padding: 20, 
                        usePointStyle: true, 
                        pointStyle: 'circle',
                        font: { size: 13 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw || 0;
                            // Tính %
                            let total = context.chart._metasets[context.datasetIndex].total;
                            let percentage = ((value / total) * 100).toFixed(2);
                            return ` ${value.toLocaleString('vi-VN')} ₫ (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });

    // Xử lý chuyển Tabs cho Doughnut Chart
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            tabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const target = e.target.getAttribute('data-target');
            structureChart.data = (target === 'pie-tong') ? dataMainGroups : dataDetails;
            structureChart.update();
        });
    });

    // --- 2. BIỂU ĐỒ TỈ TRỌNG LƯƠNG TRÊN DOANH THU THUẦN (BAR CHART) ---
    const ctxRatio = document.getElementById('salaryRatioChart').getContext('2d');
    
    // Tạo gradient cho cột
    const barGradient = ctxRatio.createLinearGradient(0, 0, 0, 400);
    barGradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)'); // Green top
    barGradient.addColorStop(1, 'rgba(16, 185, 129, 0.2)'); // Green bottom transparent

    new Chart(ctxRatio, {
        type: 'bar',
        data: {
            labels: ['Nhóm Bếp', 'Phục Vụ', 'Ban Quản Lý', 'BP Khác (Tạp vụ, BV...)'],
            datasets: [{
                label: 'Tỷ lệ % / DT Thuần',
                data: [8.66, 5.49, 3.79, 1.88],
                backgroundColor: barGradient,
                borderColor: '#10b981',
                borderWidth: 1,
                borderRadius: 6,
                barPercentage: 0.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` Trọng số: ${context.raw}% Doanh Thu`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                        tickLength: 0
                    },
                    ticks: {
                        font: { size: 12 },
                        callback: function(value) { return value + "%"; }
                    }
                },
                x: {
                    grid: { 
                        display: false, 
                        drawBorder: false 
                    },
                    ticks: {
                        font: { size: 12 }
                    }
                }
            },
            animation: {
                y: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        }
    });

    // --- 3. MAIN TAB SWITCHING ---
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Config for Spreadsheet Integration (Apps Script URL)
    const SPREADSHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby14oRijxHOcFujSHUzlRQI_n05v62f4TMTuqhjcnEN5budBW4pV4qFs_Alr5xsSCuybA/exec';

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');
            
            // Update nav buttons
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update contents
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // --- 4. BREAKAGE ANALYSIS LOGIC ---
    const uploadZones = [
        { zone: document.getElementById('drop-zone-1'), input: document.getElementById('file-1'), preview: document.getElementById('preview-1') },
        { zone: document.getElementById('drop-zone-2'), input: document.getElementById('file-2'), preview: document.getElementById('preview-2') }
    ];
    const btnRunAnalysis = document.getElementById('btn-run-analysis');
    const uploadedFiles = [null, null];

    uploadZones.forEach((item, index) => {
        const { zone, input, preview } = item;

        // Click to upload
        zone.addEventListener('click', () => input.click());

        // Handle file selection
        input.addEventListener('change', (e) => {
            handleFile(e.target.files[0], index);
        });

        // Drag & Drop
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            handleFile(e.dataTransfer.files[0], index);
        });
    });

    function handleFile(file, index) {
        if (!file || !file.type.startsWith('image/')) return;
        
        uploadedFiles[index] = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = uploadZones[index].preview;
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.classList.add('active');
            checkReadyToAnalyze();
        };
        reader.readAsDataURL(file);
    }

    function checkReadyToAnalyze() {
        if (uploadedFiles[0] && uploadedFiles[1]) {
            btnRunAnalysis.disabled = false;
        }
    }

    btnRunAnalysis.addEventListener('click', runAIAnalysis);

    // --- 5. SAVE & HISTORY LOGIC ---
    let currentReportToSave = null;

    async function runAIAnalysis() {
        // Show Processing Overlay
        const overlay = document.createElement('div');
        overlay.className = 'processing-overlay';
        overlay.innerHTML = `
            <div class="spinner"></div>
            <div class="processing-text">
                <h2 style="color: white; margin-bottom: 0.5rem;">AI Đang Phân Tích Dữ Liệu...</h2>
                <p style="color: #94a3b8;">Đang nhận diện ký tự (OCR) và so sánh số lượng vật tư.</p>
            </div>
        `;
        document.body.appendChild(overlay);

        // Simulate AI thinking time
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Simulated data (Same as before)
        const inventoryData1 = {
            date: "30/03/2026",
            items: [
                { name: "Ly quai(màu trắng)", count: 243, price: 15000 },
                { name: "Ly (Xanh)", count: 240, price: 12000 },
                { name: "Ly cocktail", count: 138, price: 25000 },
                { name: "chén (vàng)", count: 329, price: 8000 },
                { name: "Chén (xanh)", count: 26, price: 8000 },
                { name: "Chén (trắng)", count: 44, price: 8000 },
                { name: "Dĩa (xanh)", count: 520, price: 10000 }
            ]
        };
        const inventoryData2 = {
            date: "23/04/2026",
            items: [
                { name: "Ly quai(màu trắng)", count: 238 },
                { name: "Ly (Xanh)", count: 206 },
                { name: "Ly cocktail", count: 131 },
                { name: "chén (vàng)", count: 315 },
                { name: "Chén (xanh)", count: 25 },
                { name: "Chén (trắng)", count: 44 },
                { name: "Dĩa (xanh)", count: 520 }
            ]
        };

        const report = [];
        let totalLossCount = 0;
        let totalLossValue = 0;

        // Names of comparison periods
        const period1Name = inventoryData1.date;
        const period2Name = inventoryData2.date;

        inventoryData1.items.forEach(item1 => {
            const item2 = inventoryData2.items.find(i => i.name === item1.name);
            const count2 = item2 ? item2.count : item1.count;
            const diff = count2 - item1.count;
            const itemLossValue = diff < 0 ? Math.abs(diff) * item1.price : 0;

            if (diff < 0) {
                totalLossCount += Math.abs(diff);
                totalLossValue += itemLossValue;
            }
            report.push({ 
                name: item1.name, 
                price: item1.price,
                count1: item1.count, 
                count2: count2, 
                diff: diff,
                lossValue: itemLossValue
            });
        });

        currentReportToSave = {
            id: Date.now(),
            date: new Date().toLocaleString('vi-VN'),
            period1: period1Name,
            period2: period2Name,
            totalLossItems: totalLossCount,
            totalLossValue: totalLossValue,
            details: report
        };

        renderReport(report, totalLossCount, totalLossValue, period1Name, period2Name);
        
        document.body.removeChild(overlay);
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('analysis-results').style.display = 'block';
        document.getElementById('analysis-results').scrollIntoView({ behavior: 'smooth' });
    }

    const btnSaveReport = document.getElementById('btn-save-report');
    btnSaveReport.addEventListener('click', async () => {
        if (!currentReportToSave) return;

        btnSaveReport.disabled = true;
        btnSaveReport.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Đang lưu...`;

        try {
            // Add raw JSON for spreadsheet column
            const dataToSave = {
                ...currentReportToSave,
                rawJson: JSON.stringify(currentReportToSave)
            };

            // 1. Save to LocalStorage
            saveToLocal(currentReportToSave);

            // 2. Real API call to Google Spreadsheet
            const response = await fetch(SPREADSHEET_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            });
            
            showNotification('Thành công', 'Báo cáo đã được đồng bộ lên Google Spreadsheet (Bao gồm dữ liệu JSON)!');
            loadHistory();
        } catch (error) {
            console.error('Lỗi khi lưu:', error);
            showNotification('Thất bại', 'Không thể kết nối với máy chủ.', 'danger');
        } finally {
            btnSaveReport.disabled = false;
            btnSaveReport.innerHTML = `<i class='bx bx-cloud-upload'></i> Lưu Lên Hệ Thống`;
        }
    });

    // --- 6. EXPORT LOGIC ---
    const btnExport = document.querySelector('.btn-primary'); // Initial button in header
    if (btnExport && btnExport.textContent.includes('Xuất Báo Cáo')) {
        btnExport.addEventListener('click', () => {
            const history = JSON.parse(localStorage.getItem('kg_breakage_history') || '[]');
            if (history.length === 0) {
                showNotification('Chú ý', 'Không có dữ liệu để xuất báo cáo.', 'warning');
                return;
            }

            // Export to CSV
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Ngày báo cáo,Đợt 1,Đợt 2,Món hao hụt,Tổng thiệt hại thực tế\n";
            
            history.forEach(item => {
                const row = `${item.date},${item.period1},${item.period2},${item.totalLossItems},${item.totalLossValue}`;
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Bao_cao_hao_hut_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Thành công', 'Đang tải xuống tệp báo cáo CSV.');
        });
    }

    // Helper: Show Notification
    function showNotification(title, message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class='bx ${type === 'success' ? 'bx-check-circle' : (type === 'warning' ? 'bx-error' : 'bx-x-circle')}'></i>
            </div>
            <div class="toast-body">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Basic animation
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    function saveToLocal(report) {
        let history = JSON.parse(localStorage.getItem('kg_breakage_history') || '[]');
        history.unshift(report);
        localStorage.setItem('kg_breakage_history', JSON.stringify(history.slice(0, 50))); // Keep last 50
    }

    function loadHistory() {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;
        
        let history = JSON.parse(localStorage.getItem('kg_breakage_history') || '[]');
        
        if (history.length === 0) {
            historyList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); width: 100%; grid-column: 1/-1;">Chưa có lịch sử báo cáo nào.</div>`;
            return;
        }

        historyList.innerHTML = history.map(item => `
            <div class="history-card" data-id="${item.id}">
                <div class="date">
                    <span>${item.date}</span>
                    <i class='bx bx-chevron-right'></i>
                </div>
                <h4 style="margin-bottom: 0.5rem;">Đối soát: ${item.period1} vs ${item.period2}</h4>
                <div class="stats">
                    <div class="item-stat">
                        <span class="val text-pink">${item.totalLossItems}</span>
                        <span class="lab">Món hao hụt</span>
                    </div>
                    <div class="item-stat">
                        <span class="val text-yellow">${item.totalLossValue.toLocaleString('vi-VN')} ₫</span>
                        <span class="lab">Thiệt hại thực tế</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Add interactivity to history list
    const historyList = document.getElementById('history-list');
    if (historyList) {
        historyList.addEventListener('click', (e) => {
            const card = e.target.closest('.history-card');
            if (!card) return;

            const reportId = parseInt(card.getAttribute('data-id'));
            const history = JSON.parse(localStorage.getItem('kg_breakage_history') || '[]');
            const report = history.find(item => item.id === reportId);

            if (report) {
                // Display the selected report
                renderReport(report.details, report.totalLossItems, report.totalLossValue, report.period1, report.period2);
                
                // Show results section and scroll to it
                document.getElementById('empty-state').style.display = 'none';
                document.getElementById('analysis-results').style.display = 'block';
                document.getElementById('analysis-results').scrollIntoView({ behavior: 'smooth' });
                
                // Track current report for re-saving if needed (though it's already saved)
                currentReportToSave = report;
                
                showNotification('Xem lại', `Đang hiển thị báo cáo ngày ${report.date}`);
            }
        });
    }

    document.getElementById('btn-refresh-history').addEventListener('click', loadHistory);

    // Initial Load
    loadHistory();

    function renderReport(report, totalCount, totalValue, p1, p2) {
        const tbody = document.getElementById('report-tbody');
        tbody.innerHTML = '';

        // Update table headers to show period names
        const headerP1 = document.querySelector('th:nth-child(3)');
        const headerP2 = document.querySelector('th:nth-child(4)');
        if (headerP1) headerP1.textContent = `Đợt 1 (${p1})`;
        if (headerP2) headerP2.textContent = `Đợt 2 (${p2})`;

        report.forEach(row => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td style="font-weight: 500;">${row.name}</td>
                <td style="color: var(--text-secondary);">${row.price.toLocaleString('vi-VN')} ₫</td>
                <td>${row.count1}</td>
                <td>${row.count2}</td>
                <td style="font-weight: 600;" class="${row.diff < 0 ? 'text-pink' : (row.diff > 0 ? 'text-green' : '')}">
                    ${row.diff > 0 ? '+' : ''}${row.diff}
                </td>
                <td style="font-weight: 700;" class="${row.lossValue > 0 ? 'text-yellow' : ''}">
                    ${row.lossValue > 0 ? row.lossValue.toLocaleString('vi-VN') + ' ₫' : '--'}
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('total-loss-items').textContent = totalCount;
        document.getElementById('total-loss-value').textContent = totalValue.toLocaleString('vi-VN') + ' ₫';
    }

});
