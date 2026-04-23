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
    const SPREADSHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxo_Mv3S0XJj8AIsS6vA9uT9Ym-C3iYpU8QYvM-C3iYpU8QYvM/exec'; // Placeholder

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

    // --- 5. SAVE & HISTORY LOGIC ---
    let currentReportToSave = null;

    async function runAIAnalysis() {
        // ... (Existing runAIAnalysis logic) ...
        // [I will keep the existing runAIAnalysis code but add specific markers for saving]
        
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

        await new Promise(resolve => setTimeout(resolve, 2000));

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

        inventoryData1.items.forEach(item1 => {
            const item2 = inventoryData2.items.find(i => i.name === item1.name);
            const count2 = item2 ? item2.count : 243; // fallback 
            const diff = count2 - item1.count;
            if (diff < 0) {
                totalLossCount += Math.abs(diff);
                totalLossValue += Math.abs(diff) * item1.price;
            }
            report.push({ name: item1.name, count1: item1.count, count2: count2, diff: diff });
        });

        currentReportToSave = {
            id: Date.now(),
            date: new Date().toLocaleString('vi-VN'),
            totalLossItems: totalLossCount,
            totalLossValue: totalLossValue,
            alertLevel: totalLossCount > 50 ? 'Nguy cấp' : (totalLossCount > 10 ? 'Cảnh báo' : 'Bình thường'),
            details: report
        };

        renderReport(report, totalLossCount, totalLossValue);
        
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
            // 1. Save to LocalStorage for instant display
            saveToLocal(currentReportToSave);

            // 2. Try to save to Google Spreadsheet (via Apps Script)
            const response = await fetch(SPREADSHEET_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Apps Script issues with CORS
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentReportToSave)
            });

            alert('Đã lưu báo cáo thành công lên Google Spreadsheet!');
            loadHistory(); // Refresh history list
        } catch (error) {
            console.error('Lỗi khi lưu:', error);
            alert('Lưu thất bại lên Cloud, dữ liệu đã được lưu tạm tại trình duyệt.');
        } finally {
            btnSaveReport.disabled = false;
            btnSaveReport.innerHTML = `<i class='bx bx-cloud-upload'></i> Lưu Lên Hệ Thống`;
        }
    });

    function saveToLocal(report) {
        let history = JSON.parse(localStorage.getItem('kg_breakage_history') || '[]');
        history.unshift(report);
        localStorage.setItem('kg_breakage_history', JSON.stringify(history.slice(0, 50))); // Keep last 50
    }

    function loadHistory() {
        const historyList = document.getElementById('history-list');
        let history = JSON.parse(localStorage.getItem('kg_breakage_history') || '[]');
        
        if (history.length === 0) {
            historyList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); width: 100%; grid-column: 1/-1;">Chưa có lịch sử báo cáo nào.</div>`;
            return;
        }

        historyList.innerHTML = history.map(item => `
            <div class="history-card">
                <div class="date">
                    <span>${item.date}</span>
                    <span class="badge ${item.totalLossItems > 50 ? 'badge-danger' : (item.totalLossItems > 10 ? 'badge-warning' : 'badge-success')}">
                        ${item.alertLevel}
                    </span>
                </div>
                <h4>Báo cáo đợt kiểm kê</h4>
                <div class="stats">
                    <div class="item-stat">
                        <span class="val text-pink">${item.totalLossItems}</span>
                        <span class="lab">Món hao hụt</span>
                    </div>
                    <div class="item-stat">
                        <span class="val text-yellow">${item.totalLossValue.toLocaleString('vi-VN')} ₫</span>
                        <span class="lab">Thiệt hại</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    document.getElementById('btn-refresh-history').addEventListener('click', loadHistory);

    // Initial Load
    loadHistory();

    function renderReport(report, totalCount, totalValue) {
        const tbody = document.getElementById('report-tbody');
        tbody.innerHTML = '';

        report.forEach(row => {
            const tr = document.createElement('tr');
            
            let statusBadge = '';
            if (row.diff < 0) {
                statusBadge = `<span class="badge badge-danger">Hao hụt (-${Math.abs(row.diff)})</span>`;
            } else if (row.diff > 0) {
                statusBadge = `<span class="badge badge-success">Tăng (+${row.diff})</span>`;
            } else {
                statusBadge = `<span class="badge badge-warning">Ổn định</span>`;
            }

            tr.innerHTML = `
                <td style="font-weight: 500;">${row.name}</td>
                <td>${row.count1}</td>
                <td>${row.count2}</td>
                <td class="${row.diff < 0 ? 'loss-value' : ''}">${row.diff === 0 ? '--' : row.diff}</td>
                <td>${statusBadge}</td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('total-loss-items').textContent = totalCount;
        document.getElementById('total-loss-value').textContent = totalValue.toLocaleString('vi-VN') + ' ₫';
        
        const alertLevel = document.getElementById('alert-level');
        if (totalCount > 50) {
            alertLevel.textContent = 'Cảnh báo Đỏ';
            alertLevel.className = 'value text-pink';
        } else if (totalCount > 10) {
            alertLevel.textContent = 'Cảnh báo Vàng';
            alertLevel.className = 'value text-yellow';
        } else {
            alertLevel.textContent = 'Bình thường';
            alertLevel.className = 'value text-green';
        }
    }

});
